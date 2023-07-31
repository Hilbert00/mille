import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Loading from "@/components/loading";
import LockWall from "@/components/solo/lockwall";

import getDoneCount from "utils/getDoneCount";
import getQuizData from "utils/getQuizData";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// MATH SECTIONS
import MathBasics from "@/components/solo/math/basics";
import MathStatistics from "@/components/solo/math/statistics";
import MathAlgebra from "@/components/solo/math/algebra";
import MathGeometry from "@/components/solo/math/geometry";

interface WorldDataProps {
    area_name: string;
    type_id: number;
    type_description: string;
    type_name: string;
}

interface Props {
    data: WorldDataProps[];
    title: string;
    subject: string;
}

export default function Solo(props: Props) {
    const router = useRouter();

    const [sections, setSections] = useState([] as any);
    const [doneCount, setDoneCount] = useState(0);
    const [quizData, setQuizData] = useState([] as any);

    useEffect(() => {
        if (!props.data.length) {
            router.push("/");
            return;
        }

        (async function () {
            switch (props.subject) {
                case "mat":
                    if (!quizData.length) {
                        const data = [
                            await getQuizData(1),
                            await getQuizData(2),
                            await getQuizData(3),
                            await getQuizData(4),
                        ];

                        setQuizData(data);
                        setSections([
                            <MathBasics data={data[0]} key={1} />,
                            <MathStatistics data={data[1]} key={2} />,
                            <MathAlgebra data={data[2]} key={3} />,
                            <MathGeometry data={data[3]} key={4} />,
                        ]);
                    } else {
                        setSections([
                            <MathBasics data={quizData[0]} key={1} />,
                            <MathStatistics data={quizData[1]} key={2} />,
                            <MathAlgebra data={quizData[2]} key={3} />,
                            <MathGeometry data={quizData[3]} key={4} />,
                        ]);
                    }
            }

            if (quizData.length && !quizData[0].length) {
                const bodyData = {
                    subject: props.subject,
                    area: props.data[0].area_name[0].toLowerCase().slice(0, 3),
                    quizType: props.data[0].type_id,
                    quizNumber: 1,
                };

                await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
                    credentials: "include",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyData),
                });

                setQuizData(
                    await Promise.all(
                        quizData.map(async (e: any, i: number) => {
                            if (!i) {
                                return await getQuizData(1);
                            }
                            return e;
                        })
                    )
                );
            }

            if (sections.length && !doneCount) {
                const count = await getDoneCount(sections.map((e: any) => e.key));
                setDoneCount(count);
            }
        })();
    }, [quizData]);

    if (!sections.length) {
        return (
            <>
                <Head>
                    <title>{`${props.title} - Mille`}</title>
                </Head>
                <Topbar type="solo" barValue={0} barMaxValue={1} />
                <Loading />
                <Menubar active={1}></Menubar>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`${props.title} - Mille`}</title>
            </Head>

            <Topbar type="solo" barValue={doneCount} barMaxValue={37 * 5} />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                {props.data.map((e, i) => (
                    <div key={i}>
                        <div key={i + 1} className="pb-24">
                            <h1 className="mb-2 text-center text-5xl font-bold">{e.type_name}</h1>
                            <h2 className="text-center font-semibold">{e.type_description}</h2>
                            {sections[i]}
                        </div>
                        {i !== props.data.length - 1 && (doneCount < 35 * (i + 1) || !quizData[i + 1]?.length) ? (
                            <LockWall
                                subject={props.subject}
                                unlocks={i + 2}
                                currentValue={doneCount}
                                necessaryValue={35 * (i + 1)}
                                updateData={setQuizData}
                                currentData={quizData}
                            ></LockWall>
                        ) : null}
                    </div>
                ))}
            </main>

            <Menubar active={1}></Menubar>
        </>
    );
}

export async function getStaticProps({ params }: any) {
    const url = process.env.NEXT_PUBLIC_API_URL + `/api/world/${params.subject}`;

    try {
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const sectionsData = await response.json();

        if (!Object.keys(sectionsData).length) {
            throw new Error();
        }

        const url2 = process.env.NEXT_PUBLIC_API_URL + "/api/world";

        try {
            const response = await fetch(url2, { credentials: "include" });

            if (!response.ok) throw `${response.status}: ${response.statusText}`;

            const titleData = await response.json();

            if (!Object.keys(titleData).length) {
                throw new Error();
            }

            const title = titleData.filter((e: any) => e.name.toLowerCase().slice(0, 3) === params.subject);

            return {
                props: {
                    data: sectionsData,
                    title: title[0].name,
                    subject: params.subject,
                },
            };
        } catch {
            return {
                props: {
                    data: [],
                },
            };
        }
    } catch {
        return {
            props: {
                data: [],
            },
        };
    }
}

export async function getStaticPaths() {
    return {
        paths: ["/mat"],
        fallback: false,
    };
}

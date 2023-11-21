import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Loading from "@/components/loading";
import LockWall from "@/components/solo/lockwall";

import getDoneCount from "utils/getDoneCount";
import getQuizData from "utils/getQuizData";
import unlockTitle from "utils/unlockTitle";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// SECTIONS
import MatBasics from "@/components/solo/mat/basics";
import MatStatistics from "@/components/solo/mat/statistics";
import MatAlgebra from "@/components/solo/mat/algebra";
import MatGeometry from "@/components/solo/mat/geometry";

import NatBiology from "@/components/solo/nat/biology";
import NatChemistry from "@/components/solo/nat/chemistry";
import NatPhysics from "@/components/solo/nat/physics";

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

    const [quizCount, setQuizCount] = useState(0);
    const [doneCount, setDoneCount] = useState(0);
    const [sections, setSections] = useState([] as any);
    const [quizData, setQuizData] = useState([] as any);

    useEffect(() => {
        if (!props.data.length) {
            router.push("/solo");
            return;
        }

        if (quizCount > 0 && doneCount === quizCount * 5 && props.subject === "mat") unlockTitle(23);
        if (quizCount > 0 && doneCount === quizCount * 5 && props.subject === "nat") unlockTitle(24);

        (async function () {
            switch (props.subject) {
                case "mat": {
                    const data = await Promise.all([getQuizData(1), getQuizData(2), getQuizData(3), getQuizData(4)]);

                    setQuizData(data);
                    setSections([
                        <MatBasics data={data[0]} key={1} />,
                        <MatStatistics data={data[1]} key={2} />,
                        <MatAlgebra data={data[2]} key={3} />,
                        <MatGeometry data={data[3]} key={4} />,
                    ]);

                    break;
                }

                case "nat": {
                    const data = await Promise.all([getQuizData(5), getQuizData(6), getQuizData(7)]);

                    setQuizData(data);
                    setSections([
                        <NatBiology data={data[0]} key={1} />,
                        <NatPhysics data={data[1]} key={2} />,
                        <NatChemistry data={data[2]} key={3} />,
                    ]);

                    break;
                }
            }

            if (quizData.length && !quizData[0].length && props.subject === "mat") {
                const bodyData = {
                    subject: props.subject,
                    area: props.data[0].area_name[0].toLowerCase().slice(0, 3),
                    quizType: props.data[0].type_id,
                    quizNumber: 1,
                };

                await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                        "Content-Type": "application/json",
                    },
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

            if (sections.length) {
                if (!doneCount) {
                    const count = await getDoneCount(
                        sections.map((e: any) => (props.subject === "nat" ? Number(e.key) + 4 : Number(e.key)))
                    );
                    setDoneCount(count);
                }

                setQuizCount(document.querySelectorAll(".quiz-circle").length);
            }
        })();
    }, [JSON.stringify(quizData)]);

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

            <Topbar type="solo" barValue={doneCount} barMaxValue={(quizCount ? quizCount : 1) * 5} />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                {props.data.map((e, i) => {
                    return (
                        <div key={i + 1} className="w-full pb-24">
                            <div className="relative">
                                <h1 className="mb-2 text-center text-5xl font-bold">{e.type_name}</h1>
                                <h2 className="text-center font-semibold">{e.type_description}</h2>
                                <div className="mt-10 flex justify-center">
                                    {!quizData[i]?.length ? (
                                        <LockWall
                                            subject={props.subject}
                                            unlocks={i}
                                            type={e.type_id}
                                            currentValue={doneCount}
                                            necessaryValue={35 * (quizData?.filter((e: any) => e.length)?.length ?? 1)}
                                            updateData={setQuizData}
                                            currentData={quizData}
                                        ></LockWall>
                                    ) : null}
                                </div>
                            </div>
                            {sections[i]}
                        </div>
                    );
                })}
            </main>

            <Menubar active={1}></Menubar>
        </>
    );
}

export async function getStaticProps({ params }: any) {
    function getName(title: String) {
        title = String(title)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        if (title.split(" ")[0].substring(0, 3) !== "cie") return title.split(" ")[0].substring(0, 3);

        const newTitle = title
            .split(" ")
            .find((e) => e !== "ciencias" && e.length > 2)
            ?.substring(0, 3);

        return newTitle;
    }

    const url = process.env.NEXT_PUBLIC_API_URL + `/api/world/${params.subject}`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const sectionsData = await response.json();

        const url2 = process.env.NEXT_PUBLIC_API_URL + "/api/world";

        try {
            const response = await fetch(url2);

            if (!response.ok) throw `${response.status}: ${response.statusText}`;

            const titleData = await response.json();

            if (!Object.keys(titleData).length) {
                throw new Error();
            }

            const title = titleData.find((e: any) => {
                const trimmedTitle = e.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .substring(0, 3);

                if (trimmedTitle === "cie") {
                    const newTitle = getName(e.name);

                    return newTitle === params.subject;
                }

                return trimmedTitle === params.subject;
            }).name;

            return {
                props: {
                    data: sectionsData,
                    title: title,
                    subject: params.subject,
                },
            };
        } catch {
            return {
                props: {
                    data: [],
                    title: "Solo",
                },
            };
        }
    } catch {
        return {
            props: {
                data: [],
                title: "Solo",
            },
        };
    }
}

export async function getStaticPaths() {
    return {
        paths: ["/solo/mat", "/solo/nat"],
        fallback: false,
    };
}

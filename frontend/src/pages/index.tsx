import Head from "next/head";

import Topbar from "@/components/topbar";
import Card from "@/components/card";
import Menubar from "@/components/menubar";
import { useEffect, useState } from "react";

export default function Home({ cardData }: any) {
    const [data, setData] = useState([]);
    const cardColors = ["#1A66E5", "#00BB29", "#C81652", "#7106C5"];

    useEffect(() => {
        (async function () {
            if (!cardData) {
                setData([<Card key={0} soon={true}></Card>] as any);
                return;
            }

            const dataCards = cardData.map((e: any, i: number) => {
                return (
                    <Card
                        key={e.id_subject}
                        title={e.name}
                        linksTo={String(e.name)
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .substring(0, 3)
                            .toLowerCase()}
                        color={cardColors[i]}
                    ></Card>
                );
            });

            setData(dataCards);
        })();
    }, []);

    if (!data.length) {
        return (
            <>
                <Topbar type="default" />
                <Menubar active={1}></Menubar>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Solo - Mille</title>
            </Head>

            <Topbar type="default" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-wrap justify-between gap-10">{data}</div>
            </main>

            <Menubar active={1}></Menubar>
        </>
    );
}

export async function getStaticProps() {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/world";

    const response = await fetch(url);

    const data = await response.json();

    return {
        props: {
            cardData: data,
        },
    };
}

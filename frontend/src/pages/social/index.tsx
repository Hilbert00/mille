import Head from "next/head";

import Topbar from "@/components/topbar";
import Card from "@/components/card";
import Menubar from "@/components/menubar";
import { useEffect, useState } from "react";
import { getUserData } from "hooks/getUserData";

import Link from "next/link";

import { TbLock } from "react-icons/tb";

export default function Social({ cardData }: any) {
    const [user] = getUserData(false);
    const [data, setData] = useState([]);
    const cardColors = ["#1A66E5", "#00BB29", "#C81652", "#7106C5"];

    useEffect(() => {
        (async function () {
            if (!cardData) return;

            const dataCards = cardData.map((e: any, i: number) => {
                return (
                    <Card
                        key={e.id_subject}
                        title={e.name}
                        linksTo={
                            "social/" +
                            String(e.name)
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .substring(0, 3)
                                .toLowerCase()
                        }
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
                <Topbar type="social" />
                <Menubar active={0}></Menubar>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Comunidade - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="relative flex w-full flex-wrap justify-between gap-10">{data}</div>
                {Boolean(user.type) && (
                    <Link
                        className="group absolute right-0 bottom-24 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500 text-primary-white transition-all delay-200 duration-500 active:scale-90 sm:hover:w-44 sm:hover:delay-[0ms]"
                        href={"/social/adm"}
                    >
                        <TbLock className="min-h-[3rem] min-w-[3rem] text-5xl" />
                        <div className="relative ml-0 h-full w-0 transition-all delay-200 duration-500 sm:group-hover:ml-2 sm:group-hover:w-20 sm:group-hover:delay-[0ms]">
                            <span className="absolute right-0 top-4 w-20 select-none font-semibold opacity-0 transition-opacity duration-500 sm:group-hover:opacity-100 sm:group-hover:delay-200">
                                Painel de Controle
                            </span>
                        </div>
                    </Link>
                )}
            </main>

            <Menubar active={0}></Menubar>
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

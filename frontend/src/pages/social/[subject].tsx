import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import { useEffect, useState } from "react";

export default function Social({ data }: any) {
    return (
        <>
            <Head>
                <title>Mille - Solo</title>
            </Head>

            <Topbar type="default" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-wrap justify-between gap-10">{data.name}</div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

export async function getStaticProps({ params }: any) {
    const url = process.env.NEXT_PUBLIC_API_URL + `/api/world`;

    try {
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const json: { id_subject: number; name: string }[] = await response.json();
        const data = json.find((e) => String(e.name).toLowerCase().substring(0, 3) === params.subject);

        return {
            props: { data },
        };
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
        paths: ["/social/mat"],
        fallback: false,
    };
}

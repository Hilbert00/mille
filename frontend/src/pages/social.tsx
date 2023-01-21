import Head from "next/head";

import Topbar from "@/components/topbar";
import Card from "@/components/card";
import Menubar from "@/components/menubar";

export default function Social() {
    return (
        <>
            <Head>
                <title>Mille - Comunidade</title>
            </Head>

            <Topbar></Topbar>

            <main className="mx-auto mt-10 mb-24 min-h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                <div className="flex w-full flex-wrap justify-between gap-10">
                    <Card soon={true}></Card>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

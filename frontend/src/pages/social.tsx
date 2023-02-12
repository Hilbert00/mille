import Head from "next/head";

import Topbar from "@/components/topbar";
import Card from "@/components/card";
import Menubar from "@/components/menubar";

export default function Social() {
    return (
        <>
            <Head>
                <title>Mille - Social</title>
            </Head>

            <Topbar type="default" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-wrap justify-between gap-10">
                    <Card soon={true}></Card>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

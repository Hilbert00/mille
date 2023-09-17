import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import { useEffect } from "react";
import { getUserData } from "hooks/getUserData";

import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/button";

export default function ControlPanel() {
    const [user] = getUserData(false);
    const router = useRouter();

    useEffect(() => {
        if (user?.type === undefined) return;
        if (!user.type) router.push("/");
    }, [user?.type]);

    if (!user.type)
        return (
            <>
                <Head>
                    <title>Comunidade - Mille</title>
                </Head>

                <Topbar type="social" />

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Painel de Controle - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-2xl font-semibold">Painel de Controle</h1>

                <div className="flex flex-col gap-4">
                    <Link href="/social/adm/reports">
                        <Button type="button" className="w-full p-4 text-left text-xl font-semibold">
                            Denúncias
                        </Button>
                    </Link>
                    {user.type === 2 && (
                        <>
                            <Link href="/social/adm/requests">
                                <Button
                                    type="button"
                                    className="w-full p-4 text-left text-xl font-semibold"
                                    bgColor="#C81652"
                                >
                                    Pedidos de banimento
                                </Button>
                            </Link>
                            <Link href="/social/adm/roles">
                                <Button
                                    type="button"
                                    className="w-full p-4 text-left text-xl font-semibold"
                                    bgColor="#00BB29"
                                >
                                    Gerenciamento de cargos
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

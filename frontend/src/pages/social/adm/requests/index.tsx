import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Behavior from "@/components/social/behavior";

import { useEffect, useState } from "react";
import { getUserData } from "hooks/getUserData";

import { useRouter } from "next/router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import Link from "next/link";
import Image from "next/image";

// INTERFACES
interface request {
    user_picture: string;
    create_time: string;
    id_request: number;
    status: boolean;
    user_behavior: number;
    user_id: number;
    username: string;
}

export default function BanRequests() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [requests, setRequests] = useState([] as request[]);

    useEffect(() => {
        if (user?.type === undefined) return;
        if (user.type !== 2) {
            router.push("/solo");
            return;
        }

        if (!requests.length)
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/requests", {
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setRequests(data);
                })
                .catch((err) => console.error(err));
    }, [user?.type]);

    function makeRequestDivs(array: request[]) {
        return array.map((e) => {
            return (
                <div
                    key={e.id_request}
                    className="relative flex w-full flex-col gap-3 rounded-xl bg-primary-white p-3 transition-all duration-500 dark:bg-primary sm:hover:scale-110"
                >
                    <div className="relative flex items-center">
                        <div className="absolute flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        e.user_picture
                                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${e.user_picture}.webp`
                                            : "/images/usericons/default.png"
                                    }
                                    className="h-10 w-10 rounded-full object-cover"
                                    alt={"User"}
                                    width={40}
                                    height={40}
                                ></Image>
                            </div>

                            <div className="flex flex-col">
                                <Link href={"/user?name=" + e.username} className="w-24 font-medium sm:w-auto">
                                    @{e.username}
                                </Link>
                                <span className="text-sm font-light">{dayjs(e.create_time).fromNow()}</span>
                            </div>
                        </div>

                        <Link href={`/social/adm/requests/${e.id_request}`} className="flex flex-1 justify-end">
                            <Behavior>{e.user_behavior}</Behavior>
                        </Link>
                    </div>
                </div>
            );
        });
    }

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
                <title>Pedidos de Banimento - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-2xl font-semibold">Pedidos de Banimento</h1>

                {requests.length ? (
                    <div className="mt-5 flex grid-cols-2 flex-col gap-3 sm:grid">{makeRequestDivs(requests)}</div>
                ) : (
                    <h2 className="mt-10 text-center text-xl">Nenhum pedido de banimento aberto...</h2>
                )}
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

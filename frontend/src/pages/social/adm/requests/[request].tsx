import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";
import Loading from "@/components/loading";
import Behavior from "@/components/social/behavior";

import { useEffect, useState } from "react";
import { getUserData } from "hooks/getUserData";

import { useRouter } from "next/router";

import swal from "sweetalert2";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import Link from "next/link";
import Image from "next/image";

// INTERFACES
interface request {
    answer_content?: string;
    create_time: string;
    id_request: number;
    post_content?: string;
    post_title?: string;
    reason: string;
    requested_at: string;
    report_created: string;
    status: number;
    user_behavior: number;
    user_id: number;
    username: string;
}

export default function BanRequest() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [request, setRequest] = useState({} as request);

    useEffect(() => {
        if (user?.type === undefined) return;
        if (user.type !== 2) {
            router.push("/solo");
            return;
        }

        if (router.query?.request === undefined) return;

        const id = Number(router.query.request);

        if (!Object.keys(request).length && !Number.isNaN(id))
            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/request?id=${router.query.request}`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!Object.keys(data).length) return router.push("/social/adm/requests");
                    setRequest(data);
                })
                .catch((err) => console.error(err));
    }, [user?.type, JSON.stringify(request)]);

    function handleRequest(value: 0 | 1) {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/request/status", {
            body: JSON.stringify({ value, requestId: request.id_request, userId: request.user_id }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok)
                    swal.fire({
                        title: "Sucesso",
                        text: `O usuário${value ? "" : " não"} foi banido!`,
                        icon: "success",
                        background: "#1E1E1E80",
                        color: "#fff",
                    }).then(() => router.push("/social/adm/requests"));
            })
            .catch((_err) => router.push("/social/adm/requests"));
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

    if (!Object.keys(request).length)
        return (
            <>
                <Head>
                    <title>Pedido de Banimento - Mille</title>
                </Head>

                <Topbar type="social" />

                <Loading></Loading>

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Pedido de Banimento - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between sm:relative sm:justify-end sm:gap-8">
                        <div className="flex items-center gap-2 sm:absolute sm:left-0">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={"/images/usericons/default.png"}
                                    alt={"User"}
                                    width={50}
                                    height={50}
                                ></Image>
                            </div>
                            <div className="flex flex-col">
                                <Link href={"/user?name=" + request.username} className="w-24 font-medium sm:w-auto">
                                    @{request.username}
                                </Link>
                                <span className="text-sm font-light">{dayjs(request.create_time).fromNow()}</span>
                            </div>
                        </div>

                        <Behavior>{request.user_behavior}</Behavior>
                    </div>

                    <div>
                        {request.post_title ? (
                            <>
                                <h1 className="text-2xl font-semibold sm:text-3xl">{request.post_title}</h1>
                                <p className="whitespace-pre-line">{request.post_content}</p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">{request.answer_content}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-medium sm:text-2xl">Justificativa</h1>
                            <hr className="flex-1" />
                        </div>
                        <p className="whitespace-pre-line">{request.reason}</p>
                    </div>

                    <form
                        className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Button
                            type="button"
                            bgColor="#00BB29"
                            className="mx-0 flex-1 text-left sm:text-center"
                            action={() => handleRequest(0)}
                        >
                            Recusar Pedido
                        </Button>

                        <Button
                            type="button"
                            bgColor="#C81652"
                            className="mx-0 flex-1 text-left sm:text-center"
                            action={() => handleRequest(1)}
                        >
                            Banir Usuário
                        </Button>
                    </form>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

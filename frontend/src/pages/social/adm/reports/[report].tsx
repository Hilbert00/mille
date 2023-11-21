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
interface report {
    user_picture: string;
    answer_created?: string;
    content?: string;
    description?: string;
    id_answer?: number;
    id_post?: number;
    id_report: number;
    id_user: number;
    is_post: 0 | 1;
    post_created?: string;
    reason: string;
    report_time: string;
    status: number;
    title?: string;
    user_behavior: number;
    username: string;
}

export default function Report() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [report, setReport] = useState({} as report);
    const [penalty, setPenalty] = useState(20);

    useEffect(() => {
        if (user?.type === undefined) return;
        if (!user.type) {
            router.push("/solo");
            return;
        }

        if (router.query?.report === undefined) return;

        const id = String(router.query.report).substring(1);
        const isPost = (function () {
            if (String(router.query.report).substring(0, 1) === "1") return true;
            if (String(router.query.report).substring(0, 1) === "0") return false;
            return router.push("/social/adm/reports");
        })();

        if (!Object.keys(report).length && typeof isPost === "boolean")
            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/report?id=${id}&isPost=${isPost}`, {
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!Object.keys(data).length) return router.push("/social/adm/reports");
                    setReport(data);
                })
                .catch((err) => console.error(err));
    }, [user?.type, JSON.stringify(report)]);

    function handlePenalty(value: number) {
        const isPost = String(router.query.report).substring(0, 1) === "1";

        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/report/status", {
            body: JSON.stringify({
                value,
                isPost,
                reportId: report.id_report,
                userId: report.id_user,
                behavior: report.user_behavior,
            }),
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok)
                    swal.fire({
                        title: "Sucesso",
                        text: value ? "A punição foi aplicada!" : "A denúncia foi recusada!",
                        icon: "success",
                        background: "#1E1E1E80",
                        color: "#fff",
                    }).then(() => router.push("/social/adm/reports"));
            })
            .catch((_err) => router.push("/social/adm/reports"));
    }

    function handleBanRequest() {
        const isPost = String(router.query.report).substring(0, 1) === "1";

        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/report/status", {
            body: JSON.stringify({
                value: 0,
                isPost,
                reportId: report.id_report,
                userId: report.id_user,
                behavior: report.user_behavior,
                isRequest: true,
            }),
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok)
                    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/request/create", {
                        body: JSON.stringify({
                            isPost,
                            id: isPost ? report.id_post : report.id_answer,
                        }),
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        credentials: "include",
                    })
                        .then((res) => {
                            if (res.ok)
                                swal.fire({
                                    title: "Sucesso",
                                    text: "O seu pedido foi criado!",
                                    icon: "success",
                                    background: "#1E1E1E80",
                                    color: "#fff",
                                }).then(() => router.push("/social/adm/reports"));
                        })
                        .catch((_err) => router.push("/social/adm/reports"));
            })
            .catch((_err) => router.push("/social/adm/reports"));
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

    if (!Object.keys(report).length)
        return (
            <>
                <Head>
                    <title>Denúncia - Mille</title>
                </Head>

                <Topbar type="social" />

                <Loading></Loading>

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Denúncia - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between sm:relative sm:justify-end sm:gap-8">
                        <div className="flex items-center gap-2 sm:absolute sm:left-0">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        report.user_picture
                                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${report.user_picture}.webp`
                                            : "/images/usericons/default.png"
                                    }
                                    className="rounded-full object-contain"
                                    alt={"User"}
                                    width={50}
                                    height={50}
                                ></Image>
                            </div>
                            <div className="flex flex-col">
                                <Link href={"/user?name=" + report.username} className="w-24 font-medium sm:w-auto">
                                    @{report.username}
                                </Link>
                                <span className="text-sm font-light">
                                    {dayjs(report.post_created || report.answer_created).fromNow()}
                                </span>
                            </div>
                        </div>

                        <Behavior>{report.user_behavior}</Behavior>
                    </div>

                    <div>
                        {report.is_post ? (
                            <>
                                <h1 className="text-2xl font-semibold sm:text-3xl">{report.title}</h1>
                                <p className="whitespace-pre-line">{report.description}</p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">{report.content}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-medium sm:text-2xl">Justificativa</h1>
                            <hr className="flex-1" />
                        </div>
                        <p className="whitespace-pre-line">{report.reason}</p>
                    </div>

                    <form
                        className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Button
                            type="button"
                            bgColor="#00BB29"
                            className="mx-0 flex-1 text-left sm:text-center"
                            action={() => handlePenalty(0)}
                        >
                            Recusar Denúncia
                        </Button>

                        <Button
                            type="button"
                            bgColor="#C81652"
                            className="mx-0 flex flex-1 justify-between sm:justify-around"
                            action={(e) => {
                                // @ts-ignore
                                if (e.target.name) return;
                                handlePenalty(penalty);
                            }}
                        >
                            <span>Aplicar Punição</span>
                            <select
                                name="penalty"
                                className="z-10 w-16 appearance-none rounded-md bg-red-600 text-center"
                                onChange={(e) => setPenalty(Number(e.target.value))}
                            >
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </Button>

                        <Button
                            type="button"
                            bgColor="#C81652"
                            className="mx-0 flex-1 text-left sm:text-center"
                            action={handleBanRequest}
                        >
                            Requisitar Banimento
                        </Button>
                    </form>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

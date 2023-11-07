import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";

import { useEffect, useState } from "react";
import { getUserData } from "hooks/getUserData";

import { useRouter } from "next/router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
const swal = withReactContent(Swal);

// INTERFACES
interface report {
    create_time: string;
    description: string;
    id_post: number;
    id_report: number;
    is_post: 0 | 1;
    status: boolean;
}

export default function Reports() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [reports, setReports] = useState([] as report[]);
    const [filter, setFilter] = useState(0);

    useEffect(() => {
        if (user?.type === undefined) return;
        if (!user.type) {
            router.push("/solo");
            return;
        }

        if (!reports.length)
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/reports", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => {
                    setReports(data);
                })
                .catch((err) => console.error(err));
    }, [user?.type, filter]);

    function handleFilters() {
        swal.fire({
            title: "Filtros de Pesquisa",
            background: "#1E1E1E",
            color: "#fff",
            html: (
                <div className="flex-col gap-4">
                    <div className="flex justify-between">
                        <label htmlFor="type">Tipo:</label>
                        <select
                            name="type"
                            className="w-48 resize-none appearance-none truncate rounded-xl border-none bg-neutral-100 p-1 text-base text-neutral-400 outline-none dark:bg-zinc-800"
                        >
                            <option value="0" className="text-base">
                                Tudo
                            </option>
                            <option value="1" className="text-base">
                                Perguntas
                            </option>
                            <option value="2" className="text-base">
                                Respostas
                            </option>
                        </select>
                    </div>
                </div>
            ),
            focusConfirm: false,
            preConfirm: () => {
                const type = swal.getPopup()?.querySelector('select[name = "type"]') as any;

                return { type: type.value };
            },
        }).then((result) => {
            if (!result.isConfirmed) return;

            const filter = Number(result.value?.type);
            setFilter(filter);
        });
    }

    function makeReportDivs(array: report[]) {
        return array.map((e) => {
            return (
                <Link
                    key={`${e.is_post}-${e.id_report}`}
                    href={`/social/adm/reports/${e.is_post}${e.id_report}`}
                    className="relative flex w-full flex-col gap-3 rounded-xl bg-primary-white p-3 transition-all duration-500 dark:bg-primary sm:hover:scale-110"
                >
                    <div>
                        <p className="whitespace-pre-line">{e.description}</p>
                    </div>

                    <div className="flex justify-end">
                        <span className="text-sm font-light">{dayjs(e.create_time).fromNow()}</span>
                    </div>
                </Link>
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
                <title>Denúncias - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-2xl font-semibold">Denúncias</h1>

                {reports.length ? (
                    <Button type="button" className="w-full" action={handleFilters}>
                        Filtrar
                    </Button>
                ) : (
                    <h2 className="mt-10 text-center text-xl">Nenhuma denúncia para ser analisada...</h2>
                )}

                <div className="mt-5 flex flex-col gap-3">
                    {reports.some((e) => e.is_post) &&
                        filter !== 2 && [
                            <div className="flex items-center gap-3" key="posts">
                                <h1 className="font-medium sm:text-2xl">Perguntas</h1>
                                <hr className="flex-1" />
                            </div>,
                            makeReportDivs(reports.filter((e) => e.is_post)),
                        ]}

                    {reports.some((e) => !e.is_post) &&
                        filter !== 1 && [
                            <div className="flex items-center gap-3" key="answers">
                                <h1 className="font-medium sm:text-2xl">Respostas</h1>
                                <hr className="flex-1" />
                            </div>,
                            makeReportDivs(reports.filter((e) => !e.is_post)),
                        ]}
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

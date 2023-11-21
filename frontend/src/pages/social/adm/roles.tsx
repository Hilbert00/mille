import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";
import Behavior from "@/components/social/behavior";
import Loading from "@/components/loading";

import { TbCheck } from "react-icons/tb";

import { useEffect, useState } from "react";
import { getUserData } from "hooks/getUserData";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const swal = withReactContent(Swal);

// INTERFACES
interface user {
    user_picture: string;
    id: number;
    type: 0 | 1 | 2;
    user_behavior: number;
    username: string;
}

export default function BanRequests() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [users, setUsers] = useState([] as user[]);
    const [original, setOriginal] = useState([] as user[]);
    const [filter, setFilter] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user?.type === undefined) return;
        if (user.type !== 2) {
            router.push("/solo");
            return;
        }

        if (!users.length)
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/roles", {
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setOriginal(JSON.parse(JSON.stringify(data)));
                    setUsers(data);
                })
                .catch((err) => console.error(err));
    }, [user?.type]);

    function makeUserDivs(array: user[]) {
        return array.map((e) => {
            return (
                <div
                    key={e.id}
                    className="relative flex w-full flex-col gap-3 rounded-xl bg-primary-white p-3 transition-all duration-500 dark:bg-primary"
                >
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex flex-1 items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        e.user_picture
                                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${e.user_picture}.webp`
                                            : "/images/usericons/default.png"
                                    }
                                    className="rounded-full object-contain"
                                    alt={"User"}
                                    width={40}
                                    height={40}
                                ></Image>
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <Link href={"/user?name=" + e.username} className="w-full font-medium sm:w-auto">
                                    @{e.username}
                                </Link>
                                <select
                                    name="type"
                                    className="w-48 resize-none appearance-none truncate rounded-md border-none bg-neutral-100 px-2 text-sm text-neutral-400 outline-none dark:bg-zinc-800"
                                    value={e.type}
                                    onChange={(ev) => {
                                        handleChange(e.id, Number(ev.currentTarget.value));
                                    }}
                                >
                                    <option value={0} className="text-base">
                                        Comum
                                    </option>
                                    <option value={1} className="text-base">
                                        Moderador
                                    </option>
                                    <option value={2} className="text-base">
                                        Administrador
                                    </option>
                                </select>
                            </div>
                        </div>

                        <Behavior>{e.user_behavior}</Behavior>
                    </div>
                </div>
            );
        });
    }

    function handleChange(id: number, value: number) {
        const updatedData = users.map((e) => {
            if (e.id === id) e.type = value as 0 | 1 | 2;
            return e;
        });

        setUsers(updatedData);
    }

    function saveChanges() {
        users.forEach((e, i) => {
            if (e.type === original[i].type) return;

            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/social/role/update", {
                body: JSON.stringify({ value: e.type, userId: e.id }),
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
                            text: "Os cargos foram atualizados!",
                            icon: "success",
                            background: "#1E1E1E80",
                            color: "#fff",
                        }).then(() => setOriginal(JSON.parse(JSON.stringify(users))));
                })
                .catch((_err) => {
                    swal.fire({
                        title: "Oops",
                        text: "Algum erro inesperado ocorreu!",
                        icon: "error",
                        background: "#1E1E1E80",
                        color: "#fff",
                    }).then(() => router.push("/social/adm"));
                });
        });
    }

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
                                Todos
                            </option>
                            <option value="1" className="text-base">
                                Comum
                            </option>
                            <option value="2" className="text-base">
                                Moderador
                            </option>
                            <option value="3" className="text-base">
                                Administrador
                            </option>
                        </select>
                    </div>
                </div>
            ),
            focusConfirm: false,
            preConfirm: () => {
                const type = swal.getPopup()?.querySelector('select[name = "type"]') as any;

                return { type: Number(type.value) };
            },
        }).then((result) => {
            if (!result.isConfirmed) return;

            setFilter(result.value.type);
        });
    }

    if (!user.type)
        return (
            <>
                <Head>
                    <title>Comunidade - Mille</title>
                </Head>

                <Topbar type="social" />

                <Loading />

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Gerenciamento de Cargos - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-2xl font-semibold">Gerenciamento de Cargos</h1>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        className="h-11 flex-1 rounded-xl border-none bg-primary-white p-3 text-neutral-400 outline-none dark:bg-zinc-800 sm:max-w-none"
                        type="text"
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button type="button" className="w-full sm:w-40" action={handleFilters}>
                        Filtros
                    </Button>
                </div>

                {users.length ? (
                    <div className="mt-5 flex flex-col gap-3">
                        {search.length ? (
                            makeUserDivs(
                                users.filter((e) => {
                                    const msg = search.toLowerCase();
                                    if (
                                        e.username.toLocaleLowerCase().includes(msg) &&
                                        (filter === 0 ? true : e.type === filter - 1)
                                    ) {
                                        return true;
                                    }
                                    return false;
                                })
                            )
                        ) : (
                            <>
                                {users.some((e) => e.type === 2) && filter !== 1 && filter !== 2 && (
                                    <div>
                                        <div key="title" className="flex items-center gap-3">
                                            <h1 className="font-medium sm:text-2xl">Administradores</h1>
                                            <hr className="flex-1" />
                                        </div>
                                        <div key="content" className="mt-5 flex grid-cols-2 flex-col gap-3 sm:grid">
                                            {makeUserDivs(users.filter((e) => e.type === 2))}
                                        </div>
                                    </div>
                                )}

                                {users.some((e) => e.type === 1) && filter !== 1 && filter !== 3 && (
                                    <div>
                                        <div key="title" className="flex items-center gap-3">
                                            <h1 className="font-medium sm:text-2xl">Moderadores</h1>
                                            <hr className="flex-1" />
                                        </div>
                                        <div key="content" className="mt-5 flex grid-cols-2 flex-col gap-3 sm:grid">
                                            {makeUserDivs(users.filter((e) => e.type === 1))}
                                        </div>
                                    </div>
                                )}

                                {users.some((e) => e.type === 0) && filter !== 2 && filter !== 3 && (
                                    <div>
                                        <div key="title" className="flex items-center gap-3">
                                            <h1 className="font-medium sm:text-2xl">Usuários Comuns</h1>
                                            <hr className="flex-1" />
                                        </div>
                                        <div key="content" className="mt-5 flex grid-cols-2 flex-col gap-3 sm:grid">
                                            {makeUserDivs(users.filter((e) => e.type === 0))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <h2 className="mt-10 text-center text-xl">Nenhum pedido de banimento aberto...</h2>
                )}

                {Boolean(
                    users.filter((e, i) => {
                        return e.type !== original[i].type;
                    }).length
                ) && (
                    <button
                        className="group fixed right-20 bottom-24 flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-primary-white transition-all delay-200 duration-500 active:scale-90 sm:hover:w-44 sm:hover:delay-[0ms]"
                        onClick={saveChanges}
                    >
                        <TbCheck className="stroke-[3] text-5xl" />
                        <div className="relative ml-0 flex h-full w-0 items-center transition-all delay-200 duration-500 sm:group-hover:ml-2 sm:group-hover:w-20 sm:group-hover:delay-[0ms]">
                            <span className="absolute right-0 w-20 select-none font-semibold opacity-0 transition-opacity duration-500 sm:group-hover:opacity-100 sm:group-hover:delay-200">
                                Confirmar
                            </span>
                        </div>
                    </button>
                )}
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

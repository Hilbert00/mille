import Head from "next/head";
import Image from "next/image";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Loading from "@/components/loading";
import Button from "@/components/button";

import swal from "sweetalert2";
import { getUserData } from "hooks/getUserData";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function User() {
    const router = useRouter();
    const [user] = getUserData(false, false);
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [picture, setPicture] = useState("");

    useEffect(() => {
        if (!Object.keys(user).length) return;
        if (!user.isUser) {
            router.push("/");
            return;
        }

        setUsername(user.username);
    }, [Object.keys(user).length]);

    function updateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!username) return;

        const data = {} as { username?: string; title?: string; picture?: string };
        if (username) data.username = username;
        if (title) data.title = title;
        if (picture) data.picture = picture;

        if (Object.keys(data).length) {
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/update";
            fetch(url, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.ok) return router.push("/");
                swal.fire({
                    title: "Oops",
                    text: "Alguns dados estão inválidos ou o nome de usuário já está sendo utilizado!",
                    icon: "error",
                    background: "#1E1E1E80",
                    color: "#fff",
                });
            });
        }
    }

    if (!Object.keys(user).length)
        return (
            <>
                <Head>
                    <title>Mille</title>
                </Head>

                <Topbar type="default" />

                <Loading />

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Mille</title>
            </Head>

            <Topbar type="default" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-4xl font-bold">Edição do Pefil</h1>
                <form method="post" className="flex flex-col gap-5" onSubmit={updateProfile}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="username" className="font-medium sm:text-xl">
                            Nome de usuário:
                        </label>
                        <input
                            name="username"
                            type="text"
                            value={username}
                            className="h-11 flex-1 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#282828]"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="title" className="font-medium sm:text-xl">
                            Título:
                        </label>
                        <select name="title" disabled></select>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="picture" className="font-medium sm:text-xl">
                            Foto do perfil:
                        </label>
                        <input name="picture" type="file" disabled />
                    </div>

                    <Button type="submit" className="mt-5" disable={!username}>
                        Confirmar Alterações
                    </Button>
                </form>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

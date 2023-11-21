import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Loading from "@/components/loading";
import Button from "@/components/button";

import swal from "sweetalert2";
import { getUserData } from "hooks/getUserData";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const CLOUD_NAME = "dxmh73o0j";
const CLOUD_KEY = "912131322178127";

export default function User() {
    const router = useRouter();
    const [user] = getUserData(false, false);
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState(-1);
    const [available, setAvailable] = useState(null as null | { title_id: number; title: string }[]);

    useEffect(() => {
        if (!Object.keys(user).length) return;
        if (!user.isUser) {
            router.push("/solo");
            return;
        }

        if (available && available.length) {
            if (title === -1) {
                if (user.title.toLowerCase() === "novato") setTitle(0);
                else setTitle(Number(available.find((e) => e.title === user.title)?.title_id));
            }

            return;
        }

        if (!available) {
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/titles", {
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
            })
                .then((res) => res.json())
                .then((json) => setAvailable(json));
        }

        setUsername(user.username);
    }, [Object.keys(user).length, title, available]);

    async function updateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!username) return;

        const data = {} as { username?: string; active_title?: number; picture?: string };

        if (username && username !== user.username) data.username = username;

        if (
            available?.find((e) => e.title_id === title)?.title !== user.title &&
            title >= 0 &&
            (title === 0 || available?.findIndex((e) => e.title_id === title) !== -1)
        )
            data.active_title = title;

        // @ts-ignore
        const picture = document?.querySelector("#picture")?.files[0];

        if (picture) {
            const signatureResponse = await (
                await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/picture/signature", {
                    credentials: "include",
                    headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
                })
            ).json();

            if (user.picture) {
                await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/picture/destroy", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ public_id: [user.picture] }),
                });
            }

            const fd = new FormData();
            fd.append("api_key", CLOUD_KEY);
            fd.append("signature", signatureResponse.signature);
            fd.append("timestamp", signatureResponse.timestamp);
            fd.append("file", picture);

            const uploadResponse = await (
                await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: fd,
                })
            ).json();

            const photoData = {
                public_id: uploadResponse.public_id,
                version: uploadResponse.version,
                signature: uploadResponse.signature,
            };

            data.picture = photoData.public_id;
        }

        if (Object.keys(data).length) {
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/update";
            fetch(url, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.ok) return router.push(`/user?name=${username}`);
                swal.fire({
                    title: "Oops",
                    text: "Alguns dados estão inválidos ou o nome de usuário já está sendo utilizado!",
                    icon: "error",
                    background: "#1E1E1E80",
                    color: "#fff",
                });
            });
        } else return router.push(`/user?name=${user.username}`);
    }

    if (!Object.keys(user).length || !available)
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
                            id="username"
                            type="text"
                            value={username}
                            className="h-11 flex-1 rounded-xl border-none bg-neutral-100 py-2 px-3 text-neutral-400 outline-none dark:bg-zinc-800 sm:py-0"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="title" className="font-medium sm:text-xl">
                            Título:
                        </label>
                        <select
                            name="title"
                            id="title"
                            className="h-11 rounded-xl bg-neutral-100 px-3 text-neutral-400 outline-none dark:bg-zinc-800"
                            value={title}
                            onChange={(e) => setTitle(Number(e.target.value))}
                        >
                            <option value="0">Novato</option>
                            {available.map((e) => (
                                <option key={e.title_id} value={e.title_id}>
                                    {e.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label htmlFor="picture" className="font-medium sm:text-xl">
                            Foto do perfil:
                        </label>
                        <input
                            name="picture"
                            id="picture"
                            type="file"
                            className="h-11 cursor-pointer rounded-xl bg-neutral-100 pr-3 text-neutral-400 file:mr-5 file:h-11 file:cursor-pointer file:border-none dark:bg-zinc-800 sm:w-2/3"
                            accept=".png,.jpg,.jpeg,.webp"
                        />
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

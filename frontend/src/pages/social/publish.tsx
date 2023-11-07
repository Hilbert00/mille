import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";
import Loading from "@/components/loading";

import unlockTitle from "utils/unlockTitle";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import swal from "sweetalert2";

import { getUserData } from "hooks/getUserData";
import getAllAreas from "utils/getAllAreas";

export default function Publish() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [area, setArea] = useState(1);
    const [areas, setAreas] = useState({} as any);
    const [canceled, setCanceled] = useState(false);

    useEffect(() => {
        if (user.banned || user.user_behavior < 50) {
            router.push("/social");
            return;
        }

        getAllAreas().then((res) => setAreas(res));
    }, [JSON.stringify(user)]);

    function handleSubmit() {
        if (!area || !content || !title)
            return swal.fire({
                title: "Oops",
                text: "Preencha todos os campos!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title.trim(), content: content.trim(), area }),
            method: "POST",
        }).then(() => {
            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/posts`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => {
                    swal.fire({
                        title: "Sucesso!",
                        text: "A sua pergunta foi publicada!",
                        icon: "success",
                        background: "#1E1E1E80",
                        color: "#fff",
                    }).then(() => {
                        if (!data.length) return router.push("/social");

                        const titles = [13];

                        if (data.length >= 10) titles.push(14);
                        if (data.length >= 20) titles.push(15);
                        if (data.length >= 50) titles.push(16);

                        unlockTitle(titles).then(() => router.push("/social"));
                    });
                });
        });
    }

    if (!Object.keys(user).length || !Object.keys(areas).length || user.banned || user.user_behavior < 50)
        return (
            <>
                <Head>
                    <title>Criar Post - Mille</title>
                </Head>

                <Topbar type="social" />

                <Loading />

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Criar Post - Mille</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="mb-5 text-center text-2xl font-semibold">Publicar uma Pergunta</h1>
                <form
                    action=""
                    className="flex flex-col gap-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center">
                            <label htmlFor="title" className="text-xl font-medium">
                                Título:
                            </label>
                            <input
                                name="title"
                                type="text"
                                value={title}
                                className="h-11 flex-1 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                                placeholder="Digite aqui o título da pergunta..."
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={100}
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label htmlFor="area" className="text-xl font-medium">
                                Área:
                            </label>
                            <select
                                name="area"
                                value={area}
                                className="flex-1 grow resize-none appearance-none rounded-xl border-none bg-neutral-100 p-3 text-base text-neutral-400 outline-none dark:bg-zinc-800"
                                onChange={(e) => setArea(Number(e.target.value))}
                            >
                                {Object.keys(areas).map((e, i) => {
                                    return (
                                        <optgroup label={e} key={i}>
                                            {areas[e].map((e: any) => (
                                                <option value={e.id} key={e.id} className="text-base">
                                                    {e.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="content" className="text-xl font-medium">
                            Descrição:
                        </label>
                        <textarea
                            name="content"
                            value={content}
                            rows={10}
                            placeholder="Digite aqui a sua pergunta..."
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 resize-none rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        ></textarea>
                    </div>

                    <div className="flex justify-between sm:justify-start sm:gap-5">
                        <Button
                            type="button"
                            className="mx-0 w-2/5 sm:w-40"
                            bgColor="#C81652"
                            disable={canceled}
                            action={() => {
                                router.push("/social");
                                setCanceled(true);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="mx-0 w-2/5 sm:w-40"
                            disable={!content.replace(" ", "").length || !title.replace(" ", "").length}
                        >
                            Publicar
                        </Button>
                    </div>
                </form>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";
import Loading from "@/components/loading";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import swal from "sweetalert2";
import { getUserData } from "hooks/getUserData";

export default function Publish() {
    const router = useRouter();
    const [user] = getUserData(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [area, setArea] = useState(1);
    const [canceled, setCanceled] = useState(false);

    useEffect(() => {
        if (user.banned || user.user_behavior < 50) router.push("/social");
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
        }).then(() =>
            swal
                .fire({
                    title: "Sucesso!",
                    text: "A sua pergunta foi publicada!",
                    icon: "success",
                    background: "#1E1E1E80",
                    color: "#fff",
                })
                .then(() => {
                    router.push("/social");
                })
        );
    }

    if (!Object.keys(user).length || user.banned || user.user_behavior < 50)
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
                                className="h-11 flex-1 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#282828]"
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
                                className="flex-1 grow resize-none appearance-none rounded-xl border-none bg-[#F5F5F5] p-3 text-base text-[#8E8E8E] outline-none dark:bg-[#282828]"
                                onChange={(e) => setArea(Number(e.target.value))}
                            >
                                <optgroup label="Matemática">
                                    <option value="1" className="text-base">
                                        Aritmética
                                    </option>
                                    <option value="2" className="text-base">
                                        Razões e Proporções
                                    </option>
                                    <option value="3" className="text-base">
                                        Porcentagem
                                    </option>
                                    <option value="4" className="text-base">
                                        Gráficos
                                    </option>
                                    <option value="5" className="text-base">
                                        Estatísticas e Probabilidades
                                    </option>
                                    <option value="6" className="text-base">
                                        Geometria
                                    </option>
                                    <option value="7" className="text-base">
                                        Trigonometria
                                    </option>
                                    <option value="8" className="text-base">
                                        Prismas
                                    </option>
                                    <option value="9" className="text-base">
                                        Álgebra
                                    </option>
                                </optgroup>
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
                            className="flex-1 resize-none rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#282828]"
                        ></textarea>
                    </div>

                    <div className="flex justify-between sm:justify-start sm:gap-5">
                        <Button
                            type="button"
                            className="mx-0 w-2/5 sm:w-40"
                            bgColor="#C81652"
                            disable={canceled}
                            action={() => {
                                const route = `/social`;
                                router.push(route);
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

import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import unlockTitle from "utils/unlockTitle";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert2";

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [disabled, setDisabled] = useState(false);

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setDisabled(true);

        if (username.length && password.length) {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const payload = new URLSearchParams(formData as any);

            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/login", {
                method: "POST",
                body: payload,
            })
                .then((res) => {
                    if (res.ok) return res.json();
                    else
                        swal.fire({
                            title: "Oops",
                            text: "Nome de usuário e/ou senha incorreto(s)!",
                            icon: "error",
                            background: "#1E1E1E80",
                            color: "#fff",
                        });

                    setDisabled(false);
                })
                .then(async (json) => {
                    localStorage.setItem("AuthJWT", json.token);

                    const date = new Date().getFullYear();

                    if (date === 2023) await unlockTitle(26);

                    return router.push("/solo");
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            swal.fire({
                title: "Oops",
                text: "Preencha todos os campos!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            setDisabled(false);
        }
    }

    function checkEmpty(e: any) {
        if (!String(e.currentTarget.value).length) {
            return (e.currentTarget.style.outline = "2px solid red");
        }
        return (e.currentTarget.style.outline = "none");
    }

    return (
        <>
            <Head>
                <title>Mille - Plataforma de Estudos para o ENEM</title>
            </Head>

            <header className="flex h-28 items-center justify-center">
                <Logo type={"full"} />
            </header>

            <main className="mx-auto max-w-[calc(100vw-40px)] md:max-w-3xl">
                <form className="min-h-[calc(100vh-9rem)]" method="post" onSubmit={handleSubmit}>
                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-primary-white p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        name="username"
                        type="text"
                        placeholder={"Nome de Usuário"}
                        value={username}
                        onChange={(e) => {
                            checkEmpty(e);
                            setUsername(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />

                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        name="password"
                        type="password"
                        placeholder={"Senha"}
                        value={password}
                        onChange={(e) => {
                            checkEmpty(e);
                            setPassword(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />
                    <Button type="submit" disable={disabled} className="w-3/4">
                        {"Login"}
                    </Button>
                </form>

                <div className="absolute bottom-28 left-0 right-0 flex flex-col gap-2 text-center text-sm text-neutral-400">
                    <p>
                        Ainda não tem uma conta?{" "}
                        <Link href={"/signup"} className="text-blue-600">
                            <span>Cadastre-se</span>
                        </Link>
                    </p>

                    <p>
                        <Link href={"/changepass"} className="text-blue-600">
                            Esqueci minha senha
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

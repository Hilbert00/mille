import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert2";

export default function Home() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [disabled, setDisabled] = useState(false);

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setDisabled(true);

        if (username.length && email.length && password.length && password2.length) {
            if (password !== password2) {
                swal.fire({
                    title: "Oops",
                    text: "As senhas não correspondem!",
                    icon: "error",
                    background: "#1E1E1E80",
                    color: "#fff",
                });

                setDisabled(false);
                return;
            }

            if (password.length < 8) {
                swal.fire({
                    title: "Oops",
                    text: "A senha precisa ter no mínimo 8 caracteres!",
                    icon: "error",
                    background: "#1E1E1E80",
                    color: "#fff",
                });

                setDisabled(false);
                return;
            }

            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const payload = new URLSearchParams(formData as any);

            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/signup", {
                body: payload,
                method: "POST",
            })
                .then((res) => {
                    if (res.ok) {
                        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/verify/send", {
                            body: payload,
                            method: "POST",
                        }).then(() => {
                            router.push("/verify");
                        });
                    } else {
                        swal.fire({
                            title: "Oops",
                            text: "Nome de usuário e/ou email em uso por outro usuário!",
                            icon: "error",
                            background: "#1E1E1E80",
                            color: "#fff",
                        });

                        setDisabled(false);
                    }
                })
                .catch((err) => console.log(err));
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
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
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
                        name="email"
                        type="email"
                        placeholder={"Email"}
                        value={email}
                        onChange={(e) => {
                            checkEmpty(e);
                            setEmail(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />

                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        name="password"
                        type="password"
                        minLength={8}
                        placeholder={"Senha"}
                        value={password}
                        onChange={(e) => {
                            checkEmpty(e);
                            setPassword(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />

                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        name="password2"
                        type="password"
                        minLength={8}
                        placeholder={"Repita a senha"}
                        value={password2}
                        onChange={(e) => {
                            checkEmpty(e);
                            setPassword2(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />

                    <Button type="submit" disable={disabled} className="w-3/4">
                        {"Cadastrar-se"}
                    </Button>
                </form>

                <div className="absolute bottom-28 left-0 right-0 flex flex-col gap-2 text-center text-sm text-neutral-400">
                    <p>
                        Já tem uma conta?{" "}
                        <Link href={"/login"} className="text-blue-600">
                            <span>Login</span>
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

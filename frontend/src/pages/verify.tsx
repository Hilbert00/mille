import Head from "next/head";
import swal from "sweetalert2";

import Logo from "@/components/logo";
import Footer from "@/components/footer";
import Button from "@/components/button";

import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";

import { TbMailForward } from "react-icons/tb";
import { TbMailOpened } from "react-icons/tb";

export default function Home() {
    const router = useRouter();
    const [isOk, setIsOk] = useState(false);
    const calledApi = useRef(false);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [disabled, setDisabled] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setDisabled(true);

        if (password.length && password2.length) {
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
            const sendData = Object.fromEntries(payload);

            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/changepass", {
                body: JSON.stringify({ ...sendData, email }),
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                    "Content-Type": "application/json",
                },
                method: "PUT",
                credentials: "include",
            })
                .then((res) => {
                    if (res.ok) {
                        router.push("/login");
                        return;
                    }

                    setDisabled(false);
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

    useEffect(() => {
        if (!router.isReady) return;

        const token = String(router.query.token);
        const changePass = String(router.query.changePass) === "true";

        if (router.query.token && !calledApi.current) {
            calledApi.current = true;
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/verify", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
                method: "POST",
            })
                .then((res) => {
                    if (res.ok) setIsOk(true);

                    if (!changePass || !res.ok)
                        setTimeout(() => {
                            router.push("/login");
                        }, 5000);

                    return res.json();
                })
                .then((json) => setEmail(json.email))
                .catch((err) => console.log(err));
        }
    }, [router.isReady, isOk]);

    if (!router.query.token)
        return (
            <>
                <Head>
                    <title>Mille - Plataforma de Estudos para o ENEM</title>
                </Head>

                <header className="flex h-28 items-center justify-center">
                    <Logo type={"full"} />
                </header>

                <main className="mx-auto h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                    <div className="py-20">
                        <TbMailForward style={{ color: "#1A66E5" }} className="mx-auto block text-9xl" />
                    </div>

                    <p className="text-center text-xl font-semibold">
                        Para acessar verifique seu email pelo link que foi enviado para você!
                    </p>
                </main>

                <Footer />
            </>
        );

    if (!isOk)
        return (
            <>
                <Head>
                    <title>Mille - Plataforma de Estudos para o ENEM</title>
                </Head>

                <header className="flex h-28 items-center justify-center">
                    <Logo type={"full"} />
                </header>

                <main className="mx-auto h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                    <div className="py-20">
                        <TbMailForward style={{ color: "#C81652" }} className="mx-auto block text-9xl" />
                    </div>

                    <p className="text-center text-xl font-semibold">
                        Código inválido!<br></br>Por favor verifique se acessou corretamente o link enviado por email.
                    </p>
                </main>

                <Footer />
            </>
        );

    if (!(String(router.query.changePass) === "true"))
        return (
            <>
                <Head>
                    <title>Mille - Plataforma de Estudos para o ENEM</title>
                </Head>

                <header className="flex h-28 items-center justify-center">
                    <Logo type={"full"} />
                </header>

                <main className="mx-auto h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                    <div className="py-20">
                        <TbMailOpened style={{ color: "#00BB29" }} className="mx-auto block text-9xl" />
                    </div>

                    <p className="text-center text-xl font-semibold">
                        Sua email foi confirmado e você será redirecionado à plataforma em alguns instantes!
                    </p>
                </main>

                <Footer />
            </>
        );

    return (
        <>
            <Head>
                <title>Mille - Plataforma de Estudos para o ENEM</title>
            </Head>

            <header className="flex h-28 items-center justify-center">
                <Logo type={"full"} />
            </header>

            <main className="mx-auto max-w-[calc(100vw-40px)] md:max-w-3xl">
                <form className=" min-h-[calc(100vh-9rem)]" method="post" onSubmit={handleSubmit}>
                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                        name="password"
                        type="password"
                        placeholder={"Nova senha"}
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
                        placeholder={"Repita a senha"}
                        value={password2}
                        onChange={(e) => {
                            checkEmpty(e);
                            setPassword2(e.target.value);
                        }}
                        onBlur={checkEmpty}
                    />

                    <Button type="submit" disable={disabled} className="w-3/4">
                        {"Confirme a nova senha"}
                    </Button>
                </form>
            </main>

            <Footer />
        </>
    );
}

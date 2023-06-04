import Head from "next/head";

import Logo from "@/components/logo";
import Footer from "@/components/footer";

import { useRouter } from "next/router";

import { TbMailForward } from "react-icons/tb";
import { TbMailOpened } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const router = useRouter();
    const [isOk, setIsOk] = useState(false);
    const calledApi = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;

        const token = String(router.query.token);

        if (token && !calledApi.current) {
            calledApi.current = true;
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/verify", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token }),
                method: "post",
            })
                .then((res) => {
                    if (res.ok) {
                        setIsOk(true);

                        // setTimeout(() => {
                        //     router.push("/");
                        // }, 5000);
                    }
                })
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
                        Para acessar verifique seu email pelo link que foi enviado para{" "}
                        <span style={{ color: "#1A66E5" }} className="font-medium">
                            a@email.com
                        </span>
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
                        Código inválido ou expirado, tente criar uma conta novamente!
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
}

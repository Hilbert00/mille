import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert2";

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [disabled, setDisabled] = useState(false);

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setDisabled(true);

        if (email.length) {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const payload = new URLSearchParams(formData as any);
            const objectPayload = Object.fromEntries(payload);

            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/verify/send", {
                body: JSON.stringify({ ...objectPayload, changePass: true }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
            })
                .then((res) => {
                    if (res.ok) {
                        router.push("/verify");
                        return;
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
                <title>Plataforma de Estudos para o ENEM - Mille</title>
            </Head>

            <header className="flex h-28 items-center justify-center">
                <Logo type={"full"} />
            </header>

            <main className="mx-auto max-w-[calc(100vw-40px)] md:max-w-3xl">
                <form className=" min-h-[calc(100vh-9rem)]" method="post" onSubmit={handleSubmit}>
                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#282828]"
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

                    <Button type="submit" disable={disabled} className="w-3/4">
                        {"Enviar email de confirmação"}
                    </Button>
                </form>

                <div className="absolute bottom-28 left-0 right-0 flex flex-col gap-2 text-center text-sm text-[#8E8E8E]">
                    <p>
                        Lembrou sua senha?{" "}
                        <Link href={"/login"} className="text-[#1A66E5]">
                            <span>Login</span>
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (username.length && email.length && password.length) {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const payload = new URLSearchParams(formData as any);

            let object = {} as any;
            formData.forEach((value, key) => (object[key] = value));

            const json = JSON.parse(JSON.stringify(object));

            fetch("http://localhost:8080/api/auth/changepass", {
                body: payload,
                method: "post",
                credentials: "include",
            })
                .then((res) => res.json())
                .then(() => {
                    router.push(`/@${json.username}`);
                })
                .catch((err) => console.log(err));
        } else {
            swal("Oops", "Preencha todos os campos!", "error");
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
                <form className=" min-h-[calc(100vh-9rem)]" method="post" onSubmit={handleSubmit}>
                    <input
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#3C3C3C]"
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
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#3C3C3C]"
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
                        className="mx-auto mb-12 block h-11 w-3/4 rounded-xl border-none bg-[#F5F5F5] p-3 text-[#8E8E8E] outline-none dark:bg-[#3C3C3C]"
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
                    <Button type="submit" width={75}>{"Confirme a nova senha"}</Button>
                </form>

                <div className=" absolute bottom-28 left-0 right-0 flex flex-col gap-2 text-center text-sm text-[#8E8E8E]">
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

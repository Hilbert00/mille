import Head from "next/head";
import Link from "next/link";
import Styles from "@/styles/routes/Auth.module.css";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (username.length && password.length) {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const payload = new URLSearchParams(formData as any);

            fetch("http://localhost:8080/api/auth/login", { method: "post", body: payload, credentials: "include" })
                .then(() => {
                    router.push(`/@${username}`);
                })
                .catch((err) => console.log(err));
        } else {
            swal("Oops", "Preencha todos os campos!", "error");
        }
    }

    function checkEmpty(e: any) {
        console.log(String(e.currentTarget.value));
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

            <header>
                <Logo type={"full"} />
            </header>

            <main>
                <form method="post" onSubmit={handleSubmit}>
                    <input
                        className={Styles.fieldInput}
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
                        className={Styles.fieldInput}
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
                    <Button type="submit">{"Login"}</Button>
                </form>

                <div id={Styles.linksContainer}>
                    <p>
                        Ainda não tem uma conta?{" "}
                        <Link href={"/signup"}>
                            <span>Cadastre-se</span>
                        </Link>
                    </p>

                    <p>
                        <Link href={"/changepass"}>Esqueci minha senha</Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

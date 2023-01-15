import Head from "next/head";
import Link from "next/link";
import Styles from "@/styles/routes/Auth.module.css";

import Logo from "@/components/logo";
import Button from "@/components/button";
import Footer from "@/components/footer";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const payload = new URLSearchParams(formData as any);

        let object = {} as any;
        formData.forEach((value, key) => (object[key] = value));

        const json = JSON.parse(JSON.stringify(object));

        fetch("http://localhost:8080/api/auth/signup", {
            body: payload,
            method: "post",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                router.push(`/@${json.username}`);
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            <Head>
                <title>Mille - Plataforma de Estudos para o ENEM</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className={Styles.fieldInput}
                        name="email"
                        type="email"
                        placeholder={"Email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className={Styles.fieldInput}
                        name="password"
                        type="password"
                        placeholder={"Senha"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">{"Cadastrar-se"}</Button>
                </form>

                <div id={Styles.linksContainer}>
                    <p>
                        Já tem uma conta?{" "}
                        <Link href={"/login"}>
                            <span>Login</span>
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}

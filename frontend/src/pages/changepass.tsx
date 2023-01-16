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
                        placeholder={"Nova senha"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">{"Confirme a nova senha"}</Button>
                </form>

                <div id={Styles.linksContainer}>
                    <p>
                        Lembrou sua senha?{" "}
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

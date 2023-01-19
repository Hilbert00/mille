import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Head from "next/head";

interface UserData {
    id: number;
    username: string;
    user_level: string;
    challenge_matches: number;
    challenge_wins: number;
}

export default function User({ userPath }: any) {
    const router = useRouter();

    const [user, setUser] = useState({} as UserData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userPath[0] != "@") {
            router.push("/");
            return;
        }

        async function getUserData() {
            try {
                const response = await fetch(`http://localhost:8080/api/${userPath}`, { credentials: "include" });

                if (!response.ok) throw `${response.status}: ${response.statusText}`;

                const data = await response.json();

                if (!Object.keys(data).length) {
                    router.push("/");
                    return;
                }

                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                router.push("/login");
                return;
            }
        }

        getUserData();
    }, []);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Mille - Plataforma de Estudos para o ENEM</title>
                </Head>
                <div>Carregando...</div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{user.username} - Mille</title>
            </Head>
            <div className="min-h-screen">
                <p>Nome: {user.username}</p>
                <p>Lvl: {user.user_level}</p>
                <p>Duelos: {user.challenge_matches}</p>
                <p>Vitórias em Duelos: {user.challenge_wins}</p>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const userPath = context.query.user;

    return {
        props: {
            userPath,
        },
    };
}

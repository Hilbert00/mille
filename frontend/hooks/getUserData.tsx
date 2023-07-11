import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface UserData {
    username: string;
    email: string;
    user_level: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
    active: number;
    isUser?: boolean;
}

export function getUserData(isLogin: boolean, isProfile?: boolean, userPath?: string) {
    const [data, setData] = useState({} as UserData);
    const [calledPush, setCalledPush] = useState(false);

    const router = useRouter();
    const url = userPath
        ? process.env.NEXT_PUBLIC_API_URL + `/api/user/${userPath}`
        : process.env.NEXT_PUBLIC_API_URL + "/api/user";

    async function getData() {
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const data = await response.json();

        return data;
    }

    useEffect(() => {
        (async function () {
            try {
                const data = await getData();

                if (!Object.keys(data).length) {
                    throw new Error();
                }

                if (!data.active && !calledPush && router.pathname !== "/verify" && isLogin) {
                    router.push("/verify");
                    setCalledPush(true);
                }

                setData(data);
            } catch (err) {
                if (calledPush) {
                    return;
                }

                if (isLogin) router.push("/login");
                else router.push("/");
                setCalledPush(true);
            }
        })();
    }, [data.username, userPath]);

    if (isProfile && !userPath) return [{} as UserData];
    return [data];
}

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface UserData {
    id: number;
    username: string;
    title: string;
    picture: string;
    email: string;
    user_level: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
    active: number;
    type: 0 | 1 | 2;
    banned: 0 | 1;
    created_at: string;
    isUser?: boolean;
}

export function getUserData(isLogin: boolean, isProfile?: boolean, userPath?: string) {
    const [data, setData] = useState({} as UserData);
    const [calledPush, setCalledPush] = useState(false);
    const router = useRouter();

    async function getData() {
        const url = userPath
            ? process.env.NEXT_PUBLIC_API_URL + `/api/user/${userPath}`
            : process.env.NEXT_PUBLIC_API_URL + "/api/user";

        const response = await fetch(url, {
            credentials: "include",
            headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
        });

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
                if (calledPush) return;

                setCalledPush(true);
                if (isLogin) router.push("/login");
                else router.push("/solo");
            }
        })();
    }, [data.username, userPath, calledPush]);

    if (isProfile && !userPath) return [{} as UserData];
    return [data];
}

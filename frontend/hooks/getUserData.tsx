import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface UserData {
    username: string;
    user_level: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
}

export function getUserData(userPath?: string) {
    const [data, setData] = useState({} as UserData);
    const [calledPush, setCalledPush] = useState(false);

    const router = useRouter();
    const url = userPath ? `http://localhost:8080/api/user/${userPath}` : "http://localhost:8080/api/user";

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

                setData(data);
            } catch {
                if (calledPush) {
                    return;
                }

                router.push("/login");
                setCalledPush(true);
            }
        })();
    }, [data]);

    return [data];
}

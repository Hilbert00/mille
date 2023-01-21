import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getUserData } from "utils/getUserData";

interface UserData {
    username: string;
    user_level: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
}

export default function Topbar() {
    const router = useRouter();

    const [user, setUser] = useState({} as UserData);

    useEffect(() => {
        (async function () {
            if (await getUserData(setUser) === false) {
                router.push("/login");
                return;
            }
        })();
    }, []);

    return (
        <header className="sticky top-0 z-10 w-full border-b-4 border-primary-white bg-[#fff] dark:border-primary dark:bg-bgBlack">
            <main className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                <div className="relative h-11 w-11 bg-[url(/images/calendar.png)] bg-cover">
                    <span className="absolute right-0 left-0 top-3 text-center text-xl font-extrabold tracking-wide text-primary-white">
                        {user.user_sequence}
                    </span>
                </div>

                <div className="relative w-2/5">
                    <div className="flex h-8 w-full items-center rounded-xl bg-primary-white dark:bg-[#282828] sm:justify-center">
                        <div className="flex h-8 w-[calc(100%-2.75rem)] items-center justify-center sm:w-auto">
                            <span className="text-center font-semibold sm:text-xl">{user.user_coins} / 50</span>
                        </div>
                    </div>
                    <div className="absolute -top-[16%] right-0 z-10 h-11 w-11">
                        <Image
                            src={"/images/questioncoins.png"}
                            width={100}
                            height={100}
                            alt={"Moedas de Pergunta"}
                        ></Image>
                    </div>
                </div>

                <div className="h-11 w-11">
                    <Link href={`/user/${user.username}`}>
                        <Image src={"/images/usericons/default.png"} width={100} height={100} alt={"User Icon"}></Image>
                    </Link>
                </div>
            </main>
        </header>
    );
}

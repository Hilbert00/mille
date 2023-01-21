import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import User from "@/components/userduel";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

export default function Duel() {
    const router = useRouter();

    const [user, setUser] = useState({} as UserData);

    useEffect(() => {
        (async function () {
            if ((await getUserData(setUser)) === false) {
                router.push("/login");
                return;
            }
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Mille - Duelo</title>
            </Head>

            <Topbar></Topbar>

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex flex-col items-center justify-between sm:flex-row">
                    <User side="left" lvl={user.user_level} username={`@${user.username}`} title={"título"} />
                    <h1 className="inline text-7xl font-semibold text-[red] sm:text-9xl">&times;</h1>
                    <User side="right" invite={true} />
                </div>
                <div className="absolute top-8 w-full text-center sm:top-16"></div>

                <div className="mx-auto mt-8 flex flex-col gap-3 rounded-xl bg-primary-white p-3 dark:bg-[#282828] sm:w-3/4">
                    <div className="flex items-center gap-3">
                        <label htmlFor="subject" className="font-semibold sm:text-2xl">
                            Área:{" "}
                        </label>
                        <select
                            name="subject"
                            id="subject"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                        >
                            <option value="0" className="text-base">
                                Matemática
                            </option>
                            <option value="1" className="text-base">
                                Química
                            </option>
                            <option value="2" className="text-base">
                                Biologia
                            </option>
                            <option value="3" className="text-base">
                                Física
                            </option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="subject" className="font-semibold sm:text-2xl">
                            Quantidade de questões:{" "}
                        </label>
                        <select
                            name="subject"
                            id="subject"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                        >
                            <option value="5" className="text-base">
                                5
                            </option>
                            <option value="6" className="text-base">
                                6
                            </option>
                            <option value="7" className="text-base">
                                7
                            </option>
                            <option value="8" className="text-base">
                                8
                            </option>
                            <option value="9" className="text-base">
                                9
                            </option>
                            <option value="10" className="text-base">
                                10
                            </option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="subject" className="font-semibold sm:text-2xl">
                            Tempo por questão:{" "}
                        </label>
                        <select
                            name="subject"
                            id="subject"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                        >
                            <option value="10" className="text-base">
                                10 segundos
                            </option>
                            <option value="20" className="text-base">
                                20 segundos
                            </option>
                            <option value="30" className="text-base">
                                30 segundos
                            </option>
                            <option value="40" className="text-base">
                                40 segundos
                            </option>
                            <option value="50" className="text-base">
                                50 segundos
                            </option>
                            <option value="60" className="text-base">
                                60 segundos
                            </option>
                        </select>
                    </div>
                </div>
            </main>

            <Menubar active={2}></Menubar>
        </>
    );
}

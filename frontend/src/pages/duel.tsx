import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import User from "@/components/userduel";

import { getUserData } from "hooks/getUserData";

export default function Duel() {
    const [user] = getUserData();

    if (!user.username)
        return (
            <>
                <Topbar type="default" />
                <Menubar active={2}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>Mille - Duelo</title>
            </Head>

            <Topbar type="default" />

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
                            <option value="30" className="text-base">
                                30 segundos
                            </option>
                            <option value="60" className="text-base">
                                1 minuto
                            </option>
                            <option value="90" className="text-base">
                                1 minuto e 30 segundos
                            </option>
                            <option value="120" className="text-base">
                                2 minutos
                            </option>
                            <option value="150" className="text-base">
                                2 minutos 30 segundos
                            </option>
                            <option value="180" className="text-base">
                                3 minutos
                            </option>
                        </select>
                    </div>
                </div>
            </main>

            <Menubar active={2}></Menubar>
        </>
    );
}

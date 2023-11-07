import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Loading from "@/components/loading";
import Behavior from "@/components/social/behavior";

import swal from "sweetalert2";
import { getUserData } from "hooks/getUserData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbEdit, TbDoorExit } from "react-icons/tb";

export default function User() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [user] = getUserData(false, true, username);

    function logoff() {
        const url = process.env.NEXT_PUBLIC_API_URL + "/api/auth/exit";

        fetch(url, {
            method: "PUT",
            credentials: "include",
        }).then((res) => {
            if (res.ok) return router.push("/login");
            swal.fire({
                title: "Oops",
                text: "Ocorreu um erro inesperado!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            }).then(() => {
                return router.push("/solo");
            });
        });
    }

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.name) setUsername(String(router.query.name));

        if (!router.query.name) {
            router.push("/solo");
            return;
        }
    }, [router.isReady, router.query.name, username]);

    if (
        !Object.keys(user).length ||
        String(router.query.name).toLocaleLowerCase() !== user.username.toLocaleLowerCase()
    )
        return (
            <>
                <Head>
                    <title>Mille</title>
                </Head>

                <Loading />

                <Menubar active={0}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>{`@${user.username} - Mille`}</title>
            </Head>

            <Topbar type="default" />
            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-col items-center sm:flex-row sm:justify-between">
                    <div className="flex w-full flex-col items-center sm:w-[45%]">
                        <div className="w-full">
                            <div className="relative mx-auto h-32 w-32 sm:h-56 sm:w-56">
                                {user.isUser && (
                                    <>
                                        <Link href={"/user/edit"} className="absolute top-0 -left-12 h-10 w-10">
                                            <TbEdit className="h-10 w-10" />
                                        </Link>
                                        <button className="absolute bottom-0 -left-12 h-10 w-10" onClick={logoff}>
                                            <TbDoorExit className="h-10 w-10 text-red-600" />
                                        </button>
                                    </>
                                )}
                                <Behavior classname="absolute -right-12">{user.user_behavior}</Behavior>
                                <div className="absolute bottom-0 -right-12 flex h-11 w-11 items-center justify-center rounded-full border-4 border-blue-700 bg-blue-600">
                                    <span className="font-semibold text-primary-white">{user.user_level}</span>
                                </div>
                                <Image
                                    src={"/images/usericons/default.png"}
                                    alt={"User"}
                                    width={224}
                                    height={224}
                                    priority
                                ></Image>
                            </div>
                            <div className="mt-3">
                                <h1 className="text-center text-3xl font-semibold">@{user.username}</h1>
                                <p className="text-center text-xl">{user.title}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex w-full justify-between">
                            <div>
                                <Image src="/images/sword.png" width={80} height={80} alt="duels" />
                                <div className="mt-4">
                                    <h1 className="text-center text-4xl font-black">{user.challenge_matches}</h1>
                                    <h2 className="text-center text-xl font-bold">Duelos</h2>
                                </div>
                            </div>
                            <div>
                                <Image src="/images/crown.png" width={80} height={80} alt="duels" />
                                <div className="mt-4">
                                    <h1 className="text-center text-4xl font-black">{user.challenge_wins}</h1>
                                    <h2 className="text-center text-xl font-bold">Vitórias</h2>
                                </div>
                            </div>
                            <div>
                                <Image src="/images/calendar.png" width={80} height={80} alt="duels" />
                                <div className="mt-4">
                                    <h1 className="text-center text-4xl font-black">{user.user_sequence}</h1>
                                    <h2 className="text-center text-xl font-bold">Dias</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5 w-full border-y-2 border-zinc-300 dark:border-zinc-900 sm:my-0 sm:h-96 sm:w-1 sm:border-x-2 sm:border-t-0" />
                    <div className="w-full sm:mb-0 sm:w-[45%]">
                        <h2 className="mb-3 text-xl font-bold">Medalhas:</h2>
                        <div className="flex h-40 w-full flex-col items-center justify-center rounded-xl bg-primary-white dark:bg-zinc-800 sm:h-96">
                            <span className="text-4xl font-semibold">EM BREVE</span>
                        </div>
                    </div>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

import Head from "next/head";
import Image from "next/image";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";

import { getUserData } from "hooks/getUserData";
import { useRouter } from "next/router";

export default function User() {
    const router = useRouter();
    const [user] = getUserData(router.query.user ? String(router.query.user) : "");

    if (!user)
        return (
            <>
                <Topbar type="default" />
                <Menubar active={2}></Menubar>
            </>
        );

    return (
        <>
            <Head>
                <title>{`Mille - @${user.username}`}</title>
            </Head>

            <Topbar type="default" />
            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-col items-center sm:flex-row sm:justify-between">
                    <div className="flex w-full flex-col items-center sm:w-[45%]">
                        <div className="w-full">
                            <div className="relative mx-auto h-32 w-32 sm:h-56 sm:w-56">
                                <div className="absolute top-0 -right-12 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#02A726] bg-[#00BB29]">
                                    <span className="font-semibold text-primary-white">{user.user_behavior}</span>
                                </div>
                                <div className="absolute bottom-0 -right-12 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#0F52C2] bg-[#1A66E5]">
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
                                <p className="mt-2 text-center text-xl font-semibold">título</p>
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
                    <hr className="my-5 w-full border-y-2 border-[#D8D8D8] dark:border-[#191919] sm:my-0 sm:h-96 sm:w-1 sm:border-x-2 sm:border-t-0" />
                    <div className="mb-28 w-full sm:mb-0 sm:w-[45%]">
                        <h2 className="mb-3 text-xl font-bold">Medalhas:</h2>
                        <div className="flex h-40 w-full flex-col items-center rounded-xl bg-primary-white dark:bg-[#282828] sm:h-96"></div>
                    </div>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

import Image from "next/image";
import Link from "next/link";

import { getUserData } from "hooks/getUserData";

import Behavior from "./social/behavior";

interface TopbarProps {
    type: "default" | "solo" | "social";
    barValue?: number;
    barMaxValue?: number;
}

export default function Topbar(props: TopbarProps) {
    const [user] = getUserData(true);
    const percentage = ((Number(props.barValue) * 100) / Number(props.barMaxValue)).toFixed();

    const userCoins = (
        <div className="relative w-2/5">
            <div className="flex h-8 w-full items-center rounded-xl bg-primary-white dark:bg-zinc-800 sm:justify-center">
                <div className="flex h-8 w-[calc(100%-2.75rem)] items-center justify-center sm:w-auto">
                    <span className="text-center font-semibold sm:text-xl">{user.user_coins ?? 0} / 50</span>
                </div>
            </div>
            <div className="absolute -top-[16%] right-0 z-10 h-11 w-11">
                <Image src={"/images/questioncoins.png"} width={100} height={100} alt={"Moedas de Pergunta"}></Image>
            </div>
        </div>
    );

    const progressbar = (
        <div className="relative w-2/5">
            <div className="relative flex h-8 w-full items-center overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-700">
                <div
                    className="flex h-8 items-center justify-center bg-green-600 transition-all"
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="absolute right-0 left-0 text-center font-semibold text-white transition-all sm:text-xl">
                    {`${percentage}%`}
                </span>
            </div>
        </div>
    );

    if (props.type === "social")
        return (
            <header className="sticky top-0 z-20 w-full border-b-4 border-primary-white bg-white dark:border-primary dark:bg-bgBlack">
                <nav className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                    <Behavior>{user.user_behavior}</Behavior>

                    {userCoins}

                    <div className="h-11 w-11">
                        <Link href={`/user?name=${user.username}`}>
                            <Image
                                src={"/images/usericons/default.png"}
                                width={100}
                                height={100}
                                alt={"User Icon"}
                                priority
                            ></Image>
                        </Link>
                    </div>
                </nav>
            </header>
        );

    if (props.type === "solo")
        return (
            <header className="sticky top-0 z-20 w-full border-b-4 border-primary-white bg-white dark:border-primary dark:bg-bgBlack">
                <nav className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                    <div className="relative h-11 w-11 bg-[url(/images/calendar.png)] bg-cover">
                        <span className="absolute right-0 left-0 top-3 text-center text-xl font-extrabold tracking-wide text-primary-white">
                            {user.user_sequence ?? 0}
                        </span>
                    </div>

                    {progressbar}

                    <div className="h-11 w-11">
                        <Link href={`/user?name=${user.username}`}>
                            <Image
                                src={"/images/usericons/default.png"}
                                width={100}
                                height={100}
                                alt={"User Icon"}
                                priority
                            ></Image>
                        </Link>
                    </div>
                </nav>
            </header>
        );

    return (
        <header className="sticky top-0 z-20 w-full border-b-4 border-primary-white bg-white dark:border-primary dark:bg-bgBlack">
            <nav className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                <div className="relative h-11 w-11 bg-[url(/images/calendar.png)] bg-cover">
                    <span className="absolute right-0 left-0 top-3 text-center text-xl font-extrabold tracking-wide text-primary-white">
                        {user.user_sequence ?? 0}
                    </span>
                </div>

                <div className="h-11 w-11">
                    <Link href={`/user?name=${user.username}`}>
                        <Image
                            src={"/images/usericons/default.png"}
                            width={100}
                            height={100}
                            alt={"User Icon"}
                            priority
                        ></Image>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

import Image from "next/image";
import Link from "next/link";

import { getUserData } from "hooks/getUserData";
import { useEffect, useState } from "react";

interface TopbarProps {
    type: "default" | "solo";
    barValue?: number;
    barMaxValue?: number;
}

export default function Topbar(props: TopbarProps) {
    const [user] = getUserData();
    const percentage = ((Number(props.barValue) * 100) / Number(props.barMaxValue)).toFixed();

    const userCoins = (
        <div className="relative w-2/5">
            <div className="flex h-8 w-full items-center rounded-xl bg-primary-white dark:bg-[#282828] sm:justify-center">
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
            <div className="relative flex h-8 w-full items-center overflow-hidden rounded-xl bg-[#e6e6e6] dark:bg-[#3C3C3C]">
                <div
                    className="flex h-8 items-center justify-center bg-[#00BB29] transition-all"
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="absolute right-0 left-0 text-center font-semibold text-[#FFF] transition-all sm:text-xl">
                    {`${percentage}%`}
                </span>
            </div>
        </div>
    );

    const [extraInfo, setExtraInfo] = useState(null as any);

    useEffect(() => {
        if (props.type === "solo") {
            setExtraInfo(progressbar);
        } else {
            setExtraInfo(userCoins);
        }
    }, [user.user_coins, props.barValue, props.barMaxValue]);

    return (
        <header className="sticky top-0 z-20 w-full border-b-4 border-primary-white bg-[#fff] dark:border-primary dark:bg-bgBlack">
            <nav className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                <div className="relative h-11 w-11 bg-[url(/images/calendar.png)] bg-cover">
                    <span className="absolute right-0 left-0 top-3 text-center text-xl font-extrabold tracking-wide text-primary-white">
                        {user.user_sequence ?? 0}
                    </span>
                </div>

                {extraInfo}

                <div className="h-11 w-11">
                    <Link href={`/user/${user.username}`}>
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

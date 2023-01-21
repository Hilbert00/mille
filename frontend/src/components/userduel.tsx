import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "./button";

interface UserProps {
    lvl?: number;
    username?: string;
    title?: string;
    side: "left" | "right";
    invite?: boolean;
}

export default function UserDuel(props: UserProps) {
    const [side, setSide] = useState({ left: "-3rem", right: "auto" });

    useEffect(() => {
        if (props.side !== "left") {
            setSide({ left: "auto", right: "-3rem" });
        }
    }, []);

    if (!props.invite) {
        return (
            <div className={`flex w-20 flex-col items-center sm:mx-12 sm:w-56`}>
                <div className="relative flex w-32 justify-center sm:w-56">
                    <div
                        className={`absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#0F52C2] bg-[#1A66E5] sm:h-10 sm:w-10`}
                        style={side}
                    >
                        <span className="text-sm font-semibold text-primary-white sm:text-base">{props.lvl}</span>
                    </div>
                    <Image src={"/images/usericons/default.png"} alt={"User"} width={224} height={224} priority></Image>
                </div>

                <div className="mt-3 inline-block">
                    <h1 className="text-center text-2xl font-semibold sm:text-3xl">{props.username}</h1>
                    <p className="text-center text-xl font-semibold">{props.title}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`flex w-20 flex-col items-center sm:mx-12 sm:w-56`}>
                <div className="mt-3 inline-block">
                    <Button type={"button"} className="text-xl">
                        Convide um amigo
                    </Button>
                </div>
            </div>
        );
    }
}

import Image from "next/image";
import { useEffect, useState } from "react";

interface UserProps {
    lvl?: number;
    username?: string;
    title?: string;
    side: "left" | "right";
    picture: string;
    answers?: boolean[];
    points?: number;
}

export default function UserDuel(props: UserProps) {
    const [side, setSide] = useState({ left: "-3rem", right: "auto" });
    const [answers, setAnswers] = useState([] as any[]);

    useEffect(() => {
        if (props.side !== "left") {
            setSide({ left: "auto", right: "-3rem" });
        }

        if (props.answers && props.points) {
            setAnswers(
                props.answers.map((e, i) => {
                    if (e) {
                        return <li key={i} className="h-6 w-6 rounded-full bg-green-600"></li>;
                    }

                    return <li key={i} className="h-6 w-6 rounded-full bg-red-600"></li>;
                })
            );
        }
    }, []);

    if (props.answers && props.points) {
        return (
            <div className="flex w-full flex-col items-center sm:mx-12 sm:w-56">
                <div className="relative flex w-32 justify-center sm:w-56">
                    {/* <div
                        className={`absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-blue-700 bg-blue-600 sm:h-10 sm:w-10`}
                        style={side}
                    >
                        <span className="text-sm font-semibold text-primary-white sm:text-base">{props.lvl}</span>
                    </div> */}
                    <Image
                        src={
                            props.picture
                                ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${props.picture}.webp`
                                : "/images/usericons/default.png"
                        }
                        className="h-full w-auto rounded-full object-contain"
                        alt={"User"}
                        width={224}
                        height={224}
                        priority
                    ></Image>
                </div>

                <div className="mt-3 inline-block">
                    <h1 className="text-center text-2xl font-semibold sm:text-3xl">{props.username}</h1>
                    <p className="text-center text-xl">{props.title}</p>
                </div>

                <ul className="my-2 flex gap-2">{answers}</ul>
                <h2 className="text-center text-xl font-semibold">Pontos: {props.points}</h2>
            </div>
        );
    }

    return (
        <div className={`flex w-20 flex-col items-center sm:mx-12 sm:w-56`}>
            <div className="relative flex w-32 justify-center sm:w-56">
                {/* <div
                    className={`absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-blue-700 bg-blue-600 sm:h-10 sm:w-10`}
                    style={side}
                >
                    <span className="text-sm font-semibold text-primary-white sm:text-base">{props.lvl}</span>
                </div> */}
                <Image
                    src={
                        props.picture
                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${props.picture}.webp`
                            : "/images/usericons/default.png"
                    }
                    className="h-full w-auto rounded-full object-contain"
                    alt={"User"}
                    width={100}
                    height={100}
                    priority
                ></Image>
            </div>

            <div className="mt-3 inline-block">
                <h1 className="text-center text-2xl font-semibold sm:text-3xl">{props.username}</h1>
                <p className="text-center text-xl">{props.title}</p>
            </div>
        </div>
    );
}

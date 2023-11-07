import Image from "next/image";
import getQuizData from "utils/getQuizData";
import unlockTitle from "utils/unlockTitle";

import { useState } from "react";
import swal from "sweetalert2";

interface LockWallProps {
    currentValue: number;
    necessaryValue: number;
    unlocks: number;
    subject: string;
    updateData: any;
    currentData: any[];
    type: number;
}

export default function LockWall(props: LockWallProps) {
    const [apiCalled, setApiCalled] = useState(false);

    return (
        <button
            className="absolute z-10 mx-auto  mb-24 flex w-full cursor-pointer grid-cols-4 flex-col items-center gap-4 rounded-xl bg-primary p-5 text-primary-white transition-all active:scale-95 sm:grid sm:w-3/4 sm:gap-8 sm:p-10 sm:hover:scale-105 sm:active:scale-100"
            onClick={() => {
                setApiCalled(true);

                const quizArea = (function () {
                    switch (props.subject) {
                        case "mat":
                            switch (props.unlocks) {
                                case 1:
                                    return "por";
                                case 2:
                                    return "alg";
                                case 3:
                                    return "geo";
                            }

                        case "nat":
                            switch (props.unlocks) {
                                case 0:
                                    return "eco";
                                case 1:
                                    return "ele";
                                case 2:
                                    return "sol";
                            }
                    }
                    return "";
                })();

                const bodyData = {
                    subject: props.subject,
                    area: quizArea,
                    quizType: props.type,
                    quizNumber: 1,
                };


                if (props.currentValue >= props.necessaryValue && !apiCalled) {
                    unlockTitle(22);

                    (async function () {
                        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
                            credentials: "include",
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(bodyData),
                        });

                        if (response.ok) {
                            swal.fire({
                                title: "Parabéns!",
                                text: "Você desbloqueou uma nova área de estudo!",
                                icon: "success",
                                background: "#1E1E1E80",
                                color: "#fff",
                            });

                            const data = await Promise.all(
                                props.currentData.map(async (e: any, i: number) => {
                                    if (i === props.unlocks) {
                                        return getQuizData(props.type);
                                    }

                                    return e;
                                })
                            );

                            props.updateData(data);
                        }
                    })();
                }
            }}
        >
            <div className="flex w-14 items-center justify-center sm:w-20">
                <Image src="/images/lock.png" width={500} height={500} alt="lock" className="h-auto w-full"></Image>
            </div>
            <div className="col-span-3 flex items-center">
                <p className="text-center text-2xl font-bold sm:text-left sm:text-3xl">
                    Questões corretas necessárias:{" "}
                    <span style={{ color: props.currentValue >= props.necessaryValue ? "#00BB29" : "#D2042D" }}>
                        {props.necessaryValue > props.currentValue ? props.necessaryValue - props.currentValue : 0}
                    </span>
                </p>
            </div>
        </button>
    );
}

import Image from "next/image";
import getQuizData from "utils/getQuizData";

import { useState } from "react";
import swal from "sweetalert2";

interface LockWallProps {
    currentValue: number;
    necessaryValue: number;
    unlocks: number;
    subject: string;
    updateData: any;
    currentData: any[];
}

export default function LockWall(props: LockWallProps) {
    const [apiCalled, setApiCalled] = useState(false);

    return (
        <button
            className="mx-auto mb-24 flex w-full cursor-pointer grid-cols-4 flex-col items-center gap-4 rounded-xl bg-primary p-5 transition-all hover:scale-105 active:scale-100 sm:grid sm:w-3/4 sm:gap-8 sm:p-10"
            onClick={() => {
                setApiCalled(true);

                const quizArea = (function () {
                    switch (props.subject) {
                        case "mat":
                            switch (props.unlocks) {
                                case 2:
                                    return "por";
                                case 3:
                                    return "alg";
                                case 4:
                                    return "geo";
                            }
                    }
                    return "";
                })();

                const bodyData = {
                    subject: props.subject,
                    area: quizArea,
                    quizType: props.unlocks,
                    quizNumber: 1,
                };

                if (props.currentValue >= props.necessaryValue && !apiCalled) {
                    (async function () {
                        const response = await fetch("http://localhost:8080/api/quiz/create", {
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
                            const data = Promise.all(
                                props.currentData.map(async (e: any, i: number) => {
                                    if (i === props.unlocks - 1) {
                                        return await getQuizData(props.unlocks - 1);
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

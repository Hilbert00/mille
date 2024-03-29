import Head from "next/head";
import Image from "next/image";

import Topbar from "@/components/topbar";
import Button from "@/components/button";
import Loading from "@/components/loading";

import unlockTitle from "utils/unlockTitle";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const colors = ["#7106C5", "#1A66E5", "#00BB29", "#E5AC1A", "#D2042D"];

export default function Quiz() {
    const router = useRouter();

    const quizSettings = useRef({
        subject: router.query.subject,
        quizType: router.query.quizType,
        quizArea: router.query.quizArea,
        quizID: Number(router.query.quizID),
        quantity: 5,
    });

    const questionQuantity = quizSettings.current.quantity;

    const callApi = useRef(true);
    const [calledPush, setCalledPush] = useState(false);

    const [answers, setAnswers] = useState([] as any);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [quizData, setQuizData] = useState({} as any);
    const [quizImage, setQuizImage] = useState([] as any);
    const [quizAlternatives, setQuizAlternatives] = useState([]);

    async function getData() {
        const url =
            process.env.NEXT_PUBLIC_API_URL +
            `/api/quiz/get/${quizSettings.current.quizType}?num=${quizSettings.current.quizID}`;

        const response = await fetch(url, {
            credentials: "include",
            headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` },
        });

        if (response.status === 204) {
            if (calledPush) {
                return;
            }

            setCalledPush(true);
            router.push("/solo");
            return;
        }
        const data = await response.json();

        return data;
    }

    function handleData(data: any) {
        if (!data) return;

        if (data.questions[currentQuestion].image_url) {
            setQuizImage(
                <Image
                    src={data.questions[currentQuestion].image_url}
                    width={1000}
                    height={1000}
                    alt="question-image"
                    className="mb-6 h-auto w-full rounded-md sm:w-3/5"
                    priority
                ></Image>
            );
        } else {
            setQuizImage([]);
        }

        if (data.questions[currentQuestion].alternatives.available[0].image_url) {
            setQuizAlternatives(
                data.questions[currentQuestion].alternatives.available
                    .sort(function () {
                        return Math.random() - 0.5;
                    })
                    .map((e: any, i: number) => {
                        return (
                            <button
                                key={["A", "B", "C", "D", "E"][i]}
                                className="flex w-full items-center"
                                onClick={() => {
                                    setAnswers([
                                        ...answers,
                                        {
                                            answered: e.id,
                                            correct: data.questions[currentQuestion].alternatives.correct,
                                            isRight: data.questions[currentQuestion].alternatives.correct === e.id,
                                        },
                                    ]);
                                    setCurrentQuestion(currentQuestion + 1);
                                }}
                            >
                                <div className="relative flex h-40 flex-grow items-center rounded-md border-[1px] border-stone-300 bg-primary-white p-2 dark:border-none dark:bg-primary">
                                    <div
                                        className="absolute top-0 left-0 flex h-14 w-14 items-center justify-center rounded-md rounded-tr-none rounded-bl-none"
                                        style={{ background: `${colors[i]}` }}
                                    >
                                        <span className="text-3xl font-black text-white">
                                            {["A", "B", "C", "D", "E"][i]}
                                        </span>
                                    </div>
                                    <div className="flex flex-grow items-center justify-center rounded-md p-2">
                                        <Image
                                            src={e.image_url}
                                            width={1000}
                                            height={1000}
                                            alt={e.image_url}
                                            style={{ width: "50%", height: "auto" }}
                                            className="rounded-md"
                                        ></Image>
                                    </div>
                                </div>
                            </button>
                        );
                    })
            );
        } else {
            setQuizAlternatives(
                data.questions[currentQuestion].alternatives.available
                    .sort(function () {
                        return Math.random() - 0.5;
                    })
                    .map((e: any, i: number) => {
                        return (
                            <button
                                key={["A", "B", "C", "D", "E"][i]}
                                className="flex w-full items-center gap-2"
                                onClick={() => {
                                    setAnswers([
                                        ...answers,
                                        {
                                            answered: e.id,
                                            correct: data.questions[currentQuestion].alternatives.correct,
                                            isRight: data.questions[currentQuestion].alternatives.correct === e.id,
                                        },
                                    ]);
                                    setCurrentQuestion(currentQuestion + 1);
                                }}
                            >
                                <div
                                    className="flex h-10 min-w-[40px] items-center justify-center rounded-md"
                                    style={{ background: `${colors[i]}` }}
                                >
                                    <span className="text-3xl font-black text-white">
                                        {["A", "B", "C", "D", "E"][i]}
                                    </span>
                                </div>
                                <div className="flex flex-grow items-center rounded-md bg-primary-white p-2 dark:bg-primary">
                                    <span className="text-left font-semibold">{e.text}</span>
                                </div>
                            </button>
                        );
                    })
            );
        }
    }

    useEffect(() => {
        if (callApi.current) {
            (async function () {
                const data = await getData();

                setQuizData(data);
                callApi.current = false;

                if (currentQuestion !== questionQuantity) handleData(data);
            })();
        } else {
            try {
                if (currentQuestion !== questionQuantity) handleData(quizData);
            } catch (err) {
                console.log(err);

                if (calledPush) {
                    return;
                }

                setCalledPush(true);
                router.push(`/solo/${quizSettings.current.subject}`);
            }
        }
    }, [currentQuestion]);

    if (!quizData?.questions?.length) {
        return (
            <>
                <Head>
                    <title>{`Quiz ${currentQuestion + 1}/5 - Mille`}</title>
                </Head>

                <Topbar type="solo" barValue={currentQuestion} barMaxValue={questionQuantity} />

                <Loading />
            </>
        );
    }

    if (currentQuestion === questionQuantity) {
        return (
            <>
                <Head>
                    <title>{`Quiz Concluído! - Mille`}</title>
                </Head>

                <Topbar type="solo" barValue={currentQuestion} barMaxValue={questionQuantity} />

                <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                    <h1 className="text-4xl font-bold">{"Resultados"}</h1>
                    <div className="my-6 grid text-primary-white sm:grid-cols-2 sm:gap-8">
                        {quizData.questions.map((e: any, i: number) => {
                            const correct = e.alternatives.available.find((f: any) => f.id === e.alternatives.correct);

                            const answered = e.alternatives.available.find((f: any) => f.id === answers[i].answered);

                            return (
                                <div
                                    key={e.id}
                                    className="mb-8 w-full rounded-md p-2 transition-all sm:hover:scale-110"
                                    style={{ background: `${answers[i].isRight ? colors[2] : "#D2042D"}` }}
                                >
                                    <h2 className="mb-4 text-xl font-bold">{`Pergunta Nº ${i + 1}:`}</h2>
                                    <div className="flex flex-col gap-4">
                                        {correct.text
                                            ? [
                                                  <div className="flex flex-wrap gap-2" key={"correct"}>
                                                      <span className="w-40 font-medium">{`Resposta Correta:`}</span>
                                                      <span className="font-semibold">{`${correct.text}`}</span>
                                                  </div>,

                                                  <div className="flex flex-wrap gap-2" key={"answered"}>
                                                      <span className="w-40 font-medium">{`Sua Resposta:`}</span>
                                                      <span className="font-semibold">{`${answered.text}`}</span>
                                                  </div>,
                                              ]
                                            : [
                                                  <div className="flex flex-wrap gap-2" key={"correct-i"}>
                                                      <span className="w-40 font-medium">{`Resposta Correta:`}</span>
                                                      <Image
                                                          className="w-16 rounded-md"
                                                          src={correct.image_url}
                                                          width={600}
                                                          height={600}
                                                          alt="alternative-image"
                                                      ></Image>
                                                  </div>,

                                                  <div className="flex flex-wrap gap-2" key={"asnwered-i"}>
                                                      <span className="w-40 font-medium">{`Sua Resposta:`}</span>
                                                      <Image
                                                          className="w-16 rounded-md"
                                                          src={answered.image_url}
                                                          width={600}
                                                          height={600}
                                                          alt="alternative-image"
                                                      ></Image>
                                                  </div>,
                                              ]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Button type="button" className="w-60" action={handleQuizEnd}>
                            Encerrar Quiz
                        </Button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`Quiz ${currentQuestion + 1}/5 - Mille`}</title>
            </Head>

            <Topbar type="solo" barValue={currentQuestion} barMaxValue={questionQuantity} />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1 className="text-4xl font-bold">{`Pergunta Nº ${currentQuestion + 1}`}</h1>
                <div className="my-6 flex flex-col items-center">
                    {quizImage}
                    <p className="whitespace-pre-wrap text-justify ">{quizData.questions[currentQuestion].text}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">{quizAlternatives}</div>
            </main>
        </>
    );

    async function handleQuizEnd() {
        const correctQuantity = answers.filter((e: any) => e.isRight).length;

        const oldD = await fetch(
            process.env.NEXT_PUBLIC_API_URL +
                `/api/quiz/get/${quizSettings.current.quizType}?num=${quizSettings.current.quizID}&parsed=${false}`,
            { credentials: "include", headers: { Authorization: `Bearer ${localStorage.getItem("AuthJWT")}` } }
        );

        const oldData = await oldD.json();

        if (correctQuantity === quizSettings.current.quantity) unlockTitle(21);

        if (correctQuantity >= 3) {
            switch (quizSettings.current.subject) {
                case "mat":
                    switch (quizSettings.current.quizType) {
                        case "1":
                            if (quizSettings.current.quizID == 1) {
                                createNewQuiz("mat", false, "ari", "1", "2");
                                createNewQuiz("mat", false, "raz", "1", "7");
                            } else if (quizSettings.current.quizID != 6 && quizSettings.current.quizID != 11) {
                                createNewQuiz("mat", true);
                            }
                            break;
                        case "2":
                            if (quizSettings.current.quizID == 5) {
                                createNewQuiz("mat", false, "est", "2", "6");
                                createNewQuiz("mat", false, "gra", "2", "9");
                            } else if (quizSettings.current.quizID != 8 && quizSettings.current.quizID != 11) {
                                createNewQuiz("mat", true);
                            }
                            break;
                        case "3":
                            if (quizSettings.current.quizID != 5) {
                                createNewQuiz("mat", true);
                            }
                            break;
                        case "4":
                            if (quizSettings.current.quizID == 4) {
                                createNewQuiz("mat", false, "tri", "4", "5");
                                createNewQuiz("mat", false, "pri", "4", "8");
                            } else if (quizSettings.current.quizID != 7 && quizSettings.current.quizID != 10) {
                                createNewQuiz("mat", true);
                            }
                            break;
                    }

                case "nat":
                    switch (quizSettings.current.quizType) {
                        case "5":
                            if (quizSettings.current.quizID == 3) {
                                createNewQuiz("nat", false, "evo", "5", "4");
                                createNewQuiz("nat", false, "gen", "5", "7");
                            } else if (quizSettings.current.quizID == 5) {
                                createNewQuiz("nat", false, "fis", "5", "6");
                            } else if (quizSettings.current.quizID == 8) {
                                createNewQuiz("nat", false, "fis", "5", "9");
                            } else if (quizSettings.current.quizID != 6 && quizSettings.current.quizID != 9) {
                                createNewQuiz("nat", true);
                            }

                            break;
                        case "6":
                            if (quizSettings.current.quizID == 3) {
                                createNewQuiz("nat", false, "ter", "6", "4");
                                createNewQuiz("nat", false, "din", "6", "7");
                            } else if (quizSettings.current.quizID == 5) {
                                createNewQuiz("nat", false, "cin", "6", "6");
                            } else if (quizSettings.current.quizID == 8) {
                                createNewQuiz("nat", false, "cin", "6", "9");
                            } else if (quizSettings.current.quizID != 6 && quizSettings.current.quizID != 9) {
                                createNewQuiz("nat", true);
                            }

                            break;
                        case "7":
                            if (quizSettings.current.quizID == 3) {
                                createNewQuiz("nat", false, "org", "7", "4");
                                createNewQuiz("nat", false, "ino", "7", "7");
                            } else if (quizSettings.current.quizID == 5) {
                                createNewQuiz("nat", false, "elq", "7", "6");
                            } else if (quizSettings.current.quizID == 8) {
                                createNewQuiz("nat", false, "elq", "7", "9");
                            } else if (quizSettings.current.quizID != 6 && quizSettings.current.quizID != 9) {
                                createNewQuiz("nat", true);
                            }

                            break;
                    }
            }
        }

        const newData = { ...oldData, done: 1 };
        newData.questions.map((e: any, i: number) => {
            e.alternatives.answered = answers[i].answered;
        });

        try {
            const bodyData = {
                data: JSON.stringify(newData),
                quizType: quizSettings.current.quizType,
                quizNumber: quizSettings.current.quizID,
            };

            const updateResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/update", {
                credentials: "include",
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            if (!updateResponse.ok) throw `${updateResponse.status}: ${updateResponse.statusText}`;
        } catch (err) {
            console.log(err);
        } finally {
            if (calledPush) {
                return;
            }

            setCalledPush(true);
            router.push(`/solo/${quizSettings.current.subject}`);
        }
    }

    async function createNewQuiz(
        subject: string,
        defaultConfig?: boolean,
        area?: string,
        quizType?: string,
        quizNumber?: string
    ) {
        if (defaultConfig) {
            const bodyData = {
                subject,
                area: quizSettings.current.quizArea,
                quizType: quizSettings.current.quizType,
                quizNumber: String(Number(quizSettings.current.quizID) + 1),
            };

            await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
                credentials: "include",
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            return;
        }

        const bodyData = {
            subject,
            area,
            quizType,
            quizNumber,
        };

        await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
            credentials: "include",
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });

        return;
    }
}

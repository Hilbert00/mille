import Head from "next/head";
import Image from "next/image";

import Topbar from "@/components/topbar";
import Button from "@/components/button";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const colors = ["#7106C5", "#1A66E5", "#00BB29", "#E5AC1A", "#D2042D"];

export default function Quiz(props: any) {
    const router = useRouter();

    const questionQuantity = props.quantity ?? 5;

    const callApi = useRef(true);
    const [calledPush, setCalledPush] = useState(false);

    const [answers, setAnswers] = useState([] as any);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [quizData, setQuizData] = useState({} as any);
    const [quizImage, setQuizImage] = useState([] as any);
    const [quizAlternatives, setQuizAlternatives] = useState([]);

    const url = `http://localhost:8080/api/quiz/get/${props.quizType}?num=${props.quizID}`;

    async function getData() {
        const response = await fetch(url, { credentials: "include" });

        if (response.status === 204) {
            if (calledPush) {
                return;
            }

            setCalledPush(true);
            router.push(`/${props.subject}`);
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
                                <div className="relative flex h-40 flex-grow items-center rounded-md border-[1px] border-[#CCCCCC] bg-primary-white p-2 dark:border-none dark:bg-primary">
                                    <div
                                        className="absolute top-0 left-0 flex h-14 w-14 items-center justify-center rounded-md rounded-tr-none rounded-bl-none"
                                        style={{ background: `${colors[i]}` }}
                                    >
                                        <span className="text-3xl font-black text-[#FFF]">
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
                                    <span className="text-3xl font-black text-[#FFF]">
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
                router.push(`/${props.subject}`);
            }
        }
    }, [currentQuestion]);

    if (!quizData?.questions?.length) {
        return (
            <>
                <Head>
                    <title>{`Mille - Quiz ${currentQuestion + 1}/5`}</title>
                </Head>

                <Topbar type="solo" barValue={currentQuestion} barMaxValue={questionQuantity} />
            </>
        );
    }

    if (currentQuestion === questionQuantity) {
        return (
            <>
                <Head>
                    <title>{`Mille - Quiz Concluído!`}</title>
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
                                    className="mb-8 w-full rounded-md p-2 transition-all hover:scale-110"
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
                        <Button
                            type="button"
                            className="w-60"
                            action={async () => {
                                const correctQuantity = answers.filter((e: any) => e.isRight).length;

                                const oldD = await fetch(
                                    `http://localhost:8080/api/quiz/get/${props.quizType}?num=${
                                        props.quizID
                                    }&parsed=${false}`,
                                    { credentials: "include" }
                                );

                                const oldData = await oldD.json();

                                if (correctQuantity >= 3) {
                                    switch (props.subject) {
                                        case "mat":
                                            switch (props.quizType) {
                                                case "1":
                                                    if (props.quizID == 1) {
                                                        createNewQuiz("mat", false, "ari", "1", "2");
                                                        createNewQuiz("mat", false, "raz", "1", "7");
                                                    } else if (props.quizID != 6 && props.quizID != 11) {
                                                        createNewQuiz("mat", true);
                                                    }
                                                    break;
                                                case "2":
                                                    if (props.quizID == 5) {
                                                        createNewQuiz("mat", false, "est", "2", "6");
                                                        createNewQuiz("mat", false, "gra", "2", "9");
                                                    } else if (props.quizID != 8 && props.quizID != 11) {
                                                        createNewQuiz("mat", true);
                                                    }
                                                    break;
                                                case "3":
                                                    if (props.quizID != 5) {
                                                        createNewQuiz("mat", true);
                                                    }
                                                    break;
                                                case "4":
                                                    if (props.quizID == 4) {
                                                        createNewQuiz("mat", false, "tri", "4", "5");
                                                        createNewQuiz("mat", false, "pri", "4", "8");
                                                    } else if (props.quizID != 7 && props.quizID != 10) {
                                                        createNewQuiz("mat", true);
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
                                        quizType: props.quizType,
                                        quizNumber: props.quizID,
                                    };

                                    const updateResponse = await fetch("http://localhost:8080/api/quiz/update", {
                                        credentials: "include",
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(bodyData),
                                    });

                                    if (!updateResponse.ok)
                                        throw `${updateResponse.status}: ${updateResponse.statusText}`;
                                } catch (err) {
                                    console.log(err);
                                } finally {
                                    if (calledPush) {
                                        return;
                                    }

                                    setCalledPush(true);
                                    router.push(`/${props.subject}`);
                                }
                            }}
                        >
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
                <title>{`Mille - Quiz ${currentQuestion + 1}/5`}</title>
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
                area: props.quizArea,
                quizType: props.quizType,
                quizNumber: String(Number(props.quizID) + 1),
            };

            await fetch("http://localhost:8080/api/quiz/create", {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

        await fetch("http://localhost:8080/api/quiz/create", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
        });

        return;
    }
}

export async function getServerSideProps(context: any) {
    return {
        props: {
            subject: context.query.subject,
            quizType: context.query.quizType,
            quizArea: context.query.quizArea,
            quizID: context.query.quizID,
        },
    };
}

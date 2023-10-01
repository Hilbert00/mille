import Head from "next/head";
import Image from "next/image";

import DuelTopbar from "./duelTopbar";
import DuelTimer from "./duelTimer";
import Loading from "../loading";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { clearInterval, setInterval } from "worker-timers";

const colors = ["#7106C5", "#1A66E5", "#00BB29", "#E5AC1A", "#D2042D"];

interface DuelProps {
    data: any;
    socket: Socket;
    playerNumber: number;
}

export default function DuelQuiz(props: DuelProps) {
    const callApi = useRef(true);
    const socket = useRef(props.socket);
    const [timeLeft, setTimeLeft] = useState(Number(props.data.timer));
    const questionQuantity = useRef(Number(props.data.questionQuantity));

    const [answers, setAnswers] = useState([] as any);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [quizData, setQuizData] = useState({} as any);

    useEffect(() => {
        if (callApi.current) {
            (async function () {
                const data = await getData();

                data.questions.map((e: any) => {
                    return e.alternatives.available.sort(function () {
                        return Math.random() - 0.5;
                    });
                });

                setQuizData(data);
                callApi.current = false;
            })();
        }

        async function getData() {
            const url = process.env.NEXT_PUBLIC_API_URL + `/api/quiz/get?data=${JSON.stringify(props.data)}`;
            const response = await fetch(url, { credentials: "include" });

            const json = await response.json();

            return json;
        }
    }, [currentQuestion]);

    useEffect(() => {
        if (currentQuestion === questionQuantity.current) {
            return;
        }

        const timer = setInterval(() => {
            if (timeLeft - 0.01 <= 0) {
                nextQuestion(false);
                return;
            }

            setTimeLeft(
                timeLeft -
                    0.01 *
                        (props.data.players[props.playerNumber - 1 === 1 ? 0 : 1].questions.length ===
                        questionQuantity.current
                            ? 2
                            : 1)
            );
        }, 10);

        return () => {
            clearInterval(timer);
        };
    }, [timeLeft]);

    if (!quizData?.questions?.length) {
        return (
            <>
                <Head>
                    <title>{`Duelo ${currentQuestion + 1}/${questionQuantity.current} - Mille`}</title>
                </Head>

                <DuelTopbar
                    barValues={[
                        props.data.players[props.playerNumber - 1].questions.length,
                        props.data.players[props.playerNumber - 1 === 1 ? 0 : 1].questions.length,
                    ]}
                    barMaxValue={questionQuantity.current}
                    points={props.data.players[props.playerNumber - 1].points}
                ></DuelTopbar>

                <Loading />
            </>
        );
    }

    if (!quizData?.questions[currentQuestion]) {
        return (
            <>
                <Head>
                    <title>{`Duelo ${currentQuestion + 1}/${questionQuantity.current} - Mille`}</title>
                </Head>

                <DuelTopbar
                    barValues={[
                        props.data.players[props.playerNumber - 1].questions.length,
                        props.data.players[props.playerNumber - 1 === 1 ? 0 : 1].questions.length,
                    ]}
                    barMaxValue={questionQuantity.current}
                    points={props.data.players[props.playerNumber - 1].points}
                ></DuelTopbar>

                <Loading />
            </>
        );
    }

    if (questionQuantity.current === currentQuestion) return <></>;

    return (
        <>
            <Head>
                <title>{`Duelo ${currentQuestion + 1}/${questionQuantity.current} - Mille`}</title>
            </Head>

            <DuelTopbar
                barValues={[
                    props.data.players[props.playerNumber - 1].questions.length,
                    props.data.players[props.playerNumber - 1 === 1 ? 0 : 1].questions.length,
                ]}
                barMaxValue={questionQuantity.current}
                points={props.data.players[props.playerNumber - 1].points}
            ></DuelTopbar>

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <DuelTimer currentValue={timeLeft} maxValue={props.data.timer} />
                <h1 className="text-4xl font-bold">{`Pergunta Nº ${currentQuestion + 1}`}</h1>
                <div className="my-6 flex flex-col items-center">
                    {quizData.questions[currentQuestion].image_url ? (
                        <Image
                            src={quizData.questions[currentQuestion].image_url}
                            width={1000}
                            height={1000}
                            alt="question-image"
                            className="mb-6 h-auto w-full rounded-md sm:w-3/5"
                            priority
                        ></Image>
                    ) : (
                        []
                    )}
                    <p className="whitespace-pre-wrap text-justify ">{quizData.questions[currentQuestion].text}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
                    {quizData.questions[currentQuestion].alternatives.available[0].image_url
                        ? quizData.questions[currentQuestion].alternatives.available.map((e: any, i: number) => {
                              return (
                                  <button
                                      key={["A", "B", "C", "D", "E"][i]}
                                      className="flex w-full items-center"
                                      onClick={() => {
                                          const newAnswer = {
                                              answered: e.id,
                                              correct: quizData.questions[currentQuestion].alternatives.correct,
                                              isRight:
                                                  quizData.questions[currentQuestion].alternatives.correct === e.id,
                                          };

                                          setAnswers([...answers, newAnswer]);
                                          nextQuestion(newAnswer.isRight);
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
                        : quizData.questions[currentQuestion].alternatives.available.map((e: any, i: number) => {
                              return (
                                  <button
                                      key={["A", "B", "C", "D", "E"][i]}
                                      className="flex w-full items-center gap-2"
                                      onClick={() => {
                                          const newAnswer = {
                                              answered: e.id,
                                              correct: quizData.questions[currentQuestion].alternatives.correct,
                                              isRight:
                                                  quizData.questions[currentQuestion].alternatives.correct === e.id,
                                          };

                                          setAnswers([...answers, newAnswer]);
                                          nextQuestion(newAnswer.isRight);
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
                          })}
                </div>
            </main>
        </>
    );

    function nextQuestion(isRight: boolean) {
        let points: number;

        if (isRight) {
            points = Math.ceil((Math.ceil(timeLeft) * 100) / props.data.timer);
        } else {
            points = Math.min(-Math.ceil((Math.ceil(timeLeft) * 100) / props.data.timer / 2), -20);
        }

        setTimeLeft(props.data.timer);
        setCurrentQuestion(currentQuestion + 1);
        socket.current.emit("nextQuestion", isRight, points);
    }
}

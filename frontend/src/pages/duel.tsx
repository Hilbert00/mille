import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import User from "@/components/duel/duelUser";
import Button from "@/components/button";
import Loading from "@/components/loading";
import DuelQuiz from "../components/duel/duelQuiz";

import swal from "sweetalert2";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { getUserData } from "hooks/getUserData";
import unlockTitle from "utils/unlockTitle";
import { useEffect, useState, useRef, ChangeEvent } from "react";

export default function Duel() {
    const [user] = getUserData(false);
    const router = useRouter();

    const [state, setState] = useState({} as any);
    const roomID = useRef("");
    const [matchResult, setMatchResult] = useState(["", ""]);

    const playerNumber = useRef(0);
    const socket = useRef(
        io(String(process.env.NEXT_PUBLIC_API_URL), { autoConnect: false, closeOnBeforeunload: false })
    );

    const [formData, setFormData] = useState(
        Object.freeze({
            subject: "mat" as String,
            area: "ari" as String,
            questionQuantity: 5 as Number,
            timer: 30 as Number,
        })
    );

    useEffect(() => {
        if (!router.isReady) return;

        router.events.on("routeChangeStart", (url) => {
            const newPath = url.split("?")[0];

            if (newPath !== "/duel") socket.current.disconnect();
        });

        if (!Object.keys(user).length) return;

        if (Object.keys(state).length) {
            const playerPoints = state.players[playerNumber.current - 1].points;
            const enemyPoints = state.players[playerNumber.current - 1 === 1 ? 0 : 1].points;

            if (
                state.status === 2 &&
                !matchResult[0] &&
                state.questionQuantity &&
                state.players[playerNumber.current - 1].questions.length === state.questionQuantity
            ) {
                const titles = [];
                const wins = user.challenge_wins + (playerPoints > enemyPoints ? 1 : 0);
                const rightAnswers = state.players[playerNumber.current - 1].questions.filter((e: boolean) => e).length;
                const matches = user.challenge_matches + 1;

                if (matches >= 1) titles.push(1);
                if (matches >= 5) titles.push(2);
                if (matches >= 10) titles.push(3);
                if (matches >= 20) titles.push(4);
                if (matches >= 50) titles.push(5);
                if (matches >= 100) titles.push(6);

                if (wins >= 1) titles.push(7);
                if (wins >= 5) titles.push(8);
                if (wins >= 10) titles.push(9);
                if (wins >= 20) titles.push(10);
                if (wins >= 50) titles.push(11);
                if (wins >= 100) titles.push(12);

                if (rightAnswers === state.questionQuantity) titles.push(31);
                if (!rightAnswers) titles.push(32);

                if (titles.length) unlockTitle(titles);

                if (playerPoints > enemyPoints) {
                    setMatchResult(["#00BB29", "Vitória"]);

                    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/update", {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ challenge_matches: 1, challenge_wins: 1 }),
                    });
                } else if (playerPoints < enemyPoints) {
                    setMatchResult(["#C81652", "Derrota"]);

                    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/update", {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ challenge_matches: 1 }),
                    });
                } else {
                    setMatchResult(["#FFFFFF", "Empate"]);

                    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/update", {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ challenge_matches: 1 }),
                    });
                }
            }
        }

        if (!roomID.current || !playerNumber) {
            socket.current.connect();
            if (router.query.roomID) {
                socket.current.emit("joinRoom", router.query.roomID, user);
            } else {
                socket.current.emit("createRoom", user);
            }
        }

        socket.current.on("createdRoom", (room, state) => {
            roomID.current = room;
            playerNumber.current = 1;
            setState(JSON.parse(state));
        });

        socket.current.on("unknowGame", () => {
            swal.fire({
                title: "Oops",
                text: "Esta sala não existe!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            router.replace("/duel", "", { shallow: true });
            socket.current.emit("createRoom", user);
        });

        socket.current.on("fullGame", () => {
            swal.fire({
                title: "Oops",
                text: "Este duelo já está cheio!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            router.replace("/duel", "", { shallow: true });
            socket.current.emit("createRoom", user);
        });

        socket.current.on("joinedRoom", (state) => {
            if (router.query.roomID && !playerNumber.current) {
                roomID.current = String(router.query.roomID);
                playerNumber.current = 2;
            }

            setState(JSON.parse(state));
        });

        socket.current.on("gameInit", (state) => {
            setState(JSON.parse(state));
        });

        socket.current.on("duelUpdate", (state) => {
            setState(JSON.parse(state));
        });

        socket.current.on("exitedRoom", (newState) => {
            if (playerNumber.current === 2) {
                playerNumber.current = 1;
            }

            swal.fire({
                title: "Oops",
                text: "O outro usuário deixou o duelo!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            setState(JSON.parse(newState));
        });
    }, [JSON.stringify(state), Object.keys(user).length, router.query]);

    if (!user.username || !Object.keys(state).length)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Loading />

                <Menubar active={2}></Menubar>
            </>
        );

    if (state.status === 0 && !state.players[1].name)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Topbar type="default" />

                <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <User
                            side="left"
                            lvl={state.players[0].level}
                            username={`@${state.players[0].name}`}
                            title={state.players[0].title}
                        />
                        <h1 className="inline select-none text-7xl font-semibold text-red-600 sm:text-9xl">&times;</h1>
                        <div className={`flex w-20 flex-col items-center sm:mx-12 sm:w-56`}>
                            <div className="mt-3 inline-block">
                                <Button type={"button"} action={getInviteLink} className="text-xl">
                                    Convide um amigo
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                <Menubar active={2}></Menubar>
            </>
        );

    if (state.status === 0 && !state.questionQuantity)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Topbar type="default" />

                <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <User
                            side="left"
                            lvl={state.players[0].level}
                            username={`@${state.players[0].name}`}
                            title={state.players[0].title}
                        />
                        <h1 className="inline select-none text-7xl font-semibold text-red-600 sm:text-9xl">&times;</h1>
                        <User
                            side="right"
                            lvl={state.players[1].level}
                            username={`@${state.players[1].name}`}
                            title={state.players[1].title}
                        />
                    </div>
                    {renderConfigs()}
                </main>

                <Menubar active={2}></Menubar>
            </>
        );

    if (state.status === 1 && state.players[playerNumber.current - 1].questions.length !== state.questionQuantity)
        return (
            <>
                <DuelQuiz data={state} socket={socket.current} playerNumber={playerNumber.current} />
            </>
        );

    if (state.status === 1)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Topbar type="default" />

                <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 md:max-w-3xl">
                    <h1 className="text-center text-xl font-semibold after:inline-block after:w-0 after:animate-loading-ellipsis after:overflow-hidden after:align-bottom after:content-['\2026']">
                        Aguardando pelo adversário
                    </h1>
                </main>
                <Loading />
            </>
        );

    return (
        <>
            <Head>
                <title>Duelo Concluído - Mille</title>
            </Head>

            <Topbar type="default" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <h1
                    className="mb-6 text-center text-5xl font-bold sm:text-7xl"
                    style={{
                        color: matchResult[0],
                    }}
                >
                    {matchResult[1]}
                </h1>
                <div className="flex flex-col items-center justify-between sm:flex-row">
                    <User
                        side="left"
                        lvl={state.players[0].level}
                        username={`@${state.players[0].name}`}
                        title={state.players[0].title}
                        points={state.players[0].points}
                        answers={state.players[0].questions}
                    />
                    <h1 className="inline select-none text-7xl font-semibold text-red-600 sm:text-9xl">&times;</h1>
                    <User
                        side="right"
                        lvl={state.players[1].level}
                        username={`@${state.players[1].name}`}
                        title={state.players[1].title}
                        points={state.players[1].points}
                        answers={state.players[1].questions}
                    />
                </div>
            </main>

            <Menubar active={2}></Menubar>
        </>
    );

    function getInviteLink() {
        swal.fire({
            title: "Convite de Duelo",
            html: `<p>Copie este link e envie para seu amigo: <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="${
                window.location.origin + "/duel?roomID=" + roomID.current
            }">${window.location.origin + "/duel?roomID=" + roomID.current}</a></p>`,
            background: "#1E1E1E80",
            color: "#fff",
        });
    }

    function renderConfigs() {
        if (playerNumber.current === 1) {
            return (
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto mt-8 flex flex-col gap-3 rounded-xl bg-primary-white p-3 dark:bg-zinc-800 sm:w-3/4"
                >
                    <div className="flex items-center gap-3">
                        <label htmlFor="subject" className="font-semibold sm:text-2xl">
                            Área:
                        </label>
                        <select
                            name="subject"
                            id="subject"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                            onChange={updateForm}
                        >
                            <optgroup label="Matemática">
                                <option value="mat ari" className="text-base">
                                    Aritmética
                                </option>
                                <option value="mat raz" className="text-base">
                                    Razões e Proporções
                                </option>
                                <option value="mat por" className="text-base">
                                    Porcentagem
                                </option>
                                <option value="mat gra" className="text-base">
                                    Gráficos
                                </option>
                                <option value="mat est" className="text-base">
                                    Estatísticas e Probabilidades
                                </option>
                                <option value="mat geo" className="text-base">
                                    Geometria
                                </option>
                                <option value="mat tri" className="text-base">
                                    Trigonometria
                                </option>
                                <option value="mat pri" className="text-base">
                                    Prismas
                                </option>
                                <option value="mat alg" className="text-base">
                                    Álgebra
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="questionQuantity" className="font-semibold sm:text-2xl">
                            Quantidade de questões:{" "}
                        </label>
                        <select
                            name="questionQuantity"
                            id="questionQuantity"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                            onChange={updateForm}
                        >
                            <option value="5" className="text-base">
                                5
                            </option>
                            <option value="6" className="text-base">
                                6
                            </option>
                            <option value="7" className="text-base">
                                7
                            </option>
                            <option value="8" className="text-base">
                                8
                            </option>
                            <option value="9" className="text-base">
                                9
                            </option>
                            <option value="10" className="text-base">
                                10
                            </option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="timer" className="font-semibold sm:text-2xl">
                            Tempo por questão:
                        </label>
                        <select
                            name="timer"
                            id="timer"
                            className="grow appearance-none rounded-xl border-none p-3 text-base dark:bg-bgBlack"
                            onChange={updateForm}
                        >
                            <option value="30" className="text-base">
                                30 segundos
                            </option>
                            <option value="60" className="text-base">
                                1 minuto
                            </option>
                            <option value="120" className="text-base">
                                2 minutos
                            </option>
                            <option value="180" className="text-base">
                                3 minutos
                            </option>
                            <option value="240" className="text-base">
                                4 minutos
                            </option>
                        </select>
                    </div>
                    <Button
                        type={"submit"}
                        disable={playerNumber.current === 1 ? false : true}
                        className="text-xl sm:w-64"
                        action={() => startDuel()}
                    >
                        Iniciar Duelo
                    </Button>
                </form>
            );
        }

        return (
            <h1 className="mx-auto mt-8 p-3 text-center text-xl font-semibold after:inline-block after:w-0 after:animate-loading-ellipsis after:overflow-hidden after:align-bottom after:content-['\2026'] sm:w-3/4">
                Aguardando pelo host
            </h1>
        );
    }

    function updateForm(e: ChangeEvent<HTMLSelectElement>) {
        if (e.target.name === "timer" || e.target.name === "questionQuantity") {
            const newFormData = { ...formData, [e.target.name]: parseInt(e.target.value) };
            setFormData({ ...newFormData });
        } else {
            const newFormData = { ...formData, [e.target.name]: e.target.value };
            setFormData({
                ...newFormData,
                subject: newFormData.subject.split(" ")[0],
                area: newFormData.subject.split(" ")[1],
            });
        }
    }

    async function startDuel() {
        const rawResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/quiz/create", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...formData, isDuel: true }),
        });

        const content = await rawResponse.json();

        const updatedState = { ...state, ...formData, questions: content.data.questions };
        socket.current.emit("gameStart", JSON.stringify(updatedState), roomID.current);
    }
}

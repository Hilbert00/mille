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
import { useEffect, useState, useRef, ChangeEvent } from "react";

import { getUserData } from "hooks/getUserData";
import unlockTitle from "utils/unlockTitle";
import getAllAreas from "utils/getAllAreas";

export default function Duel() {
    const [user] = getUserData(false);
    const router = useRouter();

    const roomID = useRef("");
    const [state, setState] = useState({} as any);
    const [areas, setAreas] = useState({} as any);
    const [search, setSearch] = useState(false);
    const [roomCode, setRoomCode] = useState("");
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

    function getName(title: String) {
        if (title === "Eletroquímica") return "elq";

        title = String(title)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        if (title.split(" ")[0].substring(0, 3) !== "cie") return title.split(" ")[0].substring(0, 3);

        const newTitle = title
            .split(" ")
            .find((e) => e !== "ciencias" && e.length > 2)
            ?.substring(0, 3);

        return newTitle;
    }

    useEffect(() => {
        if (!router.isReady) return;

        if (!areas.length) getAllAreas().then((res) => setAreas(res));

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
                            Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
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
                            Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
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
                            Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ challenge_matches: 1 }),
                    });
                }
            }
        }

        if (!roomID.current || !playerNumber) socket.current.connect();

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

            setSearch(false);
            router.replace("/duel", "", { shallow: true });
        });

        socket.current.on("fullGame", () => {
            swal.fire({
                title: "Oops",
                text: "Este duelo já está cheio!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            setSearch(false);
            router.replace("/duel", "", { shallow: true });
        });

        socket.current.on("noGamesFound", () => {
            setSearch(false);

            swal.fire({
                title: "Oops",
                text: "Nenhuma partida disponível encontrada!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });
        });

        socket.current.on("alreadyInGame", () => {
            swal.fire({
                title: "Oops",
                text: "Este usuário já está em um duelo!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            router.push("/solo");
        });

        socket.current.on("joinedRoom", (state) => {
            if (!playerNumber.current) {
                roomID.current = roomCode;
                setRoomCode("");

                playerNumber.current = 2;
            }

            setSearch(false);
            setState(JSON.parse(state));
        });

        socket.current.on("privacyUpdated", (state) => {
            setState(JSON.parse(state));
        });

        socket.current.on("gameInit", (state) => {
            setState(JSON.parse(state));
        });

        socket.current.on("duelUpdate", (state) => {
            setState(JSON.parse(state));
        });

        socket.current.on("exitedRoom", () => {
            swal.fire({
                title: "Oops",
                text: "O outro usuário deixou o duelo!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

            playerNumber.current = 0;
            setState({});
        });
    }, [JSON.stringify(state), Object.keys(user).length]);

    if (!user.username)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Loading />

                <Menubar active={2}></Menubar>
            </>
        );

    if (!Object.keys(state).length)
        return (
            <>
                <Head>
                    <title>Duelo - Mille</title>
                </Head>

                <Topbar type="default" />

                <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                    <div className="mx-auto flex flex-col items-center justify-center gap-4 sm:w-2/3 [&>*:nth-child(2)]:mt-6 ">
                        <User
                            side="left"
                            lvl={user.user_level}
                            username={`@${user.username}`}
                            title={user.title}
                            picture={user.picture}
                        />

                        <Button
                            type={"button"}
                            action={() => socket.current.emit("createRoom", user)}
                            className="w-full text-xl"
                            bgColor="#16A44A"
                        >
                            Criar Sala
                        </Button>

                        <Button
                            type={"button"}
                            action={findMatch}
                            bgColor="#EAB308"
                            className="w-full text-xl"
                            disable={search}
                        >
                            Procurar Sala
                        </Button>

                        <div className="flex w-full items-center justify-between gap-4">
                            <input
                                name="username"
                                id="username"
                                type="text"
                                placeholder="Código"
                                value={roomCode}
                                className="max-w-[50%] flex-1 rounded-xl border-none bg-neutral-100 py-2 px-3 text-neutral-400 outline-none dark:bg-zinc-800"
                                onChange={(e) => setRoomCode(e.target.value)}
                            />

                            <Button
                                type={"button"}
                                className="flex-1 text-xl"
                                disable={!roomCode}
                                action={() => {
                                    if (!roomCode) return;

                                    socket.current.emit("joinRoom", user, roomCode);
                                }}
                            >
                                Entrar
                            </Button>
                        </div>
                    </div>
                </main>

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
                    <div className="flex justify-center">
                        <User
                            side="left"
                            lvl={state.players[0].level}
                            username={`@${state.players[0].name}`}
                            title={state.players[0].title}
                            picture={state.players[0].picture}
                        />
                    </div>

                    <div className="mt-20 flex flex-col items-center justify-center gap-8">
                        <div>
                            <h1 className="text-center text-5xl font-semibold">{roomID.current}</h1>
                            <span className="block text-center">Código da Sala</span>
                        </div>

                        <label className="me-5 relative flex cursor-pointer flex-col items-center gap-2">
                            <input
                                type="checkbox"
                                value={state.private}
                                className="peer sr-only"
                                onChange={() => socket.current.emit("updatePrivacy", !state.private, roomID.current)}
                            />
                            <div className="peer relative h-7 w-14 rounded-full bg-red-600 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-gray-600"></div>
                            <span className="">{state.private ? "Privada" : "Pública"}</span>
                        </label>
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
                            picture={state.players[0].picture}
                        />
                        <h1 className="inline select-none text-7xl font-semibold text-red-600 sm:text-9xl">&times;</h1>
                        <User
                            side="right"
                            lvl={state.players[1].level}
                            username={`@${state.players[1].name}`}
                            title={state.players[1].title}
                            picture={state.players[1].picture}
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
                        picture={state.players[0].picture}
                    />
                    <h1 className="inline select-none text-7xl font-semibold text-red-600 sm:text-9xl">&times;</h1>
                    <User
                        side="right"
                        lvl={state.players[1].level}
                        username={`@${state.players[1].name}`}
                        title={state.players[1].title}
                        points={state.players[1].points}
                        answers={state.players[1].questions}
                        picture={state.players[1].picture}
                    />
                </div>
            </main>

            <Menubar active={2}></Menubar>
        </>
    );

    function findMatch() {
        setSearch(true);
        socket.current.emit("joinRoom", user, null);
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
                            {Object.keys(areas).map((e, i) => {
                                return (
                                    <optgroup label={e} key={i}>
                                        {areas[e].map((el: any) => (
                                            <option
                                                value={getName(e) + " " + getName(el.name)}
                                                key={el.id}
                                                className="text-base"
                                            >
                                                {el.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                );
                            })}
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
                Authorization: `Bearer ${localStorage.getItem("AuthJWT")}`,
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

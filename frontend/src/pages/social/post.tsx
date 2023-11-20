import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";
import Loading from "@/components/loading";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getUserData } from "hooks/getUserData";
import unlockTitle from "utils/unlockTitle";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import { TbArrowBigUp } from "react-icons/tb";
import { TbArrowBigUpFilled } from "react-icons/tb";
import { TbArrowBigDown } from "react-icons/tb";
import { TbArrowBigDownFilled } from "react-icons/tb";
import { TbChevronDown } from "react-icons/tb";
import { BsFillReplyFill } from "react-icons/bs";
import { TbCircleCheck } from "react-icons/tb";
import { TbCircleCheckFilled } from "react-icons/tb";
import { TbAlertTriangle } from "react-icons/tb";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const swal = withReactContent(Swal);

// INTERFACES
interface post {
    user_picture: string;
    answers: number;
    area_name: string;
    create_time: string;
    description: string;
    id_post: number;
    id_user: number;
    solved: boolean;
    title: string;
    user_vote: number;
    username: string;
    votes: number;
}

interface answer {
    user_picture: string;
    create_time: string;
    content: string;
    id_answer: number;
    id_user: number;
    is_best: boolean;
    replies?: answer[];
    reply_input?: boolean;
    reply_to: number;
    show_replies?: boolean;
    user_vote: number;
    username: string;
    votes: number;
}

export default function Post() {
    const router = useRouter();
    const [data, setData] = useState({} as post);
    const [answer, setAnswer] = useState("");
    const [reply, setReply] = useState("");
    const [ansDivs, setAnsDivs] = useState([] as any[]);
    const [answers, setAnswers] = useState([] as answer[]);
    const [user] = getUserData(false);

    useEffect(() => {
        if (!router.isReady) return;
        if (!router.query.id) {
            router.push("/social");
            return;
        }

        makeAnswerDivs(answers);

        if (!Object.keys(data).length)
            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post?id=${router.query.id}`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((json) => {
                    setData(json);
                })
                .catch((err) => console.error(err));

        if (!Object.keys(answers).length)
            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post/answers?id=${router.query.id}`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((json) => {
                    setAnswers(json);
                })
                .catch((err) => console.error(err));
    }, [router.isReady, JSON.stringify(answers), JSON.stringify(data), reply]);

    function handleVote(
        value: 1 | 0 | -1,
        type: "post" | "answer",
        postID: number,
        answerID?: number,
        replyTo?: number
    ) {
        const route = type === "post" ? "post" : "post/answer";

        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/${route}/like`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postID, answerID, value }),
            method: "POST",
        });

        if (type === "post")
            setData({
                ...data,
                votes:
                    value !== 0
                        ? data.user_vote === 0
                            ? data.votes + value
                            : data.votes + 2 * value
                        : data.user_vote === 1
                        ? data.votes - 1
                        : data.votes + 1,
                user_vote: value,
            });
        else {
            const updatedAnswers = answers.map((e) => {
                if (replyTo) {
                    if (e.id_answer === replyTo) {
                        e.replies?.map((e2) => {
                            if (e2.id_answer === answerID) {
                                e2.votes =
                                    value !== 0
                                        ? e2.user_vote === 0
                                            ? e2.votes + value
                                            : e2.votes + 2 * value
                                        : e2.user_vote === 1
                                        ? e2.votes - 1
                                        : e2.votes + 1;

                                e2.user_vote = value;
                            }
                        });
                    }
                } else if (e.id_answer === answerID) {
                    e.votes =
                        value !== 0
                            ? e.user_vote === 0
                                ? e.votes + value
                                : e.votes + 2 * value
                            : e.user_vote === 1
                            ? e.votes - 1
                            : e.votes + 1;

                    e.user_vote = value;
                }

                return e;
            });

            setAnswers(updatedAnswers);
            makeAnswerDivs(updatedAnswers);
        }
    }

    function handleBest(value: boolean, postID: number, answerID: number) {
        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post/answer/best`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postID, answerID, value }),
            method: "PUT",
        });

        const updatedAnswers = answers.map((e) => {
            if (e.id_answer === answerID) e.is_best = value;
            else if (value) e.is_best = false;

            return e;
        });

        setAnswers(updatedAnswers);
        makeAnswerDivs(updatedAnswers);
    }

    function handleAnswer(postID: number, replyID?: number) {
        if (!reply && replyID) {
            return swal.fire({
                title: "Oops",
                text: "Escreva um comentário antes de publicar!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });
        } else if (!answer && !replyID)
            return swal.fire({
                title: "Oops",
                text: "Escreva uma resposta antes de publicar!",
                icon: "error",
                background: "#1E1E1E80",
                color: "#fff",
            });

        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post/answer`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: replyID ? reply : answer, postID, replyID }),
            method: "POST",
        })
            .then((result) => result.json())
            .then((json) => {
                swal.fire({
                    title: "Sucesso!",
                    text: `${replyID ? "O seu comentário foi publicado" : "A sua pergunta foi publicada"}!`,
                    icon: "success",
                    background: "#1E1E1E80",
                    color: "#fff",
                }).then(() => {
                    if (replyID) setReply("");
                    else {
                        setAnswer("");
                        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post/answers`, {
                            credentials: "include",
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (!data.length) return;

                                const titles = [17];

                                if (data.length >= 20) titles.push(18);
                                if (data.length >= 50) titles.push(19);
                                if (data.length >= 100) titles.push(20);

                                unlockTitle(titles);
                            });
                    }
                    setAnswers(json);
                });
            });
    }

    function handleReport(type: "post" | "answer", id: number) {
        swal.fire({
            title: "Denunciar Publicação",
            background: "#1E1E1E",
            color: "#fff",
            html: (
                <div className="flex flex-col gap-4">
                    <label htmlFor="recent" className="text-left">
                        Descreva o problema:
                    </label>
                    <textarea
                        name="description"
                        rows={10}
                        placeholder="Descreva aqui o problema..."
                        className="flex-1 resize-none rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                    ></textarea>
                </div>
            ),
            focusConfirm: false,
            preConfirm: () => {
                const description = swal.getPopup()?.querySelector('textarea[name = "description"]') as any;

                return { description: description.value.trim() };
            },
        }).then((result) => {
            if (!result.isConfirmed || !result.value?.description) return;

            const description = result.value.description;
            const route = type === "post" ? "post" : "post/answer";

            fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/${route}/report`, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description, postID: id, answerID: id }),
                method: "POST",
            })
                .then((res) => {
                    if (res.ok)
                        swal.fire({
                            title: "Sucesso",
                            text: "Esta publicação foi denunciada",
                            icon: "success",
                            background: "#1E1E1E80",
                            color: "#fff",
                        });
                })
                .catch((err) => console.error(err));
        });
    }

    function viewReplies(answerID: number, type: "input" | "replies") {
        setReply("");
        const updatedAnswers = answers.map((e) => {
            if (e.id_answer === answerID) {
                switch (type) {
                    case "input": {
                        e.reply_input = !e.reply_input;
                        if (e.replies?.length) e.show_replies = e.reply_input;
                        break;
                    }
                    case "replies": {
                        e.show_replies = !e.show_replies;
                        break;
                    }
                    default: {
                        e.reply_input = false;
                        e.show_replies = false;
                    }
                }
            } else {
                e.reply_input = false;
                e.show_replies = false;
            }

            return e;
        });

        setAnswers(updatedAnswers);
        makeAnswerDivs(updatedAnswers);
    }

    function makeAnswerDivs(array: answer[]) {
        const answerDivs = array.map((e: answer) => {
            return (
                <div
                    key={e.id_answer as any}
                    className="relative flex w-full flex-col gap-3 rounded-xl bg-primary-white p-3 dark:bg-primary"
                    style={{ outline: e.is_best ? "1px solid #00BB29" : "none" }}
                >
                    <div className="flex justify-between">
                        <div className="z-10 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        e.user_picture
                                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${e.user_picture}.webp`
                                            : "/images/usericons/default.png"
                                    }
                                    className="rounded-full object-contain"
                                    alt={"User"}
                                    width={40}
                                    height={40}
                                ></Image>
                            </div>
                            <div className="flex flex-col">
                                <Link href={"/user?name=" + e.username} className="w-24 font-medium sm:w-auto">
                                    @{e.username}
                                </Link>
                                <span className="text-sm font-light">{dayjs(e.create_time).fromNow()}</span>
                            </div>
                        </div>

                        {Boolean(e.is_best) && (
                            <span className="items-center justify-center text-green-600">Resolvido</span>
                        )}
                    </div>

                    <div>
                        <p className="whitespace-pre-line">{e.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    handleVote(
                                        e.user_vote === 1 ? 0 : 1,
                                        "answer",
                                        Number(router.query.id),
                                        e.id_answer
                                    )
                                }
                            >
                                {e.user_vote === 1 ? (
                                    <TbArrowBigUpFilled className="text-2xl text-green-600" />
                                ) : (
                                    <TbArrowBigUp className="text-2xl text-green-600" />
                                )}
                            </button>
                            <span className="flex w-10 justify-center font-medium sm:text-xl">
                                {Intl.NumberFormat("en", { notation: "compact" }).format(e.votes)}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    handleVote(
                                        e.user_vote === -1 ? 0 : -1,
                                        "answer",
                                        Number(router.query.id),
                                        e.id_answer
                                    )
                                }
                            >
                                {e.user_vote === -1 ? (
                                    <TbArrowBigDownFilled className="text-2xl text-red-600" />
                                ) : (
                                    <TbArrowBigDown className="text-2xl text-red-600" />
                                )}
                            </button>

                            {data.id_user !== undefined && user.id !== undefined && data.id_user === user.id && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleBest(e.is_best ? false : true, Number(router.query.id), e.id_answer)
                                    }
                                >
                                    {e.is_best ? (
                                        <TbCircleCheckFilled className="text-2xl text-green-600" />
                                    ) : (
                                        <TbCircleCheck className="text-2xl text-green-600" />
                                    )}
                                </button>
                            )}
                        </div>

                        <button type="button" onClick={() => handleReport("answer", e.id_answer)}>
                            <TbAlertTriangle className="text-2xl text-yellow-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {!user.banned && user.user_behavior >= 20 ? (
                            <button
                                className="flex items-center gap-2"
                                onClick={() => viewReplies(e.id_answer, e.reply_input ? "input" : "input")}
                            >
                                <BsFillReplyFill className="text-2xl text-blue-600" />
                                <span>Responder</span>
                            </button>
                        ) : null}

                        {Boolean(e.replies?.length) && (
                            <>
                                <span>·</span>
                                <button
                                    className="flex items-center gap-2"
                                    onClick={() => viewReplies(e.id_answer, e.show_replies ? "replies" : "replies")}
                                >
                                    <span>
                                        Ver{" "}
                                        {`${e.replies?.length} ${e.replies?.length === 1 ? "resposta" : "respostas"}`}
                                    </span>
                                    <TbChevronDown className="text-2xl" />
                                </button>
                            </>
                        )}
                    </div>

                    {e.reply_input && (
                        <form
                            className="flex flex-col gap-3 sm:flex-row"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                handleAnswer(data.id_post, e.id_answer);
                            }}
                        >
                            <input
                                name="answer"
                                type="text"
                                value={reply}
                                className="h-11 flex-1 rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                                placeholder="Digite seu comentário..."
                                onChange={(e) => {
                                    setReply(e.target.value);
                                }}
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    className="mx-0 flex-1 sm:w-28"
                                    bgColor="#C81652"
                                    action={() => viewReplies(e.id_answer, "input")}
                                >
                                    Cancelar
                                </Button>

                                <Button type="submit" className="mx-0 flex-1 sm:w-28" disable={!reply}>
                                    Responder
                                </Button>
                            </div>
                        </form>
                    )}

                    {e.show_replies && (
                        <>
                            <hr className="text-neutral-400 dark:text-zinc-800" />
                            <ul className="flex flex-col gap-2">
                                {e.replies?.map((e2) => {
                                    return (
                                        <li className="pl-4 sm:pl-8" key={e2.id_answer as any}>
                                            <div
                                                className="relative flex w-full select-none flex-col gap-3 rounded-xl bg-primary-white p-3 dark:bg-primary"
                                                style={{ border: e2.is_best ? "1px solid #00BB29" : "none" }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src={
                                                                e2.user_picture
                                                                    ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${e2.user_picture}.webp`
                                                                    : "/images/usericons/default.png"
                                                            }
                                                            className="rounded-full object-contain"
                                                            alt={"User"}
                                                            width={40}
                                                            height={40}
                                                        ></Image>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={"/user?name=" + e2.username}
                                                            className="w-24 font-medium sm:w-auto"
                                                        >
                                                            @{e2.username}
                                                        </Link>
                                                        <span className="text-sm font-light">
                                                            {dayjs(e2.create_time).fromNow()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="line-clamp-2 sm:line-clamp-3">{e2.content}</p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleVote(
                                                                    e2.user_vote === 1 ? 0 : 1,
                                                                    "answer",
                                                                    Number(router.query.id),
                                                                    e2.id_answer,
                                                                    e.id_answer
                                                                )
                                                            }
                                                        >
                                                            {e2.user_vote === 1 ? (
                                                                <TbArrowBigUpFilled className="text-2xl text-green-600" />
                                                            ) : (
                                                                <TbArrowBigUp className="text-2xl text-green-600" />
                                                            )}
                                                        </button>
                                                        <span className="flex w-10 justify-center font-medium sm:text-xl">
                                                            {Intl.NumberFormat("en", { notation: "compact" }).format(
                                                                e2.votes
                                                            )}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleVote(
                                                                    e2.user_vote === -1 ? 0 : -1,
                                                                    "answer",
                                                                    Number(router.query.id),
                                                                    e2.id_answer,
                                                                    e.id_answer
                                                                )
                                                            }
                                                        >
                                                            {e2.user_vote === -1 ? (
                                                                <TbArrowBigDownFilled className="text-2xl text-red-600" />
                                                            ) : (
                                                                <TbArrowBigDown className="text-2xl text-red-600" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleReport("answer", e2.id_answer)}
                                                    >
                                                        <TbAlertTriangle className="text-2xl text-yellow-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                </div>
            );
        });

        if (Object.keys(data).length) setData({ ...data, answers: answerDivs.length });
        setAnsDivs(answerDivs);
    }

    if (!Object.keys(data).length) {
        return (
            <>
                <Head>
                    <title>Mille</title>
                </Head>
                <Topbar type="social" />
                <Loading></Loading>
                <Menubar active={0}></Menubar>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`${data.title} - Mille`}</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        data.user_picture
                                            ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${data.user_picture}.webp`
                                            : "/images/usericons/default.png"
                                    }
                                    className="rounded-full object-contain"
                                    alt={"User"}
                                    width={50}
                                    height={50}
                                ></Image>
                            </div>
                            <div className="flex flex-col">
                                <Link href={"/user?name=" + data.username} className="w-24 font-medium sm:w-auto">
                                    @{data.username}
                                </Link>
                                <span className="text-sm font-light">{dayjs(data.create_time).fromNow()}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold sm:text-3xl">{data.title}</h1>
                        <p className="whitespace-pre-line">{data.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleVote(data.user_vote === 1 ? 0 : 1, "post", data.id_post)}
                            >
                                {data.user_vote === 1 ? (
                                    <TbArrowBigUpFilled className="text-2xl text-green-600" />
                                ) : (
                                    <TbArrowBigUp className="text-2xl text-green-600" />
                                )}
                            </button>
                            <span className="flex w-10 justify-center font-medium sm:text-xl">
                                {Intl.NumberFormat("en", { notation: "compact" }).format(data.votes)}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleVote(data.user_vote === -1 ? 0 : -1, "post", data.id_post)}
                            >
                                {data.user_vote === -1 ? (
                                    <TbArrowBigDownFilled className="text-2xl text-red-600" />
                                ) : (
                                    <TbArrowBigDown className="text-2xl text-red-600" />
                                )}
                            </button>
                        </div>

                        <button type="button" onClick={() => handleReport("post", data.id_post)}>
                            <TbAlertTriangle className="text-2xl text-yellow-500" />
                        </button>
                    </div>

                    <div>
                        {!user.banned && user.user_behavior >= 20 ? (
                            <form
                                className="flex flex-col gap-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAnswer(data.id_post);
                                }}
                            >
                                <textarea
                                    name="answer"
                                    rows={3}
                                    placeholder="Digite sua resposta..."
                                    className="flex-1 resize-none rounded-xl border-none bg-neutral-100 p-3 text-neutral-400 outline-none dark:bg-zinc-800"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>

                                <Button type="submit" className="mx-0 h-12 sm:w-40" disable={!answer}>
                                    Responder
                                </Button>
                            </form>
                        ) : null}

                        <div className="mt-5 flex flex-col gap-3">
                            {ansDivs.length ? (
                                <>
                                    <span>{`${data.answers} ${data.answers === 1 ? "resposta" : "respostas"}`}</span>
                                    {ansDivs}
                                </>
                            ) : (
                                <h2 className="mt-10 text-center text-xl">Nenhuma resposta ainda...</h2>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

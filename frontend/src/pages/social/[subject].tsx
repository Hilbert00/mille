import Head from "next/head";

import Topbar from "@/components/topbar";
import Menubar from "@/components/menubar";
import Button from "@/components/button";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
dayjs.extend(relativeTime);

import { TbX } from "react-icons/tb";
import { TbCheck } from "react-icons/tb";
import { TbArrowBigUp } from "react-icons/tb";
import { TbArrowBigUpFilled } from "react-icons/tb";
import { TbArrowBigDown } from "react-icons/tb";
import { TbArrowBigDownFilled } from "react-icons/tb";

import { getUserData } from "hooks/getUserData";

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

export default function Community(props: any) {
    const [search, setSearch] = useState({ text: "", timer: null as null | NodeJS.Timeout });
    const [posts, setPosts] = useState([] as post[]);
    const [searchPosts, setSearchPosts] = useState(null as post[] | null);
    const [postDivs, setPostDivs] = useState([] as any);
    const [areas, setAreas] = useState([] as any);
    const [redirecting, setRedirecting] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [user] = getUserData(false);

    const router = useRouter();

    useEffect(() => {
        if (searchPosts) {
            if (searchPosts.length) makePostDivs(searchPosts);
            else makePostDivs([]);
        } else makePostDivs(posts);

        if (loaded) return;

        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/world/${props.simple}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setAreas(
                    data
                        .map((e: any) => {
                            try {
                                const areas = e.area_name.map((el: any, i: number) => {
                                    return { name: el, id: e.area_id[i] };
                                });

                                return areas;
                            } catch {
                                return { name: e.area_name, id: e.area_id };
                            }
                        })
                        .flat()
                );
            })
            .catch((err) => console.error(err));

        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/posts?subject=${props.id_subject}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setLoaded(true);
                setPosts(data);
            })
            .catch((err) => console.error(err));
    }, [redirecting, JSON.stringify(posts), JSON.stringify(searchPosts)]);

    function handleVote(value: 1 | 0 | -1, postID: number) {
        fetch(process.env.NEXT_PUBLIC_API_URL + `/api/social/post/like`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postID, value, all: true }),
            method: "POST",
        });

        const updatedPosts = posts.map((e) => {
            if (e.id_post === postID) {
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

        setPosts(updatedPosts);
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        if (search.timer) {
            clearTimeout(search.timer);
        }

        if (event.target.value) {
            const timer = setTimeout(() => {
                const filtered = posts.filter((e) => {
                    const msg = event.target.value.toLowerCase();
                    if (e.title.toLocaleLowerCase().includes(msg) || e.description.toLocaleLowerCase().includes(msg)) {
                        return true;
                    }
                    return false;
                });

                setSearchPosts(filtered);
            }, 500);

            setSearch({ text: event.target.value, timer: timer });
            return;
        }

        setSearchPosts(null);
        setSearch({ text: event.target.value, timer: null });
    }

    function handleFilters() {
        swal.fire({
            title: "Filtros de Pesquisa",
            background: "#1E1E1E",
            color: "#fff",
            html: (
                <div className="flex-col gap-4">
                    <div className="flex justify-between">
                        <label htmlFor="recent">Recentes:</label>
                        <div className="flex gap-4">
                            <div>
                                <input type="radio" name="recent" value={-1} className="mr-2" />X
                            </div>

                            <div>
                                <input defaultChecked type="radio" name="recent" value={0} className="mr-2" />-
                            </div>

                            <div>
                                <input type="radio" name="recent" value={1} className="mr-2" />✓
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <label htmlFor="solved">Resolvidos:</label>
                        <div className="flex gap-4">
                            <div>
                                <input type="radio" name="solved" value={-1} className="mr-2" />X
                            </div>

                            <div>
                                <input defaultChecked type="radio" name="solved" value={0} className="mr-2" />-
                            </div>

                            <div>
                                <input type="radio" name="solved" value={1} className="mr-2" />✓
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <label htmlFor="area">Área:</label>
                        <select
                            name="area"
                            className="w-48 resize-none appearance-none truncate rounded-xl border-none bg-neutral-100 p-1 text-base text-neutral-400 outline-none dark:bg-zinc-800"
                        >
                            <option value="0" className="text-base">
                                Todas
                            </option>

                            {areas.map((e: any) => (
                                <option value={e.id} className="text-base" key={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ),
            focusConfirm: false,
            preConfirm: () => {
                const recent = Array.from(swal.getPopup()?.querySelectorAll('input[name = "recent"]') as any).find(
                    (e: any) => e.checked
                ) as any;

                const solved = Array.from(swal.getPopup()?.querySelectorAll('input[name = "solved"]') as any).find(
                    (e: any) => e.checked
                ) as any;

                const area = swal.getPopup()?.querySelector('select[name = "area"]') as any;

                return { recent: recent.value, solved: solved.value, area: area.value };
            },
        }).then((result) => {
            if (!result.isConfirmed) return;

            const filter = result.value;
            fetch(
                process.env.NEXT_PUBLIC_API_URL +
                    `/api/social/posts?subject=${props.id_subject}&recent=${filter?.recent}&solved=${filter?.solved}&area=${filter?.area}`,
                {
                    credentials: "include",
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    setPosts(data);
                })
                .catch((err) => console.error(err));
        });
    }

    function makePostDivs(data: post[]) {
        const postDivs = data.map((e) => {
            return (
                <div
                    key={e.id_post as any}
                    className="flex w-full select-none flex-col gap-3 rounded-xl bg-primary-white p-3 dark:bg-primary"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src={`/images/quiz/icons/${props.simple}/${e.area_name
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .substring(0, 3)
                                    .toLowerCase()}.png`}
                                width={25}
                                height={25}
                                alt="quiz-icon"
                            />
                            <span className="hidden sm:inline-block">·</span>
                            <span className="hidden sm:inline-block">{e.area_name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>{`${e.answers} ${e.answers === 1 ? "resposta" : "respostas"}`}</span>
                            <div className="inline-block">
                                {e.solved ? (
                                    <TbCheck className="stroke-[3] text-3xl text-green-600" />
                                ) : (
                                    <TbX className="stroke-[3] text-3xl text-red-600" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            if (!redirecting) {
                                setRedirecting(true);
                                router.push(`/social/post?id=${e.id_post}`);
                            }
                        }}
                    >
                        <h1 className="truncate text-xl font-semibold sm:text-2xl">{e.title}</h1>
                        <p className="line-clamp-2 sm:line-clamp-3">{e.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => handleVote(e.user_vote === 1 ? 0 : 1, e.id_post)}>
                            {e.user_vote === 1 ? (
                                <TbArrowBigUpFilled className="text-2xl text-green-600" />
                            ) : (
                                <TbArrowBigUp className="text-2xl text-green-600" />
                            )}
                        </button>
                        <span className="flex w-10 justify-center">
                            {Intl.NumberFormat("en", { notation: "compact" }).format(e.votes)}
                        </span>
                        <button type="button" onClick={() => handleVote(e.user_vote === -1 ? 0 : -1, e.id_post)}>
                            {e.user_vote === -1 ? (
                                <TbArrowBigDownFilled className="text-2xl text-red-600" />
                            ) : (
                                <TbArrowBigDown className="text-2xl text-red-600" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src={
                                    e.user_picture
                                        ? `https://res.cloudinary.com/dxmh73o0j/image/upload/v1699888122/${e.user_picture}.webp`
                                        : "/images/usericons/default.png"
                                }
                                className="rounded-full object-contain"
                                alt={"User"}
                                width={25}
                                height={25}
                            ></Image>
                            <Link href={"/user?name=" + e.username}>@{e.username}</Link>
                        </div>
                        <p>{dayjs(e.create_time).fromNow()}</p>
                    </div>
                </div>
            );
        });

        setPostDivs(postDivs);
    }

    return (
        <>
            <Head>
                <title>{`Comunidade ${props.name} - Mille`}</title>
            </Head>

            <Topbar type="social" />

            <main className="relative mx-auto max-w-[calc(100vw-40px)] pt-10 pb-24 md:max-w-3xl">
                <div className="flex w-full flex-col flex-wrap justify-between gap-5">
                    <h1 className="text-center text-3xl font-semibold">{props.name}</h1>

                    {!user.banned && user.user_behavior >= 50 ? (
                        <Button
                            type="button"
                            className="w-full"
                            disable={redirecting}
                            action={() => {
                                router.push("publish");
                                setRedirecting(true);
                            }}
                        >
                            Fazer uma Pergunta
                        </Button>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            className="h-11 flex-1 rounded-xl border-none bg-primary-white p-3 text-neutral-400 outline-none dark:bg-zinc-800 sm:max-w-none"
                            type="text"
                            placeholder="Pesquisar..."
                            value={search.text}
                            onChange={handleSearch}
                        />

                        <Button type="button" className="w-full sm:w-40" action={handleFilters}>
                            Filtros
                        </Button>
                    </div>

                    {postDivs.length ? (
                        postDivs
                    ) : (
                        <h2 className="mt-10 text-center text-xl">Nenhuma pergunta encontrada...</h2>
                    )}
                </div>
            </main>

            <Menubar active={0}></Menubar>
        </>
    );
}

export async function getStaticProps({ params }: any) {
    function getName(title: String) {
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

    const url = process.env.NEXT_PUBLIC_API_URL + `/api/world`;

    try {
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const json: { id_subject: number; name: string; simple: string }[] = await response.json();
        const data = json.find((e) => getName(e.name) === params.subject);
        if (data) data.simple = params.subject;

        return {
            props: data,
        };
    } catch {
        return {
            props: {
                data: [],
            },
        };
    }
}

export async function getStaticPaths() {
    return {
        paths: ["/social/mat", "/social/nat"],
        fallback: false,
    };
}

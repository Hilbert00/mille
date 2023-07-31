// STATUS
const defaultStatus = [
    <li
        key={1}
        className="top dakr:bg-[#C5C5C5] absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-0 skew-y-[-22deg] overflow-hidden bg-[#707070]"
    ></li>,
    <li
        key={2}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[72deg] skew-y-[-22deg] overflow-hidden bg-[#707070]"
    ></li>,
    <li
        key={3}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[144deg] skew-y-[-22deg] overflow-hidden bg-[#707070]"
    ></li>,
    <li
        key={4}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[216deg] skew-y-[-22deg] overflow-hidden bg-[#707070]"
    ></li>,
    <li
        key={5}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[288deg] skew-y-[-22deg] overflow-hidden bg-[#707070]"
    ></li>,
];

const correctStatus = [
    <li
        key={1}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-0 skew-y-[-22deg] overflow-hidden bg-[#00BB29]"
    ></li>,
    <li
        key={2}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[72deg] skew-y-[-22deg] overflow-hidden bg-[#00BB29]"
    ></li>,
    <li
        key={3}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[144deg] skew-y-[-22deg] overflow-hidden bg-[#00BB29]"
    ></li>,
    <li
        key={4}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[216deg] skew-y-[-22deg] overflow-hidden bg-[#00BB29]"
    ></li>,
    <li
        key={5}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[288deg] skew-y-[-22deg] overflow-hidden bg-[#00BB29]"
    ></li>,
];

const wrongStatus = [
    <li
        key={1}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-0 skew-y-[-22deg] overflow-hidden bg-[#D2042D]"
    ></li>,
    <li
        key={2}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[72deg] skew-y-[-22deg] overflow-hidden bg-[#D2042D]"
    ></li>,
    <li
        key={3}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[144deg] skew-y-[-22deg] overflow-hidden bg-[#D2042D]"
    ></li>,
    <li
        key={4}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[216deg] skew-y-[-22deg] overflow-hidden bg-[#D2042D]"
    ></li>,
    <li
        key={5}
        className="top absolute right-0 h-1/2 w-1/2 origin-bottom-left rotate-[288deg] skew-y-[-22deg] overflow-hidden bg-[#D2042D]"
    ></li>,
];

// INTERFACES
interface AlternativeProps {
    id: number;
    image_url: string | null;
    text: string | null;
}

interface AlternativesProps {
    answered: number;
    correct: number;
    available: AlternativeProps[];
}

interface QuestionProps {
    alternatives: AlternativesProps;
    id: number;
    image_url: string | null;
    text: string | null;
}

interface MainProps {
    questions: QuestionProps[];
    done: number;
}

interface Props {
    data: MainProps;
    type: number;
    area: string;
    subject: string;
    linksTo: number;
    style?: { [key: string]: string };
}

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import swal from "sweetalert2";

export default function QuizCircle(props: Props) {
    const router = useRouter();
    const [questionStatus, setQuestionStatus] = useState(defaultStatus);

    const [ping, setPing] = useState(null as any);
    const [locked, setLocked] = useState(true);
    const [testLoading, setTestLoading] = useState(false);

    useEffect(() => {
        if (typeof props?.data?.done !== "undefined") {
            setLocked(false);
            if (!props.data.done) {
                setPing(
                    <div className="absolute flex h-[80px] w-[80px]">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-[#707070] opacity-75"></span>
                    </div>
                );
            } else {
                const newStatus = props.data.questions.map((e, i) => {
                    if (e.alternatives.answered === e.alternatives.correct) {
                        return correctStatus[i];
                    } else {
                        return wrongStatus[i];
                    }
                });
                setQuestionStatus(newStatus);
            }
        }
    }, [props]);

    return (
        <button
            className="relative flex items-center justify-center rounded-full"
            style={{ ...props.style, opacity: locked ? "0.3" : "1.0" }}
            onClick={async () => {
                if (testLoading) return;
                setTestLoading(true);
                
                try {
                    const test = await fetch(
                        process.env.NEXT_PUBLIC_API_URL + `/api/quiz/get/${props.type}?num=${props.linksTo}`,
                        {
                            credentials: "include",
                        }
                    );

                    if (test.status === 204) throw new Error();

                    return router.push(
                        `${props.subject}/quiz?quizType=${props.type}&quizArea=${props.area}&quizID=${props.linksTo}`
                    );
                } catch {
                    setTestLoading(false);

                    swal.fire({
                        title: "Oops",
                        text: "Este quiz ainda não foi desbloqueado!",
                        icon: "error",
                        background: "#1E1E1E80",
                        color: "#fff",
                    });
                }
            }}
        >
            {ping}
            <div className="absolute top-0 left-0 z-10 box-content flex h-[calc(100%-20px)] w-[calc(100%-20px)] items-center justify-center rounded-[inherit] bg-[#fff] bg-clip-content p-[10px] dark:bg-bgBlack">
                <Image src={`/images/quiz/icons/math/${props.area}.png`} width={50} height={50} alt="quiz-icon"></Image>
            </div>
            <ul className={`relative h-[100px] w-[100px] list-none overflow-hidden rounded-[inherit] p-0`}>
                {questionStatus}
            </ul>
        </button>
    );
}

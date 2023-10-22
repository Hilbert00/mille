import Link from "next/link";

interface CardProps {
    title?: string;
    main?: string;
    mainData?: string;
    extra?: string;
    extraData?: string;
    color?: string;
    linksTo?: string;
}

export default function Card(props: CardProps) {
    return (
        <Link href={props.linksTo ? props.linksTo : ""} className="w-full sm:w-[45%]">
            <div
                className="relative h-44 w-full rounded-xl transition-all duration-500 sm:hover:scale-105"
                style={{
                    background: `url(/images/subject/${String(props.title)
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .substring(0, 3)
                        .toLowerCase()}.png)`,
                    backgroundSize: "cover",
                }}
            >
                <div className="p-3">
                    <p className="mb-3 font-semibold">
                        {props.main} {props.mainData}
                    </p>
                    <p className="font-semibold">
                        {props.extra} {props.extraData}
                    </p>
                </div>
                <div
                    className="absolute bottom-0 flex h-12 w-full items-center rounded-b-xl p-3"
                    style={{ background: props.color }}
                >
                    <h1 className="text-xl text-primary-white">{props.title}</h1>
                </div>
            </div>
        </Link>
    );
}

import Link from "next/link";

interface CardProps {
    title?: string;
    main?: string;
    mainData?: string;
    extra?: string;
    extraData?: string;
    color?: string;
    linksTo?: string;
    soon?: boolean;
}

export default function Card(props: CardProps) {
    if (props.soon) {
        return (
            <div className="relative h-44 w-full rounded-xl bg-[url(/images/soon.png)] bg-cover sm:w-[45%]">
                <div className="absolute bottom-0 flex h-12 w-full items-center rounded-b-xl bg-[#8D8D8DCC] p-3">
                    <h1 className="text-xl text-primary-white">Em breve...</h1>
                </div>
            </div>
        );
    }

    return (
        <Link href={props.linksTo ? props.linksTo : ""} className="w-full sm:w-[45%]">
            <div className="relative h-44 w-full rounded-xl bg-[#e7e7e7] dark:bg-primary">
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

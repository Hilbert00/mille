import { getUserData } from "hooks/getUserData";

interface TopbarProps {
    barValues: [number, number];
    barMaxValue: number;
    points: number;
}

export default function DuelTopbar(props: TopbarProps) {
    getUserData(false);
    const percentageOne = ((Number(props.barValues[0]) * 100) / Number(props.barMaxValue)).toFixed();
    const percentageTwo = ((Number(props.barValues[1]) * 100) / Number(props.barMaxValue)).toFixed();

    const progressbars = [percentageOne, percentageTwo].map((e, i) => {
        const color = ["#00BB29", "#C81652"][i];
        return (
            <div key={!i ? "user" : "enemy"} className="flex-1">
                <div className="relative flex h-6 w-full items-center overflow-hidden rounded-xl bg-neutral-400 dark:bg-neutral-700">
                    <div
                        className="flex h-full items-center justify-center transition-all"
                        style={{ width: `${e}%`, backgroundColor: color }}
                    ></div>
                    <span className="absolute right-0 left-0 text-center font-semibold text-white transition-all sm:text-xl">
                        {`${e}%`}
                    </span>
                </div>
            </div>
        );
    });

    return (
        <header className="sticky top-0 z-20 w-full border-b-4 border-primary-white bg-white dark:border-primary dark:bg-bgBlack">
            <nav className="mx-auto flex h-16 w-full max-w-[calc(100vw-40px)] flex-col items-center justify-between gap-1 md:max-w-3xl">
                <div className="mt-1 flex w-full justify-between gap-[5%]">
                    <h2 className="flex w-[60%] gap-4 text-sm font-semibold sm:w-[45%] sm:text-xl">
                        Seus pontos:
                        <span style={{ color: props.points >= 0 ? "#00BB29" : "#C81652" }}>{props.points}</span>
                    </h2>
                    {progressbars[0]}
                </div>
                <div className="flex w-full justify-between gap-[5%]">
                    <h2 className="w-[60%] text-sm font-semibold sm:w-[45%] sm:text-xl">Progresso do adversário: </h2>
                    {progressbars[1]}
                </div>
            </nav>
        </header>
    );
}

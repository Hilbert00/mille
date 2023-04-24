interface TimerProps {
    currentValue: number;
    maxValue: number;
}

export default function DuelTimer(props: TimerProps) {
    return (
        <div className="mb-4 flex items-center rounded-xl">
            <div
                className="h-4 flex-1 rounded-[inherit]"
                style={{ background: "linear-gradient(90deg, #C81652 5%, #E5AC1A 30%, #00BB29 100%)" }}
            >
                <div
                    className="ml-auto h-full rounded-r-[inherit] bg-[#282828]"
                    style={{ width: `${100 - (props.currentValue * 100) / props.maxValue}%` }}
                />
            </div>
        </div>
    );
}

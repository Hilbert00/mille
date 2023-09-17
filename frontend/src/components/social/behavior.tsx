interface CircleProps {
    children: any;
    classname?: string;
}

export default function Behavior(props: CircleProps) {
    const value = Number.isNaN(Number(props.children)) ? 0 : Number(props.children);
    const colors = (function () {
        if (value >= 50) return ["#02A726", "#00BB29"];
        else if (value >= 20) return ["#E5AC1A", "#FFC107"];
        return ["#AD1548", "#C81652"];
    })();

    return (
        <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border-4 ${props.classname}`}
            style={{ backgroundColor: colors[1], borderColor: colors[0] }}
        >
            <span className="font-semibold text-primary-white">{value}</span>
        </div>
    );
}

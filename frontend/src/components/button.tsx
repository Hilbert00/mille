import { MouseEventHandler } from "react";

interface ButtonProps {
    action?: MouseEventHandler;
    bgColor?: string;
    children: any;
    textColor?: string;
    type: "button" | "submit";
    width?: number;
}

export default function Button(props: ButtonProps) {
    const bgColor = props.bgColor ?? "#1A66E5";
    const textColor = props.textColor ?? "#fff";
    const width = props.width ?? 100;

    return (
        <input
            className="mx-auto block h-11 rounded-xl border-none transition-all duration-500 active:scale-90 active:brightness-125"
            style={{ backgroundColor: bgColor, color: textColor, width: `${width}%` }}
            onClick={props.action}
            value={props.children}
            type={props.type}
        />
    );
}

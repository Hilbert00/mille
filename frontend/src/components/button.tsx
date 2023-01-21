import { MouseEventHandler } from "react";

interface ButtonProps {
    action?: MouseEventHandler;
    bgColor?: string;
    children: any;
    textColor?: string;
    type: "button" | "submit";
    width?: number;
    className?: any;
}

export default function Button(props: ButtonProps) {
    const bgColor = props.bgColor ?? "#1A66E5";

    return (
        <input
            className={`mx-auto block rounded-xl border-none p-2 text-primary-white transition-all duration-500 active:scale-90 active:brightness-125 ${props.className}`}
            style={{ backgroundColor: bgColor }}
            onClick={props.action}
            value={props.children}
            type={props.type}
        />
    );
}

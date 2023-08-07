import { MouseEventHandler } from "react";

interface ButtonProps {
    action?: MouseEventHandler;
    bgColor?: string;
    children: any;
    textColor?: string;
    type: "button" | "submit";
    className?: any;
    disable?: boolean;
}

export default function Button(props: ButtonProps) {
    const bgColor = props.bgColor ?? "#1A66E5";

    return (
        <button
            className={`mx-auto block rounded-xl border-none p-2 text-primary-white transition-all duration-500 hover:scale-110 active:scale-90 active:brightness-125 ${props.className}`}
            style={{ backgroundColor: bgColor, opacity: props.disable ? 0.6 : 1 }}
            onClick={props.action}
            type={props.type}
            disabled={props.disable}
        >
            {props.children}
        </button>
    );
}

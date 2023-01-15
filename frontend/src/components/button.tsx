import styles from "@/styles/components/Button.module.css";
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
            className={styles.button}
            style={{ backgroundColor: bgColor, color: textColor, width: `${width}%` }}
            onClick={props.action}
            value={props.children}
            type={props.type}
        />
    );
}

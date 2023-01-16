import Image from "next/image";

import styles from "@/styles/components/landingPage/FeatureDisplay.module.css";

interface FeatureProps {
    title: string;
    children?: any;
    type: "challenge" | "community" | "solo";
}

export default function FeatureDisplay(props: FeatureProps) {
    return (
        <div className={styles.feature}>
            <div className={styles.feature__text}>
                <h2>{props.title}</h2>
                <p>{props.children}</p>
            </div>
            <div className={styles.feature__image}>
                <Image src={`/images/landingPage/${props.type}.png`} alt={props.type} width={100} height={100} />
            </div>
        </div>
    );
}

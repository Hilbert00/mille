import Image from "next/image";

interface FeatureProps {
    title: string;
    children?: any;
    type: "challenge" | "community" | "solo";
}

export default function FeatureDisplay(props: FeatureProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="w-[60%] sm:w-[70%]">
                <h2 className="mb-1 text-base font-medium sm:mb-3 sm:text-3xl">{props.title}</h2>
                <p className="text-sm font-light sm:text-2xl">{props.children}</p>
            </div>
            <div className="w-[30%] sm:w-[20%]">
                <Image
                    src={`/images/landingPage/${props.type}.png`}
                    alt={props.type}
                    width={512}
                    height={512}
                    className="sm:w-full"
                />
            </div>
        </div>
    );
}

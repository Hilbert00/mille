import Image from "next/image";
import Link from "next/link";

interface LogoType {
    type: "basic" | "conffeti" | "full";
}

export default function Logo(props: LogoType) {
    return (
        <Link href={"/landing"}>
            <Image src={`/images/logo/mille-logo-${props.type}.png`} alt={"Logo"} width={"160"} height={"80"} priority />
        </Link>
    );
}

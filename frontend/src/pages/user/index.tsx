import { useEffect } from "react";
import { useRouter } from "next/router";

export default function User({ userPath }: any) {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
        return;
    });
}

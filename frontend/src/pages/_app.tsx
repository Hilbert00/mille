import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme("dark");
    }, []);

    return (
        <ThemeProvider attribute="class">
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

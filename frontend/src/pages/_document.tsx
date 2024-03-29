import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="pt-BR">
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="shortcut icon" href="/images/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
            <Head />
            <body className="min-h-screen bg-white text-primary dark:bg-bgBlack  dark:text-primary-white">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

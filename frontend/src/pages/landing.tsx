import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import FeatureDisplay from "@/components/landingPage/featureDisplay";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <>
            <Head>
                <title>Mille - Plataforma de Estudos para o ENEM</title>
            </Head>

            <header className="flex h-28 w-full items-center justify-center">
                <Logo type={"full"} />
            </header>

            <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                <section className="mb-6 sm:mb-14">
                    <div className="mb-6 sm:mb-14">
                        <h1 className="mb-3 text-2xl font-medium sm:mb-8 sm:text-6xl">
                            Venha hoje estudar com a gente!
                        </h1>
                        <p className="font-light sm:text-3xl">
                            Participe de comunidades de estudo sobre as áreas do conhecimento do ENEM enquanto estuda no
                            modo solo e participa de duelos com seus amigos no modo desafio!
                        </p>
                    </div>

                    <Link href={"/signup"}>
                        <Button type="button" className="w-3/4">
                            {"Crie sua conta agora!"}
                        </Button>
                    </Link>
                </section>

                <section className="mb-8">
                    <FeatureDisplay title={"4 mundos únicos e mais por vir!"} type={"solo"}>
                        Quatro mundos disponíveis para as seguintes disciplinas: matemática, química, física e biologia.
                        E o número continuará aumentando no futuro!
                    </FeatureDisplay>

                    <FeatureDisplay title={"Desafie seus amigos!"} type={"challenge"}>
                        Participe de duelos com seus amigos e adquira prêmios enquanto estuda!
                    </FeatureDisplay>

                    <FeatureDisplay title={"Interaja na comunidade!"} type={"community"}>
                        Publique suas perguntas, responda as de outros usuários, e participe de eventos na comunidade!
                    </FeatureDisplay>
                </section>
            </main>

            <Footer />
        </>
    );
}

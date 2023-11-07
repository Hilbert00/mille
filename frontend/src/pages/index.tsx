import Head from "next/head";
import Link from "next/link";

import Logo from "@/components/logo";
import Button from "@/components/button";
import FeatureDisplay from "@/components/landingPage/featureDisplay";
import Footer from "@/components/footer";

export default function LandingPage() {
    return (
        <>
            <Head>
                <title>Mille - Plataforma de Estudos para o ENEM</title>
            </Head>

            <header className="flex h-28 w-full items-center justify-center">
                <Logo type={"full"} />
            </header>

            <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                <section className="mb-6 sm:mb-0 sm:flex sm:min-h-[calc(100vh-7rem)] sm:flex-col sm:justify-center">
                    <div className="mb-6 sm:mb-14">
                        <h1 className="mb-3 text-center text-2xl font-bold sm:mb-8 sm:text-7xl">
                            Venha hoje estudar com a gente!
                        </h1>
                        <p className="font-light sm:text-center sm:text-2xl">
                            Participe de comunidades de estudo sobre as áreas do conhecimento do ENEM enquanto estuda no
                            modo solo e participa de duelos com seus amigos no modo desafio!
                        </p>
                    </div>

                    <Link href={"/signup"}>
                        <Button type="button" className="w-full font-semibold sm:w-3/4 sm:text-2xl">
                            {"Crie sua conta agora!"}
                        </Button>
                    </Link>
                </section>

                <section className="flex flex-col justify-between gap-6 py-6 sm:h-[calc(100vh-2rem)]">
                    <div className="absolute left-0 right-0 -z-10 bg-blue-600 sm:top-[100vh] sm:h-screen"></div>
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

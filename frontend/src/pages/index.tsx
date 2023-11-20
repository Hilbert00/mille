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

            <div className="w-full overflow-hidden">
                <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[calc(100vw-40px)] md:max-w-3xl">
                    <section className="mb-6 sm:mb-0 sm:flex sm:min-h-[calc(100vh-7rem)] sm:flex-col sm:justify-center">
                        <div className="mb-6 sm:mb-14">
                            <h1 className="mb-3 text-center text-2xl font-bold sm:mb-8 sm:text-7xl">
                                Venha hoje estudar com a gente!
                            </h1>
                            <p className="font-light sm:text-center sm:text-2xl">
                                Participe de comunidades de estudo sobre as áreas do conhecimento do ENEM enquanto
                                estuda no modo solo e participa de disputas com seus amigos no modo duelo!
                            </p>
                        </div>

                        <Link href={"/signup"}>
                            <Button type="button" className="w-full font-semibold sm:w-3/4 sm:text-2xl">
                                {"Crie sua conta agora!"}
                            </Button>
                        </Link>
                    </section>

                    <section className="relative flex flex-col justify-between gap-6">
                        <div className="absolute -left-full -z-10 w-[200vw] bg-blue-600 h-full"></div>
                        <FeatureDisplay title={"2 mundos únicos!"} type={"solo"}>
                            Dois mundos disponíveis para as seguintes áreas do conhecimento: Matemática e Ciências da
                            Natureza.
                        </FeatureDisplay>

                        <FeatureDisplay title={"Desafie seus amigos!"} type={"challenge"}>
                            Participe de duelos com seus amigos e adquira prêmios enquanto estuda!
                        </FeatureDisplay>

                        <FeatureDisplay title={"Interaja na comunidade!"} type={"community"}>
                            Publique suas perguntas e responda as de outros usuários!
                        </FeatureDisplay>
                    </section>
                </main>
            </div>

            <Footer />
        </>
    );
}

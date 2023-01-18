import Head from "next/head";
import Link from "next/link";
import Styles from "@/styles/routes/Landing.module.css";

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

            <header>
                <Logo type={"full"} />
            </header>

            <main>
                <div className={Styles.container}>
                    <div id={Styles.titleContainer}>
                        <h1 id={Styles.mainTitle}>Venha hoje estudar com a gente!</h1>
                        <p id={Styles.mainText}>
                            Participe de comunidades de estudo sobre as áreas do conhecimento do ENEM enquanto estuda no
                            modo solo e participa de duelos com seus amigos no modo desafio!
                        </p>
                    </div>

                    <Link href={"/signup"}>
                        <Button type="button">{"Crie sua conta agora!"}</Button>
                    </Link>
                </div>

                <div className={Styles.container}>
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
                </div>
            </main>

            <Footer />
        </>
    );
}

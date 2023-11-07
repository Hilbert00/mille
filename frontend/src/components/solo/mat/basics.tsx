import QuizCircle from "../quizCircle";

export default function MatBasics(props: { data: any[] }) {
    return (
        <>
            <div className="mt-8 flex w-full [&>div]:mx-auto">
                <div className="flex flex-col">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 1)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={1}
                    ></QuizCircle>
                </div>
            </div>
            <div className="flex w-full [&>div]:mx-auto">
                <div className="flex flex-col [&>*]:mt-[100px]">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 2)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={2}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 3)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={3}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 4)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={4}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 5)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={5}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 6)[0] : null}
                        area="ari"
                        subject="mat"
                        type={1}
                        linksTo={6}
                    ></QuizCircle>
                </div>
                <div className="flex flex-col [&>*]:mt-[100px]">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 7)[0] : null}
                        area="raz"
                        subject="mat"
                        type={1}
                        linksTo={7}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 8)[0] : null}
                        area="raz"
                        subject="mat"
                        type={1}
                        linksTo={8}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 9)[0] : null}
                        area="raz"
                        subject="mat"
                        type={1}
                        linksTo={9}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 10)[0] : null}
                        area="raz"
                        subject="mat"
                        type={1}
                        linksTo={10}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 11)[0] : null}
                        area="raz"
                        subject="mat"
                        type={1}
                        linksTo={11}
                    ></QuizCircle>
                </div>
            </div>
        </>
    );
}

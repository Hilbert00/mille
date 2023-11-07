import QuizCircle from "../quizCircle";

export default function NatChemistry(props: { data: any[] }) {
    return (
        <>
            <div className="mt-8 flex w-full [&>div]:mx-auto">
                <div className="flex flex-col [&>*]:mb-[100px]">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 1)[0] : null}
                        area="sol"
                        subject="nat"
                        type={7}
                        linksTo={1}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 2)[0] : null}
                        area="sol"
                        subject="nat"
                        type={7}
                        linksTo={2}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 3)[0] : null}
                        area="sol"
                        subject="nat"
                        type={7}
                        linksTo={3}
                    ></QuizCircle>
                </div>
            </div>
            <div className="flex w-full [&>div]:mx-auto">
                <div className="flex flex-col [&>*]:mb-[100px]">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 4)[0] : null}
                        area="org"
                        subject="nat"
                        type={7}
                        linksTo={4}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 5)[0] : null}
                        area="org"
                        subject="nat"
                        type={7}
                        linksTo={5}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 6)[0] : null}
                        area="elq"
                        subject="nat"
                        type={7}
                        linksTo={6}
                        style={{ margin: "0px" }}
                    ></QuizCircle>
                </div>
                <div className="flex flex-col [&>*]:mb-[100px]">
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 7)[0] : null}
                        area="ino"
                        subject="nat"
                        type={7}
                        linksTo={7}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 8)[0] : null}
                        area="ino"
                        subject="nat"
                        type={7}
                        linksTo={8}
                    ></QuizCircle>
                    <QuizCircle
                        data={Array.isArray(props.data) ? props.data.filter((e: any) => e.id === 9)[0] : null}
                        area="elq"
                        subject="nat"
                        type={7}
                        linksTo={9}
                        style={{ margin: "0px" }}
                    ></QuizCircle>
                </div>
            </div>
        </>
    );
}

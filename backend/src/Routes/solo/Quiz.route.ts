import * as UserHelper from "../../Helpers/UserID.helper.js";
import { Router } from "express";
import conn from "../../Config/Database.config.js";
import queryPromise from "../../Helpers/QueryPromise.helper.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";
import verifysubject from "../../Middlewares/Subject.middleware.js";

// INTERFACES
interface DataProps {
    id: number;
    questions: {
        id: number;
        alternatives: {
            available: number[];
            correct: number;
            answered: 0;
        };
    }[];
    done: number;
}

const router = Router();

router.post("/create", verifyToken, verifysubject, async (req, res) => {
    const { area } = req.body;
    const { quizType } = req.body;
    const { quizNumber } = req.body;
    const questionQuantity = req.body.questionQuantity ?? 5;

    async function getQuestions() {
        const query = `SELECT id_question FROM question WHERE id_area = ${area}`;

        try {
            const q: any = await queryPromise(query);
            const questions = JSON.parse(JSON.stringify(Object.values(q)));
            return questions;
        } catch (err) {
            throw err;
        }
    }

    async function getAlternatives(index: number) {
        const query = `SELECT a.id_alternative, a.correct FROM question AS q JOIN alternative AS a ON q.id_question = a.id_question WHERE q.id_question = ${index}`;

        try {
            const al: any = await queryPromise(query);
            const alternatives: { [key: string]: string | number }[] = JSON.parse(JSON.stringify(Object.values(al)));

            return alternatives;
        } catch (err) {
            throw err;
        }
    }

    async function getQObjects(questions: { [key: string]: string | number }[]) {
        const array: number[] = Object.values(questions)
            .map((e: any) => {
                return e.id_question;
            })
            .sort(() => 0.5 - Math.random())
            .slice(0, questionQuantity);

        // DELETE IN THE FUTURE
        if (array.length < questionQuantity) {
            const newArray = Array(questionQuantity)
                .fill([...array])
                .flat()
                .slice(0, questionQuantity);

            const qObjects = await Promise.all(
                newArray.map(async (e) => {
                    const questionData = {
                        id: e,
                        alternatives: await getAlternatives(e),
                    };

                    return questionData;
                })
            );

            return qObjects;
        }
        // END OF DELETE AREA

        const qObjects = await Promise.all(
            array.map(async (e) => {
                const questionData = {
                    id: e,
                    alternatives: await getAlternatives(e),
                };

                return questionData;
            })
        );

        return qObjects;
    }

    const questions = await getQuestions();

    const resultQuestions = await getQObjects(questions);

    const userID = await UserHelper.getUserID(req.user.username);

    const availableAnswers = resultQuestions.map((e) => {
        return e.alternatives.map((a) => a.id_alternative);
    });

    const rightAnswers = resultQuestions.map((e) => {
        const answerArray = e.alternatives.map((a) => {
            if (a.correct == 1) return a.id_alternative;
        });

        return answerArray.filter((a) => typeof a === "number")[0];
    });

    const quizData: { [key: string]: any } = {};

    quizData.done = 0;
    quizData.questions = resultQuestions.map((e, i) => {
        return {
            id: e.id,
            alternatives: { available: availableAnswers[i], correct: rightAnswers[i], answered: 0 },
        };
    });

    const quizCreateQuery = "INSERT INTO quiz (id_user, quiz_type, quiz_number, data) VALUES (?, ?, ?, ?)";
    const quizCreateData = [userID, quizType, quizNumber, JSON.stringify(quizData)];

    conn.query(quizCreateQuery, quizCreateData, (err) => {
        if (err) {
            return res.sendStatus(404);
        }

        return res.json({ message: "success", data: quizData });
    });
});

router.get("/:type", verifyToken, async (req, res) => {
    const quizType = req.params.type;
    const quizID = req.query.num;
    const parsed = typeof req.query.parsed === "undefined" ? true : req.query.parsed === "true";
    const typeArray = typeof req.query.typeArray === "undefined" ? false : String(req.query.typeArray).split(",");

    async function getData() {
        const userID = await UserHelper.getUserID(req.user.username);

        async function tryQuerie(query: string) {
            try {
                const d: any = await queryPromise(query);
                const data: { [data: string]: string }[] = JSON.parse(JSON.stringify(d));
                const dataParsed: DataProps[] = data.map((e) => {
                    const jsonData = JSON.parse(e.data);
                    return { id: Number(e.quiz_number), done: jsonData.done, questions: jsonData.questions };
                });

                return dataParsed;
            } catch (err) {
                throw err;
            }
        }

        if (typeArray) {
            return await tryQuerie(`SELECT data FROM quiz WHERE id_user = ${userID} AND quiz_type IN (${typeArray})`);
        }

        if (quizType && quizID) {
            const result = await tryQuerie(
                `SELECT data, quiz_number FROM quiz WHERE id_user = ${userID} AND quiz_type = ${quizType} and quiz_number = ${quizID}`
            );
            return result[0];
        } else if (quizType) {
            return await tryQuerie(
                `SELECT data, quiz_number FROM quiz WHERE id_user = ${userID} AND quiz_type = ${quizType}`
            );
        }

        return {} as DataProps[];
    }

    async function getQuestion(id: number) {
        const query = `SELECT q.text, i.image_url FROM question AS q LEFT JOIN image AS i ON q.id_question = i.id_question WHERE q.id_question = ${id}`;

        try {
            const q: any = await queryPromise(query);
            const question = JSON.parse(JSON.stringify(q[0]));
            return question;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async function getAlternatives(id: number) {
        const query = `SELECT text, image_url FROM alternative WHERE id_alternative = ${id}`;

        try {
            const al: any = await queryPromise(query);
            const alternatives = JSON.parse(JSON.stringify(al[0]));
            return alternatives;
        } catch (err) {
            throw err;
        }
    }

    async function getQObjects(data: DataProps) {
        const qObjects = await Promise.all(
            data.questions.map(async (e) => {
                const availableAlternatives = await Promise.all(
                    e.alternatives.available.map(async (e) => {
                        const alt = await getAlternatives(e);
                        return {
                            id: e,
                            text: alt.text,
                            image_url: alt.image_url,
                        };
                    })
                );

                const question = await getQuestion(e.id);
                const questionData = {
                    id: e.id,
                    text: question.text,
                    image_url: question.image_url,
                    alternatives: {
                        available: availableAlternatives,
                        answered: e.alternatives.answered,
                        correct: e.alternatives.correct,
                    },
                };
                return questionData;
            })
        );
        return { id: data.id, done: data.done, questions: qObjects };
    }

    try {
        const baseData: any = await getData();

        if (!parsed || typeArray) return res.json(baseData);

        if (quizID) {
            const finalResult: any = await getQObjects(baseData as DataProps);
            return res.json(finalResult);
        } else {
            const multipleData = baseData as DataProps[];
            const finalResult = await Promise.all(multipleData.map((e) => getQObjects(e)));
            return res.json(finalResult);
        }
    } catch (err) {
        return res.sendStatus(204);
    }
});

router.put("/update", verifyToken, async (req, res) => {
    const { quizType } = req.body;
    const { quizNumber } = req.body;
    const { data } = req.body;
    const userID = await UserHelper.getUserID(req.user.username);

    try {
        const query = `UPDATE quiz SET ?? = ? WHERE ?? = ? AND ?? = ? AND ?? = ?`;
        const queryData = ["data", data, "id_user", userID, "quiz_type", quizType, "quiz_number", quizNumber];

        conn.query(query, queryData, (err) => {
            if (err) console.log(err);

            return res.json({ message: "data updated" });
        });
    } catch (err) {
        return res.sendStatus(500);
    }
});

export default router;

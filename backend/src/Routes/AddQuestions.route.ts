import { Router } from "express";
import queryPromise from "../Helpers/QueryPromise.helper.js";

const router = Router();

router.post("/add", async (req, res) => {
    const data: {
        subject: number;
        image: string;
        year: number;
        question: string;
        answer: {
            alternatives: {
                A: string;
                B: string;
                C: string;
                D: string;
                E: string;
            };
            right: "A" | "B" | "C" | "D" | "E";
        };
    }[] = req.body.data;

    const getIdQuery = "SELECT id_question FROM question ORDER BY id_question DESC LIMIT 1";

    let lastId = JSON.parse(JSON.stringify(await queryPromise(getIdQuery)))[0].id_question;

    for (const e of data) {
        const questionQuery = `INSERT INTO question (text, id_area) VALUES ("(ENEM ${e.year}) ${e.question}", ${e.subject});`;

        await queryPromise(questionQuery);
        lastId++;

        const imageQuery = e.image
            ? `INSERT INTO image (image_url, id_question) VALUES ("${e.image}", ${lastId});`
            : "SELECT 1;";

        await queryPromise(imageQuery);

        await Object.keys(e.answer.alternatives).reduce(async (previous, curr) => {
            await previous;

            const alternativeQuery = `INSERT INTO alternative (text, correct, id_question) VALUES ('${
                e.answer.alternatives[curr]
            }', ${Number(curr === e.answer.right)}, ${lastId});`;

            await queryPromise(alternativeQuery);
        }, Promise.resolve());
    }

    return res.sendStatus(200);
});

export default router;

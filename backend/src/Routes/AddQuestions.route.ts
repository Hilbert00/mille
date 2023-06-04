import { Router } from "express";
import conn from "../Config/Database.config.js";
import queryPromise from "../Helpers/QueryPromise.helper.js";

const router = Router();

router.post("/add", async (req, res) => {
    const { data } = req.body;
    const { year } = req.body;

    const getIdQuery = "SELECT id_question FROM question ORDER BY id_question DESC LIMIT 1";

    let lastId = JSON.parse(JSON.stringify(await queryPromise(getIdQuery)))[0].id_question;

    data.forEach(async (el: any) => {
        const questionQuery = `INSERT INTO question (text, id_area) VALUES ("(ENEM ${year}) ${el.question}", ${el.subject})`;

        await JSON.parse(JSON.stringify(await queryPromise(questionQuery)));
        lastId++;

        Object.keys(el.answer.alternatives).forEach(async (e: any) => {
            const alternativeQuery = `INSERT INTO alternative (text, correct, id_question) VALUES ('${
                el.answer.alternatives[e]
            }', ${Number(e === el.answer.right)}, ${lastId})`;

            await JSON.parse(JSON.stringify(await queryPromise(alternativeQuery)));
        });
    });

    return res.sendStatus(200);
});

export default router;

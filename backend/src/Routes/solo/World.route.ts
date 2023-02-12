import { Router } from "express";

import queryPromise from "../../Helpers/QueryPromise.helper.js";
import * as UserHelper from "../../Helpers/UserID.helper.js";

// MIDDLEWARES
import verifysubject from "../../Middlewares/Subject.middleware.js";
import verifyToken from "../../Middlewares/Auth.middleware.js";

const router = Router();

interface DataProps {
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

interface WorldDataProps {
    area_id: number | number[];
    area_name: string | string[];
    type_id: number;
    type_description: string;
    type_name: string;
    [key: string]: any;
}

router.get("/:subject", verifysubject, async (req, res) => {
    const q = await queryPromise(
        `SELECT t.id_type AS type_id, t.name AS type_name, t.description AS type_description, a.id_area as area_id, a.name AS area_name FROM type AS t JOIN area AS a ON t.id_type = a.type WHERE a.id_subject = ${req.params.subject}`
    );

    const quizTypes = q as WorldDataProps[];

    const typeIDS = [...new Set(quizTypes.map((e) => e.type_id))];

    const quizTypesMerged = typeIDS.map((e) => {
        const types = quizTypes.filter((f) => f.type_id === e);
        const typesReduced = types.reduce((old, cur) => {
            const merge = {
                type_id: cur.type_id,
                type_name: cur.type_name,
                type_description: cur.type_description,
                area_id: [old.area_id, cur.area_id].flat(),
                area_name: [old.area_name, cur.area_name].flat(),
            };

            return merge;
        });
        return typesReduced;
    });

    return res.json(JSON.parse(JSON.stringify(quizTypesMerged)));
});

router.get("/", async (req, res) => {
    const worlds = await queryPromise(`SELECT * FROM subject`);

    return res.json(JSON.parse(JSON.stringify(worlds)));
});

export default router;

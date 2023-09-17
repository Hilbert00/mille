import { Router } from "express";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";

// INTERFACES
interface answer {
    id_answer: number;
    id_user: number;
    username: string;
    content: string;
    is_best: 0 | 1;
    reply_to: number;
    votes: number;
    user_vote: 0 | -1 | 1;
    create_time: string;
    replies: answer[];
}

const router = Router();

router.get("/answers", verifyToken, (req, res) => {
    if (!req.query.id) return res.sendStatus(404);

    const query = `SELECT a.id_answer, u.id AS id_user, u.username, a.content, a.is_best, a.reply_to, COALESCE(av.votes, 0) AS votes, COALESCE(av2.value, 0) AS user_vote, a.create_time FROM answer AS a JOIN user AS u ON a.id_user = u.id LEFT JOIN (SELECT id_answer, COALESCE(SUM(av.value), 0) AS votes FROM answer_vote AS av GROUP BY av.id_answer) av ON a.id_answer = av.id_answer LEFT JOIN answer_vote AS av2 ON av2.id_answer = a.id_answer AND av2.id_user = ${req.user.id} WHERE NOT EXISTS (SELECT ar.id_report FROM answer_report AS ar WHERE (a.id_answer = ar.id_answer OR a.reply_to = ar.id_answer) AND ar.status = 1) AND a.id_post = ${req.query.id} GROUP BY a.id_answer ORDER BY a.is_best DESC, votes DESC;`;

    conn.query(query, (err, result) => {
        if (err) console.error(err);

        const parsedResult = JSON.parse(JSON.stringify(result)).filter((e: any) => e.id_answer) as answer[];

        const organizedResult = parsedResult
            .filter((e) => e.reply_to === null)
            .map((e) => {
                e.replies = parsedResult
                    .filter((e2) => e2.reply_to === e.id_answer)
                    .sort((x, y) => {
                        return new Date(x.create_time) > new Date(y.create_time) ? 1 : -1;
                    });
                delete e.reply_to;
                return e;
            });

        return res.json(organizedResult);
    });
});

router.post("/answer", verifyToken, (req, res) => {
    if (!req.body.content || !req.body.postID) return res.sendStatus(404);

    const query = req.body.replyID
        ? `INSERT INTO answer (content, id_post, id_user, reply_to) VALUES ("${req.body.content}", ${req.body.postID}, ${req.user.id}, ${req.body.replyID});`
        : `INSERT INTO answer (content, id_post, id_user) VALUES ("${req.body.content}", ${req.body.postID}, ${req.user.id});`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);

        const query = `SELECT a.id_answer, u.id AS id_user, u.username, a.content, a.is_best, a.reply_to, COALESCE(av.votes, 0) AS votes, COALESCE(av2.value, 0) AS user_vote, a.create_time FROM answer AS a JOIN user AS u ON a.id_user = u.id LEFT JOIN (SELECT id_answer, COALESCE(SUM(av.value), 0) AS votes FROM answer_vote AS av GROUP BY av.id_answer) av ON a.id_answer = av.id_answer LEFT JOIN answer_vote AS av2 ON av2.id_answer = a.id_answer AND av2.id_user = ${req.user.id} WHERE a.id_post = ${req.body.postID} GROUP BY a.id_answer ORDER BY a.is_best DESC, votes DESC;`;

        conn.query(query, (err, result) => {
            if (err) console.error(err);

            const parsedResult = JSON.parse(JSON.stringify(result)).filter((e: any) => e.id_answer) as answer[];
            const organizedResult = parsedResult
                .filter((e) => e.reply_to === null)
                .map((e) => {
                    e.replies = parsedResult
                        .filter((e2) => e2.reply_to === e.id_answer)
                        .sort((x, y) => {
                            return new Date(x.create_time) > new Date(y.create_time) ? 1 : -1;
                        });
                    delete e.reply_to;
                    return e;
                });

            return res.json(organizedResult);
        });
    });
});

router.post("/answer/like", verifyToken, (req, res) => {
    if (req.body.answerID === undefined || req.body.postID === undefined || req.body.value === undefined)
        return res.sendStatus(404);

    const query =
        req.body.value !== 0
            ? `INSERT INTO answer_vote (value, id_user, id_answer) VALUES (${req.body.value}, ${req.user.id}, ${req.body.answerID}) ON DUPLICATE KEY UPDATE value = ${req.body.value};`
            : `DELETE FROM answer_vote WHERE id_answer = ${req.body.answerID} AND id_user = ${req.user.id};`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

router.post("/answer/like", verifyToken, (req, res) => {
    if (req.body.answerID === undefined || req.body.value === undefined) return res.sendStatus(404);

    const query =
        req.body.value !== 0
            ? `INSERT INTO answer_vote (value, id_user, id_answer) VALUES (${req.body.value}, ${req.user.id}, ${req.body.answerID}) ON DUPLICATE KEY UPDATE value = ${req.body.value};`
            : `DELETE FROM answer_vote WHERE id_answer = ${req.body.answerID} AND id_user = ${req.user.id};`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

router.post("/answer/report", verifyToken, (req, res) => {
    if (req.body.answerID === undefined || req.body.description === undefined) return res.sendStatus(404);

    const query = `INSERT INTO answer_report (id_answer, description) VALUES (${req.body.answerID}, "${req.body.description}");`;
    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

router.put("/answer/best", verifyToken, (req, res) => {
    if (req.body.answerID === undefined || req.body.postID === undefined || req.body.value === undefined)
        return res.sendStatus(404);

    const query = req.body.value
        ? `UPDATE answer SET is_best = CASE WHEN id_answer = ${req.body.answerID} THEN 1 ELSE 0 END WHERE id_post = ${req.body.postID};`
        : `UPDATE answer SET is_best = 0 WHERE id_answer = ${req.body.answerID};`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

export default router;

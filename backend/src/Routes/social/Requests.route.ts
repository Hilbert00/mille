import { Router } from "express";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";
import verifyRole from "../../Middlewares/Role.middleware.js";

const router = Router();

router.get("/requests", verifyToken, verifyRole, (req, res) => {
    const query =
        "SELECT br.id_request, br.status, u.id AS user_id, u.picture AS user_picture, u.username, u.user_behavior, br.create_time FROM ban_request AS br LEFT JOIN answer_report AS ar ON br.id_reportAnswer = ar.id_report LEFT JOIN answer AS a ON a.id_answer = ar.id_answer LEFT JOIN post_report AS pr ON br.id_reportPost = pr.id_report LEFT JOIN post AS p ON p.id_post = pr.id_post LEFT JOIN user AS u ON u.id = a.id_user OR u.id = p.id_user WHERE br.status = 0;";

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = JSON.parse(JSON.stringify(result));

        return res.json(result);
    });
});

router.get("/request", verifyToken, verifyRole, (req, res) => {
    if (req.query.id === undefined) return res.sendStatus(404);

    const query = `SELECT br.id_request, br.status, u.id AS user_id, u.picture AS user_picture, u.username, u.user_behavior, a.content AS answer_content, p.title AS post_title, p.description AS post_content, COALESCE(ar.description, pr.description) AS reason, COALESCE(ar.create_time, pr.create_time) AS create_time, br.create_time AS requested_at FROM ban_request AS br LEFT JOIN answer_report AS ar ON br.id_reportAnswer = ar.id_report LEFT JOIN answer AS a ON a.id_answer = ar.id_answer LEFT JOIN post_report AS pr ON br.id_reportPost = pr.id_report LEFT JOIN post AS p ON p.id_post = pr.id_post LEFT JOIN user AS u ON u.id = a.id_user OR u.id = p.id_user WHERE br.id_request = ${req.query.id} AND br.status = 0;`;
    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = result.length ? JSON.parse(JSON.stringify(result[0])) : {};
        return res.json(result);
    });
});

router.put("/request/status", verifyToken, verifyRole, (req, res) => {
    if (
        req.body.userId === undefined ||
        (req.body.requestId === undefined && !req.body.direct) ||
        (req.body.value === undefined && !req.body.direct)
    )
        return res.sendStatus(404);

    if (req.body.direct) {
        const query = `INSERT INTO banned (user_id) VALUES (${req.body.userId});`;
        conn.query(query, (err, _result) => {
            if (err) console.error(err);
            return res.sendStatus(200);
        });
    } else {
        const query = `UPDATE ban_request SET status = CASE WHEN id_request = ${req.body.requestId} THEN ${
            Number(req.body.value) ? 1 : 2
        } ELSE 3 END WHERE EXISTS (SELECT * FROM answer_report AS ar JOIN answer AS a ON ar.id_answer = a.id_answer JOIN user AS u ON a.id_user = u.id AND u.id = ${
            req.body.userId
        }) OR EXISTS (SELECT * FROM post_report AS pr JOIN post AS p ON pr.id_post = p.id_post JOIN user AS u ON p.id_user = u.id AND u.id = ${
            req.body.userId
        });`;

        conn.query(query, (err, _result) => {
            if (err) console.error(err);

            if (req.body.value === 1) {
                const query = `INSERT INTO banned (user_id) VALUES (${req.body.userId});`;
                conn.query(query, (err, _result) => {
                    if (err) console.error(err);
                    return res.sendStatus(200);
                });
            } else return res.sendStatus(200);
        });
    }
});

router.post("/request/create", verifyToken, verifyRole, (req, res) => {
    if (req.body.id === undefined || req.body.isPost === undefined) return res.sendStatus(404);

    const query = `INSERT INTO ban_request (id_report${req.body.isPost ? "Post" : "Answer"}) VALUES (${req.body.id});`;
    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

export default router;

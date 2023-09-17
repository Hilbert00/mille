import { Router } from "express";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/posts", verifyToken, (req, res) => {
    if (!req.query.subject) return res.sendStatus(404);

    const sortRecent = (function () {
        switch (Number(req.query.recent)) {
            case -1:
                return "ORDER BY p.create_time";
            case 1:
                return "ORDER BY p.create_time DESC";
            default:
                return "ORDER BY votes DESC";
        }
    })();

    const showSolved = (function () {
        switch (Number(req.query.solved)) {
            case -1:
                return "AND COALESCE(a3.is_best, 0) = 0";
            case 1:
                return "AND COALESCE(a3.is_best, 0) = 1";
            default:
                return "";
        }
    })();

    const sortArea = (function () {
        if (!Number(req.query.area)) return "";

        return `AND a.id_area = ${req.query.area}`;
    })();

    const query = `SELECT p.id_post, u.id AS id_user, u.username, p.title, p.description, a.name AS area_name, COALESCE(a3.is_best, 0) AS solved, COUNT(DISTINCT a2.id_answer) AS answers, COALESCE(pv.votes, 0) AS votes, COALESCE(pv2.value, 0) AS user_vote, p.create_time FROM post AS p JOIN user AS u ON p.id_user = u.id JOIN area AS a ON p.id_area = a.id_area LEFT JOIN (SELECT pv.id_post, COALESCE(SUM(pv.value), 0) AS votes FROM post_vote AS pv GROUP BY pv.id_post) pv ON p.id_post = pv.id_post LEFT JOIN post_vote AS pv2 ON pv2.id_user = ${req.user.id} AND pv2.id_post = p.id_post LEFT JOIN answer AS a2 ON p.id_post = a2.id_post LEFT JOIN answer AS a3 ON p.id_post = a3.id_post AND a3.is_best = 1 WHERE NOT EXISTS (SELECT pr.id_report FROM post_report AS pr WHERE p.id_post = pr.id_post AND pr.status = 1) AND a.id_subject = ${req.query.subject} ${showSolved} ${sortArea} GROUP BY p.id_post ${sortRecent};`;

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = JSON.parse(JSON.stringify(result));
        return res.json(result);
    });
});

router.get("/post", verifyToken, (req, res) => {
    if (!req.query.id) return res.sendStatus(404);

    const query = `SELECT p.id_post, u.id AS id_user, u.username, p.title, p.description, a.name AS area_name, COALESCE(a3.is_best, 0) AS solved, COUNT(DISTINCT a2.id_answer) AS answers, COALESCE(pv.votes, 0) AS votes, COALESCE(pv2.value, 0) AS user_vote, p.create_time FROM post AS p JOIN user AS u ON p.id_user = u.id JOIN area AS a ON p.id_area = a.id_area LEFT JOIN (SELECT pv.id_post, COALESCE(SUM(pv.value), 0) AS votes FROM post_vote AS pv GROUP BY pv.id_post) pv ON p.id_post = pv.id_post LEFT JOIN post_vote AS pv2 ON pv2.id_user = ${req.user.id} AND pv2.id_post = p.id_post LEFT JOIN answer AS a2 ON p.id_post = a2.id_post LEFT JOIN answer AS a3 ON p.id_post = a3.id_post AND a3.is_best = 1 WHERE p.id_post = ${req.query.id} GROUP BY p.id_post;`;

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = result.length ? JSON.parse(JSON.stringify(result[0])) : {};
        return res.json(result);
    });
});

router.post("/post", verifyToken, (req, res) => {
    if (!req.body.title || !req.body.content || !req.body.area) return res.sendStatus(404);

    const query = `INSERT INTO post (title, description, id_user, id_area) VALUES ("${req.body.title}", "${req.body.content}", ${req.user.id}, ${req.body.area});`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

router.post("/post/like", verifyToken, (req, res) => {
    if (req.body.postID === undefined || req.body.value === undefined) return res.sendStatus(404);

    const query =
        req.body.value !== 0
            ? `INSERT INTO post_vote (value, id_user, id_post) VALUES (${req.body.value}, ${req.user.id}, ${req.body.postID}) ON DUPLICATE KEY UPDATE value = ${req.body.value};`
            : `DELETE FROM post_vote WHERE id_post = ${req.body.postID} AND id_user = ${req.user.id};`;

    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

router.post("/post/report", verifyToken, (req, res) => {
    if (req.body.postID === undefined || req.body.description === undefined) return res.sendStatus(404);

    const query = `INSERT INTO post_report (id_post, description) VALUES (${req.body.postID}, "${req.body.description}");`;
    conn.query(query, (err, _result) => {
        if (err) console.error(err);
        return res.sendStatus(200);
    });
});

export default router;

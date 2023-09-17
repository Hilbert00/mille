import { Router } from "express";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";
import verifyRole from "../../Middlewares/Role.middleware.js";

const router = Router();

router.get("/reports", verifyToken, verifyRole, (req, res) => {
    const query =
        "SELECT pr.id_report, pr.description, pr.status, pr.id_post AS report_of, 1 AS is_post, create_time FROM post_report AS pr WHERE status = 0 UNION SELECT ar.id_report, ar.description, ar.status, ar.id_answer AS report_of, 0 AS is_post, create_time FROM answer_report AS ar WHERE status = 0;";

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = JSON.parse(JSON.stringify(result));
        return res.json(result);
    });
});

router.get("/report", verifyToken, verifyRole, (req, res) => {
    if (req.query.id === undefined || req.query.isPost === undefined) return res.sendStatus(404);

    const query =
        req.query.isPost === "true"
            ? `SELECT pr.id_report, pr.description AS reason, 1 AS is_post, pr.status, p.id_post, u.id AS id_user, u.username, u.user_behavior, p.title, p.description, p.create_time AS post_created, pr.create_time AS report_time FROM post_report AS pr JOIN post AS p ON pr.id_post = p.id_post JOIN user AS u ON p.id_user = u.id WHERE pr.id_report = ${req.query.id} AND pr.status = 0;`
            : `SELECT ar.id_report, ar.description AS reason, 0 AS is_post, ar.status, a.id_answer, u.id AS id_user, u.username, u.user_behavior, a.content, a.create_time AS answer_created, ar.create_time AS report_time FROM answer_report AS ar JOIN answer AS a ON ar.id_answer = a.id_answer JOIN user AS u ON a.id_user = u.id WHERE ar.id_report = ${req.query.id} AND ar.status = 0;`;

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = result.length ? JSON.parse(JSON.stringify(result[0])) : {};
        return res.json(result);
    });
});

router.put("/report/status", verifyToken, verifyRole, (req, res) => {
    if (
        req.body.reportId === undefined ||
        req.body.userId === undefined ||
        req.body.isPost === undefined ||
        req.body.value === undefined ||
        req.body.behavior === undefined
    )
        return res.sendStatus(404);

    const type = req.body.isPost ? "post" : "answer";
    const query = `SELECT status, id_${type} as report_of FROM ${type}_report WHERE id_report = ${req.body.reportId};`;

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = JSON.parse(JSON.stringify(result[0]));

        if (!Number(result.status)) {
            if (req.body.isRequest) {
                const query = `UPDATE ${type}_report SET status = CASE WHEN id_report = ${req.body.reportId} THEN 3 ELSE 4 END WHERE id_${type} = ${result.report_of};`;

                conn.query(query, (err, _result) => {
                    if (err) console.error(err);
                    return res.sendStatus(200);
                });
            } else {
                const query =
                    req.body.value > 0
                        ? `UPDATE ${type}_report SET status = CASE WHEN id_report = ${req.body.reportId} THEN ${
                              req.body.value > 0 ? 1 : 2
                          } ELSE 4 END WHERE id_${type} = ${result.report_of};`
                        : `UPDATE ${type}_report SET status = ${req.body.value > 0 ? 1 : 2} WHERE id_report = ${
                              req.body.reportId
                          };`;

                conn.query(query, (err, _result) => {
                    if (err) console.error(err);

                    if (req.body.value > 0) {
                        const query = `UPDATE user SET user_behavior = ${Math.max(
                            Number(req.body.behavior) - Number(req.body.value),
                            0
                        )} WHERE id = ${req.body.userId};`;

                        conn.query(query, (err, _result) => {
                            if (err) console.error(err);
                            return res.sendStatus(200);
                        });
                    } else return res.sendStatus(200);
                });
            }
        } else return res.sendStatus(409);
    });
});

export default router;

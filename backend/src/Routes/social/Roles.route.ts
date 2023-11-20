import { Router } from "express";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";
import verifyRole from "../../Middlewares/Role.middleware.js";

const router = Router();

router.get("/roles", verifyToken, verifyRole, (req, res) => {
    const query =
        "SELECT id, username, picture AS user_picture, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_behavior FROM user AS u LEFT JOIN moderator AS m ON m.user_id = u.id WHERE active = 1 ORDER BY username;";

    conn.query(query, (err, result) => {
        if (err) console.error(err);
        result = JSON.parse(JSON.stringify(result));

        return res.json(result);
    });
});

router.post("/role/update", verifyToken, verifyRole, (req, res) => {
    if (req.body.userId === undefined || req.body.value === undefined) return res.sendStatus(404);

    const query = Number(req.body.value)
        ? `INSERT INTO moderator (type, user_id) VALUES (${req.body.value}, ${req.body.userId}) ON DUPLICATE KEY UPDATE type = ${req.body.value};`
        : `DELETE FROM moderator WHERE user_id = ${req.body.userId};`;
    conn.query(query, (err, _result) => {
        if (err) console.error(err);

        return res.sendStatus(200);
    });
});

export default router;

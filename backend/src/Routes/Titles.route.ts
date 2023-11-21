import { Router } from "express";
import conn from "../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/", verifyToken, (req, res) => {
    // @ts-ignore
    const id = req.user.id;

    const query =
        "SELECT uht.title_id, t.title FROM user_has_title AS uht JOIN title AS t ON uht.title_id = t.id_title WHERE ?? = ?;";
    const data = ["user_id", id];

    conn.query(query, data, (err, result) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404);
        }

        return res.json(result);
    });
});

router.post("/unlock", verifyToken, (req, res) => {
    let titleId = req.body.title_id;
    // @ts-ignore
    const userId = req.user.id;

    if (!titleId || titleId.length === 0) return res.sendStatus(400);

    if (titleId.length === undefined) titleId = [titleId];

    const parsedTitles = titleId.map((e: number) => {
        return ` (${userId}, ${e})`;
    });

    const query = `INSERT IGNORE INTO user_has_title VALUES${parsedTitles};`;

    conn.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404);
        }

        return res.json({ inserted: result.affectedRows > 0 });
    });
});

export default router;

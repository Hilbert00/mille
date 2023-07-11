import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.put("/", (req, res) => {
    const { username } = req.body;

    const query = "UPDATE user SET ?? = ? WHERE ?? = ?";
    const data = ["online", 0, "username", username];

    conn.query(query, data, async (err, result) => {
        if (err) console.error(err);

        if (!result) return res.sendStatus(404);

        return res.clearCookie("AuthJWT", { sameSite: "none", secure: true }).json({ message: "success" }).end();
    });
});

export default router;

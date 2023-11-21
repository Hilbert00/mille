import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import * as TokenHelper from "../../Helpers/Token.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { username, password } = req.body;

    let query =
        "SELECT u.id, password, active, username, user_level, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins FROM user as u JOIN (SELECT id FROM user AS u2) u2 ON u.id = u2.id LEFT JOIN moderator AS m ON m.user_id = u2.id WHERE ?? = ?";
    let data = ["username", username];

    conn.query(query, data, async (err, result) => {
        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) return res.sendStatus(404);

        const auth = await HashHelper.verifyHash(result.password, password);

        if (!auth) return res.sendStatus(401);

        const token = TokenHelper.generateUserToken(result);

        return res.json({ token });
    });
});

export default router;

import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.put("/", (req, res) => {
    const { email, password } = req.body;

    let query =
        "SELECT u.id, username, user_level, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins FROM user as u JOIN (SELECT id FROM user AS u2) u2 ON u.id = u2.id LEFT JOIN moderator AS m ON m.user_id = u2.id WHERE ?? = ?";
    let data = ["email", email];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.error(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.sendStatus(404);
        }

        const newPass = await HashHelper.getHash(password);

        query = "UPDATE user SET ?? = ? WHERE ?? = ?";
        data = ["password", newPass, "email", email];

        conn.query(query, data, (err) => {
            if (err) {
                console.error(err);
            }

            return res.json(result);
        });
    });
});

export default router;

import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const userName: string = req.body.username;
    const email: string = req.body.email;
    const password = await HashHelper.getHash(req.body.password);

    let query = `INSERT INTO users (??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, 1, 0, 0, 0, 0)`;
    let data = [
        "username",
        "email",
        "password",
        "user_level",
        "user_EXP",
        "challenge_matches",
        "challenge_wins",
        "user_type",
        userName,
        email,
        password,
    ];

    conn.query(query, data, (err) => {
        if (err) {
            console.log(err);
        }

        query = "SELECT * FROM users WHERE ?? = ?";
        data = ["username", userName];

        conn.query(query, data, async (err, result) => {
            if (err) {
                console.log(err);
            }

            result = JSON.parse(JSON.stringify(result))[0];

            const token = TokenHelper.signToken({
                userName: result.username,
                userLevel: result.user_level,
                userEXP: result.user_EXP,
                challengeMatches: result.challenge_matches,
                challengeWins: result.challenge_wins,
            });

            return res.json({ created: userName, token });
        });
    });
});

export default router;

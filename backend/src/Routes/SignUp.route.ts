import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const firstName: string = req.body.first_name;
    const lastName: string = req.body.last_name;
    const userName: string = req.body.user_name;
    const password = await HashHelper.getHash(req.body.password);
    const userLevel: string = req.body.user_level;
    const userEXP: string = req.body.user_EXP;
    const challengeMatches: string = req.body.challenge_matches;
    const challengeWins: string = req.body.challenge_wins;

    let query = `INSERT INTO users (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, 1, 0, 0, 0, 0)`;
    let data = [
        "first_name",
        "last_name",
        "user_name",
        "password",
        "user_level",
        "user_EXP",
        "challenge_matches",
        "challenge_wins",
        "user_type",
        firstName,
        lastName,
        userName,
        password,
        userLevel,
        userEXP,
        challengeMatches,
        challengeWins,
    ];

    conn.query(query, data, (err) => {
        if (err) {
            console.log(err);
        }
    });

    query = "SELECT * FROM users WHERE ?? = ?";
    data = ["user_name", userName];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.log(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        const token = TokenHelper.signToken({
            firstName: result.first_name,
            lastName: result.last_name,
            userName: result.user_name,
            userLevel: result.user_level,
            userEXP: result.user_EXP,
            challengeMatches: result.challenge_matches,
            challengeWins: result.challenge_wins,
        });

        return res.json({ created: userName, token });
    });
});

export default router;

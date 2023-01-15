import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";

import { serialize } from "cookie";

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

        conn.query(query, data, (err, result) => {
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

            const serialized = serialize("AuthJWT", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });

            res.setHeader("Set-Cookie", serialized);
            res.status(200).json({ message: "success" });
        });
    });
});

export default router;

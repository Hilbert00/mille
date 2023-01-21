import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as CookieHelper from "../Helpers/Cookie.helper.js";
import conn from "../Config/Database.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password = await HashHelper.getHash(req.body.password);

    let query = `INSERT INTO users (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, 1, 0, 0, 100, 0, 0, 0, 0)`;
    let data = [
        "username",
        "email",
        "password",
        "user_level",
        "user_EXP",
        "user_coins",
        "user_behavior",
        "user_sequence",
        "challenge_matches",
        "challenge_wins",
        "user_type",
        username,
        email,
        password,
    ];

    conn.query(query, data, (err) => {
        if (err) {
            console.error(err);
            return res.status(409).json({ message: "username or email already in use" });
        }

        query = "SELECT * FROM users WHERE ?? = ?";
        data = ["username", username];

        conn.query(query, data, (err, result) => {
            if (err) {
                console.error(err);
            }

            result = JSON.parse(JSON.stringify(result))[0];

            const cookie = CookieHelper.generateUserCookie(result);

            res.setHeader("Set-Cookie", cookie);
            res.status(200).json({ message: "success" });
        });
    });
});

export default router;

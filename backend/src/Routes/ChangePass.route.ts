import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";
import { serialize } from "cookie";

const router = express.Router();

router.post("/", (req, res) => {
    const { username, email, password } = req.body;
     
    let query = "SELECT * FROM users WHERE ?? = ? AND ?? = ?";
    let data = ["username", username, "email", email];
    
    conn.query(query, data, async (err, result) => {
        if (err) {
            console.log(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPass = await HashHelper.getHash(password);

        query = "UPDATE users SET ?? = ? WHERE ?? = ?";
        data = ["password", newPass, "username", username];

        conn.query(query, data, (err) => {
            if (err) {
                console.log(err);
            }

            const token = TokenHelper.signToken({
                username: result.username,
                userLevel: result.user_level,
                userEXP: result.user_EXP,
                challengeMatches: result.challenge_matches,
                challengeWins: result.challenge_wins,
            });

            const serialized = serialize("AuthJWT", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(process.env.COOKIE_EXPIRE),
                path: "/",
            });

            res.setHeader("Set-Cookie", serialized);
            res.status(200).json({ message: "success" });
        });
    });
});

export default router;

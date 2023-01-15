import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";
import { serialize } from "cookie";

// MIDDLEWARES
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const router = express.Router();

router.get("/test", verifyToken, (req, res) => {
    return res.json({ status: "accepted" });
});

router.post("/", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE ?? = ?";
    const data = ["username", username];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.log(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        const auth = await HashHelper.verifyHash(result.password, password);

        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

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

export default router;

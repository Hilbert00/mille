import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as TokenHelper from "../Helpers/Token.helper.js";
import conn from "../Config/Database.config.js";

// MIDDLEWARES
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const router = express.Router();

router.get("/test", verifyToken, (req, res) => {
    return res.json({ status: "accepted" });
});

router.post("/", (req, res) => {
    const { user_name, password } = req.body;

    const query = "SELECT * FROM users WHERE ?? = ?";
    const data = ["user_name", user_name];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.log(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.status(404).json({ result: "user not found" });
        }

        const auth = await HashHelper.verifyHash(result.password, password);

        if (!auth) {
            return res.status(401).json({ result: "wrong password" });
        }

        const token = TokenHelper.signToken(
            {
                userName: result.user_name,
                userLevel: result.user_level,
                userEXP: result.user_EXP,
                challengeMatches: result.challenge_matches,
                challengeWins: result.challenge_wins,
            }
        );

        return res.json({ token });
    });
});

export default router;

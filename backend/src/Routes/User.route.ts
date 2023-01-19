import { Router } from "express";
import conn from "../Config/Database.config.js";
import * as TokenHelper from "../Helpers/Token.helper.js";

// MIDDLEWARES
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/@:user", verifyToken, (req, res) => {
    const userToken = req.user;
    const userParams = req.params.user;

    if (userToken.username !== userParams) {
        const query = "SELECT username, challenge_matches, challenge_wins, user_level FROM users WHERE ?? = ?";
        const data = ["username", userParams];

        conn.query(query, data, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(404).json({ message: "user not found" });
            }

            return res.json({ ...result[0] });
        });
    } else {
        return res.json(userToken);
    }
});

export default router;

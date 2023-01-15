import { Router } from "express";
import conn from "../Config/Database.config.js";

// MIDDLEWARES
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/@:user", verifyToken, (req, res) => {
    const userName = req.params.user;

    if (userName === req.params.user) {
        const query = "SELECT username, challenge_matches, challenge_wins, user_level FROM users WHERE ?? = ?";
        const data = ["username", userName];

        conn.query(query, data, (err, result) => {
            if (err) {
                console.log(err);
            }

            return res.json({ ...result[0] });
        });
    } else {
        return res.status(401).json({ message: "nope" });
    }
});

export default router;

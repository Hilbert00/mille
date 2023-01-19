import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as CookieHelper from "../Helpers/Cookie.helper.js";
import conn from "../Config/Database.config.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE ?? = ?";
    const data = ["username", username];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.error(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        const auth = await HashHelper.verifyHash(result.password, password);

        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cookie = CookieHelper.generateUserCookie(result);

        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ message: "success" });
    });
});

export default router;

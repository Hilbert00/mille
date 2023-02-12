import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import * as CookieHelper from "../../Helpers/Cookie.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM user WHERE ?? = ?";
    const data = ["username", username];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.error(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.sendStatus(404);
        }

        const auth = await HashHelper.verifyHash(result.password, password);

        if (!auth) {
            return res.sendStatus(401);
        }

        const cookie = CookieHelper.generateUserCookie(result);

        return res.setHeader("Set-Cookie", cookie).json({ message: "success" });
    });
});

export default router;

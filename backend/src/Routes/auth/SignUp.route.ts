import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import * as CookieHelper from "../../Helpers/Cookie.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password = await HashHelper.getHash(req.body.password);

    let query = `INSERT INTO user (??, ??, ??) VALUES (?, ?, ?)`;
    let data = ["username", "email", "password", username, email, password];

    conn.query(query, data, (_err) => {
        query = "SELECT * FROM user WHERE ?? = ?";
        data = ["username", username];

        conn.query(query, data, (err, result) => {
            if (err) {
                console.error(err);
            }

            result = JSON.parse(JSON.stringify(result))[0];

            const cookie = CookieHelper.generateUserCookie(result);

            return res.setHeader("Set-Cookie", cookie).json({ message: "success" });
        });
    });
});

export default router;

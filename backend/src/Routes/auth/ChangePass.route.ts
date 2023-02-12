import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import * as CookieHelper from "../../Helpers/Cookie.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.put("/", (req, res) => {
    const { username, email, password } = req.body;

    let query = "SELECT * FROM user WHERE ?? = ? AND ?? = ?";
    let data = ["username", username, "email", email];

    conn.query(query, data, async (err, result) => {
        if (err) {
            console.error(err);
        }

        result = JSON.parse(JSON.stringify(result))[0];

        if (!result) {
            return res.sendStatus(404);
        }

        const newPass = await HashHelper.getHash(password);

        query = "UPDATE user SET ?? = ? WHERE ?? = ?";
        data = ["password", newPass, "username", username];

        conn.query(query, data, (err) => {
            if (err) {
                console.error(err);
            }

            const cookie = CookieHelper.generateUserCookie(result);

            return res.setHeader("Set-Cookie", cookie).json({ message: "success" });
        });
    });
});

export default router;

import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import * as CookieHelper from "../Helpers/Cookie.helper.js";
import conn from "../Config/Database.config.js";

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

            const cookie = CookieHelper.generateUserCookie(result);


            res.setHeader("Set-Cookie", cookie);
            res.status(200).json({ message: "success" });
        });
    });
});

export default router;

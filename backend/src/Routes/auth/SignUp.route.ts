import * as express from "express";
import * as HashHelper from "../../Helpers/Hash.helper.js";
import conn from "../../Config/Database.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password = await HashHelper.getHash(req.body.password);

    let query = `INSERT INTO user (??, ??, ??) VALUES (?, ?, ?)`;
    let data = ["username", "email", "password", username, email, password];

    conn.query(query, data, (err) => {
        if (err) return res.sendStatus(404);
        return res.sendStatus(200);
    });
});

export default router;

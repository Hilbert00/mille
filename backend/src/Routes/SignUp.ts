import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as HashHelper from "../Helpers/Hash.helper.js";
import conn from "../Config/Database.config.js";

const router = express.Router();

router.get("/signup", (req, res) => {
    return res.send("Usuário Criado!");
});

router.post("/", async (req, res) => {
    const firstName: string = req.body.first_name;
    const lastName: string = req.body.last_name;
    const userName: string = req.body.user_name;
    const password = await HashHelper.getHash(req.body.password);
    const userLevel: string = req.body.user_level;
    const userEXP: string = req.body.user_EXP;
    const challengeMatches: string = req.body.challenge_matches;
    const challengeWins: string = req.body.challenge_wins;

    const query = `INSERT INTO users (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, 1, 0, 0, 0, 0)`;
    const data = [
        "first_name",
        "last_name",
        "user_name",
        "password",
        "user_level",
        "user_EXP",
        "challenge_matches",
        "challenge_wins",
        "user_type",
        firstName,
        lastName,
        userName,
        password,
        userLevel,
        userEXP,
        challengeMatches,
        challengeWins,
    ];

    conn.query(query, data, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

export default router;
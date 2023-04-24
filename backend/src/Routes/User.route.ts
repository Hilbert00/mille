import { Router } from "express";
import conn from "../Config/Database.config.js";
import * as CookieHelper from "../Helpers/Cookie.helper.js";

// MIDDLEWARES
import verifyToken from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/:user", verifyToken, (req, res) => {
    const userToken = req.user;
    const userParams = req.params.user;

    if (userToken.username !== userParams) {
        const query =
            "SELECT username, user_level, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins FROM user WHERE ?? = ?";
        const data = ["username", userParams];

        conn.query(query, data, (err, result) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404).json({ message: "user not found" });
            }

            return res.json({ ...result[0] });
        });
    } else {
        return res.json(userToken);
    }
});

router.get("/", verifyToken, (req, res) => {
    const userToken = req.user;
    return res.json(userToken);
});

router.put("/update", verifyToken, (req, res) => {
    const userToken = req.user;
    const requestBody: {
        username?: string;
        user_level?: number;
        user_coins?: number;
        user_behavior?: number;
        user_sequence?: number;
        challenge_matches?: number;
        challenge_wins?: number;
    } = req.body;

    if (!Object.keys(requestBody).length) return res.sendStatus(404);

    // @ts-ignore
    const updateKeys = Object.keys(requestBody).filter((e) => requestBody[e] !== undefined);
    const updateValues = updateKeys.map((e) => {
        // @ts-ignore
        if (typeof requestBody[e] === "string") return requestBody[e];

        // @ts-ignore
        if (requestBody[e] === 0) return requestBody[e];

        // @ts-ignores
        return requestBody[e] + userToken[e];
    });

    const updateData = (function () {
        const object = {} as any;

        updateKeys.map((e, i) => {
            object[e] = updateValues[i];
        });

        return object;
    })();

    const updateDataArray = (function () {
        const array = [];

        for (let i = 0; i < updateKeys.length; i++) {
            array.push(updateKeys[i]);
            array.push(updateValues[i]);
        }

        return array;
    })();

    const query = `UPDATE user SET ${updateKeys.map(() => "?? = ?").join(", ")} WHERE ?? = ?`;
    const data = [...updateDataArray, "username", userToken.username];

    conn.query(query, data, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404).json({ message: "user not found" });
        }

        delete userToken.iat;
        delete userToken.exp;
        const cookie = CookieHelper.generateUserCookie({ ...userToken, ...updateData });

        return res.setHeader("Set-Cookie", cookie).json({ message: "success" });
    });
});

export default router;

import { Router } from "express";
import conn from "../Config/Database.config.js";
import * as CookieHelper from "../Helpers/Cookie.helper.js";

// MIDDLEWARES
import verifyToken from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/:user", verifyToken, (req, res) => {
    const userToken = req.user;
    const userParams = req.params.user;

    const query =
        userToken.username === userParams
            ? "SELECT username, COALESCE(t.title, 'Novato') AS title, user_level, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins FROM user as u LEFT JOIN moderator AS m ON m.user_id = u.id LEFT JOIN title AS t ON u.active_title = t.id_title WHERE ?? = ?"
            : "SELECT u.id, username, COALESCE(t.title, 'Novato') AS title, user_level, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins, active FROM user as u LEFT JOIN moderator AS m ON m.user_id = u.id LEFT JOIN title AS t ON u.active_title = t.id_title WHERE ?? = ?";
    const data = ["username", userParams];

    conn.query(query, data, (err, result) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404).json({ message: "user not found" });
        }

        if (userToken.username === userParams) return res.json({ ...result[0], isUser: true });
        return res.json({ ...result[0] });
    });
});

router.get("/", verifyToken, (req, res) => {
    const username = req.user.username;

    const query =
        "SELECT u.id, username, COALESCE(t.title, 'Novato') AS title, user_level, COALESCE(type, 0) AS type, EXISTS (SELECT id_banned FROM banned AS b WHERE b.id_banned = u.id) AS banned, user_coins, user_behavior, user_sequence, challenge_matches, challenge_wins, active FROM user as u LEFT JOIN moderator AS m ON m.user_id = u.id LEFT JOIN title AS t ON u.active_title = t.id_title WHERE ?? = ?";
    const data = ["username", username];

    conn.query(query, data, (err, result) => {
        if (err) {
            console.error(err);
            return res.sendStatus(404);
        }

        return res.json({ ...result[0], isUser: true });
    });
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
        active_title?: number;
    } = req.body;

    if (!Object.keys(requestBody).length) return res.sendStatus(404);

    // @ts-ignore
    const updateKeys = Object.keys(requestBody).filter((e) => requestBody[e] !== undefined);
    const updateValues = updateKeys.map((e) => {
        // @ts-ignore
        if (typeof requestBody[e] === "string") return requestBody[e];

        // @ts-ignore
        if (requestBody[e] === 0) return requestBody[e];
        if (e === "active_title") if (requestBody[e] >= 0) return requestBody[e];

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
        if (err) return res.sendStatus(404);

        delete userToken.iat;
        delete userToken.exp;
        const cookie = CookieHelper.generateUserCookie({ ...userToken, ...updateData });

        return res.setHeader("Set-Cookie", cookie).json({ message: "success" });
    });
});

export default router;

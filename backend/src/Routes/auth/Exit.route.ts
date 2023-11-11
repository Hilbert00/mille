import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import verifyToken from "../../Middlewares/Auth.middleware.js";

const router = express.Router();

router.put("/", verifyToken, (_req, res) =>
    res.clearCookie("AuthJWT", { sameSite: "none", secure: true }).json({ message: "success" }).end()
);

export default router;

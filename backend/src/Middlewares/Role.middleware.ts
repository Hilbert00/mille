import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";

export default function verifyRole(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.sendStatus(401);
    }

    if (!req.user.type) {
        return res.sendStatus(403);
    }

    next();
}

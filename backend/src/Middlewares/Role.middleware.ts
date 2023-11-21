import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";

export default function verifyRole(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user) {
        return res.sendStatus(401);
    }

    // @ts-ignore
    if (!req.user.type) {
        return res.sendStatus(403);
    }

    next();
}

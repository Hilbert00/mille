import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET as string, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

export { verifyToken };

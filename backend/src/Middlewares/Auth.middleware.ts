import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token: string = req.cookies.AuthJWT;

    if (token == null) {
        return res.status(401).json({ message: "missing token" });
    }

    jwt.verify(token, JWT_SECRET as string, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: "not authorized" });
        }
        req.user = user;
        next();
    });
}

export { verifyToken };

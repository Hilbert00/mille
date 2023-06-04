import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

// SECRETS
const { JWT_SECRET, JWT_EXPIRE } = process.env;

function signToken(data: object, expire?: string): string {
    const expireTime = expire ? expire : JWT_EXPIRE;
    return jwt.sign(data, JWT_SECRET as string, { expiresIn: expireTime });
}

export { signToken };

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

// SECRETS
const { JWT_SECRET, JWT_SECRET_EXPIRE } = process.env;

function signToken(data: object): string {
    return jwt.sign(data, JWT_SECRET as string, { expiresIn: JWT_SECRET_EXPIRE });
}

export { signToken };
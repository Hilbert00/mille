import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

// SECRETS
const { JWT_SECRET, JWT_EXPIRE } = process.env;

function signToken(data: object, expire?: string): string {
    if (expire === "0") return jwt.sign(data, JWT_SECRET as string);

    const expireTime = expire ? expire : JWT_EXPIRE;
    return jwt.sign(data, JWT_SECRET as string, { expiresIn: expireTime });
}

function parseToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

function generateUserToken(userData: {
    id: number;
    username: string;
    active_title: string;
    user_level: number;
    user_EXP: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
    active: number;
    type: 0 | 1 | 2;
    banned: 0 | 1 | 2;
}) {
    const token = signToken({
        id: userData.id,
        username: userData.username,
        active_title: userData.active_title,
        user_level: userData.user_level,
        user_EXP: userData.user_EXP,
        user_coins: userData.user_coins,
        user_behavior: userData.user_behavior,
        user_sequence: userData.user_sequence,
        challenge_matches: userData.challenge_matches,
        challenge_wins: userData.challenge_wins,
        active: userData.active,
        type: userData.type,
        banned: userData.banned,
    });

    return token;
}

export { signToken, parseToken, generateUserToken };

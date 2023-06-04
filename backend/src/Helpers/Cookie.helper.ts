import * as TokenHelper from "./Token.helper.js";
import { serialize } from "cookie";

function generateUserCookie(userData: {
    username: string;
    user_level: number;
    user_EXP: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
    active: number;
}) {
    const token = TokenHelper.signToken({
        username: userData.username,
        user_level: userData.user_level,
        user_EXP: userData.user_EXP,
        user_coins: userData.user_coins,
        user_behavior: userData.user_behavior,
        user_sequence: userData.user_sequence,
        challenge_matches: userData.challenge_matches,
        challenge_wins: userData.challenge_wins,
        active: userData.active,
    });

    const serialized = serialize("AuthJWT", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(process.env.COOKIE_EXPIRE),
        path: "/",
    });

    return serialized;
}

export { generateUserCookie };

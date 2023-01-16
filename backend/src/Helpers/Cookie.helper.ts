import * as TokenHelper from "./Token.helper.js";
import { serialize } from "cookie";

function generateUserCookie(userData: {
    username: string;
    user_level: number;
    user_EXP: number;
    challenge_matches: number;
    challenge_wins: number;
}) {
    const token = TokenHelper.signToken({
        username: userData.username,
        user_level: userData.user_level,
        user_EXP: userData.user_EXP,
        challenge_matches: userData.challenge_matches,
        challenge_wins: userData.challenge_wins,
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

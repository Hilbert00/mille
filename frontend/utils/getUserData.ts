import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

interface UserData {
    username: string;
    user_level: number;
    user_coins: number;
    user_behavior: number;
    user_sequence: number;
    challenge_matches: number;
    challenge_wins: number;
}

export async function getUserData(setUser: Dispatch<SetStateAction<UserData>>, userPath?: string): Promise<boolean> {
    const url = userPath ? `http://localhost:8080/api/user/${userPath}` : "http://localhost:8080/api/user";

    try {
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const data = await response.json();

        if (!Object.keys(data).length) {
            return false;
        }

        setUser(data);
        return true;
    } catch {
        console.clear();
        return false;
    }
}

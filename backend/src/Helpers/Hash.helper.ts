import argon2 from "argon2";

async function getHash(pass: string): Promise<string> {
    return await argon2.hash(pass, { type: argon2.argon2id });
}

async function verifyHash(hash: string, pass: string): Promise<boolean> {
    return await argon2.verify(hash, pass);
}

export { getHash, verifyHash };

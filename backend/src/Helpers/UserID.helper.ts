import queryPromise from "./QueryPromise.helper.js";

async function getUserID(username: string) {
    const userQuery: string = `SELECT (id) FROM user WHERE username = '${username}'`;

    const userID = (await queryPromise(userQuery)) as any;

    const parsedID: number = JSON.parse(JSON.stringify(userID))[0].id;

    return parsedID;
}

export { getUserID };

import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql";

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
});

setInterval(() => {
    conn.query("SELECT 1", (err, _res) => {
        if (err) console.log(err);
    });
}, 5000);

export default conn;

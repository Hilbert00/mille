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
    conn.query("UPDATE user SET online = 0 WHERE updated_at + INTERVAL 1 HOUR <= NOW();", (err, _res) => {
        if (err) console.log(err);
    });
    
    conn.query("DELETE FROM user WHERE updated_at + INTERVAL 1 DAY <= NOW() AND active = 0;", (err, _res) => {
        if (err) console.log(err);
    });
}, 10000);

export default conn;

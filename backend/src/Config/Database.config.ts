import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql";

const conn = mysql.createPool({
    connectionLimit: 10000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
});

export default conn;

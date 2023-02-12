import util from "util";
import conn from "../Config/Database.config.js";

const queryPromise = util.promisify(conn.query).bind(conn);

export default queryPromise;
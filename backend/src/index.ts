import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as bodyParser from "body-parser";

const { PORT } = process.env;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));

// ROUTES
import signUp from "./Routes/SignUp.route.js";
import auth from "./Routes/Auth.route.js"

app.use("/api/signup", signUp);
app.use("/api/login", auth);

app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

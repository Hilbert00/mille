import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const { PORT } = process.env;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        preflightContinue: true,
    })
);

// ROUTES
import signUp from "./Routes/SignUp.route.js";
import auth from "./Routes/Auth.route.js";
import user from "./Routes/User.route.js";

app.use("/api/auth/signup", signUp);
app.use("/api/auth/login", auth);
app.use("/api", user);

app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

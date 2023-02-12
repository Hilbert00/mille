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
import signUp from "./Routes/auth/SignUp.route.js";
import auth from "./Routes/auth/Auth.route.js";
import changePass from "./Routes/auth/ChangePass.route.js";

import user from "./Routes/User.route.js";
import quiz from "./Routes/solo/Quiz.route.js";
import world from "./Routes/solo/World.route.js";

app.use("/api/auth/signup", signUp);
app.use("/api/auth/login", auth);
app.use("/api/auth/changepass", changePass);

app.use("/api/user", user);
app.use("/api/quiz", quiz);
app.use("/api/world", world);

app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

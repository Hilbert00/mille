import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";

const { PORT } = process.env;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "*",
        methods: "GET,PUT,POST,DELETE",
        allowedHeaders: "X,PINGOTHER,Content-Type,Authorization",
    })
);

// ROUTES
import signUp from "./Routes/SignUp.route.js";
import auth from "./Routes/Auth.route.js";

app.use("/api/signup", signUp);
app.use("/api/login", auth);

app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

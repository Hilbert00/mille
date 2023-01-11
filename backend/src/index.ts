import dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as bodyParser from "body-parser";

const { PORT } = process.env;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));

// ROUTES
import signUp from "./Routes/SignUp.js";

app.get("/", (req, res) => {
    return res.json({ message: "API is active" });
});

app.use("/signup", signUp);

app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

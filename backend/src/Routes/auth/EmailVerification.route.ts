import fs from "fs";
import jwt from "jsonwebtoken";
import * as express from "express";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import * as TokenHelper from "../../Helpers/Token.helper.js";

const router = express.Router();

router.post("/send", async (req, res) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const password = req.body.password;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS,
        },
    });

    const token = TokenHelper.signToken(
        {
            username,
            email,
            password,
        },
        process.env.JWT_EXPIRE_EMAIL
    );

    fs.readFile("./src/Routes/auth/email/email.html", { encoding: "utf-8" }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const template = handlebars.compile(data);
        const htmlToSend = template({ TOKEN: token });

        const mailConfig = {
            from: process.env.EMAIL_NAME,
            to: email,
            subject: "Mille - Verifique seu Email!",
            html: htmlToSend,
            attachments: [
                {
                    filename: "mille-logo-full.png",
                    path: "./src/Routes/auth/email/mille-logo-full.png",
                    cid: "logo",
                },
            ],
        };

        transporter.sendMail(mailConfig, (err, _) => {
            if (err) throw err;
        });

        return res.sendStatus(200);
    });
});

router.post("/", async (req, res) => {
    const token: string = String(req.body.token);

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, _) => {
        if (err) {
            return res.sendStatus(403);
        }

        console.log(_);

        return res.sendStatus(200);
    });
});

export default router;

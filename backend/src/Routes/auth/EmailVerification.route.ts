import fs from "fs";
import jwt from "jsonwebtoken";
import * as express from "express";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import conn from "../../Config/Database.config.js";
import * as TokenHelper from "../../Helpers/Token.helper.js";

const router = express.Router();

router.post("/send", async (req, res) => {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const changePass: boolean = req.body.changePass ? req.body.changePass : false;

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
        },
        changePass ? process.env.JWT_EXPIRE_EMAIL : "0"
    );

    if (!changePass)
        fs.readFile("./src/Routes/auth/email/email.html", { encoding: "utf-8" }, (err, data) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404);
            }

            const template = handlebars.compile(data);
            const htmlToSend = template({ TOKEN: token, URL: process.env.FRONTEND_URL });

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
    else
        fs.readFile("./src/Routes/auth/email/changePass.html", { encoding: "utf-8" }, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            conn.query(`SELECT * FROM user WHERE email = '${email}'`, (err, sql) => {
                if (err) {
                    console.log(err);
                }

                if (!sql.length) return res.sendStatus(404);

                const template = handlebars.compile(data);
                const htmlToSend = template({ TOKEN: token, URL: process.env.FRONTEND_URL });

                const mailConfig = {
                    from: process.env.EMAIL_NAME,
                    to: email,
                    subject: "Mille - Troque sua Senha!",
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
});

router.post("/", async (req, res) => {
    const token: string = String(req.body.token);

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        conn.query(`UPDATE user SET active = 1 WHERE username = '${data.username}'`, (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(404);
            }

            return res.json({ ...data }).status(200).send();
        });
    });
});

export default router;

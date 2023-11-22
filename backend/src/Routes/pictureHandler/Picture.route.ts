import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import conn from "../../Config/Database.config.js";

// MIDDLEWARES
import verifyToken from "../../Middlewares/Auth.middleware.js";

const router = Router();

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

router.get("/signature", verifyToken, (_req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
        },
        cloudinaryConfig.api_secret
    );

    res.json({ timestamp, signature });
});

router.post("/destroy", verifyToken, (req, res) => {
    // @ts-ignore
    const user = req.user;
    const { public_id } = req.body;
    const { clear } = req.body;

    cloudinary.api.delete_resources(public_id, { type: "upload", resource_type: "image" }).then(() => {
        if (!clear) return res.sendStatus(200);

        const query = "UPDATE user SET ?? = ? WHERE ?? = ?;";
        const data = ["picture", null, "username", user.username];

        conn.query(query, data, (err) => {
            if (err) return res.sendStatus(404);

            return res.sendStatus(200);
        });
    });
});

export default router;

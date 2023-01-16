import { Router } from "express";

// MIDDLEWARES
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const router = Router();

router.get("/@:user", verifyToken, (req, res) => {
    const user = req.user;

    return res.json(user);
});

export default router;

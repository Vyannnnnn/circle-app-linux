import express from "express";
import { register, login, getProfile } from "../controller/authController";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// this endpoint is still in progress, not yet complete
router.get("/profile", authMiddleware, getProfile);

export default router;

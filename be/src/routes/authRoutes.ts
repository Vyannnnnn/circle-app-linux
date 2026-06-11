import express from "express";
import { register, login, getProfile, editProfile } from "../controller/authController";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";
import { upload } from "../lib/multer";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// this endpoint is still in progress, not yet complete
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("image"), editProfile);

export default router;

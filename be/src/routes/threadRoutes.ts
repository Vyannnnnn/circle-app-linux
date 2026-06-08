import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";
import { likeThread, unlikeThread } from "../controller/likeController";
import { createThread } from "../controller/createThreadController";
import { upload } from "../lib/multer";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createThread);
router.get("/lists", authMiddleware, getThreadLists);
router.post("/:threadId/like", authMiddleware, likeThread);
router.post("/:threadId/unlike", authMiddleware, unlikeThread);
router.post("/create", authMiddleware, upload.single("image"), createThread);

export default router;

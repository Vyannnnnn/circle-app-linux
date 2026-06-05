import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";
import { likeThread, unlikeThread } from "../controller/likeController";

const router = express.Router();

router.get("/lists", authMiddleware, getThreadLists);
router.post("/:threadId/like", authMiddleware, likeThread);
router.post("/:threadId/unlike", authMiddleware, unlikeThread, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Thread unliked hit",
  });
});

export default router;

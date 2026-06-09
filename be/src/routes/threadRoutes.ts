import express from "express";
import { getThreadLists } from "../controller/threadController";
import { likeThread, unlikeThread } from "../controller/likeController";
import { createThread , createReply} from "../controller/createThreadController";
import { upload } from "../lib/multer";
import getThreadById from "../controller/getThreadById";
import { getRepliesByThreadId } from "../controller/ReplieController";

const router = express.Router();

router.post("/create", upload.single("image"), createThread);
router.post("/:threadId/reply", upload.single("image"), createReply);
router.get("/lists", getThreadLists);
router.get("/:threadId", getThreadById); // Get thread by ID
router.post("/:threadId/like", likeThread);
router.post("/:threadId/unlike", unlikeThread);
router.get("/:threadId/replies", getRepliesByThreadId);

export default router;

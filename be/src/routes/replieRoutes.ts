import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getRepliesByThreadId } from "../controller/ReplieController";

const router = express.Router();

router.get("/:threadId", authMiddleware, getRepliesByThreadId);

export default router;

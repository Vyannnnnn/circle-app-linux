import { Router } from "express";
import authRoute from "./authRoutes";
import threadRoutes from "./threadRoutes";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", authMiddleware, threadRoutes);
// router.use("/replies", replieRoutes);

export default router;

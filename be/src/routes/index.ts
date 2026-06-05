import { Router } from "express";
import authRoute from "./authRoutes";
import threadRoutes from "./threadRoutes";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", threadRoutes);

export default router;

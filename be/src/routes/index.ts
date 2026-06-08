import { Router } from "express";
import authRoute from "./authRoutes";
import threadRoutes from "./threadRoutes";
import replieRoutes from "./replieRoutes";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", threadRoutes);
// router.use("/replies", replieRoutes);

export default router;

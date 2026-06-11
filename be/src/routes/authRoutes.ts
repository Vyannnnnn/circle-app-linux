import express from "express";
import { register, login, getProfile, editProfile, getFollows} from "../controller/authController";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";
import { upload } from "../lib/multer";
import { getSuggestions } from "../controller/getSuggestion";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("image"), editProfile);

router.get("/follows", authMiddleware, getFollows);

router.get("/suggested-users", authMiddleware, getSuggestions);
// router.get("/following", authMiddleware, getFollowing); 
export default router;

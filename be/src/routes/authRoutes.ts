import express from "express";
import {
  register,
  login,
  getProfile,
  editProfile,
  getFollows,
  getUsers,
  getProfileById,
} from "../controller/authController";
import { authMiddleware } from "../middleware/auth";
import { getThreadLists } from "../controller/threadController";
import { upload } from "../lib/multer";
import { getSuggestions } from "../controller/getSuggestion";
import { followUser, unfollowUser } from "../controller/followController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("image"), editProfile);

router.get("/follows", authMiddleware, getFollows);

router.get("/suggested-users", authMiddleware, getSuggestions);
router.get("/search-users", authMiddleware, getUsers);

router.post("/:userId/follow", authMiddleware, followUser);
router.delete("/:userId/unfollow", authMiddleware, unfollowUser);

router.get("/:userId/profile", getProfileById);

export default router;

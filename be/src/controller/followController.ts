import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = Number(req.user?.id);
    const followingId = Number(req.params.userId);

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const targetUser = await prisma.users.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingFollow = await prisma.following.findUnique({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Already following",
      });
    }

    await prisma.following.create({
      data: {
        followingId,
        followerId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Followed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = Number(req.user?.id);
    const followingId = Number(req.params.userId);

    const existingFollow = await prisma.following.findUnique({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(404).json({
        success: false,
        message: "Follow relationship not found",
      });
    }

    await prisma.following.delete({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

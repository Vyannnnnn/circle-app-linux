import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const currentUserId = req.user.id;

    const followedUsers = await prisma.following.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followedIds = followedUsers.map(
      (user) => user.followingId
    );

    const suggestions = await prisma.users.findMany({
      where: {
        id: {
          notIn: [currentUserId, ...followedIds],
        },
      },
      select: {
        id: true,
        username: true,
        full_Name: true,
        photo_profile: true,
        bio: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const randomSuggestions = suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: randomSuggestions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get suggestions",
    });
  }
};
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getThreadLists = async (
  req: Request,
  res: Response,
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

    const threadLists = await prisma.threads.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: true,  
        replies: true,
      },
    });

    const formattedThreadLists = threadLists.map((thread) => {
      return {
        id: thread.id,
        content: thread.content,
        image: thread.image,
        createdAt: thread.createdAt,

        user: {
          id: thread.user.id,
          username: thread.user.username,
          full_Name: thread.user.full_Name,
          photo_profile: thread.user.photo_profile,
        },

        like: thread.likes.length,
        replies: thread.replies.length,

        isLiked: thread.likes.some((like) => like.userId === currentUserId),
      };
    });

    res.status(200).json({
      success: true,
      message: "Thread lists fetched successfully",
      data: { formattedThreadLists },
    });
  } catch (error) {
    console.error("Error fetching thread lists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch thread lists",
    });
  }
};

export const getUserThreads = async (
  req: Request,
  res: Response,
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

    const threadLists = await prisma.threads.findMany({
      where: {
        userId: currentUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: true,  
        replies: true,
      },
    });

    const formattedThreadLists = threadLists.map((thread) => {
      return {
        id: thread.id,
        content: thread.content,
        image: thread.image,
        createdAt: thread.createdAt,

        user: {
          id: thread.user.id,
          username: thread.user.username,
          full_Name: thread.user.full_Name,
          photo_profile: thread.user.photo_profile,
        },

        like: thread.likes.length,
        replies: thread.replies.length,

        isLiked: thread.likes.some((like) => like.userId === currentUserId),
      };
    });

    res.status(200).json({
      success: true,
      message: "User threads fetched successfully",
      data: { formattedThreadLists },
    });
  } catch (error) {
    console.error("Error fetching user threads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user threads",
    });
  }
};

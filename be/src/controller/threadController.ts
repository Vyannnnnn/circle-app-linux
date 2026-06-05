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
        created: {
          select: {
            id: true,
            username: true,
            full_Name: true,
            photo_profile: true,
          },
        },
        likes: true,
        thread: true,
      },
    });

    const formattedThreadLists = threadLists.map((thread) => {
      const likesCount = thread.likes.length;
      const repliesCount = thread.thread.length;
      const isLiked = thread.likes.some(
        (like) => like.userId === currentUserId,
      );

      return {
        id: thread.id,
        content: thread.content,
        createdAt: thread.createdAt,
        user: {
          id: thread.created.id,
          username: thread.created.username,
          full_Name: thread.created.full_Name,
          photo_profile: thread.created.photo_profile,
        },
        created_at: thread.createdAt.toISOString(),
        like: likesCount,
        replies: repliesCount,
        isLiked: isLiked,
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

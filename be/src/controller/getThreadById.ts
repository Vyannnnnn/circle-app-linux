import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export default async function getThreadById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const id = Number(req.params.threadId);
    console.log("params:", req.params);
    console.log("id param:", req.params.threadId);
    console.log("number id:", Number(req.params.threadId));

    const thread = await prisma.threads.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        replies: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!thread) {
      res.status(404).json({
        success: false,
        message: "Thread not found",
      });
      return;
    }

    const formattedThread = {
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

      isLiked: thread.likes.some((like) => like.userId === req.user!.id),
    };

    res.status(200).json({
      success: true,
      message: "Thread fetched successfully",
      data: { formattedThread },
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch thread",
    });
  }
}

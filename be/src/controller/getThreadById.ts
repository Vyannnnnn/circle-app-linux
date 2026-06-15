import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * @swagger
 * /threads/{threadId}:
 *   get:
 *     summary: Get thread by ID
 *     tags: [Threads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Thread not found
 */
export const getThreadById = async (
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

export const getThreadsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const currentUserId = req.user?.id;

    const threads = await prisma.threads.findMany({
      where: { userId },
      include: {
        user: true,
        likes: true,
        replies: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedThreads = threads.map((thread) => ({
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
      isLiked: currentUserId
        ? thread.likes.some((l) => l.userId === currentUserId)
        : false,
      replies: thread.replies.length,
    }));

    res.status(200).json({
      success: true,
      data: formattedThreads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed get user threads",
    });
  }
};
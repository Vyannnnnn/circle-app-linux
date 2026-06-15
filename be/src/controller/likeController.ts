import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { broadcast, sendToUser } from "../lib/websocket";

/**
 * @swagger
 * /threads/{threadId}/like:
 *   post:
 *     summary: Like a thread
 *     tags: [Likes]
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
 *         description: Thread liked successfully
 *       400:
 *         description: Invalid thread ID or already liked
 *       401:
 *         description: Unauthorized
 */
export const likeThread = async (
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

    const { threadId } = req.params;
    const userId = req.user.id;
    const parsedThreadId = Number(threadId);
    if (isNaN(parsedThreadId)) {
      res.status(400).json({
        success: false,
        message: "Invalid thread ID.",
      });
      return;
    }

    // Check if the like already exists
    const existingLike = await prisma.likes.findUnique({
      where: {
        threadId_userId: {
          threadId: parsedThreadId,
          userId,
        },
      },
    });

    if (existingLike) {
      res.status(400).json({
        success: false,
        message: "You have already liked this thread.",
      });
      return;
    }

    // Create a new like
    await prisma.likes.create({
      data: {
        userId: userId,
        threadId: parsedThreadId,
      },
    });

    const thread = await prisma.threads.findUnique({
      where: { id: parsedThreadId },
      select: { userId: true }
    });

    const likeCount = await prisma.likes.count({
      where: { threadId: parsedThreadId }
    });

    const liker = await prisma.users.findUnique({
      where: { id: userId },
      select: { username: true, full_Name: true, photo_profile: true }
    });

    if (thread && liker && thread.userId !== userId) {
      // Create Notification in Database
      const newNotification = await prisma.notifications.create({
        data: {
          receiverId: thread.userId,
          senderId: userId,
          type: "LIKE",
          threadId: parsedThreadId,
        },
        include: {
          sender: { select: { id: true, username: true, full_Name: true, photo_profile: true } }
        }
      });

      sendToUser(thread.userId, "thread_liked", {
        threadId: parsedThreadId,
        likeCount: likeCount,
        liker: liker,
        notification: newNotification
      });
    }

    res.status(200).json({
      success: true,
      message: "Thread liked successfully.",
    });
  } catch (error) {
    console.error("Error liking thread:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while liking the thread.",
    });
  }
};

/**
 * @swagger
 * /threads/{threadId}/like:
 *   delete:
 *     summary: Unlike a thread
 *     tags: [Likes]
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
 *         description: Thread unliked successfully
 *       400:
 *         description: Invalid thread ID or not liked
 *       401:
 *         description: Unauthorized
 */
export const unlikeThread = async (
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

    const { threadId } = req.params;
    const userId = req.user.id;
    const parsedThreadId = Number(threadId);
    if (isNaN(parsedThreadId)) {
      res.status(400).json({
        success: false,
        message: "Invalid thread ID.",
      });
      return;
    }

    // Check if the like exists
    const existingLike = await prisma.likes.findFirst({
      where: {
        userId: userId,
        threadId: parsedThreadId,
      },
    });

    if (!existingLike) {
      res.status(400).json({
        success: false,
        message: "You have not liked this thread.",
      });
      return;
    }

    // Delete the like
    await prisma.likes.delete({
      where: {
        id: existingLike.id,
      },
    });

    const thread = await prisma.threads.findUnique({
      where: { id: parsedThreadId },
      select: { userId: true }
    });

    const likeCount = await prisma.likes.count({
      where: { threadId: parsedThreadId }
    });

    if (thread && thread.userId !== userId) {
      // Delete Notification from Database
      await prisma.notifications.deleteMany({
        where: {
          receiverId: thread.userId,
          senderId: userId,
          type: "LIKE",
          threadId: parsedThreadId,
        }
      });

      sendToUser(thread.userId, "thread_unliked", {
        threadId: parsedThreadId,
        likeCount: likeCount
      });
    }

    res.status(200).json({
      success: true,
      message: "Thread unliked successfully.",
    });
  } catch (error) {
    console.error("Error unliking thread:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while unliking the thread.",
    });
  }
};

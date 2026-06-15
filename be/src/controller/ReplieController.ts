import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * @swagger
 * /threads/{threadId}/replies:
 *   get:
 *     summary: Get all replies for a specific thread
 *     tags: [Replies]
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
 *       400:
 *         description: Invalid thread ID
 *       401:
 *         description: Unauthorized
 */
export const getRepliesByThreadId = async (
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

    const threadId = Number(req.params.threadId);
    if (isNaN(threadId)) {
      res.status(400).json({
        success: false,
        message: "Invalid thread ID.",
      });
      return;
    }
    console.log("params:", req.params);
    console.log("threadId:", req.params.threadId);

    const replies = await prisma.replies.findMany({
      where: { threadId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    console.log(replies);

    res.status(200).json({
      success: true,
      data: replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        image: reply.image,
        createdAt: reply.createdAt,
        user: {
          id: reply.user.id,
          username: reply.user.username,
          full_Name: reply.user.full_Name,
          photo_profile: reply.user.photo_profile,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching replies.",
    });
  }
};


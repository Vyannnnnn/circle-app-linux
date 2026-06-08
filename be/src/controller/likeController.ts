import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

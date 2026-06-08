import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { broadcast } from "../lib/websocket";

export const createThread = async (
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

    const { content, image } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        message: "Content is required",
      });
      return;
    }

    const newThread = await prisma.threads.create({
      data: {
        content,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Thread created successfully",
      thread: newThread,
    });

    const formatedThread = await prisma.threads.findUnique({
      where: { id: newThread.id },
      include: {
        user: true,
        likes: true,
        replies: true,
      },
    });

    broadcast("new_thread", {
      id: formatedThread!.id,
      content: formatedThread!.content,
      image: formatedThread!.image,
      createdAt: formatedThread!.createdAt,
      user: {
        id: formatedThread!.user.id,
        username: formatedThread!.user.username,
        email: formatedThread!.user.email,
        full_Name: formatedThread!.user.full_Name,
        photo_profile: formatedThread!.user.photo_profile,
      },
      like: formatedThread!.likes.length,
      reply: formatedThread!.replies.length,
      isLiked: false,
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create thread",
    });
  }
};

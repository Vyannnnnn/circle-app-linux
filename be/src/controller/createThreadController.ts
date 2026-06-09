import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { broadcast, sendToUser } from "../lib/websocket";

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

export const createReply = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("CREATE REPLY HIT");
    console.log("body:", req.body);
    console.log("file:", req.file);
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { content, image } = req.body;
    const threadId = Number(req.params.threadId);

    if (!content || !threadId) {
      res.status(400).json({
        success: false,
        message: "Content and thread ID are required",
      });
      return;
    }

    const newReply = await prisma.replies.create({
      data: {
        content,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        userId: req.user.id,
        threadId: Number(threadId),
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Reply created successfully",
      reply: {
        id: newReply.id,
        content: newReply.content,
        image: newReply.image,
        createdAt: newReply.createdAt,
        user: {
          id: newReply.user.id,
          username: newReply.user.username,
          email: newReply.user.email,
          full_Name: newReply.user.full_Name,
          photo_profile: newReply.user.photo_profile,
        },
      },
    });
    const thread = await prisma.threads.findUnique({
      where: { id: threadId },
      include: {
        user: true,
      },
    });
    console.log("THREAD OWNER:", thread?.user.id);
    console.log("REPLIER:", req.user.id);
    if (thread && thread.user.id !== req.user.id) {
      console.log("Sending new_reply event to user ID:", thread.user.id);
      sendToUser(thread.user.id, "new_reply", {
        threadId,
        replier: {
          id: newReply.user.id,
          full_Name: newReply.user.full_Name,
          username: newReply.user.username,
          email: newReply.user.email,
          photo_profile: newReply.user.photo_profile,
        },
        content: newReply.content,
      });
    }

    const likeCount = await prisma.likes.count({
      where:{
        threadId,
      }
    })

    broadcast("thread_likes", {
      threadId,
      likeCount,
    })


  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create reply",
    });
  }
};

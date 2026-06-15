import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const notifications = await prisma.notifications.findMany({
      where: {
        receiverId: req.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            full_Name: true,
            photo_profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { id } = req.params;

    await prisma.notifications.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while marking notification as read.",
    });
  }
};

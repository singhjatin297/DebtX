import { PrismaClient } from "@prisma/client";
import { Notification } from "../types/notification";

const prisma = new PrismaClient();

export const createNotification = async (
  type: Notification["type"], // Use Notification type union
  message: string,
  userName: string,
  status: "pending" | "completed" | "overdue"
) => {
  return await prisma.notification.create({
    data: {
      type,
      message,
      userName,
      status,
      createdAt: new Date(),
    },
  });
};

export const getAllNotifications = async () => {
  return await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
};

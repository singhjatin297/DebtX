import { Request, Response } from "express";
import { getAllNotifications } from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.signedCookies.session;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const notifications = await getAllNotifications();
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

import { Router, Request, Response } from "express";
import { getNotifications } from "../controllers/notificationController";

export default function notificationRoutes() {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    await getNotifications(req, res);
  });

  return router;
}

import { Router, Request, Response } from "express";
import { getNotifications } from "../controllers/notificationController";

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [new_customer, payment_received, payment_overdue, payment_pending, payment_completed]
 *                   message:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, completed, overdue]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch notifications
 */
export default function notificationRoutes() {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    await getNotifications(req, res);
  });

  return router;
}

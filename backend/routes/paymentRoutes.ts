import { Router, Request, Response } from "express";
import { Server } from "socket.io";
import { mockPayment } from "../controllers/paymentController";

/**
 * @openapi
 * /api/payments/mock:
 *   post:
 *     summary: Mock a payment for a customer
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - customerId
 *               - amount
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
const router = Router();

export default function paymentRoutes(io: Server) {
  router.post("/mock", async (req: Request, res: Response) => {
    await mockPayment(req, res, io);
  });
  return router;
}

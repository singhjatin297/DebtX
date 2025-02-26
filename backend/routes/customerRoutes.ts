import { Router, Request, Response } from "express";
import {
  deleteCustomersController,
  getAllCustomers,
  uploadCustomersController,
  updateStatusController,
} from "../controllers/customerController";
import { Server } from "socket.io";

export default function customerRoutes(io: Server) {
  const router = Router();

  /**
   * @openapi
   * /api/customers:
   *   get:
   *     summary: Get all customers
   *     tags: [Customers]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: List of customers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   contactInfo:
   *                     type: string
   *                   outstandingAmount:
   *                     type: number
   *                   dueDate:
   *                     type: string
   *                   paymentStatus:
   *                     type: string
   *                     enum: [pending, completed, overdue]
   *       401:
   *         description: Unauthorized
   */
  router.get("/", async (req: Request, res: Response) => {
    await getAllCustomers(req, res);
  });

  /**
   * @openapi
   * /api/customers/upload:
   *   post:
   *     summary: Upload multiple customers
   *     tags: [Customers]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 contactInfo:
   *                   type: string
   *                 outstandingAmount:
   *                   type: number
   *                 dueDate:
   *                   type: string
   *                   format: date
   *                 paymentStatus:
   *                   type: string
   *                   enum: [pending, completed, overdue]
   *               required:
   *                 - name
   *                 - contactInfo
   *                 - outstandingAmount
   *                 - dueDate
   *                 - paymentStatus
   *     responses:
   *       200:
   *         description: Customers uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 count:
   *                   type: number
   *       400:
   *         description: Failed to upload customers
   *       401:
   *         description: Unauthorized
   */
  router.post("/upload", async (req: Request, res: Response) => {
    await uploadCustomersController(req, res, io);
  });

  /**
   * @openapi
   * /api/customers/delete:
   *   post:
   *     summary: Delete multiple customers
   *     tags: [Customers]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: string
   *             required:
   *               - ids
   *     responses:
   *       200:
   *         description: Customers deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Failed to delete customers
   *       401:
   *         description: Unauthorized
   */
  router.post("/delete", async (req: Request, res: Response) => {
    await deleteCustomersController(req, res);
  });

  /**
   * @openapi
   * /api/customers/update-status:
   *   post:
   *     summary: Update customer payment status
   *     tags: [Customers]
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
   *               status:
   *                 type: string
   *                 enum: [pending, completed, overdue]
   *             required:
   *               - customerId
   *               - status
   *     responses:
   *       200:
   *         description: Status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 customer:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     contactInfo:
   *                       type: string
   *                     outstandingAmount:
   *                       type: number
   *                     dueDate:
   *                       type: string
   *                     paymentStatus:
   *                       type: string
   *       400:
   *         description: Failed to update status
   *       401:
   *         description: Unauthorized
   */
  router.post("/update-status", async (req: Request, res: Response) => {
    await updateStatusController(req, res, io);
  });

  return router;
}

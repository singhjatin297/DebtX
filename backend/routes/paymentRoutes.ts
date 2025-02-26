import { Router, Request, Response } from "express";
import { Server } from "socket.io";
import { mockPayment } from "../controllers/paymentController";

const router = Router();

export default function paymentRoutes(io: Server) {
  router.post("/mock", async (req: Request, res: Response) => {
    await mockPayment(req, res, io);
  });
  return router;
}

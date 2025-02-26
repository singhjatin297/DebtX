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

  router.get("/", async (req: Request, res: Response) => {
    await getAllCustomers(req, res);
  });

  router.post("/upload", async (req: Request, res: Response) => {
    await uploadCustomersController(req, res, io);
  });

  router.post("/delete", async (req: Request, res: Response) => {
    await deleteCustomersController(req, res);
  });

  router.post("/update-status", async (req: Request, res: Response) => {
    await updateStatusController(req, res, io);
  });

  return router;
}

import { Request, Response } from "express";
import { Server } from "socket.io";
import { processPayment } from "../services/paymentService";
import { createNotification } from "../services/notificationService";

export const mockPayment = async (req: Request, res: Response, io: Server) => {
  const userId = req.cookies.token;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { customerId, amount } = req.body;
  const customer = await processPayment(customerId, amount);
  io.emit("payment_update", { customerId, status: "completed" });
  const receivedMessage = `Payment of $${amount} received for ${customer.name}`;
  io.emit("notification", {
    type: "payment_received",
    message: receivedMessage,
  });
  await createNotification(
    "payment_received",
    receivedMessage,
    customer.name,
    "completed"
  );

  const dueDate = new Date(customer.dueDate);
  if (dueDate < new Date() && customer.paymentStatus !== "completed") {
    const overdueMessage = `Payment for ${
      customer.name
    } is overdue since ${dueDate.toLocaleDateString()}`;
    io.emit("notification", {
      type: "payment_overdue",
      message: overdueMessage,
    });
    await createNotification(
      "payment_overdue",
      overdueMessage,
      customer.name,
      customer.paymentStatus as "pending" | "completed" | "overdue"
    );
  }

  res.json({ message: "Payment processed" });
};

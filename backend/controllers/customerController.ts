import { Request, Response } from "express";
import { getCustomers, uploadCustomers } from "../services/customerService";
import {
  deleteCustomers as deleteCustomersService,
  updateCustomerStatus,
} from "../services/customerService";
import { createNotification } from "../services/notificationService";
import { Server } from "socket.io";

export const getAllCustomers = async (req: Request, res: Response) => {
  const userId = req.signedCookies.session;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const customers = await getCustomers();
  res.json(customers);
};

export const uploadCustomersController = async (
  req: Request,
  res: Response,
  io: Server
) => {
  const userId = req.signedCookies.session;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const customers = req.body;
  try {
    const count = await uploadCustomers(customers);
    const message = `${count} customers added via upload`;
    io.emit("notification", {
      type: "new_customer",
      message: message,
    });
    if (customers.length > 0) {
      await createNotification(
        "new_customer",
        message,
        customers[0].name,
        customers[0].paymentStatus
      );
    }
    res.json({ message: "Customers uploaded successfully", count });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to upload customers" });
  }
};

export const deleteCustomersController = async (
  req: Request,
  res: Response
) => {
  const userId = req.signedCookies.session;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { ids } = req.body;
  try {
    await deleteCustomersService(ids);
    res.json({ message: "Customers deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete customers" });
  }
};

export const updateStatusController = async (
  req: Request,
  res: Response,
  io: Server
) => {
  const userId = req.signedCookies.session;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { customerId, status } = req.body as {
    customerId: string;
    status: "pending" | "completed" | "overdue";
  }; // Type assertion
  try {
    const customer = await updateCustomerStatus(customerId, status);
    const message = `${customer.name}'s payment status updated to ${status}`;
    const notificationType = `payment_${status}` as NotificationType; // Narrow type
    io.emit("notification", {
      type: notificationType,
      message: message,
    });
    await createNotification(notificationType, message, customer.name, status);
    res.json({ message: "Status updated successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update status" });
  }
};

// Helper type for Notification['type']
type NotificationType =
  | "new_customer"
  | "payment_received"
  | "payment_overdue"
  | "payment_pending"
  | "payment_completed";

// app/types/notification.ts
export interface Notification {
  id: string;
  type:
    | "new_customer"
    | "payment_received"
    | "payment_overdue"
    | "payment_pending"
    | "payment_completed";
  message: string;
  userName: string;
  status: "pending" | "completed" | "overdue";
  createdAt: string;
}

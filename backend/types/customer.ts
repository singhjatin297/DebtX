export interface CustomerInput {
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string; // ISO string
  paymentStatus: "pending" | "completed" | "overdue";
}

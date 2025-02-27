export interface CustomerInput {
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string;
  paymentStatus: "pending" | "completed" | "overdue";
}

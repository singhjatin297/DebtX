export interface Customer {
  id: string;
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string;
  paymentStatus: "pending" | "completed" | "overdue";
}

export interface RawCustomer {
  name: string;
  contactInfo: string;
  outstandingAmount: string;
  dueDate: string;
  paymentStatus?: string;
}

export interface CustomerInput {
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string;
  paymentStatus: "pending" | "completed" | "overdue";
}

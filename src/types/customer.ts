export interface Customer {
  id: string;
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string; // ISO string
  paymentStatus: "pending" | "completed" | "overdue";
}

// Raw data from CSV before transformation
export interface RawCustomer {
  name: string;
  contactInfo: string;
  outstandingAmount: string; // String from CSV, parsed to number later
  dueDate: string; // String from CSV, parsed to ISO later
  paymentStatus?: string; // Optional, defaults to 'pending'
}

// Data sent to backend for upload (no id)
export interface CustomerInput {
  name: string;
  contactInfo: string;
  outstandingAmount: number;
  dueDate: string; // ISO string
  paymentStatus: "pending" | "completed" | "overdue";
}

"use client";

import { useState } from "react";
import {
  useGetCustomersQuery,
  useUploadCustomersMutation,
  useDeleteCustomersMutation,
} from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CustomerInput } from "@/types/customer";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: z.string().email("Invalid email address"),
  outstandingAmount: z.number().min(0, "Amount must be non-negative"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  paymentStatus: z.enum(["pending", "completed", "overdue"]),
});

export default function CustomersPage() {
  const { data: customers = [], error, isLoading } = useGetCustomersQuery();
  const [uploadCustomers, { isLoading: uploadLoading }] =
    useUploadCustomersMutation();
  const [deleteCustomers, { isLoading: deleteLoading }] =
    useDeleteCustomersMutation();
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [singleCustomer, setSingleCustomer] = useState({
    name: "",
    contactInfo: "",
    outstandingAmount: "",
    dueDate: "",
    paymentStatus: "pending" as "pending" | "completed" | "overdue",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        Name: "Example Customer",
        "Contact Information": "example@email.com",
        "Outstanding Amount": 100,
        "Due Date": "24/05/2024",
        "Payment Status": "pending",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "customer_template.xlsx");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const validateData = (
    data: { [key: string]: string }[]
  ): { valid: CustomerInput[]; errors: string[] } => {
    const valid: CustomerInput[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const requiredFields = [
        "Name",
        "Contact Information",
        "Outstanding Amount",
        "Due Date",
        "Payment Status",
      ];
      const missing = requiredFields.filter(
        (field) => !row[field] || row[field].trim() === ""
      );
      if (missing.length > 0) {
        errors.push(`Row ${index + 1}: Missing ${missing.join(", ")}`);
        return;
      }

      const amount = parseFloat(row["Outstanding Amount"]);
      if (isNaN(amount) || amount < 0) {
        errors.push(
          `Row ${index + 1}: Invalid Outstanding Amount (${
            row["Outstanding Amount"]
          })`
        );
        return;
      }

      const [day, month, year] = row["Due Date"].split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (isNaN(date.getTime())) {
        errors.push(`Row ${index + 1}: Invalid Due Date (${row["Due Date"]})`);
        return;
      }

      valid.push({
        name: row["Name"],
        contactInfo: row["Contact Information"],
        outstandingAmount: amount,
        dueDate: date.toISOString(),
        paymentStatus: row["Payment Status"] as
          | "pending"
          | "completed"
          | "overdue",
      });
    });

    return { valid, errors };
  };

  const handleSaveFile = async () => {
    if (!file) {
      setFileError("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      let parsedData: { [key: string]: string }[];

      if (file.name.endsWith(".csv")) {
        const result = Papa.parse(data as string, {
          header: true,
          skipEmptyLines: true,
        });
        parsedData = result.data as { [key: string]: string }[];
      } else if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        parsedData = XLSX.utils.sheet_to_json(sheet);
      } else {
        setFileError("Unsupported file format");
        toast.error("Unsupported file format");
        return;
      }

      const { valid, errors } = validateData(parsedData);

      if (errors.length > 0) {
        setFileError(`Errors:\n${errors.join("\n")}`);
        toast.error("Upload failed due to validation errors");
        return;
      }

      try {
        const response = await uploadCustomers(valid).unwrap();
        toast.success(`Uploaded ${response.count} customers successfully`);
        setFileError(null);
        setFile(null);
        setOpen(false);
      } catch (err) {
        setFileError("Failed to upload customers");
        toast.error("Failed to upload customers");
        console.error("Upload failed:", err);
      }
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomers(selectedIds).unwrap();
      setSelectedIds([]);
      toast.success("Selected customers deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete customers");
    }
  };

  const handleSingleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSingleCustomer((prev) => ({
      ...prev,
      [name]:
        name === "outstandingAmount"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    }));
  };

  const handleSingleCustomerSubmit = async () => {
    try {
      const validatedData = customerSchema.parse({
        ...singleCustomer,
        outstandingAmount:
          singleCustomer.outstandingAmount === ""
            ? 0
            : singleCustomer.outstandingAmount,
        dueDate: new Date(singleCustomer.dueDate).toISOString(),
      });
      await uploadCustomers([validatedData]).unwrap();
      toast.success("Customer added successfully");
      setSingleCustomer({
        name: "",
        contactInfo: "",
        outstandingAmount: "",
        dueDate: "",
        paymentStatus: "pending",
      });
      setFormErrors({});
      setOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setFormErrors(errors);
      } else {
        toast.error("Failed to add customer");
        console.error("Add customer failed:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 min-h-screen bg-gray-100"
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upload Customers
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-800">
            <DialogHeader>
              <DialogTitle>Upload Customer File</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="w-full"
              />
              {uploadLoading && <p className="text-blue-600">Uploading...</p>}
              {fileError && (
                <p className="text-red-600 whitespace-pre-wrap">{fileError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={handleSaveFile}
                disabled={uploadLoading || !file}
              >
                {uploadLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={downloadTemplate}
        >
          <Download className="w-4 h-4" /> Download Template
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-800">
            <DialogHeader>
              <DialogTitle>Add Single Customer</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  name="name"
                  value={singleCustomer.name}
                  onChange={handleSingleCustomerChange}
                  placeholder="Name"
                  className="w-full"
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Input
                  name="contactInfo"
                  value={singleCustomer.contactInfo}
                  onChange={handleSingleCustomerChange}
                  placeholder="Email"
                  className="w-full"
                />
                {formErrors.contactInfo && (
                  <p className="text-red-600 text-sm">
                    {formErrors.contactInfo}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="outstandingAmount"
                  type="number"
                  value={singleCustomer.outstandingAmount}
                  onChange={handleSingleCustomerChange}
                  placeholder="Outstanding Amount"
                  className="w-full"
                />
                {formErrors.outstandingAmount && (
                  <p className="text-red-600 text-sm">
                    {formErrors.outstandingAmount}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="dueDate"
                  type="date"
                  value={singleCustomer.dueDate}
                  onChange={handleSingleCustomerChange}
                  className="w-full"
                />
                {formErrors.dueDate && (
                  <p className="text-red-600 text-sm">{formErrors.dueDate}</p>
                )}
              </div>
              <div>
                <select
                  name="paymentStatus"
                  value={singleCustomer.paymentStatus}
                  onChange={handleSingleCustomerChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                {formErrors.paymentStatus && (
                  <p className="text-red-600 text-sm">
                    {formErrors.paymentStatus}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSingleCustomerSubmit}
                disabled={uploadLoading}
              >
                {uploadLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading customers...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error fetching customers: {JSON.stringify(error)}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}

      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex justify-end"
        >
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

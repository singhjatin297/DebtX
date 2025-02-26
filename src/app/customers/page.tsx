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
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Customer, CustomerInput } from "@/types/customer";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Table } from "@tanstack/react-table";

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
  const [tableInstance, setTableInstance] = useState<Table<Customer> | null>(
    null
  );

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

  const handleSave = async () => {
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
      setSelectedIds([]); // Reset selection
      if (tableInstance) {
        tableInstance.setRowSelection({}); // Reset Tanstack selection
      }
      toast.success("Selected customers deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete customers");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 min-h-screen bg-gray-100"
    >
      <div className="flex gap-4 mb-4">
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
              <Button onClick={handleSave} disabled={uploadLoading || !file}>
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
          setTableInstance={setTableInstance} // Pass setter for table instance
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

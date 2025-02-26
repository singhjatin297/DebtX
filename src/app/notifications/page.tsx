"use client";

import { useGetNotificationsQuery } from "@/store/apiSlice";
import { motion } from "framer-motion";
import { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const {
    data: notifications = [],
    error,
    isLoading,
  } = useGetNotificationsQuery();

  // Map notification types to display-friendly labels
  const getNotificationLabel = (type: Notification["type"]) => {
    switch (type) {
      case "new_customer":
        return "New Customer Added";
      case "payment_received":
        return "Payment Received";
      case "payment_overdue":
        return "Payment Overdue";
      case "payment_pending":
        return "Payment Pending";
      case "payment_completed":
        return "Payment Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 min-h-screen bg-gray-100"
    >
      {isLoading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-center text-red-500">
          Error loading notifications: {JSON.stringify(error)}
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              className={`p-4 rounded-lg shadow-md border flex flex-col gap-2 ${
                notif.type === "payment_received" ||
                notif.type === "payment_completed"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : notif.type === "payment_overdue"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : notif.type === "payment_pending"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-blue-100 text-blue-800 border-blue-300" // new_customer
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold text-lg">
                {getNotificationLabel(notif.type)}
              </p>
              <p className="font-medium">{notif.userName}</p>
              <p>{notif.message}</p>
              <p className="text-sm">
                Status: <span className="font-medium">{notif.status}</span>
              </p>
              <p className="text-xs text-gray-600">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

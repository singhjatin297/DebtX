"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useGetCustomersQuery,
  useGetNotificationsQuery,
} from "@/store/apiSlice";
import { motion } from "framer-motion";
import { Notification } from "@/types/notification";

function InfoCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <motion.div
      className={`bg-white p-6 rounded-lg border ${color} shadow-md`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </motion.div>
  );
}

function NotificationCard({
  notifications,
}: {
  notifications: Notification[];
}) {
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "payment_received":
      case "payment_completed":
        return (
          <svg
            className="h-4 w-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "new_customer":
        return (
          <svg
            className="h-4 w-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case "payment_overdue":
        return (
          <svg
            className="h-4 w-4 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "payment_pending":
        return (
          <svg
            className="h-4 w-4 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-md h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Activities
      </h2>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {notifications.slice(0, 5).map((notif) => (
          <div key={notif.id} className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              {getIcon(notif.type)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {notif.type === "new_customer"
                  ? "New Customer"
                  : notif.type
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
              </p>
              <p className="text-xs text-gray-500">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/notifications">
        <Button variant="outline" className="w-full mt-4">
          View All Activities
        </Button>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: customers = [], isLoading: customersLoading } =
    useGetCustomersQuery();
  const { data: notifications = [], isLoading: notificationsLoading } =
    useGetNotificationsQuery();

  if (customersLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const totalOutstanding = customers.reduce(
    (sum, customer) => sum + customer.outstandingAmount,
    0
  );
  const pendingCount = customers.filter(
    (c) => c.paymentStatus === "pending"
  ).length;
  const overdueCount = customers.filter(
    (c) => c.paymentStatus === "overdue"
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-6"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <InfoCard
            title="Total Outstanding"
            value={`$${totalOutstanding.toLocaleString()}`}
            subtitle={`${customers.length} total customers`}
            color="border-blue-300"
          />
          <InfoCard
            title="Pending Payments"
            value={`$${customers
              .filter((c) => c.paymentStatus === "pending")
              .reduce((sum, c) => sum + c.outstandingAmount, 0)
              .toLocaleString()}`}
            subtitle={`${pendingCount} pending transactions`}
            color="border-yellow-300"
          />
          <InfoCard
            title="Overdue Payments"
            value={`$${customers
              .filter((c) => c.paymentStatus === "overdue")
              .reduce((sum, c) => sum + c.outstandingAmount, 0)
              .toLocaleString()}`}
            subtitle={`${overdueCount} overdue transactions`}
            color="border-red-300"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotificationCard notifications={notifications} />
          <motion.div
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Link href="/customers">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Manage Customers
                </Button>
              </Link>
              <Link href="/notifications">
                <Button variant="outline" className="w-full">
                  View Notifications
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

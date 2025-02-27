import { PrismaClient } from "@prisma/client";
import { CustomerInput } from "../types/customer";

const prisma = new PrismaClient();

export const getCustomers = async () => {
  return await prisma.customer.findMany();
};

export const uploadCustomers = async (customers: CustomerInput[]) => {
  const formattedCustomers = customers.map((customer) => ({
    name: customer.name,
    contactInfo: customer.contactInfo,
    outstandingAmount: customer.outstandingAmount,
    dueDate: new Date(customer.dueDate),
    paymentStatus: customer.paymentStatus,
  }));
  await prisma.customer.createMany({ data: formattedCustomers });
  return formattedCustomers.length;
};

export const deleteCustomers = async (ids: string[]) => {
  await prisma.customer.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

export const updateCustomerStatus = async (
  customerId: string,
  status: "pending" | "completed" | "overdue"
) => {
  const updateData: { paymentStatus: string; outstandingAmount?: number } = {
    paymentStatus: status,
  };

  if (status === "completed") {
    updateData.outstandingAmount = 0;
  }

  return await prisma.customer.update({
    where: { id: customerId },
    data: updateData,
  });
};

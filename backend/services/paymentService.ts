import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const processPayment = async (customerId: string, amount: number) => {
  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      paymentStatus: "completed",
      outstandingAmount: { decrement: amount },
    },
  });
  return customer;
};

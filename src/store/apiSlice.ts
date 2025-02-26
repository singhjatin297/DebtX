import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Customer, CustomerInput } from "@/types/customer";
import { Notification } from "@/types/notification";

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    credentials: "include",
  }),
  tagTypes: ["Auth", "Customers", "Notifications"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
    login: builder.mutation<
      { message: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation<
      { message: string; userId: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    uploadCustomers: builder.mutation<
      { message: string; count: number },
      CustomerInput[]
    >({
      query: (customers) => ({
        url: "/customers/upload",
        method: "POST",
        body: customers,
      }),
      invalidatesTags: ["Customers", "Notifications"],
    }),
    checkAuth: builder.query<{ isAuthenticated: boolean }, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    deleteCustomers: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: "/customers/delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["Customers"],
    }),
    mockPayment: builder.mutation<
      { message: string },
      { customerId: string; amount: number }
    >({
      query: (data) => ({
        url: "/payments/mock",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers", "Notifications"],
    }),
    updateCustomerStatus: builder.mutation<
      { message: string; customer: Customer },
      { customerId: string; status: "pending" | "completed" | "overdue" }
    >({
      query: (data) => ({
        url: "/customers/update-status",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers", "Notifications"],
    }),
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useLoginMutation,
  useSignupMutation,
  useUploadCustomersMutation,
  useCheckAuthQuery,
  useLogoutMutation,
  useDeleteCustomersMutation,
  useMockPaymentMutation,
  useUpdateCustomerStatusMutation,
  useGetNotificationsQuery,
} = apiSlice;

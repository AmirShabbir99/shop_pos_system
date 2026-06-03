import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCashierDashboard: builder.query({
      query: () => "/cashier",
    }),
    getManagerDashboard: builder.query({
      query: () => "/manager",
    }),
    getAdminDashboard: builder.query({
      query: () => "/admin",
    }),
  }),
});

export const {
  useGetCashierDashboardQuery,
  useGetManagerDashboardQuery,
  useGetAdminDashboardQuery,
} = dashboardApi;
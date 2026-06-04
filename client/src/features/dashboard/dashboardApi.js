import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAdminStats:   builder.query({ query: () => "/admin" }),
    getManagerStats: builder.query({ query: () => "/manager" }),
    getCashierStats: builder.query({ query: () => "/cashier" }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetManagerStatsQuery,
  useGetCashierStatsQuery,
} = dashboardApi;
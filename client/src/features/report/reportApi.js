import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/reports",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ startDate, endDate, groupBy = "day" } = {}) =>
        `?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
    }),
    getInventoryReport: builder.query({
      query: () => "/inventory",
    }),
    getProfitReport: builder.query({
      query: ({ startDate, endDate } = {}) =>
        `?startDate=${startDate}&endDate=${endDate}`,
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetProfitReportQuery,
} = reportApi;
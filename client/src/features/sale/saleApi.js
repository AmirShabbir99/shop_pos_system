import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/sales",
    credentials: "include",
  }),
  tagTypes: ["Sale"],
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", body: data }),
      invalidatesTags: ["Sale"],
    }),
    getSales: builder.query({
      query: ({ page = 1 } = {}) => `?page=${page}&limit=20`,
      providesTags: ["Sale"],
    }),
  }),
});

export const { useCreateSaleMutation, useGetSalesQuery } = saleApi;
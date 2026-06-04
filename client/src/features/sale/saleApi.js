import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/sales",
    credentials: "include",
  }),
  tagTypes: ["Sales", "Sale"],
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    getSales: builder.query({
      query: () => "/",
      providesTags: ["Sales"],
    }),

    getSaleById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sale", id }],
    }),
  }),
});

export const {
  useCreateSaleMutation,
  useGetSalesQuery,
  useGetSaleByIdQuery,
} = saleApi;
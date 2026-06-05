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

    getSalesSummary: builder.query({
  query: () => "/summary",
}),

// getSales mein filters add karo:
getSales: builder.query({
  query: ({ page = 1, search = "", startDate = "", endDate = "", paymentMethod = "" } = {}) =>
    `?page=${page}&limit=15&search=${search}&startDate=${startDate}&endDate=${endDate}&paymentMethod=${paymentMethod}`,
  providesTags: ["Sale"],
}),
  }),
});

export const {
  useCreateSaleMutation,
  useGetSalesQuery,
  useGetSaleByIdQuery,
} = saleApi;
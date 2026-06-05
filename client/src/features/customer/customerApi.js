import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/customers", credentials: "include" }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page = 1, search = "", status = "" } = {}) =>
        `?page=${page}&search=${search}&status=${status}&limit=12`,
      providesTags: ["Customer"],
    }),
    getCustomer: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", body: data }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Customer"],
    }),
    addTransaction: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}/transaction`, method: "POST", body: data }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useAddTransactionMutation,
} = customerApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/suppliers", credentials: "include" }),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: ({ page = 1, search = "", status = "" } = {}) =>
        `?page=${page}&search=${search}&status=${status}&limit=12`,
      providesTags: ["Supplier"],
    }),
    getSupplier: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Supplier"],
    }),
    createSupplier: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", body: data }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Supplier"],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Supplier"],
    }),
    addSupplierTransaction: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}/transaction`, method: "POST", body: data }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useAddSupplierTransactionMutation,
} = supplierApi;
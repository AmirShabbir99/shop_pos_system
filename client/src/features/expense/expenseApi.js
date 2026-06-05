import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/expenses", credentials: "include" }),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: ({ page = 1, category = "", search = "", startDate = "", endDate = "" } = {}) =>
        `?page=${page}&category=${category}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", body: data }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
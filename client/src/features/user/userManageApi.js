import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//  userManageApi query
export const userManageApi = createApi({
  reducerPath: "userManageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, search = "", role = "" } = {}) =>
        `?page=${page}&search=${search}&role=${role}&limit=10`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({ url: "/register", method: "POST", body: data }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `/${id}/reset-password`,
        method: "PUT",
        body: { newPassword },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: "/profile", method: "PUT", body: data }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: "/change-password", method: "PUT", body: data }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userManageApi;
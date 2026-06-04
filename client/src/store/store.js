import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { dashboardApi } from "../features/dashboardApi";
import { categoryApi } from "../features/category/categoryApi";
import { productApi } from "../features/product/productApi";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
[categoryApi.reducerPath]: categoryApi.reducer,
[productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, dashboardApi.middleware)
  .concat(categoryApi.middleware)
  .concat(productApi.middleware),
});
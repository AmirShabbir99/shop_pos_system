import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { dashboardApi } from "../features/dashboard/dashboardApi";
import { categoryApi } from "../features/category/categoryApi";
import { productApi } from "../features/product/productApi";
import { saleApi } from "../features/sale/saleApi";
import { reportApi } from "../features/report/reportApi";
import { expenseApi } from "../features/expense/expenseApi";
import { userManageApi } from "../features/user/userManageApi";







export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [saleApi.reducerPath]: saleApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [userManageApi.reducerPath]: userManageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, dashboardApi.middleware)
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(saleApi.middleware)
      .concat(reportApi.middleware)
      .concat(expenseApi.middleware)
      .concat(userManageApi.middleware),
});
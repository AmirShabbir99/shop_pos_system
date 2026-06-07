import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AuthBootstrap from "./components/AuthBootstrap";
import ProtectedRoute from "./components/ProtectedRoute";
import { getTheme, applyTheme } from "./utils/theme";

import Login from "./pages/Login";
import CategoryPage from "./pages/admin/CategoryPage";
import ProductPage from "./pages/admin/ProductPage";
import CashierPOS from "./pages/cashier/CashierPOS";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import InvoiceSection from "./components/InvoiceSection";
import ReportsPage from "./pages/admin/ReportsPage";
import SalesHistoryPage from "./pages/shared/SalesHistoryPage";
import ExpensesPage from "./pages/shared/ExpensesPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/shared/SettingsPage";
import CustomersPage from "./pages/shared/CustomersPage";
import SuppliersPage from "./pages/shared/SuppliersPage";
import StockAlertsPage from "./pages/shared/StockAlertsPage";




const App = () => {
  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  return (
    <AuthBootstrap>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout allowedRole="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
        <Route path="/admin/pos" element={<CashierPOS />} />
        <Route path="/invoices" element={<InvoiceSection />} />

        <Route path="/admin/reports" element={<ReportsPage />} />

        <Route path="/manager/reports" element={<ReportsPage />} />

        <Route path="/admin/sales" element={<SalesHistoryPage />} />
        <Route path="/admin/expenses" element={<ExpensesPage />} />

        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/suppliers" element={<SuppliersPage />} />
        <Route path="/admin/stock-alerts"   element={<StockAlertsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <DashboardLayout allowedRole="manager" />
          </ProtectedRoute>
        }
      >
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/products" element={<ProductPage />} />
        <Route path="/manager/categories" element={<CategoryPage />} />
        <Route path="/manager/pos" element={<CashierPOS />} />

        <Route path="/manager/sales" element={<SalesHistoryPage />} />
        <Route path="/manager/expenses" element={<ExpensesPage />} />
        <Route path="/manager/settings" element={<SettingsPage />} />
        <Route path="/manager/customers" element={<CustomersPage />} />
        <Route path="/manager/suppliers" element={<SuppliersPage />} />
        <Route path="/manager/stock-alerts" element={<StockAlertsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["cashier"]}>
            <DashboardLayout allowedRole="cashier" />
          </ProtectedRoute>
        }
      >
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/cashier/pos" element={<CashierPOS />} />

        <Route path="/cashier/sales" element={<SalesHistoryPage />} />
        <Route path="/cashier/settings" element={<SettingsPage />} />
        <Route path="/cashier/customers" element={<CustomersPage />} />
        <Route path="/cashier/stock-alerts" element={<StockAlertsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AuthBootstrap>
  );
};

export default App;
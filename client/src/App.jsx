import { Routes, Route, Navigate } from "react-router-dom";
import AuthBootstrap from "./components/AuthBootstrap";
import ProtectedRoute from "./components/ProtectedRoute";

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


const App = () => (
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
        // Admin routes mein
<Route path="/admin/reports"   element={<ReportsPage />} />

// Manager routes mein
<Route path="/manager/reports" element={<ReportsPage />} />
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
      </Route>

    </Routes>
  </AuthBootstrap>
);

export default App;
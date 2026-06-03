import { Routes, Route, Navigate } from "react-router-dom";
import AuthBootstrap from "./components/AuthBootstrap";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Cashier from "./pages/Cashier";
import Manager from "./pages/Manager";
import Admin from "./pages/Admin";

function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={["cashier", "manager", "admin"]}>
              <Cashier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <Manager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthBootstrap>
  );
}

export default App;
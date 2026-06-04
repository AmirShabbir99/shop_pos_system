import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";

const DashboardLayout = ({ allowedRole }) => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // if (allowedRole && user?.role !== allowedRole) {
  //   return <Navigate to={`/${user?.role}/dashboard`} replace />;
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={user?.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
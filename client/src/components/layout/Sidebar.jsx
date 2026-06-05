import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import {
  LayoutDashboard, ShoppingCart, Package, Tag,
  AlertTriangle, Receipt, BarChart2, Wallet,
  Users, Settings, ChevronLeft, ChevronRight,
  Building2, LogOut,
  Truck,
} from "lucide-react";
import { useLowStock } from "../../hooks/useLowStock";

const NAV = {
  admin: [
    {
      label: "Main",
      items: [
        { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/pos", icon: ShoppingCart, label: "POS Screen" },
      ],
    },
    {
      label: "Inventory",
      items: [
        { to: "/admin/products", icon: Package, label: "Products", badge: null },
        { to: "/admin/categories", icon: Tag, label: "Categories" },
        { to: "/admin/stock-alerts", icon: AlertTriangle, label: "Stock Alerts", badge: "!" },
      ],
    },
    {
      label: "Sales",
      items: [
        { to: "/admin/sales", icon: Receipt, label: "Sales History" },
        { to: "/admin/reports", icon: BarChart2, label: "Reports" },
        { to: "/admin/expenses", icon: Wallet, label: "Expenses" },

        { to: "/admin/customers", icon: Users, label: "Customers" },
        { to: "/admin/suppliers", icon: Truck, label: "Suppliers" },
      ],
    },
    {
      label: "Admin",
      items: [
        { to: "/admin/users", icon: Users, label: "Users" },
        { to: "/admin/settings", icon: Settings, label: "Settings" },
      ],
    },
  ],
  manager: [
    {
      label: "Main",
      items: [
        { to: "/manager", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/manager/pos", icon: ShoppingCart, label: "POS Screen" },
      ],
    },
    {
      label: "Inventory",
      items: [
        { to: "/manager/products", icon: Package, label: "Products" },
        { to: "/manager/categories", icon: Tag, label: "Categories" },
        { to: "/manager/stock-alerts", icon: AlertTriangle, label: "Stock Alerts" },
      ],
    },
    {
      label: "Sales",
      items: [
        { to: "/manager/sales", icon: Receipt, label: "Sales History" },
        { to: "/manager/reports", icon: BarChart2, label: "Reports" },
        { to: "/admin/customers", icon: Users, label: "Customers" },
        { to: "/admin/suppliers", icon: Truck, label: "Suppliers" },
      ],
    },
  ],
  cashier: [
    {
      label: "Main",
      items: [
        { to: "/cashier", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/cashier/pos", icon: ShoppingCart, label: "POS Screen" },
      ],
    },
    {
      label: "Sales",
      items: [
        { to: "/cashier/sales", icon: Receipt, label: "My Sales" },
      ],
    },
  ],
};

const Sidebar = ({ role = "admin" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [logout] = useLogoutMutation();
  const { lowStockCount } = useLowStock();
  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate("/login");
  };

  const sections = NAV[role] || NAV.admin;

  return (
    <aside
      className={`flex flex-col h-screen bg-[#1E1E2D] transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-14" : "w-56"}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between px-3 py-3.5 border-b border-white/[0.07] min-h-[52px]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-medium text-white whitespace-nowrap">
              POS System
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center text-white/50 hover:text-white/80 transition flex-shrink-0"
        >
          {collapsed
            ? <ChevronRight size={13} />
            : <ChevronLeft size={13} />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
        {sections.map((section) => (
          <div key={section.label} className="px-2 mb-1">
            {!collapsed && (
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-2 py-2">
                {section.label}
              </p>
            )}
            {section.items.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 px-2 py-2.5 rounded-lg mb-0.5 transition-all
                  ${isActive
                    ? "bg-indigo-500 text-white"
                    : "text-white/50 hover:bg-white/[0.07] hover:text-white/80"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-[13px] flex-1 whitespace-nowrap">{label}</span>
                    )}
                    {!collapsed && badge && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full
                        ${isActive ? "bg-white/25 text-white" : "bg-white/10 text-white/70"}`}>
                        {badge}
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1E1E2D] text-white text-xs rounded-lg
                        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                        border border-white/10 z-50">
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {collapsed && <div className="border-b border-white/[0.05] my-2 mx-1" />}

          
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/85 truncate">{user?.name}</p>
              <p className="text-[11px] text-white/40 capitalize">{user?.role}</p>
            </div>
          )}
          {/* {!collapsed && item.to.includes("stock-alerts") && lowStockCount > 0 && (
            <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
              {lowStockCount}
            </span>
          )} */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-red-400 transition flex-shrink-0"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
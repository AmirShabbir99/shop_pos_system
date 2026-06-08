import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
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
      key: "main_nav",
      items: [
        { to: "/admin", icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
        { to: "/admin/pos", icon: ShoppingCart, label: "POS Screen", key: "pos_screen" },
      ],
    },
    {
      label: "Inventory",
      key: "inventory_nav",
      items: [
        { to: "/admin/products", icon: Package, label: "Products", badge: null, key: "products" },
        { to: "/admin/categories", icon: Tag, label: "Categories", key: "categories" },
        { to: "/admin/stock-alerts", icon: AlertTriangle, label: "Stock Alerts", badge: "!", key: "stock_alerts" },
      ],
    },
    {
      label: "Sales",
      key: "sales_nav",
      items: [
        { to: "/admin/sales", icon: Receipt, label: "Sales History", key: "sales_history" },
        { to: "/admin/reports", icon: BarChart2, label: "Reports", key: "reports" },
        { to: "/admin/expenses", icon: Wallet, label: "Expenses", key: "expenses" },
        { to: "/admin/customers", icon: Users, label: "Customers", key: "customers" },
        { to: "/admin/suppliers", icon: Truck, label: "Suppliers", key: "suppliers" },
      ],
    },
    {
      label: "Admin",
      key: "admin_nav",
      items: [
        { to: "/admin/users", icon: Users, label: "Users", key: "users" },
        { to: "/admin/settings", icon: Settings, label: "Settings", key: "settings" },
      ],
    },
  ],
  manager: [
    {
      label: "Main",
      key: "main_nav",
      items: [
        { to: "/manager", icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
        { to: "/manager/pos", icon: ShoppingCart, label: "POS Screen", key: "pos_screen" },
      ],
    },
    {
      label: "Inventory",
      key: "inventory_nav",
      items: [
        { to: "/manager/products", icon: Package, label: "Products", key: "products" },
        { to: "/manager/categories", icon: Tag, label: "Categories", key: "categories" },
        { to: "/manager/stock-alerts", icon: AlertTriangle, label: "Stock Alerts", key: "stock_alerts" },
      ],
    },
    {
      label: "Sales",
      key: "sales_nav",
      items: [
        { to: "/manager/sales", icon: Receipt, label: "Sales History", key: "sales_history" },
        { to: "/manager/reports", icon: BarChart2, label: "Reports", key: "reports" },
        { to: "/admin/customers", icon: Users, label: "Customers", key: "customers" },
        { to: "/admin/suppliers", icon: Truck, label: "Suppliers", key: "suppliers" },
      ],
    },
  ],
  cashier: [
    {
      label: "Main",
      key: "main_nav",
      items: [
        { to: "/cashier", icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
        { to: "/cashier/pos", icon: ShoppingCart, label: "POS Screen", key: "pos_screen" },
      ],
    },
    {
      label: "Sales",
      key: "sales_nav",
      items: [
        { to: "/cashier/sales", icon: Receipt, label: "My Sales", key: "sales_history" },
      ],
    },
  ],
};

const Sidebar = ({ role = "admin" }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
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
      className={`flex flex-col h-screen bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-14" : "w-56"}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between px-3 py-3.5 border-b border-gray-100 dark:border-gray-800 min-h-[52px]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
              {t("pos_system")}
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-collapse-btn w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition flex-shrink-0"
        >
          {collapsed
            ? (isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />)
            : (isRTL ? <ChevronRight size={13} /> : <ChevronLeft size={13} />)
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
        {sections.map((section) => (
          <div key={section.label} className="px-2 mb-1">
            {!collapsed && (
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 py-2">
                {t(section.key)}
              </p>
            )}
            {section.items.map(({ to, icon: Icon, label, badge, key }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? t(key) : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 px-2 py-2.5 rounded-lg mb-0.5 transition-all
                  ${isActive
                    ? "bg-indigo-500 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-[13px] flex-1 whitespace-nowrap">{t(key)}</span>
                    )}
                    {!collapsed && badge && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full
                        ${isActive ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                        {badge}
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-white dark:bg-black text-gray-800 dark:text-white text-xs rounded-lg
                        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                        border border-gray-200 dark:border-gray-800 z-50">
                        {t(key)}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {collapsed && <div className="border-b border-gray-100 dark:border-gray-800 my-2 mx-1" />}

          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={t("logout")}
            className="w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition flex-shrink-0"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
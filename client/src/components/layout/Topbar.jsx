import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { getTheme, applyTheme } from "../../utils/theme";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  pos:          "POS Screen",
  products:     "Products",
  categories:   "Categories",
  sales:        "Sales History",
  reports:      "Reports",
  expenses:     "Expenses",
  users:        "Users",
  settings:     "Settings",
  "stock-alerts": "Stock Alerts",
};

const Topbar = () => {
  const { user }   = useSelector((s) => s.auth);
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() => {
    const theme = getTheme();
    return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = getTheme();
      setDark(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));
    };

    window.addEventListener("theme-change", handleThemeChange);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (getTheme() === "system") {
        setDark(mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = dark ? "light" : "dark";
    applyTheme(nextTheme);
  };

  const segment = pathname.split("/").pop();
  const title   = PAGE_TITLES[segment] || "Dashboard";

  return (
    <header className="h-[52px] bg-white border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
          <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-gray-700 leading-none">{user?.name}</p>
            <p className="text-[11px] text-gray-400 capitalize leading-none mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
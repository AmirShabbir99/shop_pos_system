import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { getTheme, applyTheme } from "../../utils/theme";
import { useTranslation } from "react-i18next";

const PAGE_TITLES = {
  dashboard:    "dashboard",
  pos:          "pos_screen",
  products:     "products",
  categories:   "categories",
  sales:        "sales_history",
  reports:      "reports",
  expenses:     "expenses",
  users:        "users",
  settings:     "settings",
  "stock-alerts": "stock_alerts",
};

const Topbar = () => {
  const { user }   = useSelector((s) => s.auth);
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
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

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  const segment = pathname.split("/").pop();
  const titleKey   = PAGE_TITLES[segment] || "dashboard";
  const title = t(titleKey);

  return (
    <header className="h-[52px] bg-white border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <select
          value={i18n.language}
          onChange={changeLanguage}
          className="text-xs bg-white dark:bg-black text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer h-8 transition"
        >
          <option value="en">English</option>
          <option value="ur">اردو</option>
          <option value="ru">Roman Urdu</option>
        </select>

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
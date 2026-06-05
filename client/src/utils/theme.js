export const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const getTheme = () => {
  return localStorage.getItem("theme") || "system";
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  const activeTheme = theme === "system" ? getSystemTheme() : theme;

  if (activeTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
  // Dispatch custom event to notify other components of theme change
  window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
};

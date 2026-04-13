import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className="flex items-center justify-between p-4 border-b border-border-subtle bg-card transition-colors">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Library" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-foreground">Library Hub</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Moon /> : <Sun />}
      </button>
    </header>
  );
}

import { Sun, Moon, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./Login";
import Button from "./Button";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-border-subtle bg-card transition-colors sticky top-0 z-50 shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="Library" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Library Hub
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Toggle Dark Mode"
            icon={isDarkMode ? Moon : Sun}
          />

          {user ? (
            <div
              className="relative flex items-center gap-3 pl-4 border-l border-border-subtle"
              ref={dropdownRef}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded-full transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-background ring-offset-2 ring-offset-border-subtle hover:scale-105 transition-transform">
                  {getInitials(user.name)}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border-subtle rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border-subtle">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wider font-bold mt-0.5">
                      {user.roles?.[0] || "Member"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pl-4 border-l border-border-subtle">
              <Button
                onClick={() => setIsLoginOpen(true)}
                variant="primary"
                size="md"
                className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                icon={User}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}

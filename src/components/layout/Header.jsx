import { Sun, Moon, LogOut, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import AuthModal from "./AuthModal";
import Button from "../ui/Button";

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
      {/* ── Premium Glassmorphism Wrapper ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle transition-colors">
        {/* ── Grid Alignment Container ── */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <img
              src="/logo.png"
              alt="Library"
              className="w-9 h-9 transition-transform group-hover:scale-105"
            />
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Library Hub
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              aria-label="Toggle Dark Mode"
              icon={isDarkMode ? Moon : Sun}
              className="rounded-full w-10 h-10 p-0 transition-transform hover:scale-110 active:scale-90"
            />

            {user ? (
              <div
                className="relative flex items-center gap-3 pl-2 sm:pl-4 border-l border-border-subtle"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full outline-hidden ring-2 ring-transparent focus:ring-accent/50 transition-all"
                >
                  {/* Sleeker Avatar */}
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-accent to-accent/80 flex items-center justify-center text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                    {getInitials(user.name)}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-card border border-border-subtle rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border-subtle/50">
                      <p className="text-sm font-bold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                        {user.roles?.[0] || "Member"}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="pl-2 sm:pl-4 border-l border-border-subtle">
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  variant="solid"
                  size="md"
                  className="rounded-full px-6"
                  icon={User}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

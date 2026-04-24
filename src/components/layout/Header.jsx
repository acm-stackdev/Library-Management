import { Sun, Moon, LogOut, User, Plus, ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/useToast";
import AuthModal from "./AuthModal";
import BookModal from "./BookModal";
import Button from "../ui/Button";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toast = useToast();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes("Admin");

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

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    closeMenus();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link
            to="/"
            onClick={closeMenus}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
          >
            <img
              src="/logo.png"
              alt="Library"
              className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105"
            />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              <span className="hidden xs:inline">Library Hub</span>
              <span className="xs:hidden">LH</span>
            </h1>
            <span className="w-fit px-1 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] leading-none">
              Beta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user && isAdmin && (
              <Button
                onClick={() => setIsBookModalOpen(true)}
                variant="primary"
                icon={Plus}
                className="rounded-full px-5 h-10 font-bold"
              >
                Add Book
              </Button>
            )}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              aria-label="Toggle Dark Mode"
              icon={isDarkMode ? Moon : Sun}
              className="rounded-full w-10 h-10 p-0 transition-transform hover:scale-110 active:scale-90"
            />

            {user ? (
              <div
                className="relative flex items-center gap-3 pl-4 border-l border-border-subtle"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full outline-hidden ring-2 ring-transparent focus:ring-accent/50 transition-all"
                >
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
                    {isAdmin ? (
                      <div className="p-2">
                        <button
                          onClick={() => handleNavigation("/admin")}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-xl transition-colors font-medium"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Panel
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <button
                          onClick={() => handleNavigation("/profile")}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-xl transition-colors font-medium"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                      </div>
                    )}
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
              <div className="pl-4 border-l border-border-subtle">
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

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              aria-label="Toggle Dark Mode"
              icon={isDarkMode ? Moon : Sun}
              className="rounded-full w-10 h-10 p-0"
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle bg-background animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-4 pb-4 border-b border-border-subtle/50">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent to-accent/80 flex items-center justify-center text-white text-lg font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {user.roles?.[0] || "Member"}
                      </p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setIsBookModalOpen(true);
                            closeMenus();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Add New Book
                        </button>
                        <button
                          onClick={() => handleNavigation("/admin")}
                          className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-5 h-5" />
                          Admin Dashboard
                        </button>
                      </>
                    )}
                    {!isAdmin && (
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-colors"
                      >
                        <User className="w-5 h-5" />
                        My Profile
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </nav>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground text-sm font-medium">
                    Welcome to Library Hub. Sign in to manage your books.
                  </p>
                  <Button
                    onClick={() => {
                      setIsLoginOpen(true);
                      closeMenus();
                    }}
                    variant="solid"
                    size="lg"
                    className="w-full rounded-xl justify-center"
                    icon={User}
                  >
                    Login to Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </>
  );
}

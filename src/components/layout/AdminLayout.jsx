import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Library,
  ArrowLeftRight,
  CreditCard,
  Menu,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "User Management", path: "/admin/users", icon: Users },
  { name: "Role & Security", path: "/admin/roles", icon: ShieldCheck },
  { name: "Catalog Settings", path: "/admin/categories", icon: Library },
  { name: "Book Loans", path: "/admin/bookloans", icon: ArrowLeftRight },
  { name: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
];

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentNav = NAV_LINKS.find((link) =>
    link.end
      ? location.pathname === link.path
      : location.pathname.startsWith(link.path),
  );
  const pageTitle = currentNav ? currentNav.name : "Admin Dashboard";

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto flex w-full h-full px-4 sm:px-6 lg:px-8">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed lg:static top-16 md:top-20 left-0 z-50 
            h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] lg:h-full w-64 
            bg-card lg:bg-background border-r border-border-subtle shadow-xl lg:shadow-none 
            transform transition-transform duration-300 flex flex-col lg:pr-6
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 space-y-1.5">
            <p className="px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Admin Menu
            </p>
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={2.5} />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* ── Main Content Wrapper ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background lg:pl-6">
          <header className="h-14 flex items-center gap-4 border-b border-border-subtle shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-foreground">{pageTitle}</h2>
          </header>

          {/* ── Dynamic Content Area (The Outlet) ── */}
          <main className="flex-1 overflow-y-auto py-6">
            <div className="w-full animate-in fade-in duration-500 pb-20">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

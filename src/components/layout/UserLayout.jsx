import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { User, History, Menu, Home, Heart } from "lucide-react";

const MEMBER_LINKS = [
  { name: "My Profile", path: "/profile", icon: User, end: true },
  { name: "Wishlist", path: "/profile/wishlist", icon: Heart },
  { name: "Loan History", path: "/profile/loans", icon: History },
];

export default function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentNav = MEMBER_LINKS.find((link) =>
    link.end
      ? location.pathname === link.path
      : location.pathname.startsWith(link.path),
  );

  const pageTitle = currentNav ? currentNav.name : "Member Hub";

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-background text-foreground overflow-hidden">
      {/* ── Brute Force Scrollbar Fix ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none !important; }
        .hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `,
        }}
      />

      <div className="max-w-7xl mx-auto flex w-full h-full px-4 sm:px-6 lg:px-8">
        {/* Mobile Overlay */}
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
          <nav className="flex-1 overflow-y-auto py-8 space-y-1.5 hide-scrollbar">
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Member Hub
            </p>
            {MEMBER_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }
                `}
              >
                <link.icon size={18} strokeWidth={2.5} />
                {link.name}
              </NavLink>
            ))}

            {/* Bottom Utility Link */}
            <div className="pt-6 mt-6 border-t border-border-subtle">
              <NavLink
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground font-bold text-sm hover:text-accent transition-colors"
              >
                <Home size={18} />
                Explore Library
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* ── Main Content Wrapper ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background lg:pl-10">
          <header className="h-20 flex items-center gap-4 border-b border-border-subtle shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {pageTitle}
            </h2>
          </header>

          {/* ── Content Area ── */}
          <main className="flex-1 overflow-y-auto py-8 hide-scrollbar">
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

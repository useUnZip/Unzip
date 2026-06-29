import { Outlet, NavLink, Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTree,
  Server,
  KeyRound,
  Settings,
  ArrowUpRight,
  FileText,
  ScrollText,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/requests", label: "Requests", icon: ListTree },
  { to: "/app/providers", label: "Providers", icon: Server },
  { to: "/app/keys", label: "API Keys", icon: KeyRound },
];

export const AppShell = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-foreground/40" />
      </div>
    );
  }
  if (!user) return <Navigate to="/signin" replace />;

  const allNav = [...navItems, { to: "/app/settings", label: "Settings", icon: Settings }];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <img src="/unzip-logo.png" alt="" aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
          <span className="font-sans-display text-[14px] font-medium tracking-tight">UnZip</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1 text-[12px] font-medium text-foreground/50 hover:text-foreground transition-colors"
        >
          Back to Site
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <aside className="hidden md:flex flex-col w-56 border-r border-border/50 px-3 py-6 gap-1 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-3 mb-6">
          <img src="/unzip-logo.png" alt="" aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
          <span className="font-sans-display text-[14px] font-medium tracking-tight">UnZip</span>
        </Link>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5"
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-0.5">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5"
              }`
            }
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            Settings
          </NavLink>
          <Link
            to="/docs"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            Documentation
          </Link>
          <Link
            to="/whitepaper"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
          >
            <ScrollText className="h-4 w-4 flex-shrink-0" />
            Whitepaper
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
            Back to Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav aria-label="Mobile primary navigation" className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-around h-16 pb-[env(safe-area-inset-bottom)] border-t border-border/50 bg-background/90 backdrop-blur-md">
        {allNav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

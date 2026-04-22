import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: Home, key: "nav_home" as const },
  { to: "/dashboard", icon: LayoutDashboard, key: "nav_dashboard" as const },
  { to: "/practice", icon: Gamepad2, key: "nav_simulation" as const },
  { to: "/fact-check", icon: ShieldCheck, key: "nav_detector" as const },
  { to: "/twin", icon: Sparkles, key: "nav_twin" as const },
  { to: "/election-day", icon: CalendarCheck, key: "nav_eday" as const },
];

export default function TopNav() {
  const { t } = useI18n();
  const loc = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return loc.pathname === "/";
    return loc.pathname.startsWith(path);
  };

  return (
    <>
      {/* 🔥 DESKTOP NAV */}
      <header className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(960px,calc(100%-2rem))]">
        <div className="glass-strong rounded-full px-3 py-2 w-full flex items-center gap-2 shadow-xl border border-white/10 backdrop-blur-xl">
          
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2 px-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-aurora flex items-center justify-center shadow-glow group-hover:scale-110 transition">
              <Vote className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm gradient-text">
              VoteWise
            </span>
          </NavLink>

          {/* NAV LINKS */}
          <nav className="flex-1 flex items-center justify-center gap-1">
            {links.map(({ to, icon: Icon, key }) => {
              const active = isActive(to);

              return (
                <NavLink
                  key={to}
                  to={to}
                  className="relative px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.05]"
                >
                  {active && (
                    <motion.span
                      layoutId="navpill"
                      className="absolute inset-0 bg-gradient-primary rounded-full shadow-glow"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className={cn(
                      "relative flex items-center gap-1.5",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t(key)}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* LANGUAGE */}
          <LangToggle />
        </div>
      </header>

      {/* 📱 MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-aurora flex items-center justify-center">
            <Vote className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold gradient-text">
            VoteWise
          </span>
        </NavLink>
        <LangToggle />
      </header>

      {/* 📱 MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around shadow-xl border border-white/10 backdrop-blur-xl">
        {links.map(({ to, icon: Icon, key }) => {
          const active = isActive(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] font-medium transition-all duration-200"
            >
              {active && (
                <motion.span
                  layoutId="navpill-mobile"
                  className="absolute inset-0 bg-gradient-primary rounded-xl shadow-glow"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={cn(
                  "relative flex flex-col items-center gap-0.5",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="leading-none">{t(key)}</span>
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
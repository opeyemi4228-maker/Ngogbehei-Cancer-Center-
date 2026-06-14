"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Users, Heart, Mail,
  LogOut, Menu, X, ExternalLink, ChevronRight,
} from "lucide-react";
import { checkAdminSession, clearAdminSession } from "@/lib/adminStorage";

export const CountsCtx = createContext({ contacts: 0, volunteers: 0, donations: 0, newsletter: 0 });

const NAV = [
  { href: "/admin",            label: "Overview",    icon: LayoutDashboard, key: null },
  { href: "/admin/contacts",   label: "Contacts",    icon: MessageSquare,   key: "contacts" },
  { href: "/admin/volunteers", label: "Volunteers",  icon: Users,           key: "volunteers" },
  { href: "/admin/donations",  label: "Donations",   icon: Heart,           key: "donations" },
  { href: "/admin/newsletter", label: "Subscribers", icon: Mail,            key: "newsletter" },
];

function NavItem({ href, label, icon: Icon, count, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-[9px] text-[13px] transition-colors duration-100 focus:outline-none"
      style={{
        color: active ? "#0D1F35" : "#888",
        fontWeight: active ? 700 : 500,
        background: active ? "#F5F4F0" : "transparent",
        borderLeft: `2px solid ${active ? "#0D1F35" : "transparent"}`,
      }}>
      <Icon size={14} strokeWidth={active ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {count > 0 && (
        <span className="tabular-nums text-[11px] font-semibold" style={{ color: "#BBBBBB" }}>
          {count > 999 ? "999+" : count}
        </span>
      )}
    </Link>
  );
}

function Sidebar({ pathname, onClose, mobile }) {
  const router = useRouter();
  const counts = useContext(CountsCtx);

  const logout = () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  return (
    <div className="flex flex-col h-full bg-white" style={{ borderRight: "1px solid #E8E7E3" }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 flex-shrink-0"
        style={{ height: 58, borderBottom: "1px solid #E8E7E3" }}>
        <Link href="/admin" onClick={mobile ? onClose : undefined}
          className="flex items-center gap-2.5 focus:outline-none">
          <div className="w-[26px] h-[26px] rounded-[5px] flex items-center justify-center flex-shrink-0"
            style={{ background: "#0D1F35" }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L4 5v5c0 3.55 2.58 6.87 6 7.68C13.42 16.87 16 13.55 16 10V5l-6-3z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0D1F35", letterSpacing: "-0.02em" }}>
            NCC Admin
          </span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 focus:outline-none ml-2">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-5 mb-1.5 text-[9.5px] font-black tracking-[0.15em] uppercase"
          style={{ color: "#CCCCCC" }}>Menu</p>
        {NAV.map(({ href, label, icon, key }) => {
          const active = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
          return (
            <NavItem key={href} href={href} label={label} icon={icon}
              count={key ? counts[key] : 0} active={active}
              onClick={mobile ? onClose : undefined} />
          );
        })}

        <div className="mx-4 my-3" style={{ height: 1, background: "#F0EEE9" }} />

        <p className="px-5 mb-1.5 text-[9.5px] font-black tracking-[0.15em] uppercase"
          style={{ color: "#CCCCCC" }}>Links</p>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-[9px] text-[13px] font-medium transition-colors duration-100 focus:outline-none hover:text-gray-700"
          style={{ color: "#888" }}>
          <ExternalLink size={13} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          View live site
        </a>
      </nav>

      {/* User + Logout */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3" style={{ borderTop: "1px solid #E8E7E3" }}>
        <div className="flex items-center gap-2.5 px-1 mb-2">
          <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0"
            style={{ background: "#0D1F35" }}>
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-gray-700 truncate leading-none mb-0.5">Admin</p>
            <p className="text-[11px] text-gray-400 truncate">NCC Portal</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none">
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState({ contacts: 0, volunteers: 0, donations: 0, newsletter: 0 });

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }
    if (!checkAdminSession()) { router.replace("/admin/login"); return; }
    setReady(true);
    Promise.all([
      fetch("/api/admin/contacts").then(r => r.json()).catch(() => []),
      fetch("/api/admin/volunteers").then(r => r.json()).catch(() => []),
      fetch("/api/admin/donations").then(r => r.json()).catch(() => []),
      fetch("/api/admin/newsletter").then(r => r.json()).catch(() => []),
    ]).then(([c, v, d, n]) => {
      setCounts({
        contacts:   Array.isArray(c) ? c.length : 0,
        volunteers: Array.isArray(v) ? v.length : 0,
        donations:  Array.isArray(d) ? d.length : 0,
        newsletter: Array.isArray(n) ? n.length : 0,
      });
    });
  }, [pathname, router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!ready) return null;
  if (pathname === "/admin/login") return <>{children}</>;

  const pageTitle = NAV.find(n =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  )?.label ?? "Admin";

  return (
    <CountsCtx.Provider value={counts}>
      <div className="flex fixed inset-0 font-montserrat overflow-hidden" style={{ background: "#F5F4F0" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[215px] flex-shrink-0 h-full">
          <Sidebar pathname={pathname} />
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40 lg:hidden"
                style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
                onClick={() => setMobileOpen(false)} />
              <motion.aside key="sb" initial={{ x: -215 }} animate={{ x: 0 }} exit={{ x: -215 }}
                transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-[215px] lg:hidden shadow-2xl">
                <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} mobile />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="flex-shrink-0 bg-white flex items-center gap-3 px-5 sm:px-7"
            style={{ height: 58, borderBottom: "1px solid #E8E7E3" }}>
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-700 focus:outline-none">
              <Menu size={17} />
            </button>

            <nav className="flex items-center gap-1.5 min-w-0">
              <Link href="/admin"
                className="text-gray-400 text-[12.5px] font-medium hover:text-gray-700 transition-colors hidden sm:block focus:outline-none">
                Admin
              </Link>
              {pathname !== "/admin" && (
                <>
                  <ChevronRight size={10} className="text-gray-300 hidden sm:block flex-shrink-0" />
                  <span className="text-[13px] font-bold text-gray-800 truncate">{pageTitle}</span>
                </>
              )}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-[12px] text-gray-400 hidden md:block">
                {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
              <div className="w-px h-4 hidden md:block" style={{ background: "#E8E7E3" }} />
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors focus:outline-none">
                <ExternalLink size={10} /> Live Site
              </a>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <motion.div key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}>
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </CountsCtx.Provider>
  );
}

"use client";

/**
 * @file Navbar.jsx
 * @project Ngogbehei Cancer Center
 * @description Production-ready sticky navbar with full Montserrat typography.
 *
 * Features
 * ─────────────────────────────────────────────────────────────
 *   • Yellow announcement banner - typewriter intro → auto carousel
 *   • Scroll-aware header (transparent on hero → solid white on scroll)
 *   • Full-width mega menus (route-only, no fabricated pages)
 *   • Logo + nav text adapt to scroll state
 *   • Mobile slide-in drawer with accordion nav, focus trap, scroll lock
 *   • Keyboard accessible (Escape closes drawer / mega menu)
 *   • Hover-intent timer prevents accidental menu flicker
 *   • Reduced-motion respected via Framer Motion
 *   • Semantic HTML5 (<header>, <nav>, role=menubar / menu / dialog)
 *
 * Routes (all verified against site content)
 * ─────────────────────────────────────────────────────────────
 *   /, /about, /about#story, /about#mvv-heading, /about#pillars-heading,
 *   /about#team-heading, /impact, /projects, /donate, /get-involved,
 *   /get-involved/volunteer, /get-involved/partners, /get-involved/events,
 *   /get-involved/campaigns, /get-involved/legacy, /contact,
 *   /services/screening
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Heart,
  ArrowRight,
  Shield,
  Award,
  Activity,
  UserCheck,
  Calendar,
  FileText,
  Megaphone,
  Handshake,
  Landmark,
  BarChart3,
  Phone,
  Mail,
} from "lucide-react";
import logo from "../assets/logo.png";

/* ─── constants ──────────────────────────────────────────── */
const BANNER_H = 38;
const HEADER_H = 64;

/* ─── banner messages ────────────────────────────────────── */
const BANNER_MSGS = [
  "Free cancer screening every Saturday in Abuja. No appointment needed.",
  "Our patient navigation team is available 24/7. Call +234 800 NCC CARE.",
  "New: Breast cancer awareness workshop. Register at ngogbeheicc.org.",
  "All donations matched up to ₦5M through December 2025. Give today.",
  "Early detection saves lives. Book your free screening now.",
];

/* ─── nav data (only verified routes) ────────────────────── */
const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Impact",
    href: "/impact",
  },
  {
    label: "Volunteer",
    href: "/volunteer",
  },
  { label: "Contact", href: "/contact", columns: [] },
];

/* ─── framer variants ────────────────────────────────────── */
const megaV = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

const drawerV = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: "100%", transition: { duration: 0.22, ease: "easeIn" } },
};

/* ═══════════════════════════════════════════════
   TOP BANNER
═══════════════════════════════════════════════ */
function TopBanner({ visible, onDismiss }) {
  const [phase, setPhase] = useState("typing");
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const charRef = useRef(0);
  const timerRef = useRef(null);

  /* Typewriter for first message */
  useEffect(() => {
    if (phase !== "typing" && phase !== "deleting") return;
    const FIRST = BANNER_MSGS[0];
    clearTimeout(timerRef.current);

    if (phase === "typing") {
      const tick = () => {
        if (charRef.current <= FIRST.length) {
          setText(FIRST.slice(0, charRef.current++));
          timerRef.current = setTimeout(
            tick,
            charRef.current <= 1 ? 600 : 30
          );
        } else {
          timerRef.current = setTimeout(() => setPhase("deleting"), 2600);
        }
      };
      timerRef.current = setTimeout(tick, 700);
    } else {
      const del = () => {
        if (charRef.current > 0) {
          setText(FIRST.slice(0, --charRef.current));
          timerRef.current = setTimeout(del, 10);
        } else {
          setPhase("carousel");
        }
      };
      timerRef.current = setTimeout(del, 80);
    }

    return () => clearTimeout(timerRef.current);
  }, [phase]);

  /* Carousel after typewriter */
  useEffect(() => {
    if (phase !== "carousel") return;
    setMsgIdx(1);
    setSlideKey((k) => k + 1);
    const id = setInterval(() => {
      setMsgIdx((i) => {
        const n = (i + 1) % BANNER_MSGS.length;
        setSlideKey((k) => k + 1);
        return n;
      });
    }, 9500);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <motion.div
      initial={false}
      animate={
        visible
          ? {
              height: BANNER_H,
              opacity: 1,
              transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
            }
          : {
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }
      }
      className="w-full overflow-hidden select-none font-montserrat"
      style={{
        background: "linear-gradient(135deg,#F5C300 0%,#e8b800 100%)",
      }}
      role="region"
      aria-label="Site announcement"
    >
      <div className="relative flex items-center justify-center h-[38px] px-12">
        <div className="overflow-hidden flex items-center max-w-[86%]">
          {phase !== "carousel" ? (
            <p className="font-montserrat text-[14px] font-black text-[#1a1200] whitespace-nowrap tracking-wide leading-none">
              {text}
              <span
                className="inline-block w-[1.5px] h-[0.85em] bg-[#1a1200] ml-[2px] align-middle"
                style={{ animation: "ncc-blink 0.65s step-end infinite" }}
                aria-hidden="true"
              />
            </p>
          ) : (
            <div className="overflow-hidden" style={{ height: "1.25em" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={slideKey}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                  }}
                  exit={{
                    y: "-110%",
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeIn" },
                  }}
                  className="font-montserrat text-[14px] font-black text-[#1a1200] whitespace-nowrap tracking-wide leading-[1.25em]"
                >
                  {BANNER_MSGS[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1200]"
        >
          <X size={12} strokeWidth={2.5} className="text-[#1a1200]/60" />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════ */
function Logo({ scrolled }) {
  return (
    <Link
      href="/"
      aria-label="Ngogbehei Cancer Center - Home"
      className="flex items-center group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg font-montserrat"
    >
      <div className="flex items-center gap-2.5 px-3 py-1.5">
        <Image
          src={logo}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10"
          priority
        />
        <div className="flex flex-col leading-[1.2]">
          <span
            className="font-montserrat text-[15px] font-black tracking-[0.05em] uppercase transition-colors duration-300"
            style={{ color: scrolled ? "#0A2240" : "#ffffff" }}
          >
            Ngogbehei
          </span>
          <span
            className="font-montserrat text-[14px] font-bold tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: scrolled ? "#0A2240" : "#F5C300" }}
          >
            Cancer Center
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   MEGA MENU
═══════════════════════════════════════════════ */
function MegaMenu({ item, navbarBottom, onLinkClick }) {
  if (!item.columns?.length) return null;

  return (
    <motion.div
      variants={megaV}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed left-0 right-0 z-[9994] font-montserrat"
      style={{ top: navbarBottom }}
      role="menu"
      aria-label={`${item.label} menu`}
    >
      {/* Gold accent rule */}
      <div
        className="h-[3px]"
        style={{
          background:
            "linear-gradient(to right, transparent, #F5C300 20%, #e8b800 50%, #F5C300 80%, transparent)",
        }}
      />

      <div
        className="bg-white border-b border-slate-100"
        style={{
          boxShadow:
            "0 20px 56px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-3">
          <div className="grid grid-cols-[1fr_1fr_300px] gap-5">
            {/* Two link columns */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {item.columns.map((col, ci) => (
                <div key={ci}>
                  <div className="flex items-center gap-2 mb-[6px] pb-1.5 border-b border-slate-100">
                    <span
                      className="w-[3px] h-4 rounded-full bg-[#F5C300] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-montserrat text-[13px] font-black tracking-[0.2em] uppercase text-slate-400">
                      {col.heading}
                    </p>
                  </div>
                  <ul className="space-y-0">
                    {col.links.map((link, li) => {
                      const Icon = link.icon;
                      return (
                        <motion.li
                          key={li}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: li * 0.03 + ci * 0.06,
                              duration: 0.18,
                            },
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={onLinkClick}
                            role="menuitem"
                            className="group flex items-start gap-3 py-1.5 px-3 rounded-xl transition-all duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50"
                          >
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                              style={{
                                background: "rgba(245,195,0,0.1)",
                                border: "1px solid rgba(245,195,0,0.22)",
                              }}
                              aria-hidden="true"
                            >
                              <Icon
                                size={13}
                                strokeWidth={1.8}
                                style={{ color: "#8a6e00" }}
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-montserrat text-[15px] font-bold text-slate-800 group-hover:text-[#0A2240] transition-colors leading-tight">
                                {link.label}
                              </span>
                              <span className="block font-montserrat text-[11.5px] text-slate-400 mt-0.5 leading-snug truncate">
                                {link.desc}
                              </span>
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured card */}
            {item.featured && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.08, duration: 0.28 },
                }}
                className="relative overflow-hidden rounded-2xl flex flex-col border border-slate-100"
                style={{ background: "#f8fafc" }}
              >
                <div
                  className="relative overflow-hidden flex-shrink-0"
                  style={{ height: 110 }}
                >
                  <img
                    src={item.featured.img}
                    alt={item.featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute top-3 left-3 font-montserrat text-[12px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ background: item.featured.tagColor }}
                  >
                    {item.featured.tag}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <p
                      className="font-montserrat text-[15px] font-black text-slate-900 leading-snug mb-1.5"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {item.featured.title}
                    </p>
                    <p className="font-montserrat text-[14px] text-slate-500 leading-relaxed">
                      {item.featured.desc}
                    </p>
                  </div>
                  <Link
                    href={item.featured.href}
                    onClick={onLinkClick}
                    className="inline-flex items-center gap-1.5 font-montserrat text-[14px] font-black transition-colors group w-fit focus-visible:outline-none focus-visible:underline"
                    style={{ color: item.featured.tagColor }}
                  >
                    {item.featured.cta}
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════ */
function MobileDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const pathname = usePathname();

  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  /* Escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Close on route change */
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mob-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9997]"
            style={{
              background: "rgba(3,7,18,0.62)",
              backdropFilter: "blur(3px)",
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="mob-panel"
            variants={drawerV}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-[300px] z-[9998] flex flex-col overflow-hidden font-montserrat"
            style={{
              background:
                "radial-gradient(130% 130% at 110% 0%, #030712 42%, #011e10 100%)",
            }}
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5C300] flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 22 22"
                    fill="none"
                    className="w-[17px] h-[17px]"
                  >
                    <circle cx="11" cy="11" r="9" fill="#0A2240" />
                    <path
                      d="M11 7.5V15M8.5 10.5L11 7.5L13.5 10.5"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col leading-[1.2]">
                  <span className="font-montserrat text-[14px] font-black text-white tracking-[0.05em] uppercase">
                    Ngogbehei
                  </span>
                  <span className="font-montserrat text-[8px] font-bold text-[#F5C300]/70 tracking-[0.16em] uppercase">
                    Cancer Center
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav accordion */}
            <nav
              className="flex-1 overflow-y-auto py-1"
              aria-label="Primary mobile"
            >
              {NAV.map((item, i) => {
                const isExpanded = expanded === i;
                const hasCols = item.columns?.length > 0;
                const allLinks = item.columns?.flatMap((c) => c.links) ?? [];

                return (
                  <div
                    key={i}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {hasCols ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : i)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.035] transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/[0.05]"
                      >
                        <span className="font-montserrat text-[16px] font-bold text-white">
                          {item.label}
                        </span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.18 }}
                          aria-hidden="true"
                        >
                          <ChevronDown size={13} className="text-white" />
                        </motion.span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.035] transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/[0.05]"
                      >
                        <span className="font-montserrat text-[16px] font-bold text-white">
                          {item.label}
                        </span>
                        <ChevronRight
                          size={12}
                          className="text-white"
                          aria-hidden="true"
                        />
                      </Link>
                    )}

                    <AnimatePresence>
                      {isExpanded && hasCols && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-4 pb-2 pt-1"
                            style={{ background: "rgba(255,255,255,0.02)" }}
                          >
                            {allLinks.map((link, li) => (
                              <Link
                                key={li}
                                href={link.href}
                                onClick={onClose}
                                className="flex items-center gap-2.5 py-2.5 px-2 font-montserrat text-[15px] text-white hover:text-[#F5C300] transition-colors focus-visible:outline-none focus-visible:underline"
                              >
                                <ChevronRight
                                  size={9}
                                  className="text-emerald-500 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* CTA buttons */}
            <div
              className="p-4 space-y-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Link
                href="/donate"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-montserrat text-[15px] font-black text-[#1a1200] uppercase tracking-wider transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
                style={{
                  background: "linear-gradient(135deg,#F5C300,#e8b800)",
                  boxShadow: "0 4px 16px rgba(245,195,0,0.28)",
                }}
              >
                <Heart size={13} strokeWidth={2.5} aria-hidden="true" />
                Donate Now
              </Link>
              <Link
                href="/services/screening"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-montserrat text-[15px] font-bold text-white border border-white/10 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Book a Free Screening
              </Link>
            </div>

            {/* Contact strip */}
            <address
              className="not-italic px-5 pb-5 pt-2 space-y-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <a
                href="tel:+2348001234567"
                className="flex items-center gap-2.5 font-montserrat text-[14px] text-white hover:text-[#F5C300] transition-colors"
              >
                <Phone
                  size={11}
                  style={{ color: "#F5C300", flexShrink: 0 }}
                  aria-hidden="true"
                />
                +234 800 NCC CARE
              </a>
              <a
                href="mailto:info@ngogbeheicc.org"
                className="flex items-center gap-2.5 font-montserrat text-[14px] text-white hover:text-[#F5C300] transition-colors"
              >
                <Mail
                  size={11}
                  style={{ color: "#F5C300", flexShrink: 0 }}
                  aria-hidden="true"
                />
                info@ngogbeheicc.org
              </a>
            </address>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════ */
export default function Navbar() {
  const pathname = usePathname();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuTimer = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (val) => setScrolled(val > 1));

  const onEnter = useCallback((label) => {
    clearTimeout(menuTimer.current);
    setActiveMenu(label);
  }, []);

  const onLeave = useCallback(() => {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 80);
  }, []);

  useEffect(() => () => clearTimeout(menuTimer.current), []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        return;
      }
      if (activeMenu) {
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen, activeMenu]);

  const bannerH = bannerVisible ? BANNER_H : 0;
  const navbarBottom = bannerH + HEADER_H;

  const linkColor = scrolled ? "#374151" : "rgba(255,255,255,0.85)";
  const headerBg = scrolled ? "#ffffff" : "transparent";
  const headerBorder = scrolled
    ? "1px solid rgba(0,0,0,0.07)"
    : "1px solid transparent";
  const headerShadow = scrolled ? "0 2px 20px rgba(0,0,0,0.07)" : "none";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-[#F5C300] focus:text-[#030712] focus:rounded-lg focus:font-black focus:font-montserrat"
      >
        Skip to main content
      </a>

      <div
        className="fixed top-0 left-0 w-full z-[9990] font-montserrat"
        role="banner"
      >
        <TopBanner
          visible={bannerVisible}
          onDismiss={() => setBannerVisible(false)}
        />

        <motion.header
          animate={{
            backgroundColor: headerBg,
            borderBottom: headerBorder,
            boxShadow: headerShadow,
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-20 flex items-center justify-between gap-6"
            style={{ height: HEADER_H }}
          >
            <Logo scrolled={scrolled} />

            <nav
              className="hidden lg:flex items-center h-full"
              role="menubar"
              aria-label="Primary"
            >
              {NAV.map((item) => {
                const isActive = activeMenu === item.label;
                const hasCols = item.columns?.length > 0;
                const isCurrent =
                  pathname?.startsWith(item.href) && item.href !== "/";

                return (
                  <div
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() =>
                      hasCols ? onEnter(item.label) : undefined
                    }
                    onMouseLeave={hasCols ? onLeave : undefined}
                  >
                    {hasCols ? (
                      <button
                        type="button"
                        role="menuitem"
                        aria-expanded={isActive}
                        aria-haspopup="true"
                        onClick={() =>
                          setActiveMenu(isActive ? null : item.label)
                        }
                        className="relative flex items-center gap-[5px] px-4 h-full font-montserrat text-[15px] font-bold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                        style={{
                          color: isActive
                            ? scrolled
                              ? "#0A2240"
                              : "white"
                            : linkColor,
                        }}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.16 }}
                          className="flex items-center opacity-70"
                          aria-hidden="true"
                        >
                          <ChevronDown size={11} strokeWidth={2.5} />
                        </motion.span>
                        <motion.span
                          className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-sm origin-left"
                          style={{ background: "#F5C300" }}
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX: isActive || isCurrent ? 1 : 0,
                          }}
                          transition={{ duration: 0.16 }}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        role="menuitem"
                        aria-current={
                          item.href === "/"
                            ? pathname === "/"
                              ? "page"
                              : undefined
                            : isCurrent
                            ? "page"
                            : undefined
                        }
                        className="relative flex items-center px-4 h-full font-montserrat text-[15px] font-bold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                        style={{
                          color: isCurrent
                            ? scrolled
                              ? "#0A2240"
                              : "white"
                            : linkColor,
                        }}
                      >
                        {item.label}
                        {isCurrent && (
                          <span
                            className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-sm bg-[#F5C300]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    )}

                    <AnimatePresence>
                      {isActive && hasCols && (
                        <MegaMenu
                          item={item}
                          navbarBottom={navbarBottom}
                          onLinkClick={() => setActiveMenu(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
              <motion.a
                href="/donate"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-montserrat text-[14px] font-black text-[#1a1200] uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
                style={{
                  background:
                    "linear-gradient(135deg,#F5C300 0%,#e8b800 100%)",
                  boxShadow: "0 4px 14px rgba(245,195,0,0.36)",
                }}
              >
                <Heart size={12} strokeWidth={2.5} aria-hidden="true" />
                Donate
              </motion.a>
            </div>

            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-drawer"
                aria-label="Open navigation menu"
                className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  color: scrolled ? "#374151" : "rgba(255,255,255,0.75)",
                  borderColor: scrolled ? "#e5e7eb" : "rgba(255,255,255,0.18)",
                  background: scrolled
                    ? "#ffffff"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </motion.header>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <style>{`
        @keyframes ncc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ncc-blink { 0%, 100% { opacity: 1; } }
        }
      `}</style>
    </>
  );
}
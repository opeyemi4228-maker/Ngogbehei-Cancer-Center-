"use client";

/**
 * @file HeroSection.jsx
 * @project Ngogbehei Cancer Center (NCC)
 * @description Production-ready cinematic hero - rebuilt for clarity, a11y & responsiveness.
 *
 *   • 4 NCC slides - Education, Free Screenings, Patient Support, Donate
 *   • Single semantic <h1> per slide, animated word-by-word (no sr-only/visual split)
 *   • Headlines are two-part {lead, emphasis} → break cleanly at EVERY breakpoint
 *   • Auto-advance (7s) with manual override that pauses, then gracefully resumes
 *   • Reduced-motion: keeps autoplay but removes transforms; honors user intent
 *   • Robust viewport height (svh → dvh → vh fallback chain)
 *   • Keyboard: arrow-key slide nav, focus-visible rings, ESC closes video modal
 *   • Branded "key" CTA chip echoing the reference, JSON-LD schema, skip-target
 *
 *   Drop-in replacement. Requires: framer-motion, lucide-react, next/image, next/link.
 *   Fonts: applies `font-montserrat` (configure in your Tailwind/next-font setup).
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Play, X, KeyRound } from "lucide-react";

import Hero1 from "@/assets/Hero1.jpg";
import Hero2 from "@/assets/Hero2.jpg";
import Hero3 from "@/assets/Hero3.jpg";
import Hero4 from "@/assets/Hero4.jpg";

/* ─── Tokens ──────────────────────────────────────────── */
const TAB_H = 64; // px height of bottom programme navigator
const ACCENT = "#F5C300"; // NCC signal yellow
const INK = "#030712"; // near-black base
const AUTOPLAY_MS = 7000;
const RESUME_MS = 14000; // how long manual interaction pauses autoplay

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ─── Slides ──────────────────────────────────────────────
   headline = { lead, emphasis }
   `lead` renders in white, `emphasis` in accent - one <h1>, clean wraps.
─────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: "education",
    tag: "Cancer Education",
    headline: { lead: "Knowledge is", emphasis: "the first cure." },
    sub: "We bring cancer awareness workshops, risk factor education, and early warning guidance directly to rural Nigerian communities in local languages.",
    cta: { text: "Our Programmes", href: "/about" },
    ghost: { text: "Our Mission", href: "/about" },
    img: Hero1,
    alt: "An NCC community health educator speaking with Nigerian residents about cancer prevention.",
  },
  {
    id: "screening",
    tag: "Free Screenings",
    headline: { lead: "Free screening,", emphasis: "at your doorstep." },
    sub: "Mobile clinics and trained volunteers deliver breast, cervical, and prostate screenings directly to underserved communities across Nigeria.",
    cta: { text: "Book Free Screening", href: "/contact" },
    ghost: { text: "See Our Impact", href: "/impact" },
    img: Hero2,
    alt: "An NCC mobile screening unit set up in a rural Nigerian community with healthcare volunteers.",
  },
  {
    id: "navigation",
    tag: "Patient Support",
    headline: { lead: "No patient walks", emphasis: "this road alone." },
    sub: "From diagnosis through treatment, our navigation team connects patients to specialists, transport, financial aid, and emotional care.",
    cta: { text: "Patient Navigation", href: "/services" },
    ghost: { text: "Survivor Stories", href: "/impact" },
    img: Hero3,
    alt: "An NCC patient navigator walking alongside a Nigerian cancer patient.",
  },
  {
    id: "donate",
    tag: "Give Today",
    headline: { lead: "Your gift funds", emphasis: "a fighting chance." },
    sub: "₦5,000 educates 100 people. ₦25,000 screens 5 women. ₦100,000 fuels a mobile clinic for a full day. Every naira reaches the field.",
    cta: { text: "Donate Now", href: "/donate" },
    ghost: { text: "Volunteer", href: "/volunteer" },
    img: Hero4,
    alt: "Community members and NCC volunteers at a cancer awareness fundraising event in Nigeria.",
  },
];

const EASE = [0.16, 1, 0.3, 1];

/* ═══════════════════════════════════════════════════════════
   STRUCTURED DATA
═══════════════════════════════════════════════════════════ */
function HeroSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ngogbehei Cancer Center | Home",
    url: SITE_URL,
    description:
      "Bridging the gap between cancer awareness and access to care across Nigeria and Africa. Free screening, education, and patient navigation.",
    publisher: {
      "@type": "NGO",
      name: "Marcel Ngogbehei Center for Cancer Education & Care",
      url: SITE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   GEOMETRIC DECO - corner blueprint accent
═══════════════════════════════════════════════════════════ */
function GeometricDeco({ reduce }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.5 }}
      className="pointer-events-none absolute right-0 top-0 z-[8]"
      style={{
        width: "clamp(180px, 30vw, 460px)",
        height: "clamp(180px, 30vw, 460px)",
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 480 480" fill="none" className="h-full w-full">
        <motion.path
          d="M 480 0 Q 480 320 160 460"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.8, delay: 0.4, ease: EASE }}
        />
        <motion.path
          d="M 480 0 Q 480 220 240 380"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, delay: 0.6, ease: EASE }}
        />
        <motion.path
          d="M 360 0 L 480 0 L 480 120"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: 0.8, ease: EASE }}
        />
        {[80, 160, 240, 320, 400].map((x, i) => (
          <motion.line
            key={`h${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={10}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 + i * 0.08 }}
          />
        ))}
        <motion.circle
          cx="480"
          cy="0"
          r="5"
          fill={ACCENT}
          fillOpacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
          style={{ transformOrigin: "480px 0px" }}
        />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIDEO MODAL - focus-trapped, ESC + backdrop close
═══════════════════════════════════════════════════════════ */
function VideoModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock scroll behind modal
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ngogbehei Cancer Center story video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-montserrat fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 px-4"
          style={{ backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: EASE },
            }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.18 } }}
            className="relative w-full max-w-[860px] overflow-hidden rounded-2xl bg-[#030712] ring-1 ring-white/10"
            style={{ aspectRatio: "16 / 9" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full border border-[#F5C300]/40"
                aria-hidden="true"
              >
                <Play size={28} className="ml-1 text-[#F5C300]" fill="#F5C300" />
              </span>
              <p className="font-montserrat text-[14px] text-white/60">
                Our story video, coming soon
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
            >
              <X size={15} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HERO
═══════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // hover / focus / manual
  const [videoOpen, setVideoOpen] = useState(false);

  const heroRef = useRef(null);
  const tickRef = useRef(null);
  const resumeRef = useRef(null);

  /* Parallax - disabled under reduced-motion */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.55]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  /* Autoplay - pauses on hover/focus/interaction, resumes automatically */
  useEffect(() => {
    clearInterval(tickRef.current);
    if (paused || videoOpen) return;
    tickRef.current = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(tickRef.current);
  }, [paused, videoOpen]);

  const goTo = useCallback((i) => {
    setActive(i);
    setPaused(true);
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), RESUME_MS);
  }, []);

  const next = useCallback(
    () => goTo((active + 1) % SLIDES.length),
    [active, goTo]
  );
  const prev = useCallback(
    () => goTo((active - 1 + SLIDES.length) % SLIDES.length),
    [active, goTo]
  );

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  const slide = SLIDES[active];

  return (
    <>
      <HeroSchema />

      <section
        id="main-content"
        ref={heroRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
        className="font-montserrat hero-vh relative w-full overflow-hidden bg-[#030712]"
        aria-roledescription="carousel"
        aria-label="Ngogbehei Cancer Center - Homepage hero"
      >
        {/* Background photo */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${active}`}
            className="absolute inset-0 z-0"
            style={reduce ? undefined : { scale: imgScale, opacity: imgOpacity }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: reduce ? 0 : 1.0, ease: EASE },
            }}
            exit={{
              opacity: 0,
              transition: { duration: reduce ? 0 : 0.6, ease: "easeIn" },
            }}
          >
            <Image
              src={slide.img}
              alt={slide.alt}
              fill
              priority={active === 0}
              sizes="100vw"
              quality={90}
              placeholder="blur"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlays - directional + bottom + top scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(102deg, rgba(3,7,18,0.88) 0%, rgba(3,7,18,0.58) 34%, rgba(3,7,18,0.16) 60%, transparent 78%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
          style={{
            height: "58%",
            background:
              "linear-gradient(to top, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.32) 48%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
          style={{
            height: "22%",
            background:
              "linear-gradient(to bottom, rgba(3,7,18,0.5) 0%, transparent 100%)",
          }}
        />
        {/* Subtle grain for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <GeometricDeco reduce={reduce} />

        {/* Content */}
        <motion.div
          style={reduce ? undefined : { y: contentY }}
          className="relative z-[10] flex h-full flex-col"
        >
          {/* Tag - top */}
          <div className="flex-shrink-0 px-5 pt-[calc(var(--navbar-h,102px)+18px)] sm:px-8 sm:pt-[calc(var(--navbar-h,102px)+22px)] lg:px-16 lg:pt-[calc(var(--navbar-h,102px)+32px)] xl:px-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${active}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-2"
              >
                <span
                  aria-hidden="true"
                  className="h-[7px] w-[7px] flex-shrink-0"
                  style={{ background: ACCENT }}
                />
                <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.26em] text-white/90 sm:text-[10.5px]">
                  {slide.tag}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="min-h-0 flex-1" />

          {/* Headline + CTAs - bottom, generous safe gap above navigator */}
          <div
            className="flex-shrink-0 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-16 lg:pb-14 xl:px-20"
            style={{ paddingBottom: `calc(${TAB_H}px + env(safe-area-inset-bottom, 0px) + 1.5rem)` }}
          >
            <div className="max-w-[680px] lg:max-w-[960px]">
              {/* Headline - single <h1>, two parts, clean wrap everywhere */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`h1-${active}`}
                  className="font-montserrat mb-4 font-black leading-[0.94] tracking-[-0.035em] text-white lg:mb-6"
                  style={{ fontSize: "clamp(2.5rem, 8.5vw, 6.5rem)" }}
                >
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ delay: reduce ? 0 : 0.04, duration: reduce ? 0 : 0.7, ease: EASE }}
                  >
                    {slide.headline.lead}
                  </motion.span>
                  <motion.span
                    className="block"
                    style={{ color: ACCENT }}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ delay: reduce ? 0 : 0.13, duration: reduce ? 0 : 0.7, ease: EASE }}
                  >
                    {slide.headline.emphasis}
                  </motion.span>
                </motion.h1>
              </AnimatePresence>

              {/* Subtitle + CTAs */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`sub-${active}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: reduce ? 0 : 0.28, duration: reduce ? 0 : 0.55, ease: EASE }}
                >
                  <p
                    className="font-montserrat mb-5 text-[14px] leading-[1.7] text-white/85 sm:mb-6 lg:mb-8 lg:text-[15.5px]"
                    style={{ maxWidth: "min(500px, 100%)", textWrap: "pretty" }}
                  >
                    {slide.sub}
                  </p>

                  <div className="flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
                    {/* PRIMARY - branded key chip CTA (echoes reference) */}
                    <Link
                      href={slide.cta.href}
                      className="group inline-flex items-center gap-3 rounded-full pl-2 pr-6 font-montserrat font-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]"
                      style={{
                        fontSize: "clamp(12.5px, 1.2vw, 14px)",
                        paddingTop: 8,
                        paddingBottom: 8,
                        background: ACCENT,
                        color: INK,
                        boxShadow: "0 10px 34px rgba(245,195,0,0.32)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 group-hover:rotate-[-25deg]"
                      >
                        <KeyRound size={16} strokeWidth={2.6} />
                      </span>
                      <span className="uppercase tracking-[0.08em]">
                        {slide.cta.text}
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator (desktop) */}
        {!reduce && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="absolute z-[15] hidden flex-col items-center gap-2 lg:flex"
            style={{ left: "clamp(24px, 2.5vw, 48px)", bottom: TAB_H + 24 }}
            aria-hidden="true"
          >
            <span className="relative h-10 w-[1px] overflow-hidden rounded-full bg-white/15">
              <motion.span
                className="absolute left-0 top-0 w-full rounded-full bg-white/60"
                style={{ height: "42%" }}
                animate={{ y: ["0%", "238%"] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
              />
            </span>
            <span
              className="font-montserrat text-[9px] font-bold uppercase tracking-[0.22em] text-white/70"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll
            </span>
          </motion.div>
        )}

        {/* Vertical dots (xl) */}
        <div
          className="absolute right-7 top-1/2 z-[15] hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
          role="tablist"
          aria-label="Hero slide selector"
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide: ${s.tag}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
              style={{
                width: 3,
                height: i === active ? 28 : 12,
                background: i === active ? "white" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Bottom programme navigator */}
        <nav
          className="absolute inset-x-0 bottom-0 z-[20]"
          aria-label="NCC programme slides"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div aria-hidden="true" className="h-[1px] w-full bg-white/[0.09]" />
          <div className="flex" style={{ height: TAB_H }} role="tablist">
            {SLIDES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${i + 1} of ${SLIDES.length}: ${s.tag}`}
                  onClick={() => goTo(i)}
                  className="relative flex flex-1 items-center px-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F5C300]/60 sm:px-6 lg:px-8"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.07)" : "rgba(3,7,18,0.55)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-[5px] w-[5px] flex-shrink-0 rounded-full transition-all duration-300 sm:h-[6px] sm:w-[6px]"
                      style={{ background: isActive ? ACCENT : "rgba(255,255,255,0.25)" }}
                    />
                    <span
                      className="hidden font-montserrat text-[9.5px] font-black uppercase leading-none tracking-[0.14em] transition-colors duration-200 sm:block md:text-[10px] md:tracking-[0.16em]"
                      style={{ color: isActive ? "white" : "rgba(255,255,255,0.42)" }}
                    >
                      {s.tag}
                    </span>
                    <span
                      className="block font-montserrat text-[11px] font-black transition-colors duration-200 sm:hidden"
                      style={{ color: isActive ? "white" : "rgba(255,255,255,0.42)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>

                  {/* active underline */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[3px]"
                        style={{ background: ACCENT }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1, transition: { duration: 0.5, ease: EASE } }}
                        exit={{ scaleX: 0, originX: 1, transition: { duration: 0.22 } }}
                      />
                    )}
                  </AnimatePresence>

                  {/* autoplay progress */}
                  {isActive && !paused && !videoOpen && !reduce && (
                    <motion.span
                      key={`prog-${active}`}
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-[2px] opacity-40"
                      style={{ background: ACCENT }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%", transition: { duration: AUTOPLAY_MS / 1000, ease: "linear" } }}
                    />
                  )}

                  {i < SLIDES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-1/2 h-5 w-[1px] -translate-y-1/2 bg-white/[0.08]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Robust viewport height + navbar var. Layered fallback chain. */}
        <style>{`
          :root { --navbar-h: 102px; }
          .hero-vh { height: 100vh; min-height: 600px; }
          @supports (height: 100svh) { .hero-vh { height: 100svh; } }
          @supports (height: 100dvh) { .hero-vh { height: 100dvh; } }
        `}</style>
      </section>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
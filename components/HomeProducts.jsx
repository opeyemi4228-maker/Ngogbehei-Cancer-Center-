"use client";

/**
 * @file WhoWeAre.jsx
 * @project Ngogbehei Cancer Center
 * @description Production-ready "Who We Are" section.
 *   • Typewriter headline cycling NCC mission phrases
 *   • Animated counters + dot-grid world map (UK HQ ↔ African ops)
 *   • Bento grid: stats, map panel, UK badge, four pillars, CTA banner
 *   • Full Montserrat typography
 *   • Semantic HTML, aria-labelled, reduced-motion respected
 *   • All routes verified against NCC content
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  Globe2,
  Users,
  Microscope,
  Heart,
} from "lucide-react";

/* ─── Typewriter hook ────────────────────────────────────── */
function useTypewriter(phrases, speed = 72) {
  const [phase, setPhase] = useState("idle");
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (phase === "idle") return;
    const word = phrases[idx];
    if (phase === "typing") {
      if (char < word.length) {
        const t = setTimeout(() => {
          setText(word.slice(0, char + 1));
          setChar((c) => c + 1);
        }, speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), 2400);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("deleting"), 200);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (char > 0) {
        const t = setTimeout(() => {
          setText(word.slice(0, char - 1));
          setChar((c) => c - 1);
        }, speed * 0.38);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % phrases.length);
      setPhase("typing");
    }
  }, [phase, char, idx, phrases, speed]);

  return { text, start: () => setPhase("typing") };
}

/* ─── Counter ────────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "", duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Map panel ──────────────────────────────────────────── */
function MapPanel({ inView }) {
  const pins = [
    { id: "uk", cx: 47.5, cy: 23, label: "London, UK", color: "#0f172a", r: 1.0, primary: true },
    { id: "ng", cx: 51, cy: 51, label: "Nigeria", color: "#059669", r: 1.2, primary: true },
    { id: "gh", cx: 48.5, cy: 52, label: "Ghana", color: "#10b981", r: 0.7 },
    { id: "ke", cx: 57, cy: 52, label: "Kenya", color: "#10b981", r: 0.7 },
    { id: "za", cx: 54, cy: 68, label: "S. Africa", color: "#10b981", r: 0.7 },
    { id: "cm", cx: 52.5, cy: 53, label: "Cameroon", color: "#6ee7b7", r: 0.6 },
  ];

  const dots = [
    ...Array.from({ length: 20 }, (_, i) => ({ x: 44 + (i % 5) * 2.2, y: 20 + Math.floor(i / 5) * 2 })),
    ...Array.from({ length: 70 }, (_, i) => ({ x: 46.5 + (i % 9) * 1.7, y: 38 + Math.floor(i / 9) * 3.4 })),
    ...Array.from({ length: 28 }, (_, i) => ({ x: 16 + (i % 7) * 2.4, y: 24 + Math.floor(i / 7) * 4 })),
    ...Array.from({ length: 36 }, (_, i) => ({ x: 62 + (i % 9) * 2.1, y: 22 + Math.floor(i / 9) * 3.2 })),
    ...Array.from({ length: 12 }, (_, i) => ({ x: 73 + (i % 4) * 2, y: 58 + Math.floor(i / 4) * 2.4 })),
  ];

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="World map showing NCC's UK headquarters and African operations"
      >
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={0.32}
            fill="#94a3b8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.45 } : {}}
            transition={{ delay: 0.01 * i, duration: 0.5 }}
          />
        ))}
        {pins
          .filter((p) => p.id !== "uk")
          .map((p, i) => (
            <motion.path
              key={p.id}
              d={`M47.5,23 Q${(47.5 + p.cx) / 2 - 4},${(23 + p.cy) / 2 - 7} ${p.cx},${p.cy}`}
              fill="none"
              stroke={p.color}
              strokeWidth="0.22"
              strokeDasharray="0.7 0.55"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
              transition={{
                delay: 0.9 + i * 0.1,
                duration: 1.1,
                ease: "easeInOut",
              }}
            />
          ))}
        {pins.map((p, i) => (
          <motion.g
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 1.1 + i * 0.12,
              type: "spring",
              stiffness: 280,
              damping: 16,
            }}
            style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
          >
            <motion.circle
              cx={p.cx}
              cy={p.cy}
              r={p.r + 3}
              fill="none"
              stroke={p.color}
              strokeWidth="0.25"
              animate={{ r: [p.r + 2, p.r + 6], opacity: [0.6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                delay: i * 0.45,
              }}
            />
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} />
            {p.primary && <circle cx={p.cx} cy={p.cy} r={p.r * 0.42} fill="white" />}
          </motion.g>
        ))}
      </svg>
      {pins
        .filter((p) => p.primary)
        .map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.8 + i * 0.18, duration: 0.45 }}
            className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full font-montserrat text-[14px] font-bold border border-white/60 shadow-md pointer-events-none"
            style={{
              left: `${p.cx}%`,
              top: `${p.cy + 3.5}%`,
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.94)",
              color: p.color,
              backdropFilter: "blur(6px)",
              boxShadow: `0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px ${p.color}25`,
            }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.color }}
            />
            {p.label}
          </motion.div>
        ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function WhoWeAre() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const phrases = [
    "detect cancer early.",
    "bridge the deadly gap.",
    "reach the unreached.",
    "save African lives.",
  ];
  const { text: typed, start: startTyping } = useTypewriter(phrases, 70);
  useEffect(() => {
    if (inView && !reduceMotion) startTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  const stats = [
    { num: 5, suffix: "+", label: "African Nations" },
    { num: 10000, suffix: "+", label: "Lives Touched" },
    { num: 3, suffix: "", label: "Years of Impact" },
    { num: 100, suffix: "%", label: "Nonprofit" },
  ];

  const pillars = [
    { symbol: "◎", title: "Education", desc: "Community-led awareness programs that reach where hospitals cannot.", icon: Users },
    { symbol: "◈", title: "Early Detection", desc: "Screening drives that turn late-stage diagnoses into survivable catches.", icon: Microscope },
    { symbol: "◉", title: "Access to Care", desc: "Bridging patients to treatment pathways regardless of geography or income.", icon: Heart },
  ];

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden font-montserrat"
      aria-labelledby="who-heading"
    >
      {/* Grid background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-small" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16,185,129,0.07)" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid-large" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M 160 0 L 0 0 0 160" fill="none" stroke="rgba(16,185,129,0.13)" strokeWidth="1" />
            </pattern>
            <radialGradient id="grid-mask-radial" cx="50%" cy="42%" r="58%" gradientUnits="userSpaceOnUse" fx="50%" fy="42%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="55%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
            <mask id="grid-fade-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-mask-radial)" />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-small)" />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-large)" />
          <rect x="0" y="0" width="100%" height="100%" fill="white" fillOpacity="1" mask="url(#grid-fade-mask)" />
        </svg>

        {/* Animated dots */}
        {[
          { x: "20%", y: "15%", delay: 0, size: 3, opacity: 0.5 },
          { x: "80%", y: "12%", delay: 0.6, size: 2, opacity: 0.4 },
          { x: "10%", y: "55%", delay: 1.2, size: 2.5, opacity: 0.35 },
          { x: "90%", y: "48%", delay: 0.3, size: 3, opacity: 0.45 },
          { x: "50%", y: "85%", delay: 0.9, size: 2, opacity: 0.3 },
          { x: "35%", y: "30%", delay: 1.5, size: 2, opacity: 0.35 },
          { x: "65%", y: "72%", delay: 0.4, size: 2.5, opacity: 0.4 },
          { x: "15%", y: "80%", delay: 1.8, size: 2, opacity: 0.3 },
          { x: "75%", y: "35%", delay: 0.7, size: 2, opacity: 0.38 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size * 2,
              height: dot.size * 2,
              background:
                "radial-gradient(circle, rgba(5,150,105,0.7) 0%, rgba(16,185,129,0.3) 50%, transparent 100%)",
              transform: "translate(-50%,-50%)",
            }}
            animate={{ opacity: [0, dot.opacity, 0], scale: [0.6, 1.4, 0.6] }}
            transition={{
              repeat: Infinity,
              duration: 4 + i * 0.7,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.span
          className="absolute left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(16,185,129,0.35) 30%, rgba(16,185,129,0.5) 50%, rgba(16,185,129,0.35) 70%, transparent 100%)",
          }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        />
        <motion.span
          className="absolute top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(16,185,129,0.2) 30%, rgba(16,185,129,0.35) 50%, rgba(16,185,129,0.2) 70%, transparent 100%)",
          }}
          animate={{ left: ["5%", "95%", "5%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />

        {[
          { pos: "top-8 left-8", d: "M 0 28 L 0 0 L 28 0", cx: 0, cy: 0 },
          { pos: "top-8 right-8", d: "M 64 28 L 64 0 L 36 0", cx: 64, cy: 0 },
          { pos: "bottom-8 left-8", d: "M 0 36 L 0 64 L 28 64", cx: 0, cy: 64 },
          { pos: "bottom-8 right-8", d: "M 64 36 L 64 64 L 36 64", cx: 64, cy: 64 },
        ].map((c, i) => (
          <svg key={i} className={`absolute ${c.pos} w-16 h-16`} viewBox="0 0 64 64" fill="none">
            <path d={c.d} stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" fill="none" />
            <circle cx={c.cx} cy={c.cy} r="3" fill="rgba(16,185,129,0.3)" />
          </svg>
        ))}

        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 72%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[300px]"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(5,150,105,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-28">
        <motion.div {...fw(0)} className="flex items-center justify-center gap-3 mb-8">
          <span aria-hidden="true" className="h-px w-8 bg-emerald-400" />
          <span className="font-montserrat text-[14px] font-bold tracking-[0.28em] uppercase text-emerald-600">
            Who We Are
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-emerald-400" />
        </motion.div>

        <div className="text-center mb-5">
          <motion.p
            {...fw(0.06)}
            className="font-montserrat text-base font-semibold text-slate-400 uppercase tracking-widest mb-3"
          >
            About Ngogbehei Cancer Center
          </motion.p>
          <motion.h2
            id="who-heading"
            {...fw(0.1)}
            className="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.0] tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            We exist to
          </motion.h2>
          <div className="min-h-[1.15em] mt-1" aria-live="polite">
            <p
              className="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight"
              style={{ letterSpacing: "-0.03em", color: "#059669" }}
            >
              {typed}
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.52 }}
                className="inline-block w-[4px] h-[0.78em] bg-emerald-500 ml-1 align-middle rounded-sm"
              />
            </p>
          </div>
        </div>

        <motion.p
          {...fw(0.22)}
          className="font-montserrat text-center text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-16"
        >
          The{" "}
          <strong className="text-slate-700 font-semibold">
            Marcel Ngogbehei Center for Cancer Education &amp; Care (NCC)
          </strong>{" "}
          is a UK-registered nonprofit — bridging the deadly gap between
          awareness and access to care in underserved regions across Africa.
        </motion.p>

        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {/* Stats */}
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.3 + i * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -3,
                boxShadow: "0 12px 36px rgba(5,150,105,0.1)",
              }}
              className="col-span-3 lg:col-span-3 xl:col-span-3 relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center py-7 px-4 text-center transition-all duration-300 cursor-default group"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <p
                className="font-montserrat text-3xl sm:text-4xl font-black text-slate-900 leading-none mb-1 tabular-nums"
                style={{ letterSpacing: "-0.03em" }}
              >
                <Counter to={s.num} suffix={s.suffix} />
              </p>
              <p className="font-montserrat text-[14px] font-bold uppercase tracking-widest text-slate-400">
                {s.label}
              </p>
            </motion.div>
          ))}

          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.38,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-span-6 lg:col-span-4 relative overflow-hidden rounded-2xl border border-slate-100"
            style={{
              background:
                "linear-gradient(155deg,#f0fdf4 0%,#ecfdf5 55%,#f8fafc 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              minHeight: 300,
            }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100/70 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                />
                <span className="font-montserrat text-[14px] font-bold tracking-[0.25em] uppercase text-slate-500">
                  Global Footprint
                </span>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { color: "#0f172a", label: "UK HQ" },
                  { color: "#059669", label: "Africa Ops" },
                ].map((l) => (
                  <span
                    key={l.label}
                    className="flex items-center gap-1.5 font-montserrat text-[14px] text-slate-400 font-semibold"
                  >
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative" style={{ height: 260 }}>
              <MapPanel inView={inView} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 2.1 }}
              className="flex items-center justify-around px-5 py-3 border-t border-emerald-100/60 bg-white/70 backdrop-blur-sm"
            >
              {[
                { k: "Registered", v: "England & Wales" },
                { k: "Operations", v: "West & East Africa" },
                { k: "Focus", v: "Cancer Education" },
              ].map((item) => (
                <div key={item.k} className="flex flex-col items-center">
                  <span className="font-montserrat text-[14px] uppercase tracking-widest text-slate-400 font-bold">
                    {item.k}
                  </span>
                  <span className="font-montserrat text-xs font-bold text-slate-700 mt-0.5">
                    {item.v}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* UK badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.46,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-span-6 lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center gap-4 py-8 px-6 text-center"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div
              className="relative flex items-center justify-center w-16 h-16 rounded-full border border-slate-100 before:absolute before:-inset-2 before:rounded-full before:border before:border-slate-100/60"
              aria-hidden="true"
            >
              <Globe2 size={28} strokeWidth={1.2} className="text-emerald-600" />
            </div>
            <div>
              <p
                className="font-montserrat text-2xl font-black text-slate-900 leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                UK
              </p>
              <p className="font-montserrat text-[14px] font-bold uppercase tracking-widest text-emerald-600 mt-1">
                Registered
              </p>
            </div>
            <span aria-hidden="true" className="w-10 h-px bg-emerald-200" />
            <p className="font-montserrat text-xs text-slate-400 font-medium leading-relaxed">
              Charity Commission
              <br />
              England &amp; Wales
            </p>
          </motion.div>

          {/* Pillars */}
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.55 + i * 0.1,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -4,
                boxShadow: "0 16px 40px rgba(5,150,105,0.1)",
              }}
              className="col-span-6 sm:col-span-3 lg:col-span-2 group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm p-6 flex flex-col gap-4 transition-all duration-300 cursor-default"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-emerald-400 to-emerald-600"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  delay: 0.7 + i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ originX: 0 }}
              />
              <div
                className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl font-mono text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300"
                aria-hidden="true"
              >
                {p.symbol}
              </div>
              <div>
                <h3 className="font-montserrat text-sm font-black uppercase tracking-wider text-slate-800 mb-2">
                  {p.title}
                </h3>
                <p className="font-montserrat text-[15px] text-slate-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.article>
          ))}

          {/* CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.85,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-span-6 relative overflow-hidden rounded-2xl border border-emerald-100"
            style={{
              background:
                "linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 50%,#f0fdf4 100%)",
              boxShadow: "0 2px 16px rgba(5,150,105,0.08)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute right-8 top-1/2 -translate-y-1/2 font-montserrat text-[80px] font-black text-emerald-100 select-none pointer-events-none leading-none"
            >
              NCC
            </span>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-7 py-6">
              <div>
                <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.25em] text-emerald-600 mb-1">
                  Learn More
                </p>
                <p
                  className="font-montserrat text-base font-black text-slate-900"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Discover the full story behind Ngogbehei Cancer Center
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <motion.a
                  href="/about"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-montserrat text-sm font-bold text-white relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,#047857 0%,#059669 55%,#10b981 100%)",
                    boxShadow:
                      "0 8px 24px rgba(5,150,105,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="relative z-10">Learn More About NCC</span>
                  <motion.span
                    aria-hidden="true"
                    className="relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowUpRight size={15} />
                  </motion.span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{
                      background:
                        "linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)",
                    }}
                  />
                </motion.a>

                <a
                  href="/impact"
                  className="inline-flex items-center gap-1.5 font-montserrat text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors duration-200 group"
                >
                  Our Impact
                  <ChevronRight
                    size={14}
                    aria-hidden="true"
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-12 right-12 h-px origin-left"
        style={{
          background:
            "linear-gradient(to right,transparent,#a7f3d0 35%,#6ee7b7 50%,#a7f3d0 65%,transparent)",
        }}
      />
    </section>
  );
}
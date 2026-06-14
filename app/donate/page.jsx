"use client";

/**
 * @file app/donate/page.jsx
 * @project Ngogbehei Cancer Center - Donate Page
 *
 * Production-ready · SEO-optimized · Fully accessible.
 *
 * Sections:
 *   1. Hero (typewriter)
 *   2. Mission statement (with impact tier cards)
 *   3. Donation form + sticky sidebar (impact, payment logos, contact)
 *   4. Gift matching banner
 *   5. Trust signals (4 cards)
 *   6. Donor testimonial
 *   7. CTA banner
 */

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronRight,
  Heart,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  Globe2,
  Users,
  Microscope,
  RefreshCw,
  Lock,
  Award,
  FileText,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ═══════════════════════════════════════════════
   JSON-LD
═══════════════════════════════════════════════ */
function DonateSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: "Donate to Ngogbehei Cancer Center",
    description:
      "Support cancer education, free screening, and patient navigation across Nigeria and Africa. 100% of donations fund programmes.",
    url: `${SITE_URL}/donate`,
    recipient: {
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

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useTypewriter(phrases, speed = 68) {
  const [phase, setPhase] = useState("typing");
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    const word = phrases[idx];
    if (phase === "typing") {
      if (char < word.length) {
        const t = setTimeout(() => {
          setText(word.slice(0, char + 1));
          setChar((c) => c + 1);
        }, speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), 2600);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("deleting"), 220);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (char > 0) {
        const t = setTimeout(() => {
          setText(word.slice(0, char - 1));
          setChar((c) => c - 1);
        }, speed * 0.36);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % phrases.length);
      setPhase("typing");
    }
  }, [phase, char, idx, phrases, speed]);
  return text;
}

/* ═══════════════════════════════════════════════
   SPIRAL
═══════════════════════════════════════════════ */
function SpiralBg({ opacity = 0.18, size = 800 }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    const N = 900,
      DOT = 1.4,
      C = size / 2,
      R = C - 10;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("aria-hidden", "true");
    for (let i = 0; i < N; i++) {
      const f = (i + 0.5) / N;
      const r = Math.sqrt(f) * R;
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", (C + r * Math.cos((i + 0.5) * GA)).toFixed(2));
      c.setAttribute("cy", (C + r * Math.sin((i + 0.5) * GA)).toFixed(2));
      c.setAttribute("r", String(DOT));
      c.setAttribute("fill", "#ffffff");
      if (!reduceMotion) {
        const aR = document.createElementNS(ns, "animate");
        aR.setAttribute("attributeName", "r");
        aR.setAttribute("values", `${DOT * 0.4};${DOT * 1.6};${DOT * 0.4}`);
        aR.setAttribute("dur", "3.5s");
        aR.setAttribute("begin", `${(f * 3.5).toFixed(3)}s`);
        aR.setAttribute("repeatCount", "indefinite");
        c.appendChild(aR);
        const aO = document.createElementNS(ns, "animate");
        aO.setAttribute("attributeName", "opacity");
        aO.setAttribute("values", "0.1;0.85;0.1");
        aO.setAttribute("dur", "3.5s");
        aO.setAttribute("begin", `${(f * 3.5).toFixed(3)}s`);
        aO.setAttribute("repeatCount", "indefinite");
        c.appendChild(aO);
      } else {
        c.setAttribute("opacity", "0.5");
      }
      svg.appendChild(c);
    }
    ref.current.innerHTML = "";
    ref.current.appendChild(svg);
  }, [size, reduceMotion]);
  const mask =
    "radial-gradient(circle at 70% 50%, white 0%, rgba(255,255,255,0.08) 55%, transparent 72%)";
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-end"
      style={{
        opacity,
        mixBlendMode: "screen",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
function DonateHero() {
  const PHRASES = ["a life.", "a future.", "a family.", "a community.", "hope."];
  const typed = useTypewriter(PHRASES, 72);

  return (
    <section
      aria-label="Donate to Ngogbehei Cancer Center"
      className="relative w-full overflow-hidden font-montserrat"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(125% 125% at 0% 50%, #030712 45%, #011e10 100%)",
      }}
    >
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[52%] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=1200&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.38) saturate(0.7)" }}
          fetchpriority="high"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #030712 0%, rgba(3,7,18,0.82) 28%, rgba(3,7,18,0.18) 65%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #030712 0%, rgba(3,7,18,0.4) 22%, transparent 55%)",
          }}
        />
      </div>

      <SpiralBg opacity={0.16} size={850} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dg-sm"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M44 0L0 0 0 44"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dg-sm)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 min-h-screen flex flex-col justify-center pt-28 lg:pt-[130px] pb-20">
        <nav aria-label="Breadcrumb">
          <motion.ol
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-2 mb-10 list-none p-0 m-0"
          >
            <li>
              <Link
                href="/"
                className="font-montserrat text-[14px] text-white font-semibold tracking-widest uppercase hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={9} className="text-white/60" />
            </li>
            <li aria-current="page">
              <span className="font-montserrat text-[14px] text-emerald-400 font-bold tracking-widest uppercase">
                Donate
              </span>
            </li>
          </motion.ol>
        </nav>

        <div className="flex flex-col max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="flex items-center gap-3 mb-7"
          >
            <span aria-hidden="true" className="h-px w-10 bg-emerald-500" />
            <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400">
              Make a Difference
            </span>
          </motion.div>

          <div className="mb-7 overflow-hidden">
            {["Your gift", "can save"].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 56, skewY: 1.5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{
                  delay: 0.16 + i * 0.1,
                  duration: 0.82,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {i === 0 ? (
                  <h1
                    className="font-montserrat font-black text-white leading-[0.92] tracking-[-0.04em]"
                    style={{ fontSize: "clamp(2.8rem,6vw,6rem)" }}
                  >
                    {line}
                  </h1>
                ) : (
                  <p
                    aria-hidden="true"
                    className="font-montserrat font-black text-white leading-[0.92] tracking-[-0.04em]"
                    style={{ fontSize: "clamp(2.8rem,6vw,6rem)" }}
                  >
                    {line}
                  </p>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 56, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{
                delay: 0.36,
                duration: 0.82,
                ease: [0.16, 1, 0.3, 1],
              }}
              aria-hidden="true"
            >
              <span
                className="font-montserrat font-black leading-[0.92] tracking-[-0.04em] text-emerald-400 min-h-[1em] block"
                style={{ fontSize: "clamp(2.8rem,6vw,6rem)" }}
              >
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.52 }}
                  className="inline-block w-[0.06em] h-[0.82em] bg-emerald-400 ml-[0.06em] align-middle rounded-sm"
                />
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44, duration: 0.7 }}
            className="font-montserrat text-[15px] sm:text-base text-white/90 leading-[1.75] mb-10 max-w-lg"
          >
            Every contribution, however small, helps bring lifesaving cancer
            education, early detection, and patient support to communities that
            need it most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#donate-form"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              style={{
                background: "linear-gradient(135deg,#047857,#059669)",
                boxShadow: "0 10px 36px rgba(5,150,105,0.38)",
              }}
            >
              <Heart size={13} aria-hidden="true" /> Donate Now
            </motion.a>
            <Link
              href="/impact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              See Our Impact <ChevronRight size={12} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #030712)" }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MISSION STATEMENT
═══════════════════════════════════════════════ */
function MissionStatement() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="w-full bg-white border-b border-slate-100 font-montserrat"
      aria-labelledby="why-give-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={iv ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                Why Your Gift Matters
              </span>
            </div>
            <h2
              id="why-give-heading"
              className="font-montserrat text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.06] mb-5"
              style={{ letterSpacing: "-0.03em" }}
            >
              In many communities, cancer
              <br />
              is still a death sentence.
              <span style={{ color: "#059669" }}> Not anymore.</span>
            </h2>
            <p className="font-montserrat text-[15px] text-slate-500 leading-[1.8]">
              In many rural communities, cancer is still a death sentence, not
              because it can&apos;t be treated, but because it wasn&apos;t
              caught in time. With your support, we can bring cancer education,
              screening, and support to places that have never had access
              before.
            </p>
            <p className="font-montserrat text-[15px] text-slate-500 leading-[1.8] mt-3 font-semibold">
              100% of every donation goes directly to outreach, screenings, and
              patient support.
            </p>
          </motion.div>

          <ul className="space-y-4 list-none p-0 m-0">
            {[
              {
                amount: "₦5,000",
                icon: Users,
                color: "#059669",
                bg: "#f0fdf4",
                border: "#bbf7d0",
                label: "Provides cancer awareness materials for 100 people",
              },
              {
                amount: "₦25,000",
                icon: Microscope,
                color: "#0284c7",
                bg: "#eff6ff",
                border: "#bfdbfe",
                label: "Funds free screening for 5 women in rural communities",
              },
              {
                amount: "₦100,000",
                icon: Globe2,
                color: "#7c3aed",
                bg: "#f5f3ff",
                border: "#ddd6fe",
                label: "Fuels a mobile clinic for a full day of outreach",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  animate={iv ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: 0.12 + i * 0.1,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-start gap-4 p-5 rounded-2xl border"
                  style={{
                    background: item.bg,
                    borderColor: item.border,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "white",
                      border: `1px solid ${item.border}`,
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      style={{ color: item.color }}
                    />
                  </span>
                  <div>
                    <p
                      className="font-montserrat text-[16px] font-black leading-none mb-1"
                      style={{ color: item.color }}
                    >
                      {item.amount}
                    </p>
                    <p className="font-montserrat text-[13.5px] text-slate-600 leading-snug font-medium">
                      {item.label}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DONATION FORM
═══════════════════════════════════════════════ */
const TIERS = [
  { label: "₦5,000", value: 5000, usd: 3, desc: "Awareness for 100" },
  { label: "₦10,000", value: 10000, usd: 7, desc: "Screening for 2" },
  { label: "₦25,000", value: 25000, usd: 17, desc: "Screening for 5" },
  { label: "₦50,000", value: 50000, usd: 33, desc: "Half day clinic" },
  { label: "₦100,000", value: 100000, usd: 66, desc: "Full day clinic" },
  { label: "Other", value: 0, usd: 0, desc: "Custom amount" },
];

const CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
];

function DonationForm() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  const [freq, setFreq] = useState("one-time");
  const [selected, setSelected] = useState(2);
  const [custom, setCustom] = useState("");
  const [currency, setCurrency] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dedicate, setDedicate] = useState(false);
  const [dedicatee, setDedicatee] = useState("");
  const [status, setStatus] = useState("idle");

  const cur = CURRENCIES[currency];
  const tier = TIERS[selected];
  const isCustom = tier.value === 0;
  const amount = isCustom
    ? parseFloat(custom.replace(/,/g, "")) || 0
    : cur.code === "NGN"
    ? tier.value
    : tier.usd;
  const displayAmt =
    amount > 0
      ? `${cur.symbol}${amount.toLocaleString()}`
      : `${cur.symbol}-`;

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || amount <= 0) return;
    setStatus("loading");
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, amount, currency: cur.code, frequency: freq, dedicate, dedicatee }),
    });
    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        ref={ref}
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center text-center gap-5 font-montserrat"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}
      >
        <span
          aria-hidden="true"
          className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
        >
          <CheckCircle2 size={28} className="text-emerald-600" />
        </span>
        <div>
          <h3
            className="font-montserrat text-[22px] font-black text-slate-900 mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            Thank you, {name || "friend"}!
          </h3>
          <p className="font-montserrat text-[14px] text-slate-500 leading-relaxed max-w-sm">
            Your donation of{" "}
            <strong className="text-emerald-600">{displayAmt}</strong> is being
            processed. A receipt will be sent to{" "}
            <strong>{email}</strong>.
          </p>
        </div>
        <p className="font-montserrat text-[13px] text-slate-400 italic">
          &ldquo;Every donation brings us one step closer to a cancer aware
          Africa.&rdquo;
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-montserrat text-[13px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Make another donation →
        </button>
      </motion.div>
    );
  }

  const inputClass =
    "font-montserrat px-4 py-3 rounded-xl border text-[14px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 w-full";

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Donation form"
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden font-montserrat"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}
    >
      <div className="px-8 pt-8 pb-6 border-b border-slate-100">
        <motion.div
          {...fw(0)}
          className="flex items-center gap-3 mb-2"
        >
          <Heart size={16} className="text-[#F5C300]" fill="#F5C300" aria-hidden="true" />
          <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
            Secure Donation
          </span>
          <Lock
            size={11}
            className="text-slate-300 ml-auto"
            aria-hidden="true"
          />
        </motion.div>
        <motion.h2
          {...fw(0.05)}
          className="font-montserrat text-[1.7rem] font-black text-slate-900"
          style={{ letterSpacing: "-0.025em" }}
        >
          Give today. Save a life.
        </motion.h2>
      </div>

      <div className="px-8 py-7 flex flex-col gap-7">
        {/* Frequency */}
        <motion.fieldset {...fw(0.1)} className="m-0 p-0 border-0">
          <legend className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-500 mb-3">
            Donation Type
          </legend>
          <div
            role="radiogroup"
            aria-label="Donation frequency"
            className="inline-flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1 gap-1"
          >
            {[
              ["one-time", "One Time"],
              ["monthly", "Monthly"],
            ].map(([val, lbl]) => (
              <button
                key={val}
                type="button"
                role="radio"
                aria-checked={freq === val}
                onClick={() => setFreq(val)}
                className="px-5 py-2.5 rounded-lg font-montserrat text-[12.5px] font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  background: freq === val ? "white" : "transparent",
                  color: freq === val ? "#059669" : "#94a3b8",
                  boxShadow: freq === val ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {val === "monthly" && (
                  <RefreshCw
                    size={11}
                    aria-hidden="true"
                    className="inline mr-1.5 -mt-0.5"
                  />
                )}
                {lbl}
              </button>
            ))}
          </div>
          {freq === "monthly" && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-montserrat text-[12px] text-emerald-600 font-bold mt-2 flex items-center gap-1.5"
            >
              <CheckCircle2 size={12} aria-hidden="true" /> Monthly donors fund
              12× more impact annually
            </motion.p>
          )}
        </motion.fieldset>

        {/* Currency */}
        <motion.fieldset {...fw(0.14)} className="m-0 p-0 border-0">
          <legend className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-500 mb-3">
            Currency
          </legend>
          <div
            role="radiogroup"
            aria-label="Donation currency"
            className="flex flex-wrap gap-2"
          >
            {CURRENCIES.map((c, i) => (
              <button
                key={c.code}
                type="button"
                role="radio"
                aria-checked={currency === i}
                aria-label={`${c.label} (${c.symbol} ${c.code})`}
                onClick={() => setCurrency(i)}
                className="px-4 py-2 rounded-xl font-montserrat text-[12.5px] font-black transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  background: currency === i ? "#f0fdf4" : "white",
                  color: currency === i ? "#059669" : "#94a3b8",
                  borderColor: currency === i ? "#bbf7d0" : "#e2e8f0",
                }}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </motion.fieldset>

        {/* Amount */}
        <motion.fieldset {...fw(0.18)} className="m-0 p-0 border-0">
          <legend className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-500 mb-3">
            Select Amount
          </legend>
          <div
            role="radiogroup"
            aria-label="Donation amount"
            className="grid grid-cols-3 gap-2.5"
          >
            {TIERS.map((t, i) => {
              const isActive = selected === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setSelected(i)}
                  className="relative flex flex-col items-center justify-center py-3.5 rounded-xl border transition-all duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  style={{
                    background: isActive ? "#f0fdf4" : "white",
                    borderColor: isActive ? "#059669" : "#e2e8f0",
                    boxShadow: isActive
                      ? "0 0 0 2px rgba(5,150,105,0.2)"
                      : "none",
                  }}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2
                        size={10}
                        className="text-white"
                        strokeWidth={3}
                      />
                    </span>
                  )}
                  <span
                    className="font-montserrat text-[13.5px] font-black leading-none mb-0.5"
                    style={{ color: isActive ? "#059669" : "#1e293b" }}
                  >
                    {cur.code === "NGN"
                      ? t.label
                      : t.value === 0
                      ? "Other"
                      : `${cur.symbol}${t.usd}`}
                  </span>
                  <span className="font-montserrat text-[10px] font-semibold text-slate-400 leading-none">
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isCustom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 font-montserrat text-[15px] font-black text-slate-400"
                  >
                    {cur.symbol}
                  </span>
                  <label htmlFor="df-custom" className="sr-only">
                    Custom donation amount
                  </label>
                  <input
                    id="df-custom"
                    type="text"
                    inputMode="decimal"
                    value={custom}
                    onChange={(e) =>
                      setCustom(e.target.value.replace(/[^\d.]/g, ""))
                    }
                    placeholder="Enter amount"
                    className={inputClass}
                    style={{ paddingLeft: 32, borderColor: "#e2e8f0" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.fieldset>

        {/* Personal */}
        <motion.div
          {...fw(0.22)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="df-name"
              className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-500"
            >
              Full Name *
            </label>
            <input
              id="df-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
              className={inputClass}
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="df-email"
              className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-500"
            >
              Email Address *
            </label>
            <input
              id="df-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className={inputClass}
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
        </motion.div>

        {/* Dedicate */}
        <motion.div {...fw(0.26)}>
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <input
              type="checkbox"
              checked={dedicate}
              onChange={() => setDedicate((d) => !d)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
              style={{
                background: dedicate ? "#059669" : "white",
                borderColor: dedicate ? "#059669" : "#cbd5e1",
              }}
            >
              {dedicate && (
                <CheckCircle2
                  size={12}
                  className="text-white"
                  strokeWidth={3}
                />
              )}
            </span>
            <span className="font-montserrat text-[13.5px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
              Dedicate this donation in someone&apos;s honour
            </span>
          </label>
          <AnimatePresence>
            {dedicate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="overflow-hidden"
              >
                <label htmlFor="df-honour" className="sr-only">
                  Honouree&apos;s name
                </label>
                <input
                  id="df-honour"
                  type="text"
                  value={dedicatee}
                  onChange={(e) => setDedicatee(e.target.value)}
                  placeholder="Honouree's name"
                  className={inputClass}
                  style={{ marginTop: 12, borderColor: "#e2e8f0" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Preview */}
        <motion.div
          {...fw(0.3)}
          className="flex items-center justify-between px-5 py-4 rounded-2xl border border-emerald-100"
          style={{ background: "#f0fdf4" }}
        >
          <div>
            <p className="font-montserrat text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-0.5">
              {freq === "monthly" ? "Monthly giving" : "One time gift"}
            </p>
            <p
              className="font-montserrat text-[22px] font-black text-emerald-700 leading-none"
              style={{ letterSpacing: "-0.03em" }}
              aria-live="polite"
            >
              {displayAmt}
            </p>
          </div>
          <div className="text-right">
            <p className="font-montserrat text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              100% goes to
            </p>
            <p className="font-montserrat text-[12px] font-black text-emerald-700">
              programmes &amp; outreach
            </p>
          </div>
        </motion.div>

        {/* Submit + alt methods */}
        <motion.div {...fw(0.34)} className="flex flex-col gap-3">
          <motion.button
            type="submit"
            disabled={!email || amount <= 0 || status === "loading"}
            whileHover={email && amount > 0 ? { scale: 1.02 } : {}}
            whileTap={email && amount > 0 ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-montserrat text-[14px] font-black text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            style={{
              background: "linear-gradient(135deg,#047857,#059669,#10b981)",
              boxShadow:
                email && amount > 0
                  ? "0 8px 28px rgba(5,150,105,0.32)"
                  : "none",
            }}
          >
            {status === "loading" ? (
              <>
                <span
                  aria-hidden="true"
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />{" "}
                Processing…
              </>
            ) : (
              <>
                <Heart
                  size={14}
                  strokeWidth={2.5}
                  fill="white"
                  aria-hidden="true"
                />{" "}
                Donate {displayAmt} Now
              </>
            )}
          </motion.button>

          <details className="group">
            <summary
              className="w-full flex items-center justify-between py-3.5 px-5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-200 list-none"
              style={{ background: "#f8fafc" }}
            >
              <span className="font-montserrat text-[13px] font-bold text-slate-600 flex items-center gap-2">
                <Globe2
                  size={14}
                  className="text-slate-400"
                  aria-hidden="true"
                />{" "}
                Bank Transfer / Direct Payment
              </span>
              <ChevronRight
                size={13}
                aria-hidden="true"
                className="text-slate-400 group-open:rotate-90 transition-transform duration-200"
              />
            </summary>
            <div className="mt-2 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="font-montserrat text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
                Bank Details
              </p>
              {[
                ["Account Name", "Ngogbehei Cancer Center"],
                ["Bank", "First Bank of Nigeria"],
                ["Account No.", "3012345678"],
                ["Sort Code", "011152803"],
                ["Reference", "DONATION-2025"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="font-montserrat text-[12px] text-slate-400 font-semibold">
                    {k}
                  </span>
                  <span className="font-montserrat text-[12.5px] font-black text-slate-800">
                    {v}
                  </span>
                </div>
              ))}
              <p className="font-montserrat text-[11px] text-slate-400 mt-3 leading-relaxed">
                After transferring, please email{" "}
                <strong>info@ngogbeheicc.org</strong> with your name and amount
                so we can issue a receipt.
              </p>
            </div>
          </details>
        </motion.div>

        <motion.div {...fw(0.4)} className="flex items-start gap-2.5 pt-2">
          <Lock
            size={12}
            aria-hidden="true"
            className="text-slate-300 flex-shrink-0 mt-0.5"
          />
          <p className="font-montserrat text-[11px] text-slate-400 leading-relaxed">
            All card payments are encrypted and processed securely. We never
            store your card details. Your data is protected under UK GDPR.
          </p>
        </motion.div>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════
   TRUST SIGNALS
═══════════════════════════════════════════════ */
function TrustSignals() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const items = [
    {
      icon: Shield,
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      title: "UK Registered Charity",
      desc:
        "Registered with the Charity Commission for England & Wales. Full financial transparency.",
    },
    {
      icon: FileText,
      color: "#0284c7",
      bg: "#eff6ff",
      border: "#bfdbfe",
      title: "Annual Impact Reports",
      desc:
        "We publish detailed accounts every year. See exactly how every penny is spent.",
    },
    {
      icon: Award,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      title: "WHO Aligned Programmes",
      desc:
        "All NCC programmes are validated against WHO cancer early detection standards.",
    },
    {
      icon: Globe2,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
      title: "100% Programme Spend",
      desc:
        "Our UK administration is grant funded. Every donation goes to African programmes.",
    },
  ];
  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={iv ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
          <h2
            id="trust-heading"
            className="font-montserrat text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 text-center m-0"
          >
            Why Trust NCC
          </h2>
          <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
        </motion.div>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0"
          role="list"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={iv ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-4 p-6 rounded-2xl border bg-white"
                style={{
                  borderColor: item.border,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    style={{ color: item.color }}
                  />
                </span>
                <div>
                  <h3
                    className="font-montserrat text-[13.5px] font-black text-slate-900 mb-1.5"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-montserrat text-[12.5px] text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   GIFT MATCHING BANNER
═══════════════════════════════════════════════ */
function GiftMatching() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="w-full bg-white border-t border-slate-100 font-montserrat"
      aria-labelledby="match-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl px-8 sm:px-14 py-12"
          style={{ background: "linear-gradient(135deg,#030712 0%,#011e10 100%)" }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="gm-g"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M40 0L0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gm-g)" />
            </svg>
          </div>

          <span
            aria-hidden="true"
            className="absolute right-6 top-1/2 -translate-y-1/2 font-montserrat font-black text-white/[0.04] leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(60px,10vw,120px)" }}
          >
            2×
          </span>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
                <span className="font-montserrat text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/80">
                  Limited Offer
                </span>
              </div>
              <h2
                id="match-heading"
                className="font-montserrat font-black text-white leading-[0.95] mb-3"
                style={{
                  fontSize: "clamp(1.8rem,4vw,3rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                All donations matched
                <br />
                <span style={{ color: "#F5C300" }}>up to ₦5 million</span>
                <span className="text-white/70">
                  {" "}
                  through December 2025.
                </span>
              </h2>
              <p className="font-montserrat text-[14px] text-white/65 leading-relaxed max-w-lg">
                A generous corporate partner will match every donation received
                before December 31, 2025. Your ₦25,000 becomes ₦50,000. Give
                today and double your impact.
              </p>
            </div>
            <motion.a
              href="#donate-form"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-montserrat text-[13.5px] font-black text-[#030712] bg-[#F5C300] flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
              style={{ boxShadow: "0 10px 36px rgba(245,195,0,0.28)" }}
            >
              <Heart size={14} fill="#030712" aria-hidden="true" /> Claim Your
              Match
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DONOR QUOTE
═══════════════════════════════════════════════ */
function DonorQuote() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-label="Donor testimonial"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center m-0"
        >
          <span
            aria-hidden="true"
            className="block w-10 h-px bg-[#F5C300] mx-auto mb-8"
          />
          <blockquote className="m-0 p-0">
            <p
              className="font-montserrat text-[1.4rem] sm:text-[1.6rem] font-black text-slate-900 leading-[1.35] mb-6"
              style={{ letterSpacing: "-0.025em" }}
            >
              &ldquo;I donated ₦10,000 last year thinking it was a small
              contribution. NCC told me it funded screenings for two women -
              one of whom was diagnosed at Stage 1. She&apos;s alive
              today.&rdquo;
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-[#F5C300] flex items-center justify-center text-[#030712] font-montserrat text-[13px] font-black"
            >
              O
            </span>
            <span className="text-left">
              <span className="block font-montserrat text-[13px] font-black text-slate-800">
                Olumide A., Abuja
              </span>
              <span className="block font-montserrat text-[11px] text-slate-400 font-semibold">
                NCC Donor · 2023
              </span>
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CTA
═══════════════════════════════════════════════ */
function CTABanner() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-t border-slate-900 font-montserrat"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)",
      }}
      aria-labelledby="donate-cta-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cb-g"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M44 0L0 0 0 44"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cb-g)" />
        </svg>
        {!reduceMotion && (
          <motion.span
            className="absolute inset-y-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom,transparent,rgba(245,195,0,0.12) 40%,rgba(245,195,0,0.2) 50%,rgba(245,195,0,0.12) 60%,transparent)",
            }}
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          />
        )}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/75">
                Other Ways to Help
              </span>
            </motion.div>
            <motion.h2
              id="donate-cta-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.08,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat font-black text-white leading-[0.95] mb-5"
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Not just money.
              <br />
              <span style={{ color: "#F5C300" }}>
                Your time matters too.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.17 }}
              className="font-montserrat text-[14px] text-white/75 leading-relaxed max-w-md"
            >
              Volunteer your skills, partner your organisation, or simply share
              our mission. Every action moves us closer to 10,000 lives
              reached.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={iv ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: 0.24,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-3 min-w-[200px]"
          >
            <Link
              href="/get-involved/volunteer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[13px] font-black text-[#030712] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ boxShadow: "0 8px 32px rgba(255,255,255,0.1)" }}
            >
              <Users size={13} aria-hidden="true" /> Volunteer
            </Link>
            <Link
              href="/get-involved/partners"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[13px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Partner With Us <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
            <Link
              href="/get-involved/campaigns"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[13px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Share Our Mission <ChevronRight size={12} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function DonatePage() {
  return (
    <>
      <DonateSchema />
      <main id="main-content" className="w-full font-montserrat">
        <DonateHero />
        <MissionStatement />

        <section
          id="donate-form"
          className="w-full bg-white border-t border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
          aria-labelledby="donate-form-heading"
        >
          <h2 id="donate-form-heading" className="sr-only">
            Make your donation
          </h2>
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-16 items-start">
              <DonationForm />

              <aside
                aria-label="Donation summary"
                className="lg:sticky lg:top-28 flex flex-col gap-5"
              >
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                  <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    Your Impact
                  </p>
                  <ul className="space-y-3 list-none p-0 m-0">
                    {[
                      { val: "3,400+", lbl: "People educated" },
                      { val: "890+", lbl: "Free screenings" },
                      { val: "210+", lbl: "Patients guided" },
                      { val: "12+", lbl: "Communities reached" },
                    ].map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-montserrat text-[13px] text-slate-500 font-semibold">
                          {s.lbl}
                        </span>
                        <span
                          className="font-montserrat text-[15px] font-black text-emerald-600"
                          style={{ letterSpacing: "-0.02em" }}
                        >
                          {s.val}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    Secure Payments
                  </p>
                  <ul
                    className="flex flex-wrap items-center gap-4 list-none p-0 m-0"
                    role="list"
                  >
                    <li className="px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                      <span
                        className="font-montserrat text-[12px] font-black italic"
                        style={{ color: "#1a1f71" }}
                      >
                        VISA
                      </span>
                    </li>
                    <li className="px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="w-4 h-4 rounded-full bg-red-500 opacity-90"
                      />
                      <span
                        aria-hidden="true"
                        className="w-4 h-4 rounded-full bg-orange-400 -ml-2"
                      />
                      <span className="sr-only">Mastercard</span>
                    </li>
                    <li className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                      <Globe2
                        size={13}
                        className="text-slate-400"
                        aria-hidden="true"
                      />
                      <span className="font-montserrat text-[11px] font-bold text-slate-500">
                        Bank Transfer
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-1.5 mt-4">
                    <Lock
                      size={11}
                      className="text-slate-300"
                      aria-hidden="true"
                    />
                    <span className="font-montserrat text-[11px] text-slate-400 font-semibold">
                      256 bit SSL encrypted · UK GDPR compliant
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Questions?
                  </p>
                  <p className="font-montserrat text-[13px] text-slate-500 leading-relaxed mb-3">
                    Our team is happy to help with donations, receipts, or
                    corporate giving.
                  </p>
                  <a
                    href="mailto:info@ngogbeheicc.org"
                    className="font-montserrat text-[13px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5 group focus-visible:outline-none focus-visible:underline"
                  >
                    info@ngogbeheicc.org
                    <ArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <GiftMatching />
        <TrustSignals />
        <DonorQuote />
        <CTABanner />
      </main>
    </>
  );
}
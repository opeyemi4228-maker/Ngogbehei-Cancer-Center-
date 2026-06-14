"use client";

/**
 * @file app/impact/page.jsx
 * @project Ngogbehei Cancer Center - Impact Page
 */

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  MoveRight,
  ChevronRight,
  Plus,
  Download,
  Users,
  Microscope,
  Heart,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import Hero4 from "@/assets/Hero4.jpg";
import M1 from "@/assets/M1.jpg";
import M2 from "@/assets/M2.jpg";
import M3 from "@/assets/M3.jpg";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ═══════════════════════════════════════════════
   JSON-LD
═══════════════════════════════════════════════ */
function ImpactSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "NGO"],
        "@id": `${SITE_URL}/#organization`,
        name: "Ngogbehei Cancer Center",
        alternateName: "NCC",
        legalName: "Marcel Ngogbehei Center for Cancer Education & Care",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        foundingDate: "2021",
        areaServed: ["Nigeria", "Ghana", "Cameroon", "Kenya", "South Africa"],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/impact`,
        name: "Our Impact | Ngogbehei Cancer Center",
        description:
          "Ngogbehei Cancer Center has educated 3,400+ people, conducted 890+ free cancer screenings, and navigated 210+ patients to care across 5 African nations.",
        url: `${SITE_URL}/impact`,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Impact",
              item: `${SITE_URL}/impact`,
            },
          ],
        },
      },
    ],
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

function Counter({ to, suffix = "", prefix = "", duration = 1800 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const iv = useInView(ref, { once: true });
  useEffect(() => {
    if (!iv) return;
    let s = null;
    const f = (t) => {
      if (!s) s = t;
      const p = Math.min((t - s) / duration, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [iv, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </span>
  );
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
function ImpactHero() {
  const PHRASES = [
    "touched.",
    "educated.",
    "screened early.",
    "guided to care.",
    "saved.",
  ];
  const typed = useTypewriter(PHRASES, 72);

  return (
    <section
      aria-labelledby="impact-hero-heading"
      className="relative w-full overflow-hidden font-montserrat"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(125% 125% at 0% 50%, #030712 45%, #011e10 100%)",
      }}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <Image
          src={Hero4}
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          placeholder="blur"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.38) saturate(0.7)",
          }}
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
              id="ig-sm"
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
          <rect width="100%" height="100%" fill="url(#ig-sm)" />
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
                Our Impact
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
              Our Impact
            </span>
          </motion.div>

          <div className="mb-7 overflow-hidden">
            {["Every number", "is a life we've"].map((line, i) => (
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
                    id="impact-hero-heading"
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
            Since 2021, every statistic we publish represents a real person -
            educated, screened, guided to care, or given a fighting chance at
            life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#stats-heading"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              style={{
                background: "linear-gradient(135deg,#047857,#059669)",
                boxShadow: "0 10px 36px rgba(5,150,105,0.38)",
              }}
            >
              <Plus size={13} aria-hidden="true" /> See Our Numbers
            </motion.a>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Support Our Work <ChevronRight size={12} aria-hidden="true" />
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
   STATS
═══════════════════════════════════════════════ */
const STATS = [
  { num: 5, suf: "+", label: "African Nations", sub: "Active operations" },
  { num: 3400, suf: "+", label: "People Educated", sub: "Cancer literacy" },
  { num: 890, suf: "+", label: "Free Screenings", sub: "Conducted to date" },
  { num: 210, suf: "+", label: "Patients Supported", sub: "Through navigation" },
  { num: 12, suf: "+", label: "Communities", sub: "Directly reached" },
  { num: 100, suf: "%", label: "Nonprofit", sub: "UK registered charity" },
];

function StatsRow() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white border-b border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="px-6 sm:px-10 lg:px-16 xl:px-20 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
            <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
              By The Numbers
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <motion.h2
              id="stats-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat text-[2.2rem] sm:text-[2.8rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              Measurable results.
              <br />
              <span style={{ color: "#059669" }}>Real lives changed.</span>
            </motion.h2>
            <motion.a
              href="/impact/reports"
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.18 }}
              className="inline-flex items-center gap-2 font-montserrat text-[15px] font-bold text-slate-500 hover:text-slate-800 transition-colors group flex-shrink-0 focus-visible:outline-none focus-visible:underline"
            >
              <Download size={13} aria-hidden="true" /> Download Full Report
              <MoveRight
                size={13}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </motion.a>
          </div>
        </div>

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 list-none p-0 m-0"
          role="list"
          aria-label="Impact statistics"
        >
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col py-10 px-6 border-r border-b border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors duration-200"
            >
              <p
                className="font-montserrat text-[2.2rem] font-black text-slate-900 leading-none tabular-nums mb-2"
                style={{ letterSpacing: "-0.03em" }}
                aria-label={`${s.num}${s.suf} ${s.label}`}
              >
                <Counter to={s.num} suffix={s.suf} duration={1600} />
              </p>
              <p className="font-montserrat text-[14px] font-black text-slate-700 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="font-montserrat text-[14px] text-slate-400 font-medium">
                {s.sub}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PILLARS
═══════════════════════════════════════════════ */
const PILLARS = [
  {
    num: "01",
    color: "#059669",
    icon: Users,
    title: "Community Education & Awareness",
    desc: "Workshops in schools, churches, and community centres covering cancer symptoms, risk factors, myths, and lifestyle changes, in local languages and culturally relevant formats.",
    stat: "3,400+",
    statLbl: "Individuals reached",
    progress: 34,
    goal: "Goal: 10,000",
  },
  {
    num: "02",
    color: "#0284c7",
    icon: Microscope,
    title: "Screening & Early Detection",
    desc: "Mobile screening units and pop up clinics bringing breast, cervical, and prostate screenings directly into rural and peri urban communities. We train health volunteers in referral processes.",
    stat: "890+",
    statLbl: "Free screenings",
    progress: 29,
    goal: "Goal: 3,000",
  },
  {
    num: "03",
    color: "#7c3aed",
    icon: Heart,
    title: "Access to Care & Navigation",
    desc: "We walk beside every patient after diagnosis, connecting them to hospitals, specialists, and treatment. Micro grants and transport support ensure poverty is never a barrier to survival.",
    stat: "210+",
    statLbl: "Patients guided",
    progress: 42,
    goal: "Goal: 500",
  },
  {
    num: "04",
    color: "#0891b2",
    icon: Globe2,
    title: "Survivor & Caregiver Support",
    desc: "Peer support groups for cancer survivors and caregivers, mental health and wellness programmes post diagnosis, and survivor story campaigns that reduce stigma and inspire early action.",
    stat: "5+",
    statLbl: "Nations active",
    progress: 50,
    goal: "Goal: 10",
  },
];

function ImpactPillars() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white border-t border-slate-100 font-montserrat"
      aria-labelledby="pillars-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                What We Do
              </span>
            </motion.div>
            <motion.h2
              id="pillars-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              Four pillars.
              <br />
              <span style={{ color: "#059669" }}>One mission.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.14 }}
            className="font-montserrat text-[16px] text-slate-500 leading-relaxed max-w-xs"
          >
            Everything NCC does flows from one belief: early action saves
            lives, and no rural community should be left behind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
          {PILLARS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.num}
                initial={{ opacity: 0 }}
                animate={iv ? { opacity: 1 } : {}}
                transition={{ delay: 0.16 + i * 0.09, duration: 0.55 }}
                className="bg-white p-8 flex flex-col gap-5 group hover:bg-slate-50 transition-colors duration-200"
                aria-label={`Programme pillar ${item.num}: ${item.title}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="font-montserrat text-[15px] font-black tabular-nums"
                    style={{ color: item.color }}
                  >
                    {item.num}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: `${item.color}14` }}
                  >
                    <Icon size={12} style={{ color: item.color }} />
                  </span>
                </div>
                <div>
                  <h3
                    className="font-montserrat text-[15px] font-black text-slate-900 mb-2.5"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-montserrat text-[15px] text-slate-500 leading-[1.7]">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="font-montserrat text-[14px] font-black uppercase tracking-wider"
                      style={{ color: item.color }}
                    >
                      {item.progress}% of goal
                    </span>
                    <span className="font-montserrat text-[14px] text-slate-400 font-semibold">
                      {item.goal}
                    </span>
                  </div>
                  <div
                    className="h-[2px] w-full rounded-full bg-slate-100 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={item.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.title} progress: ${item.progress}% of ${item.goal}`}
                  >
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={iv ? { width: `${item.progress}%` } : {}}
                      transition={{ delay: 0.4 + i * 0.08, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-100">
                  <p
                    className="font-montserrat text-[22px] font-black leading-none"
                    style={{ letterSpacing: "-0.03em", color: item.color }}
                  >
                    {item.stat}
                  </p>
                  <p className="font-montserrat text-[14px] text-slate-400 font-semibold mt-1">
                    {item.statLbl}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STORY CARDS
═══════════════════════════════════════════════ */
const STORIES = [
  {
    tag: "Communities",
    tagColor: "#059669",
    title: "Mobile clinics reaching the unreachable.",
    desc: "Deploying awareness units into underserved Nigerian communities where cancer information and screening services have never reached before.",
    img: M1,
    imgAlt: "African NCC mobile clinic arriving in a rural Nigerian community",
    stat: "12+ Communities",
    href: "/impact/communities",
  },
  {
    tag: "Survivors",
    tagColor: "#7c3aed",
    title: "She had never heard the word \u201Cmammogram.\u201D",
    desc: "A first generation survivor story from Abuja, caught at Stage 1 because of an NCC screening drive that came directly to her village.",
    img: M2,
    imgAlt: "African cancer survivor sharing her story after early detection through NCC programme",
    stat: "210+ Guided",
    href: "/impact/survivors",
  },
  {
    tag: "Partnerships",
    tagColor: "#0284c7",
    title: "Building cancer protocols for Africa.",
    desc: "Formal collaborations with NHS charity partners and leading universities to build evidence based treatment frameworks suited to Nigeria's healthcare landscape.",
    img: M3,
    imgAlt: "African healthcare professionals collaborating on cancer research partnership with NCC",
    stat: "Active partners",
    href: "/get-involved/partners",
  },
];

function StoryCards() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-labelledby="stories-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                Stories &amp; Impact
              </span>
            </motion.div>
            <motion.h2
              id="stories-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              Real people.
              <br />
              <span style={{ color: "#059669" }}>Real lives changed.</span>
            </motion.h2>
          </div>
          <motion.a
            href="/stories"
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.16 }}
            className="inline-flex items-center gap-1.5 font-montserrat text-[15px] font-bold text-slate-500 hover:text-slate-800 transition-colors group flex-shrink-0 focus-visible:outline-none focus-visible:underline"
            aria-label="View all NCC impact stories"
          >
            All stories{" "}
            <MoveRight
              size={13}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.a>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 list-none p-0 m-0"
          role="list"
        >
          {STORIES.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 flex flex-col"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <Link
                href={s.href}
                className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
                aria-label={`Read story: ${s.title}`}
              >
                <figure
                  className="relative overflow-hidden m-0 w-full"
                  style={{ aspectRatio: "16/10" }}
                >
                  <Image
                    src={s.img}
                    alt={s.imgAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    priority={false}
                    quality={95}
                    placeholder="blur"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
                    }}
                  />
                  <span
                    className="absolute top-4 left-4 font-montserrat text-[13px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ background: s.tagColor }}
                  >
                    {s.tag}
                  </span>
                </figure>
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <h3
                    className="font-montserrat text-[15px] font-black text-slate-900 leading-snug"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </h3>
                  <p className="font-montserrat text-[15px] text-slate-500 leading-relaxed flex-1">
                    {s.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span
                      className="font-montserrat text-[14px] font-black uppercase tracking-wider"
                      style={{ color: s.tagColor }}
                    >
                      {s.stat}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 font-montserrat text-[14px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors"
                      aria-hidden="true"
                    >
                      Read more{" "}
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════ */
const TIMELINE = [
  {
    year: "2021",
    color: "#F5C300",
    title: "NCC Founded",
    desc: "UK registered nonprofit launched after a deeply personal encounter with the devastating cost of late stage cancer diagnosis in Africa.",
  },
  {
    year: "2022",
    color: "#059669",
    title: "First Pilot Programme",
    desc: "Community cancer awareness programme in Lagos State reaches 400+ residents in a single weekend drive.",
  },
  {
    year: "2022",
    color: "#0284c7",
    title: "Free Screenings Begin",
    desc: "Mobile screening unit deployed - 150 free breast and cervical screenings conducted in communities with no prior access.",
  },
  {
    year: "2023",
    color: "#7c3aed",
    title: "UK Partnerships Formed",
    desc: "Formal collaborations established with NHS charity partners and King's College London for research and clinical support.",
  },
  {
    year: "2023",
    color: "#0891b2",
    title: "5-Nation Expansion",
    desc: "NCC operations extended into Ghana, Cameroon, Kenya, and South Africa, bringing education and screening to new communities.",
  },
  {
    year: "2024",
    color: "#059669",
    title: "10,000+ Lives Target Set",
    desc: "Board approves ambitious 12-month mission to educate, screen, and support 10,000+ individuals across Africa.",
  },
];

function Timeline() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white border-t border-slate-100 font-montserrat"
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                Our Journey
              </span>
            </motion.div>
            <motion.h2
              id="timeline-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.06]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Every
              <br />
              milestone.
              <br />
              <span style={{ color: "#059669" }}>Every life.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16 }}
              className="font-montserrat text-[15px] text-slate-500 leading-relaxed mt-4 max-w-[220px]"
            >
              From a single community programme in Lagos to five nations, three
              years of relentless effort.
            </motion.p>
          </div>

          <div className="relative">
            <motion.span
              aria-hidden="true"
              className="absolute left-[10px] top-2 bottom-2 w-px bg-slate-200"
              initial={{ scaleY: 0 }}
              animate={iv ? { scaleY: 1 } : {}}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ originY: 0 }}
            />
            <ol
              className="space-y-10 pl-10 list-none p-0 m-0"
              aria-label="NCC milestones timeline"
            >
              {TIMELINE.map((item, i) => (
                <motion.li
                  key={`${item.year}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={iv ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[33px] top-1 w-[10px] h-[10px] rounded-full border-2 border-white"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 0 2px ${item.color}`,
                    }}
                  />
                  <div className="flex items-start gap-5">
                    <span
                      className="font-montserrat text-[14px] font-black tracking-widest flex-shrink-0 pt-0.5"
                      style={{ color: item.color, minWidth: 38 }}
                    >
                      {item.year}
                    </span>
                    <div>
                      <h3
                        className="font-montserrat text-[15px] font-black text-slate-900 mb-1"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {item.title}
                      </h3>
                      <p className="font-montserrat text-[15px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   REPORT CARD
═══════════════════════════════════════════════ */
function ReportCard() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-labelledby="report-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center bg-white rounded-2xl px-8 sm:px-12 py-10 border border-slate-100"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                Annual Report
              </span>
            </div>
            <h2
              id="report-heading"
              className="font-montserrat text-[1.8rem] sm:text-[2.2rem] font-black text-slate-900 mb-3"
              style={{ letterSpacing: "-0.025em" }}
            >
              2024 NCC Impact Report
            </h2>
            <p className="font-montserrat text-[16px] text-slate-500 leading-relaxed max-w-lg">
              Over 3,400 people educated, 890+ free screenings conducted, and
              210+ patients supported across five African nations. Full data,
              survivor stories, financial transparency, and our 12 month
              roadmap, all in one document.
            </p>
            <ul className="flex flex-wrap items-center gap-6 mt-5 list-none p-0">
              {[
                "3,400+ People Reached",
                "5 Nations",
                "100% Nonprofit",
                "UK Registered",
              ].map((chip, i) => (
                <motion.li
                  key={chip}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={iv ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 font-montserrat text-[14px] font-bold text-slate-500"
                >
                  <CheckCircle2
                    size={12}
                    style={{ color: "#059669" }}
                    aria-hidden="true"
                  />{" "}
                  {chip}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0">
            <motion.a
              href="/impact/reports"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-black text-[#030712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
              style={{
                background: "linear-gradient(135deg,#F5C300,#e8b800)",
                boxShadow: "0 6px 20px rgba(245,195,0,0.28)",
              }}
              aria-label="Download NCC 2024 Impact Report"
            >
              <Download size={14} aria-hidden="true" /> Download PDF
            </motion.a>
            <Link
              href="/impact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              View Online <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TESTIMONIAL
═══════════════════════════════════════════════ */
function Testimonial() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="w-full bg-white border-t border-slate-100 font-montserrat"
      aria-label="Survivor testimonial"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center m-0"
        >
          <span
            aria-hidden="true"
            className="block w-10 h-px bg-[#F5C300] mx-auto mb-8"
          />
          <blockquote className="m-0 p-0">
            <p
              className="font-montserrat text-[1.5rem] sm:text-[1.75rem] font-black text-slate-900 leading-[1.35] mb-8"
              style={{ letterSpacing: "-0.025em" }}
            >
              &ldquo;When they told me it was caught early, I didn&apos;t cry
              from fear, I cried from relief. The NCC team was there every
              single step of the way.&rdquo;
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-montserrat text-[15px] font-black"
            >
              A
            </span>
            <span className="text-left">
              <span className="block font-montserrat text-[15px] font-black text-slate-800">
                Amina T., Lagos
              </span>
              <span className="block font-montserrat text-[14px] text-slate-400 font-semibold">
                Cancer Survivor · NCC Programme 2024
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
  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-t border-slate-100 font-montserrat"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)",
      }}
      aria-labelledby="impact-cta-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cta-imp-g"
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
          <rect width="100%" height="100%" fill="url(#cta-imp-g)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/80">
                Join the Mission
              </span>
            </motion.div>

            <motion.h2
              id="impact-cta-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="font-montserrat font-black text-white leading-[0.95] mb-5"
              style={{
                fontSize: "clamp(2.2rem,5vw,4.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Don&apos;t just read
              <br />
              our numbers -
              <br />
              <span style={{ color: "#F5C300" }}>help change them.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.18 }}
              className="font-montserrat text-[16px] text-white/85 leading-relaxed max-w-md"
            >
              Every donation, every volunteer hour, every shared story moves us
              closer to 10,000 lives reached. Because knowledge saves lives -
              and action changes futures.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={iv ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.24, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 min-w-[200px]"
          >
            <motion.a
              href="/donate"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-montserrat text-[15px] font-black text-[#030712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
              style={{
                background: "linear-gradient(135deg,#F5C300,#e8b800)",
                boxShadow: "0 10px 36px rgba(245,195,0,0.28)",
              }}
            >
              <Plus size={13} aria-hidden="true" /> Donate Now
            </motion.a>
            <Link
              href="/get-involved/volunteer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Volunteer <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
            <Link
              href="/get-involved/partners"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Partner With Us <ChevronRight size={12} aria-hidden="true" />
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
export default function ImpactPage() {
  return (
    <>
      <ImpactSchema />
      <main id="main-content" className="w-full font-montserrat">
        <ImpactHero />
        <StatsRow />
        <ImpactPillars />
        <StoryCards />
        <Timeline />
        <ReportCard />
        <Testimonial />
        <CTABanner />
      </main>
    </>
  );
}
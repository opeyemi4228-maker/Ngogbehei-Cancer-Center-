"use client";

/**
 * @file app/get-involved/volunteer/page.jsx
 * @project Ngogbehei Cancer Center — Volunteer Page
 *
 * Production-ready · SEO-optimized · Fully accessible.
 *
 * Sections:
 *   1. Hero (typewriter, breadcrumb, single H1)
 *   2. Why volunteer (impact strip with counters)
 *   3. Six volunteer roles (filterable by category)
 *   4. Volunteer journey (4-step process)
 *   5. Volunteer spotlight (current volunteer story)
 *   6. Application form
 *   7. FAQ accordion
 *   8. CTA banner
 */

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowRight,
  MoveRight,
  Heart,
  Users,
  Microscope,
  Megaphone,
  HandCoins,
  Globe2,
  GraduationCap,
  CheckCircle2,
  Send,
  Clock,
  MapPin,
  Sparkles,
  Calendar,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ═══════════════════════════════════════════════
   JSON-LD
═══════════════════════════════════════════════ */
function VolunteerSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "NGO"],
        "@id": `${SITE_URL}/#organization`,
        name: "Ngogbehei Cancer Center",
        alternateName: "NCC",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/get-involved/volunteer`,
        name: "Volunteer With Ngogbehei Cancer Center",
        description:
          "Join NCC as a volunteer across six pathways — field outreach, healthcare, fundraising, communications, education, and virtual support.",
        url: `${SITE_URL}/get-involved/volunteer`,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Get Involved",
              item: `${SITE_URL}/get-involved`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Volunteer",
              item: `${SITE_URL}/get-involved/volunteer`,
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

function Counter({ to, suffix = "", duration = 1800 }) {
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
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   SPIRAL BG
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
function VolunteerHero() {
  const PHRASES = [
    "your time.",
    "your skills.",
    "your voice.",
    "your hands.",
    "your heart.",
  ];
  const typed = useTypewriter(PHRASES, 72);

  return (
    <section
      aria-label="Volunteer with Ngogbehei Cancer Center"
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
          src="https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=1200&q=85"
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
              id="vg-sm"
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
          <rect width="100%" height="100%" fill="url(#vg-sm)" />
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
            <li>
              <Link
                href="/get-involved"
                className="font-montserrat text-[14px] text-white font-semibold tracking-widest uppercase hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                Get Involved
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={9} className="text-white/60" />
            </li>
            <li aria-current="page">
              <span className="font-montserrat text-[14px] text-emerald-400 font-bold tracking-widest uppercase">
                Volunteer
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
              Volunteer With NCC
            </span>
          </motion.div>

          <div className="mb-7 overflow-hidden">
            {["Lend us", "your time —"].map((line, i) => (
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
            Whether you have an hour a week or a month to spare — every
            volunteer hour helps NCC bring cancer education, screening, and
            patient navigation to communities that need it most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#roles-heading"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              style={{
                background: "linear-gradient(135deg,#047857,#059669)",
                boxShadow: "0 10px 36px rgba(5,150,105,0.38)",
              }}
            >
              <Plus size={13} aria-hidden="true" /> See Open Roles
            </motion.a>
            <a
              href="#apply-heading"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Apply Now <ChevronRight size={12} aria-hidden="true" />
            </a>
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
   IMPACT STRIP
═══════════════════════════════════════════════ */
const IMPACT = [
  { num: 87, suf: "+", label: "Active volunteers", sub: "Across 5 nations" },
  { num: 4200, suf: "+", label: "Hours given", sub: "Last 12 months" },
  { num: 12, suf: "", label: "Communities served", sub: "Through volunteers" },
  { num: 6, suf: "", label: "Volunteer pathways", sub: "Field & remote" },
];

function ImpactStrip() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white border-b border-slate-100 font-montserrat"
      aria-labelledby="vol-impact-heading"
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
              The NCC Volunteer Movement
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <motion.h2
              id="vol-impact-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.07,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat text-[2.2rem] sm:text-[2.8rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              Real people.
              <br />
              <span style={{ color: "#059669" }}>Real difference.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.18 }}
              className="font-montserrat text-[15px] text-slate-500 leading-relaxed max-w-sm"
            >
              Volunteers are the backbone of every screening drive, every
              community workshop, and every survivor support group we run.
            </motion.p>
          </div>
        </div>

        <ul
          className="grid grid-cols-2 lg:grid-cols-4 list-none p-0 m-0"
          role="list"
        >
          {IMPACT.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.12 + i * 0.07,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
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
   ROLES (filterable)
═══════════════════════════════════════════════ */
const ROLES = [
  {
    cat: "field",
    icon: Megaphone,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "Community Outreach Volunteer",
    commitment: "4–8 hrs / week",
    location: "Lagos, Abuja, Port Harcourt",
    desc:
      "Lead cancer awareness workshops in rural communities, schools, churches, and markets. Translate materials into local languages and mobilise turnout for screening drives.",
    tags: ["In-person", "Weekly", "Training provided"],
  },
  {
    cat: "healthcare",
    icon: Microscope,
    color: "#0284c7",
    bg: "#eff6ff",
    border: "#bfdbfe",
    title: "Healthcare Professional",
    commitment: "Saturdays · monthly",
    location: "Mobile screening units",
    desc:
      "Doctors, nurses, midwives and screening technicians staff our pop-up clinics. Conduct breast, cervical, and prostate screenings; counsel patients; and make referrals.",
    tags: ["Licensed", "Monthly drives", "CPD-eligible"],
  },
  {
    cat: "fundraising",
    icon: HandCoins,
    color: "#F5C300",
    bg: "#fffbeb",
    border: "#fde68a",
    title: "Fundraiser & Event Host",
    commitment: "Flexible",
    location: "Anywhere",
    desc:
      "Run sponsored walks, charity dinners, online fundraisers, or workplace giving campaigns. We provide branded materials, talking points, and donation tracking.",
    tags: ["Self-paced", "Toolkit provided", "All ages welcome"],
  },
  {
    cat: "virtual",
    icon: Globe2,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    title: "Virtual Communications Volunteer",
    commitment: "2–4 hrs / week",
    location: "Remote · UK / Africa",
    desc:
      "Translate health content, draft social posts, edit survivor story videos, or maintain our community newsletter. Ideal for students and remote professionals.",
    tags: ["Fully remote", "Skill-building", "Global team"],
  },
  {
    cat: "education",
    icon: GraduationCap,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    title: "Cancer Educator",
    commitment: "1–2 weekends / month",
    location: "Nigeria · UK universities",
    desc:
      "Train teachers, peer educators, and youth leaders in cancer literacy. Deliver curriculum-backed sessions in secondary schools and on university campuses.",
    tags: ["Health background", "Train-the-trainer", "Certificate"],
  },
  {
    cat: "field",
    icon: Heart,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    title: "Patient Companion",
    commitment: "1–3 visits / month",
    location: "Lagos, Abuja, Ibadan",
    desc:
      "Accompany newly-diagnosed patients to hospital appointments, sit with them during chemotherapy, and provide emotional support throughout treatment journeys.",
    tags: ["Compassionate", "DBS-checked", "Ongoing training"],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Roles" },
  { id: "field", label: "Field Work" },
  { id: "healthcare", label: "Healthcare" },
  { id: "fundraising", label: "Fundraising" },
  { id: "virtual", label: "Virtual" },
  { id: "education", label: "Education" },
];

function Roles() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? ROLES : ROLES.filter((r) => r.cat === filter);

  return (
    <section
      ref={ref}
      id="roles"
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
      aria-labelledby="roles-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                Open Roles
              </span>
            </motion.div>
            <motion.h2
              id="roles-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.07,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              Six pathways.
              <br />
              <span style={{ color: "#059669" }}>One mission.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.14 }}
            className="font-montserrat text-[16px] text-slate-500 leading-relaxed max-w-sm"
          >
            Find the role that fits your skills, schedule, and location.
            Don&apos;t see a match? Apply with a free-text proposal.
          </motion.p>
        </div>

        {/* Filter pills */}
        <motion.div
          role="tablist"
          aria-label="Filter volunteer roles"
          initial={{ opacity: 0, y: 8 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(c.id)}
                className="px-4 py-2 rounded-full font-montserrat text-[13px] font-black uppercase tracking-wider transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  background: active ? "#059669" : "white",
                  color: active ? "white" : "#475569",
                  borderColor: active ? "#059669" : "#e2e8f0",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </motion.div>

        {/* Role cards */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0"
          role="list"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.li
                  key={role.title}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-white rounded-2xl border border-slate-100 p-7 flex flex-col gap-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: role.bg,
                        border: `1px solid ${role.border}`,
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                        style={{ color: role.color }}
                      />
                    </span>
                    <span
                      className="font-montserrat text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        background: role.bg,
                        color: role.color,
                        border: `1px solid ${role.border}`,
                      }}
                    >
                      {role.cat}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-montserrat text-[16px] font-black text-slate-900 mb-2 leading-snug"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {role.title}
                    </h3>
                    <p className="font-montserrat text-[14px] text-slate-500 leading-[1.7]">
                      {role.desc}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                    <p className="flex items-center gap-2 font-montserrat text-[13px] font-semibold text-slate-600">
                      <Clock
                        size={12}
                        style={{ color: role.color }}
                        aria-hidden="true"
                      />
                      {role.commitment}
                    </p>
                    <p className="flex items-center gap-2 font-montserrat text-[13px] font-semibold text-slate-600">
                      <MapPin
                        size={12}
                        style={{ color: role.color }}
                        aria-hidden="true"
                      />
                      {role.location}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0 mt-auto">
                    {role.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-montserrat text-[11px] font-bold text-slate-500 px-2 py-1 rounded bg-slate-50 border border-slate-100"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#apply-heading"
                    onClick={() => {
                      // Pre-select the role on apply (handled by form via URL hash)
                      try {
                        sessionStorage.setItem("ncc-vol-role", role.title);
                      } catch {}
                    }}
                    className="inline-flex items-center justify-between gap-2 font-montserrat text-[13px] font-black uppercase tracking-wider transition-all duration-200 group/btn focus-visible:outline-none focus-visible:underline"
                    style={{ color: role.color }}
                    aria-label={`Apply for ${role.title}`}
                  >
                    Apply for this role
                    <ArrowRight
                      size={12}
                      aria-hidden="true"
                      className="group-hover/btn:translate-x-1 transition-transform duration-200"
                    />
                  </a>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   JOURNEY (4 steps)
═══════════════════════════════════════════════ */
const STEPS = [
  {
    n: "01",
    title: "Submit your application",
    desc:
      "Tell us a little about yourself, your skills, your availability, and which pathway interests you. Takes about 5 minutes.",
    color: "#F5C300",
  },
  {
    n: "02",
    title: "Quick screening call",
    desc:
      "A friendly 15-minute video call with a member of our volunteer team to align on expectations and answer your questions.",
    color: "#059669",
  },
  {
    n: "03",
    title: "Onboarding & training",
    desc:
      "Self-paced online onboarding plus a single in-person training day (or virtual session) covering safeguarding, cultural sensitivity, and your specific role.",
    color: "#0284c7",
  },
  {
    n: "04",
    title: "Begin volunteering",
    desc:
      "Get matched to a community drive, project, or remote task. You&apos;ll have a dedicated coordinator and a peer buddy from day one.",
    color: "#7c3aed",
  },
];

function Journey() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white border-t border-slate-100 font-montserrat"
      aria-labelledby="journey-heading"
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
                Your Journey
              </span>
            </motion.div>
            <motion.h2
              id="journey-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.07,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              From application
              <br />
              <span style={{ color: "#059669" }}>to first drive.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.14 }}
            className="font-montserrat text-[16px] text-slate-500 leading-relaxed max-w-sm"
          >
            Most volunteers complete the full process within 2–3 weeks. We
            keep it simple — and we&apos;re here every step of the way.
          </motion.p>
        </div>

        <ol
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0"
          aria-label="Volunteer onboarding journey"
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.18 + i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative bg-white rounded-2xl border border-slate-100 p-7"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-7 right-7 h-[2px] rounded-full"
                style={{ background: step.color }}
              />
              <p
                className="font-montserrat text-[12px] font-black tracking-widest mb-4 mt-2"
                style={{ color: step.color }}
              >
                STEP {step.n}
              </p>
              <h3
                className="font-montserrat text-[16px] font-black text-slate-900 mb-2 leading-snug"
                style={{ letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p className="font-montserrat text-[14px] text-slate-500 leading-[1.7]">
                {step.desc}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SPOTLIGHT
═══════════════════════════════════════════════ */
function Spotlight() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-labelledby="spotlight-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 lg:p-16 max-w-3xl mx-auto"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
            <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
              Volunteer Voices
            </span>
          </motion.div>

          <motion.h2
            id="spotlight-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={iv ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.08,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-montserrat text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.1] mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            &ldquo;The moment you see early detection make a real difference in
            someone&apos;s life,
            <span style={{ color: "#059669" }}>
              {" "}
              you understand why we do this.&rdquo;
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.18 }}
            className="space-y-6 mb-10"
          >
            <p className="font-montserrat text-[15px] text-slate-500 leading-[1.8]">
              Our volunteers come from every background — nurses, teachers,
              business owners, students, retirees — united by a single belief:
              that cancer doesn&apos;t have to be a death sentence in rural
              Africa. They show up to screening drives, community workshops, and
              patient support groups because they&apos;ve seen what knowledge
              and early action can do.
            </p>
            <p className="font-montserrat text-[15px] text-slate-500 leading-[1.8]">
              &ldquo;Every time we catch a case early, every time a patient
              learns their symptoms mean something — that&apos;s the work that
              stays with you. It&apos;s not just about numbers. It&apos;s about
              the mothers, daughters, and sisters in our communities who now
              have a fighting chance.&rdquo;
            </p>
            <p className="font-montserrat text-[15px] text-slate-500 leading-[1.8]">
              Whether you can give 2 hours a week or lead a monthly drive,
              whether you&apos;re on the ground in Lagos or supporting remotely
              from London, there&apos;s a place for you here. Our volunteers
              are the backbone of everything NCC does. And they&apos;ll tell you
              the same thing: this volunteering changes you as much as it
              changes the communities we serve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.26 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#apply-heading"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-montserrat text-[15px] font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Join Our Volunteers <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <Link
              href="/stories"
              className="inline-flex items-center gap-1.5 font-montserrat text-[15px] font-bold text-slate-500 hover:text-emerald-600 transition-colors group focus-visible:outline-none focus-visible:underline"
            >
              Read more stories{" "}
              <MoveRight
                size={13}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   APPLICATION FORM
═══════════════════════════════════════════════ */
const PATHWAYS = [
  "Community Outreach",
  "Healthcare Professional",
  "Fundraiser & Event Host",
  "Virtual Communications",
  "Cancer Educator",
  "Patient Companion",
  "Other / Open Proposal",
];

const AVAILABILITY = [
  "1–2 hrs / week",
  "3–5 hrs / week",
  "6+ hrs / week",
  "Monthly drives only",
  "One-off events",
];

function ApplyForm() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    pathway: "",
    availability: "",
    skills: "",
    why: "",
    over18: false,
    consent: false,
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");

  // Pre-fill pathway from sessionStorage if a role card sent us here
  useEffect(() => {
    try {
      const r = sessionStorage.getItem("ncc-vol-role");
      if (r) {
        const matched = PATHWAYS.find((p) =>
          r.toLowerCase().includes(p.toLowerCase().split(" ")[0])
        );
        if (matched) setForm((f) => ({ ...f, pathway: matched }));
        sessionStorage.removeItem("ncc-vol-role");
      }
    } catch {}
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const errors = {
    name: touched.name && !form.name.trim() ? "Name is required" : "",
    email:
      touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? "Valid email required"
        : "",
    location:
      touched.location && !form.location.trim()
        ? "Please tell us where you're based"
        : "",
    pathway:
      touched.pathway && !form.pathway ? "Please select a pathway" : "",
    why:
      touched.why && form.why.trim().length < 30
        ? "A short paragraph helps us match you (min 30 chars)"
        : "",
    over18: touched.over18 && !form.over18 ? "You must be 18 or over" : "",
    consent:
      touched.consent && !form.consent
        ? "Please agree to the data policy"
        : "",
  };

  const valid =
    form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.location.trim() &&
    form.pathway &&
    form.why.trim().length >= 30 &&
    form.over18 &&
    form.consent;

  const submit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      location: true,
      pathway: true,
      why: true,
      over18: true,
      consent: true,
    });
    if (!valid) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  });

  if (status === "success") {
    return (
      <motion.div
        ref={ref}
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center text-center gap-6 font-montserrat"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
      >
        <span
          aria-hidden="true"
          className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
        >
          <CheckCircle2 size={28} className="text-emerald-600" />
        </span>
        <div>
          <h3
            className="font-montserrat text-[24px] font-black text-slate-900 mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            Welcome to the team, {form.name.split(" ")[0] || "friend"}!
          </h3>
          <p className="font-montserrat text-[15px] text-slate-500 leading-relaxed max-w-md">
            Your application is in. A volunteer coordinator will email you at{" "}
            <strong className="text-slate-700">{form.email}</strong> within 3
            working days to schedule your screening call.
          </p>
        </div>
        <ul
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 list-none p-0"
          role="list"
        >
          {[
            "Application received",
            "Coordinator assigned",
            "Email confirmation sent",
          ].map((s) => (
            <li
              key={s}
              className="inline-flex items-center gap-1.5 font-montserrat text-[13px] font-bold text-slate-500"
            >
              <CheckCircle2
                size={12}
                style={{ color: "#059669" }}
                aria-hidden="true"
              />{" "}
              {s}
            </li>
          ))}
        </ul>
        <Link
          href="/impact"
          className="inline-flex items-center gap-1.5 font-montserrat text-[14px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors group focus-visible:outline-none focus-visible:underline"
        >
          Meanwhile, see our impact{" "}
          <MoveRight
            size={13}
            aria-hidden="true"
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </motion.div>
    );
  }

  const inputClass =
    "font-montserrat px-4 py-3 rounded-xl border text-[15px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 w-full";

  return (
    <form
      ref={ref}
      onSubmit={submit}
      noValidate
      aria-labelledby="apply-heading"
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden font-montserrat"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
    >
      <div className="px-8 py-8 border-b border-slate-100">
        <motion.div {...fw(0)} className="flex items-center gap-3 mb-3">
          <Sparkles
            size={16}
            className="text-[#F5C300]"
            fill="#F5C300"
            aria-hidden="true"
          />
          <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
            Volunteer Application
          </span>
        </motion.div>
        <motion.h2
          id="apply-heading"
          {...fw(0.05)}
          className="font-montserrat text-[1.8rem] sm:text-[2.2rem] font-black text-slate-900 leading-[1.06]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Ready to join us?
          <br />
          <span style={{ color: "#059669" }}>Tell us about you.</span>
        </motion.h2>
        <motion.p
          {...fw(0.1)}
          className="font-montserrat text-[14px] text-slate-500 leading-relaxed mt-3 max-w-2xl"
        >
          Takes about 5 minutes. All fields marked * are required.
        </motion.p>
      </div>

      <div className="px-8 py-8 flex flex-col gap-6">
        {/* Name + Email */}
        <motion.div
          {...fw(0.14)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-name"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              Full Name *
            </label>
            <input
              id="vf-name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => touch("name")}
              autoComplete="name"
              required
              placeholder="Amina Okafor"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "vf-name-err" : undefined}
              className={inputClass}
              style={{ borderColor: errors.name ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.name && (
              <span
                id="vf-name-err"
                role="alert"
                className="font-montserrat text-[13px] text-red-500 font-semibold"
              >
                {errors.name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-email"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              Email Address *
            </label>
            <input
              id="vf-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => touch("email")}
              autoComplete="email"
              required
              placeholder="amina@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "vf-email-err" : undefined}
              className={inputClass}
              style={{ borderColor: errors.email ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.email && (
              <span
                id="vf-email-err"
                role="alert"
                className="font-montserrat text-[13px] text-red-500 font-semibold"
              >
                {errors.email}
              </span>
            )}
          </div>
        </motion.div>

        {/* Phone + Location */}
        <motion.div
          {...fw(0.18)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-phone"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              Phone (Optional)
            </label>
            <input
              id="vf-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              className={inputClass}
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-location"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              City / Country *
            </label>
            <input
              id="vf-location"
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              onBlur={() => touch("location")}
              autoComplete="address-level2"
              required
              placeholder="Lagos, Nigeria"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "vf-loc-err" : undefined}
              className={inputClass}
              style={{ borderColor: errors.location ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.location && (
              <span
                id="vf-loc-err"
                role="alert"
                className="font-montserrat text-[13px] text-red-500 font-semibold"
              >
                {errors.location}
              </span>
            )}
          </div>
        </motion.div>

        {/* Pathway + Availability */}
        <motion.div
          {...fw(0.22)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-pathway"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              Preferred Pathway *
            </label>
            <select
              id="vf-pathway"
              value={form.pathway}
              onChange={(e) => update("pathway", e.target.value)}
              onBlur={() => touch("pathway")}
              required
              aria-invalid={!!errors.pathway}
              aria-describedby={errors.pathway ? "vf-path-err" : undefined}
              className="font-montserrat px-4 py-3 rounded-xl border text-[15px] font-semibold text-slate-700 outline-none transition-all duration-200 cursor-pointer appearance-none bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 w-full"
              style={{
                borderColor: errors.pathway ? "#ef4444" : "#e2e8f0",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              <option value="">Choose a pathway…</option>
              {PATHWAYS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.pathway && (
              <span
                id="vf-path-err"
                role="alert"
                className="font-montserrat text-[13px] text-red-500 font-semibold"
              >
                {errors.pathway}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vf-avail"
              className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
            >
              Availability
            </label>
            <select
              id="vf-avail"
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
              className="font-montserrat px-4 py-3 rounded-xl border border-slate-200 text-[15px] font-semibold text-slate-700 outline-none transition-all duration-200 cursor-pointer appearance-none bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 w-full"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              <option value="">Select availability…</option>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div {...fw(0.26)} className="flex flex-col gap-1.5">
          <label
            htmlFor="vf-skills"
            className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
          >
            Relevant Skills or Experience (Optional)
          </label>
          <input
            id="vf-skills"
            type="text"
            value={form.skills}
            onChange={(e) => update("skills", e.target.value)}
            placeholder="e.g. Registered nurse, fluent Yoruba, video editing"
            className={inputClass}
            style={{ borderColor: "#e2e8f0" }}
          />
        </motion.div>

        {/* Why */}
        <motion.div {...fw(0.3)} className="flex flex-col gap-1.5">
          <label
            htmlFor="vf-why"
            className="font-montserrat text-[12px] font-black uppercase tracking-wider text-slate-500"
          >
            Why Do You Want to Volunteer With NCC? *
          </label>
          <textarea
            id="vf-why"
            value={form.why}
            onChange={(e) => update("why", e.target.value)}
            onBlur={() => touch("why")}
            required
            rows={4}
            placeholder="A few sentences about what draws you to NCC and what you hope to contribute…"
            aria-invalid={!!errors.why}
            aria-describedby={errors.why ? "vf-why-err" : "vf-why-count"}
            className={`${inputClass} resize-none`}
            style={{ borderColor: errors.why ? "#ef4444" : "#e2e8f0" }}
          />
          <div className="flex items-center justify-between">
            {errors.why ? (
              <span
                id="vf-why-err"
                role="alert"
                className="font-montserrat text-[13px] text-red-500 font-semibold"
              >
                {errors.why}
              </span>
            ) : (
              <span />
            )}
            <span
              id="vf-why-count"
              className="font-montserrat text-[13px] text-slate-400 font-medium"
            >
              {form.why.length} chars
            </span>
          </div>
        </motion.div>

        {/* Checkboxes */}
        <motion.div {...fw(0.34)} className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.over18}
              onChange={(e) => {
                update("over18", e.target.checked);
                touch("over18");
              }}
              aria-invalid={!!errors.over18}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5"
              style={{
                background: form.over18 ? "#059669" : "white",
                borderColor: errors.over18
                  ? "#ef4444"
                  : form.over18
                  ? "#059669"
                  : "#cbd5e1",
              }}
            >
              {form.over18 && (
                <CheckCircle2
                  size={12}
                  className="text-white"
                  strokeWidth={3}
                />
              )}
            </span>
            <span className="font-montserrat text-[14px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
              I confirm that I am 18 years of age or older. *
            </span>
          </label>
          {errors.over18 && (
            <span
              role="alert"
              className="font-montserrat text-[13px] text-red-500 font-semibold pl-8"
            >
              {errors.over18}
            </span>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => {
                update("consent", e.target.checked);
                touch("consent");
              }}
              aria-invalid={!!errors.consent}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5"
              style={{
                background: form.consent ? "#059669" : "white",
                borderColor: errors.consent
                  ? "#ef4444"
                  : form.consent
                  ? "#059669"
                  : "#cbd5e1",
              }}
            >
              {form.consent && (
                <CheckCircle2
                  size={12}
                  className="text-white"
                  strokeWidth={3}
                />
              )}
            </span>
            <span className="font-montserrat text-[14px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
              I agree to NCC&apos;s{" "}
              <Link
                href="/legal/privacy"
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                privacy policy
              </Link>{" "}
              and consent to NCC contacting me about my application. *
            </span>
          </label>
          {errors.consent && (
            <span
              role="alert"
              className="font-montserrat text-[13px] text-red-500 font-semibold pl-8"
            >
              {errors.consent}
            </span>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div {...fw(0.4)} className="pt-2">
          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileHover={
              valid && status !== "loading" ? { scale: 1.02 } : {}
            }
            whileTap={valid && status !== "loading" ? { scale: 0.98 } : {}}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-montserrat text-[15px] font-black text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            style={{
              background: "linear-gradient(135deg,#047857,#059669,#10b981)",
              boxShadow: valid
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
                Submitting…
              </>
            ) : (
              <>
                <Send size={13} strokeWidth={2.5} aria-hidden="true" />{" "}
                Submit Application
              </>
            )}
          </motion.button>
          <p className="font-montserrat text-[13px] text-slate-400 mt-3">
            We&apos;ll respond within 3 working days. Your data is protected
            under UK GDPR.
          </p>
        </motion.div>
      </div>
    </form>
  );
}

function ApplySection() {
  return (
    <section
      id="apply-form"
      className="w-full bg-white border-t border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
      aria-label="Volunteer application"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-16 items-start">
          <ApplyForm />
          <aside
            aria-label="Application sidebar"
            className="lg:sticky lg:top-28 flex flex-col gap-5"
          >
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
              <p className="font-montserrat text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">
                What Happens Next
              </p>
              <ol className="space-y-4 list-none p-0 m-0">
                {[
                  ["Within 3 days", "Coordinator emails you to schedule a 15-min call"],
                  ["Within 1 week", "Quick screening conversation"],
                  ["Within 2 weeks", "Onboarding & first project match"],
                ].map(([when, what], i) => (
                  <li key={when} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-montserrat text-[12px] font-black text-emerald-700 flex-shrink-0"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-montserrat text-[12px] font-black uppercase tracking-wider text-emerald-600 mb-0.5">
                        {when}
                      </p>
                      <p className="font-montserrat text-[13px] text-slate-600 leading-snug font-semibold">
                        {what}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ background: "#fffbeb", borderColor: "#fde68a" }}
            >
              <p className="font-montserrat text-[11px] font-black uppercase tracking-widest text-amber-700 mb-2">
                Already Volunteering?
              </p>
              <p className="font-montserrat text-[13px] text-slate-600 leading-relaxed mb-3">
                If you&apos;re an existing NCC volunteer wanting to take on a
                new role, please email us directly.
              </p>
              <a
                href="mailto:info@ngogbeheicc.org"
                className="font-montserrat text-[13px] font-bold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1.5 group focus-visible:outline-none focus-visible:underline"
              >
                info@ngogbeheicc.org
                <ArrowUpRight
                  size={12}
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <p className="font-montserrat text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Other Ways to Help
              </p>
              <ul className="space-y-2 list-none p-0 m-0">
                {[
                  ["/donate", "Make a donation"],
                  ["/get-involved/partners", "Partner your organisation"],
                  ["/get-involved/events", "Host or attend an event"],
                  ["/get-involved/campaigns", "Share our campaigns"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center justify-between font-montserrat text-[13px] font-bold text-slate-600 hover:text-emerald-600 transition-colors group focus-visible:outline-none focus-visible:underline"
                    >
                      {label}
                      <ArrowRight
                        size={11}
                        aria-hidden="true"
                        className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════ */
const FAQS = [
  {
    q: "Do I need any qualifications to volunteer?",
    a:
      "Most roles require no prior qualifications — just enthusiasm, reliability, and a willingness to learn. Healthcare and educator pathways do require relevant credentials, which we'll verify during onboarding.",
  },
  {
    q: "Is there a minimum time commitment?",
    a:
      "We ask for a minimum 3-month commitment to maintain continuity for the communities we serve. Within that, hours are flexible — anything from 1–2 hours a week to full weekend drives works.",
  },
  {
    q: "Can I volunteer remotely from outside Nigeria?",
    a:
      "Yes. Our virtual communications, fundraising, and content roles are open to volunteers anywhere in the world. NCC has volunteers contributing from the UK, US, Canada, Ghana, and Kenya.",
  },
  {
    q: "Will I get any training?",
    a:
      "Absolutely. Every volunteer goes through onboarding covering NCC's mission, safeguarding, cultural sensitivity, and role-specific skills. Healthcare volunteers receive additional clinical refresher training before each drive.",
  },
  {
    q: "Are there any costs to me?",
    a:
      "No. NCC covers all training, materials, and reasonable travel expenses for in-person roles. We never ask volunteers to fundraise to qualify for a role.",
  },
  {
    q: "Can I bring my workplace or student group?",
    a:
      "Yes — group volunteering is one of our favourite formats. Reach out via the partnerships pathway and we can design a programme around your team's skills and schedule.",
  },
];

function FAQItem({ item, isOpen, onToggle, idx }) {
  const headingId = `vfaq-h-${idx}`;
  const panelId = `vfaq-p-${idx}`;
  return (
    <div className="border-b border-slate-100 last:border-0">
      <h3 className="m-0">
        <button
          id={headingId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-start justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:underline"
        >
          <span
            className="font-montserrat text-[14.5px] font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 flex-1"
            style={{ letterSpacing: "-0.01em" }}
          >
            {item.q}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <Plus
              size={18}
              strokeWidth={2}
              className={`transition-colors duration-200 ${
                isOpen
                  ? "text-emerald-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
            />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-montserrat text-[16px] text-slate-500 leading-[1.75] pb-6 pr-8 max-w-2xl">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState(0);

  return (
    <section
      ref={ref}
      className="w-full bg-slate-50 border-t border-slate-100 font-montserrat"
      aria-labelledby="vol-faq-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[14px] font-black tracking-[0.3em] uppercase text-slate-400">
                FAQ
              </span>
            </motion.div>
            <motion.h2
              id="vol-faq-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.07,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.06]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Things people
              <br />
              ask before
              <br />
              <span style={{ color: "#059669" }}>they apply.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16 }}
              className="font-montserrat text-[15px] text-slate-500 leading-relaxed mt-4 max-w-[220px]"
            >
              Still got questions?
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.22 }}
              className="flex flex-col gap-2 mt-2"
            >
              <a
                href="mailto:info@ngogbeheicc.org"
                className="inline-flex items-center gap-1.5 font-montserrat text-[15px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors group focus-visible:outline-none focus-visible:underline"
              >
                Email volunteer team{" "}
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-montserrat text-[15px] font-bold text-slate-500 hover:text-slate-800 transition-colors group focus-visible:outline-none focus-visible:underline"
              >
                Contact page{" "}
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={iv ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.12,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="divide-y divide-slate-100 border-t border-slate-100"
          >
            {FAQS.map((item, i) => (
              <FAQItem
                key={i}
                idx={i}
                item={item}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
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
      aria-labelledby="vol-cta-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cta-vol-g"
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
          <rect width="100%" height="100%" fill="url(#cta-vol-g)" />
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
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/80">
                The Time is Now
              </span>
            </motion.div>
            <motion.h2
              id="vol-cta-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.08,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat font-black text-white leading-[0.95] mb-5"
              style={{
                fontSize: "clamp(2.2rem,5vw,4.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              The next 10,000 lives
              <br />
              we reach —
              <br />
              <span style={{ color: "#F5C300" }}>they need you too.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="font-montserrat text-[16px] text-white/85 leading-relaxed max-w-md"
            >
              Every screening drive needs hands. Every workshop needs voices.
              Every patient needs a companion. Step into the role that fits
              your life — we&apos;ll meet you where you are.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={iv ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: 0.22,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-3 min-w-[220px]"
          >
            <motion.a
              href="#apply-heading"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-montserrat text-[15px] font-black text-[#030712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
              style={{
                background: "linear-gradient(135deg,#F5C300,#e8b800)",
                boxShadow: "0 10px 36px rgba(245,195,0,0.28)",
              }}
            >
              <Sparkles size={13} aria-hidden="true" /> Apply Now
            </motion.a>
            <Link
              href="/donate"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Donate Instead <ArrowUpRight size={12} aria-hidden="true" />
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
export default function VolunteerPage() {
  return (
    <>
      <VolunteerSchema />
      <main id="main-content" className="w-full font-montserrat">
        <VolunteerHero />
        <ImpactStrip />
        <Roles />
        <Journey />
        <Spotlight />
        <ApplySection />
        <FAQ />
        <CTABanner />
      </main>
    </>
  );
}
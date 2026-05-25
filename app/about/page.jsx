"use client";

/**
 * @file app/about/page.jsx
 * @project Ngogbehei Cancer Center — About Page
 *
 * Production-ready. SEO-optimized. Fully accessible.
 *
 * Sections:
 *   1. Hero (cinematic, typewriter, breadcrumbs, single H1)
 *   2. Origin story (founder photo + narrative)
 *   3. Stats grid (6 NCC metrics)
 *   4. Mission · Vision · Values
 *   5. Four Programme Pillars
 *   6. Leadership team
 *   7. Survivor testimonial
 *   8. CTA banner
 *
 * Conventions:
 *   • Montserrat applied via the `font-montserrat` Tailwind utility.
 *   • Reduced-motion respected via `useReducedMotion`.
 *   • All decorative SVGs/images carry aria-hidden / empty alt.
 *   • JSON-LD Organization+NGO schema injected once.
 *   • Section anchors match what the Navbar mega-menu links to:
 *       #story, #mvv-heading, #pillars-heading, #team-heading
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
  Plus,
  MoveRight,
  ChevronRight,
} from "lucide-react";
import { assets } from "@/assets/assets";
import Mr_Marcel from "@/assets/Mr Marcel.jpg";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ═══════════════════════════════════════════════
   JSON-LD
═══════════════════════════════════════════════ */
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    name: "Ngogbehei Cancer Center",
    alternateName: "NCC",
    legalName: "Marcel Ngogbehei Center for Cancer Education & Care",
    description:
      "A UK-registered nonprofit empowering rural African communities through cancer education, early detection, and accessible pathways to care.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: "2021",
    areaServed: ["Nigeria", "Ghana", "Cameroon", "Kenya", "South Africa"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Wuse 2",
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Enquiries",
      email: "info@ngogbeheicc.org",
      telephone: "+234-800-NCC-CARE",
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
   SPIRAL BACKGROUND
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
   HOOKS
═══════════════════════════════════════════════ */
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
   HERO
═══════════════════════════════════════════════ */
function Hero() {
  const PHRASES = [
    "late diagnosis.",
    "information gaps.",
    "the deadly silence.",
    "rural invisibility.",
    "every community.",
  ];
  const typed = useTypewriter(PHRASES, 68);

  return (
    <section
      aria-label="About Ngogbehei Cancer Center"
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
              id="hg-sm"
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
          <rect width="100%" height="100%" fill="url(#hg-sm)" />
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
                About Us
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
              About Ngogbehei Cancer Center
            </span>
          </motion.div>

          <div className="mb-7 overflow-hidden">
            {["We exist to", "bridge the gap"].map((line, i) => (
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
                {/* The first <h1> stands as the page heading.
                    The second line continues it visually as a styled span. */}
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
            A UK-registered nonprofit closing the deadliest gap in African
            healthcare — bringing cancer education, early detection, and
            patient navigation directly to the rural communities that need it
            most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="/get-involved"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              style={{
                background: "linear-gradient(135deg,#047857,#059669)",
                boxShadow: "0 10px 36px rgba(5,150,105,0.38)",
              }}
            >
              <Plus size={13} aria-hidden="true" /> Get Involved
            </motion.a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Our Story <ChevronRight size={12} aria-hidden="true" />
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
   ORIGIN STORY
═══════════════════════════════════════════════ */
function Origin() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-80px" });
  const anim = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="origin-heading"
      className="relative w-full bg-white font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
      style={{ borderTop: "1px solid #f1f5f9" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">
          <motion.div {...anim(0)} className="relative order-2 lg:order-1">
            <figure
              className="relative overflow-hidden rounded-2xl m-0"
              style={{ aspectRatio: "4/5", position: "relative" }}
            >
              <Image
                src={Mr_Marcel}
                alt="Marcel Ngogbehei, founder of the Ngogbehei Cancer Center"
                fill
                priority={false}
                quality={95}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ 
                  objectFit: "cover", 
                  objectPosition: "center",
                  filter: "brightness(0.88) contrast(1.04)" 
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                }}
              />
              <figcaption className="absolute bottom-6 left-6">
                <p className="font-montserrat text-[14px] font-bold text-white uppercase tracking-widest mb-0.5">
                  Founder
                </p>
                <p
                  className="font-montserrat text-[17px] font-black text-white"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  Marcel Ngogbehei
                </p>
              </figcaption>
            </figure>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={iv ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.42, duration: 0.6 }}
              className="absolute -bottom-5 -right-4 sm:-right-6 rounded-2xl px-5 py-4 bg-white border border-slate-100 shadow-xl"
              aria-label="Founded in 2021"
            >
              <p
                className="font-montserrat text-[28px] font-black text-slate-900 leading-none"
                style={{ letterSpacing: "-0.03em" }}
              >
                2021
              </p>
              <p className="font-montserrat text-[14px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5">
                Founded
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -18, y: -18 }}
              animate={iv ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-4 -left-4 sm:-left-6 rounded-xl px-4 py-3 bg-white border border-slate-100 shadow-lg flex items-center gap-2.5"
              aria-label="Registered charity in England and Wales"
            >
              <span
                aria-hidden="true"
                className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center"
              >
                <span className="font-montserrat text-emerald-600 font-black text-[14px]">
                  UK
                </span>
              </span>
              <span>
                <span className="block font-montserrat text-[14px] font-bold uppercase tracking-widest text-slate-400 leading-none">
                  Registered
                </span>
                <span className="block font-montserrat text-[14px] font-black text-slate-800 mt-0.5">
                  England &amp; Wales
                </span>
              </span>
            </motion.div>
          </motion.div>

          <article className="order-1 lg:order-2">
            <motion.div {...anim(0.1)} className="flex items-center gap-3 mb-6">
              <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600">
                Our Origin
              </span>
            </motion.div>

            <motion.h2
              id="origin-heading"
              {...anim(0.16)}
              className="font-montserrat text-[2.4rem] sm:text-[2.8rem] font-black text-slate-900 leading-[1.06] mb-7"
              style={{ letterSpacing: "-0.03em" }}
            >
              Born from loss.
              <br />
              <span style={{ color: "#059669" }}>Built for survival.</span>
            </motion.h2>

            <div className="space-y-4 mb-10">
              {[
                "The Marcel Ngogbehei Center for Cancer Education & Care was established after a deeply personal encounter with the devastating cost of late cancer diagnosis in Africa. Marcel watched loved ones lose their battle — not because treatment was impossible, but because nobody caught it in time.",
                "In underserved African communities, the word 'cancer' still carries a death sentence — not from biology, but from information gaps, poverty, and inaccessible healthcare. NCC was built to change that equation permanently, one community at a time.",
                "Registered in England & Wales, with core operations rooted in Nigeria and beyond, NCC deploys mobile awareness units, free screenings, and patient navigation support directly into the rural communities that need it most.",
              ].map((p, i) => (
                <motion.p
                  key={i}
                  {...anim(0.22 + i * 0.08)}
                  className="font-montserrat text-[15px] text-slate-500 leading-[1.75]"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div
              {...anim(0.48)}
              className="flex items-center gap-4 flex-wrap"
            >
              <motion.a
                href="#mvv-heading"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-montserrat text-[15px] font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  background: "linear-gradient(135deg,#047857,#059669)",
                  boxShadow: "0 6px 24px rgba(5,150,105,0.26)",
                }}
              >
                Our Mission <ArrowUpRight size={13} aria-hidden="true" />
              </motion.a>
              <Link
                href="/impact"
                className="inline-flex items-center gap-1.5 font-montserrat text-[15px] font-bold text-slate-500 hover:text-emerald-600 transition-colors group focus-visible:outline-none focus-visible:underline"
              >
                See Our Impact{" "}
                <MoveRight
                  size={13}
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════ */
function Stats() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const data = [
    { num: 5, suf: "+", label: "African Nations", sub: "Active operations" },
    { num: 3400, suf: "+", label: "People Educated", sub: "Cancer literacy" },
    { num: 890, suf: "+", label: "Free Screenings", sub: "Conducted to date" },
    { num: 210, suf: "+", label: "Patients Supported", sub: "Through navigation" },
    { num: 12, suf: "+", label: "Communities", sub: "Directly reached" },
    { num: 100, suf: "%", label: "Nonprofit", sub: "UK-registered charity" },
  ];
  return (
    <section
      ref={ref}
      aria-label="Ngogbehei Cancer Center impact statistics"
      className="relative w-full border-t border-slate-100 font-montserrat"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 list-none p-0 m-0"
          role="list"
        >
          {data.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.08 + i * 0.06,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col py-10 px-6 border-r border-b border-slate-100 last:border-r-0"
            >
              <p
                className="font-montserrat text-[2rem] font-black text-slate-900 leading-none tabular-nums mb-2"
                style={{ letterSpacing: "-0.03em" }}
                aria-label={`${s.num}${s.suf} ${s.label}`}
              >
                {iv ? (
                  <Counter to={s.num} suffix={s.suf} duration={1600} />
                ) : (
                  `0${s.suf}`
                )}
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
   MISSION · VISION · VALUES
═══════════════════════════════════════════════ */
function MVV() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const cards = [
    {
      label: "Mission",
      color: "#059669",
      text: "To empower underserved communities — especially in African rural areas — through cancer education, early detection awareness, and accessible pathways to care and support. Because knowledge saves lives, and every person deserves a fighting chance against cancer, no matter where they live.",
    },
    {
      label: "Vision",
      color: "#0284c7",
      text: "A world where cancer is no longer a death sentence in rural communities — because education and access always come first. An Africa where geography and income never determine who survives.",
    },
    {
      label: "Values",
      color: "#7c3aed",
      text: "Dignity in every encounter. Radical access over convenience. Community first. Evidence-based action. Relentless hope in the face of overwhelming odds. Because justice is at the heart of every life we fight for.",
    },
  ];
  return (
    <section
      ref={ref}
      aria-labelledby="mvv-heading"
      className="relative w-full bg-slate-50 border-t border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-[30px] pb-5 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-16 lg:gap-24 items-start">
          <div className="lg:pt-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600">
                What Drives Us
              </span>
            </motion.div>
            <motion.h2
              id="mvv-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.08,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-montserrat text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.08] whitespace-nowrap"
              style={{ letterSpacing: "-0.03em" }}
            >
              Purpose.
              <br />
              Direction.
              <br />
              <span style={{ color: "#059669" }}>Character.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((c, i) => (
              <motion.article
                key={c.label}
                initial={{ opacity: 0, y: 28 }}
                animate={iv ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.14 + i * 0.1,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative bg-white rounded-2xl p-7 border border-slate-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                aria-labelledby={`mvv-${c.label.toLowerCase()}`}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute top-0 left-7 right-7 h-[2px] rounded-full"
                  style={{ background: c.color, originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={iv ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.28 + i * 0.1, duration: 0.8 }}
                />
                <h3
                  id={`mvv-${c.label.toLowerCase()}`}
                  className="font-montserrat text-[14px] font-black uppercase tracking-[0.2em] mb-4 mt-3"
                  style={{ color: c.color }}
                >
                  {c.label}
                </h3>
                <p className="font-montserrat text-[16px] text-slate-600 leading-[1.75]">
                  {c.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOUR PILLARS
═══════════════════════════════════════════════ */
function Pillars() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const items = [
    {
      num: "01",
      title: "Community Education & Awareness",
      color: "#059669",
      desc:
        "Workshops in rural areas on cancer symptoms, risk factors, myths, and lifestyle changes. We partner with local schools, churches, and community centres — distributing materials in local languages.",
      stat: "3,400+",
      statLbl: "Individuals reached",
    },
    {
      num: "02",
      title: "Screening & Early Detection",
      color: "#0284c7",
      desc:
        "Mobile screening units and pop-up clinics bringing breast, cervical, and prostate screenings directly into communities. We train health volunteers in symptom spotting and referral pathways.",
      stat: "890+",
      statLbl: "Free screenings",
    },
    {
      num: "03",
      title: "Access to Care & Navigation",
      color: "#7c3aed",
      desc:
        "We walk beside every patient — connecting them to hospitals, specialists, and treatment. Financial micro-grants and transport support ensure poverty is never a barrier to survival.",
      stat: "210+",
      statLbl: "Patients guided",
    },
    {
      num: "04",
      title: "Survivor & Caregiver Support",
      color: "#0891b2",
      desc:
        "Peer support groups for survivors and caregivers, mental health programmes post-diagnosis, and survivor story campaigns that reduce stigma and inspire communities to act early.",
      stat: "5+",
      statLbl: "Nations active",
    },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="pillars-heading"
      className="relative w-full bg-white border-t border-slate-100 font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 sm:mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-4"
            >
              <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600">
                What We Do
              </span>
            </motion.div>
            <motion.h2
              id="pillars-heading"
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
              Four pillars.
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
            Everything NCC does flows from one belief: that early action saves
            lives — and that no rural community should be left behind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
          {items.map((item, i) => (
            <motion.article
              key={item.num}
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.16 + i * 0.09, duration: 0.6 }}
              className="bg-white p-8 flex flex-col gap-6 group hover:bg-slate-50 transition-colors duration-200"
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
                  <ArrowUpRight size={12} style={{ color: item.color }} />
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
              <div className="mt-auto pt-5 border-t border-slate-100">
                <p
                  className="font-montserrat text-[20px] font-black leading-none"
                  style={{ letterSpacing: "-0.03em", color: item.color }}
                >
                  {item.stat}
                </p>
                <p className="font-montserrat text-[14px] text-slate-400 font-semibold mt-1">
                  {item.statLbl}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
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
      aria-label="Survivor testimonial"
      className="relative w-full bg-slate-50 border-t border-slate-100 font-montserrat"
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
            className="block w-10 h-px bg-emerald-500 mx-auto mb-8"
          />
          <blockquote className="m-0 p-0">
            <p
              className="font-montserrat text-[1.5rem] sm:text-[1.75rem] font-black text-slate-900 leading-[1.35] mb-8"
              style={{ letterSpacing: "-0.025em" }}
            >
              &ldquo;When they told me it was caught early, I didn&apos;t cry
              from fear — I cried from relief. The NCC team was there every
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
function CTA() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative w-full overflow-hidden font-montserrat"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)",
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="cg-about" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cg-about)" />
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
              <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
              <span className="font-montserrat text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400">
                Join the Mission
              </span>
            </motion.div>
            <motion.h2
              id="cta-heading"
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
              Don&apos;t just read
              <br />
              our story —
              <br />
              <span style={{ color: "#10b981" }}>help write it.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="font-montserrat text-[16px] text-white/85 leading-relaxed max-w-md"
            >
              Whether you give, volunteer, partner, or simply spread the word
              — every action moves us closer to a cancer-aware Africa where
              no one is left behind because of where they live.
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
            className="flex flex-col gap-3 min-w-[200px]"
          >
            <motion.a
              href="/donate"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[15px] font-black text-slate-900 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ boxShadow: "0 8px 32px rgba(255,255,255,0.1)" }}
            >
              <Plus size={13} aria-hidden="true" /> Donate Now
            </motion.a>
            <a
              href="/get-involved/volunteer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Volunteer <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <a
              href="/get-involved/partners"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-montserrat text-[15px] font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Partner With Us <ChevronRight size={12} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <main id="main-content" className="w-full font-montserrat">
        <Hero />
        <Origin />
        <Stats />
        <MVV />
        <Pillars />
        <Testimonial />
        <CTA />
      </main>
    </>
  );
}
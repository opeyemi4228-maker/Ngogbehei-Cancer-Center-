"use client";

/**
 * @file StorySection.jsx
 * @project Ngogbehei Cancer Center
 * @description Editorial bento grid of NCC stories.
 *   • 3 stories (founder, community, survivor)
 *   • Full Montserrat typography, semantic <article>, a11y
 */

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Play, ArrowUpRight, ChevronRight, X } from "lucide-react";
import FP1 from "@/assets/FP1.jpg";
import FP2 from "@/assets/FP2.jpg";
import FP3 from "@/assets/FP3.jpg";
/* ─── NCC stories ────────────────────────────────────────── */
const STORIES = [
  {
    id: 1,
    tag: "Founder Story",
    headline:
      "The mission Marcel Ngogbehei started and why it can't stop now.",
    img:
      FP1, // "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=85",
    href: "/story/founder",
    large: true,
  },
  {
    id: 2,
    tag: "Community Impact",
    headline:
      "She had never heard the word \u201Cmammogram.\u201D Now she teaches it.",
    img:
     FP2, // "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=85",
    href: "/story/community",
  },
  {
    id: 3,
    tag: "Early Detection",
    headline: "Caught at Stage 1: the screening that saved Amina's life.",
    img:
      FP3, // "https://images.unsplash.com/photo-1614859054685-e23ce3e1a6f7?w=800&q=85",
    href: "/story/amina",
  },
];

/* ═══════════════════════════════════════════════
   VIDEO MODAL
═══════════════════════════════════════════════ */
function VideoModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", h);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-montserrat"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="NCC story video"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#030712]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
            <Play size={28} aria-hidden="true" />
            <p className="font-montserrat text-sm">
              Our story video, coming soon
            </p>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function StorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [videoOpen, setVideoOpen] = useState(false);

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      <section
        ref={ref}
        className="relative w-full bg-white overflow-hidden font-montserrat"
        style={{ borderTop: "1px solid #f1f5f9" }}
        aria-labelledby="story-heading"
      >
        {/* Grid background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="s8-xs"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0L0 0 0 40"
                  fill="none"
                  stroke="rgba(16,185,129,0.05)"
                  strokeWidth="0.4"
                />
              </pattern>
              <pattern
                id="s8-lg"
                width="200"
                height="200"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M200 0L0 0 0 200"
                  fill="none"
                  stroke="rgba(16,185,129,0.09)"
                  strokeWidth="0.7"
                />
              </pattern>
              <radialGradient id="s8-vig" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="70%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </radialGradient>
              <mask id="s8-mask">
                <rect width="100%" height="100%" fill="url(#s8-vig)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#s8-xs)" />
            <rect width="100%" height="100%" fill="url(#s8-lg)" />
            <rect
              width="100%"
              height="100%"
              fill="white"
              fillOpacity="1"
              mask="url(#s8-mask)"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
          {/* Header */}
          <motion.div
            {...fw(0)}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
                <span className="font-montserrat text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-600">
                  Stories &amp; Media
                </span>
              </div>
              <h2
                id="story-heading"
                className="font-montserrat text-4xl sm:text-5xl font-black text-slate-900 leading-[1.04]"
                style={{ letterSpacing: "-0.03em", maxWidth: 480 }}
              >
                Real people.
                <br />
                Real impact.
                <br />
                <span style={{ color: "#059669" }}>Real lives</span> changed.
              </h2>
            </div>
            <Link
              href="/stories"
              className="hidden sm:inline-flex items-center gap-2 font-montserrat text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group flex-shrink-0 focus-visible:outline-none focus-visible:underline"
            >
              Visit our stories
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 flex items-center justify-center transition-all duration-200"
              >
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 mb-12">
            {/* Left - large hero */}
            <motion.article
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.12,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-2xl"
              style={{ minHeight: 480 }}
            >
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                aria-label={`Watch: ${STORIES[0].headline}`}
                className="absolute inset-0 w-full h-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/60 rounded-2xl"
              >
                <Image
                  src={STORIES[0].img}
                  alt=""
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.04) 100%)",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    aria-hidden="true"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 72,
                      height: 72,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      border: "1.5px solid rgba(255,255,255,0.35)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Play
                      size={26}
                      className="text-white ml-1"
                      fill="white"
                    />
                  </motion.span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <span
                    className="inline-block font-montserrat text-[9px] font-bold tracking-[0.28em] uppercase px-2.5 py-1 rounded-full mb-3 text-white"
                    style={{ background: "rgba(5,150,105,0.85)" }}
                  >
                    {STORIES[0].tag}
                  </span>
                  <h3
                    className="font-montserrat text-xl font-black text-white leading-tight mb-1"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {STORIES[0].headline}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0"
                    >
                      <ChevronRight size={10} className="text-white" />
                    </span>
                    <span className="font-montserrat text-xs font-bold text-white/75">
                      Watch the story
                    </span>
                  </div>
                </div>
              </button>
            </motion.article>

            {/* Right - two stacked */}
            <div className="flex flex-col gap-4">
              {STORIES.slice(1).map((s, i) => (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: 0.2 + i * 0.1,
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative overflow-hidden rounded-2xl flex-1"
                  style={{ minHeight: 220 }}
                >
                  <Link
                    href={s.href}
                    aria-label={`Read: ${s.headline}`}
                    className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/60 rounded-2xl"
                  >
                    <Image
                      src={s.img}
                      alt=""
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p
                        className="font-montserrat text-base font-black text-white leading-snug mb-2"
                        style={{ letterSpacing: "-0.015em" }}
                      >
                        {s.headline}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-200"
                        >
                          <ChevronRight size={9} className="text-white" />
                        </span>
                        <span className="font-montserrat text-[11px] font-bold text-white/75 group-hover:text-white transition-colors">
                          Read more
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 h-px origin-left"
            style={{
              background:
                "linear-gradient(to right,transparent,#a7f3d0 30%,#6ee7b7 50%,#a7f3d0 70%,transparent)",
            }}
          />
        </div>
      </section>
    </>
  );
}
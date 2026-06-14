"use client";

/**
 * @file ProjectsPage.jsx
 * @project Ngogbehei Cancer Center
 *
 * Sections:
 *  1. Basel-style cinematic hero banner
 *  2. Projects filter grid (All / Active / Completed / Upcoming)
 *  3. Featured project - full-width with auto-play-on-scroll video
 *  4. Video showcase strip - multiple videos auto-play on scroll into view
 *  5. Project timeline
 *  6. Partners strip
 *  7. Dark CTA banner
 */

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ArrowUpRight, Play, Pause,
  Volume2, VolumeX, MapPin, Calendar, Users,
  CheckCircle2, Clock, Zap, Globe2, Heart,
  Microscope, Plus, MoveRight, ExternalLink,
} from "lucide-react";

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ──────────────────────────────────────────────────
   GEOMETRIC SVG DECO  (Basel reference)
────────────────────────────────────────────────── */
function GeometricDeco() {
  return (
    <div className="absolute top-0 right-0 z-[8] pointer-events-none overflow-hidden"
      style={{ width:"clamp(260px,34vw,520px)", height:"clamp(260px,34vw,520px)" }}>
      <svg viewBox="0 0 520 520" fill="none" className="w-full h-full">
        <motion.rect x="190" y="18" width="290" height="250"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none"
          initial={{ pathLength:0,opacity:0 }} animate={{ pathLength:1,opacity:1 }}
          transition={{ duration:1.4,delay:0.3,ease:[0.16,1,0.3,1] }}/>
        <motion.path d="M 520 150 Q 400 150 320 270 Q 240 390 240 520"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:1.8,delay:0.5,ease:[0.16,1,0.3,1] }}/>
        <motion.path d="M 520 210 Q 420 210 350 310 Q 280 410 280 520"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:1.6,delay:0.7,ease:[0.16,1,0.3,1] }}/>
        <motion.path d="M 300 18 L 460 270"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:1.0,delay:0.9,ease:[0.16,1,0.3,1] }}/>
        <motion.path d="M 420 18 L 520 18 L 520 118"
          stroke="rgba(255,255,255,0.26)" strokeWidth="1.4" fill="none" strokeLinecap="round"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:0.7,delay:0.4,ease:[0.16,1,0.3,1] }}/>
        <motion.circle cx="520" cy="18" r="5" fill="#F5C300" fillOpacity="0.9"
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ delay:0.8,type:"spring",stiffness:300 }}
          style={{ transformOrigin:"520px 18px" }}/>
        {[250,330,410].map((x,i)=>(
          <motion.line key={x} x1={x} y1={18} x2={x} y2={30}
            stroke="rgba(255,255,255,0.16)" strokeWidth="1"
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:1.1+i*0.07 }}/>
        ))}
        {[100,200,300,400].map((y,i)=>(
          <motion.line key={y} x1={520} y1={y} x2={510} y2={y}
            stroke="rgba(255,255,255,0.12)" strokeWidth="1"
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:1.1+i*0.07 }}/>
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   AUTO-PLAY VIDEO COMPONENT
   Plays when 50%+ of the element is in the viewport,
   pauses when it leaves. Muted by default (browser policy).
────────────────────────────────────────────────── */
function AutoPlayVideo({ src, poster, className, style, children, overlay = true }) {
  const videoRef   = useRef(null);
  const wrapRef    = useRef(null);
  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(true);
  const [hovered,  setHovered]  = useState(false);

  /* IntersectionObserver - play when 45% visible, pause when less */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.45, 1] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play().then(() => setPlaying(true)).catch(()=>{}); }
    else { video.pause(); setPlaying(false); }
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden group cursor-pointer ${className||""}`}
      style={style}
      onClick={togglePlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Dark overlay */}
      {overlay && (
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background:"linear-gradient(to top, rgba(3,7,18,0.65) 0%, rgba(3,7,18,0.15) 50%, transparent 80%)",
            opacity: hovered ? 0.85 : 1 }}/>
      )}

      {/* Play / Pause indicator */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
            transition={{ duration:0.18 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              {playing
                ? <Pause size={22} className="text-white" fill="white"/>
                : <Play  size={22} className="text-white ml-1" fill="white"/>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute toggle - bottom right */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200"
        aria-label={muted ? "Unmute" : "Mute"}>
        {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
      </button>

      {/* Live indicator when playing */}
      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15">
            <motion.span className="w-1.5 h-1.5 rounded-full bg-red-500"
              animate={{ opacity:[1,0.3,1] }} transition={{ repeat:Infinity, duration:1.2 }}/>
            <span className="text-[9px] font-black text-white uppercase tracking-widest" style={M}>Live</span>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────── */
const FILTERS = ["All", "Active", "Completed", "Upcoming"];

const PROJECTS = [
  {
    id: 1, status: "Active", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0",
    title: "Operation AwareNorth",
    location: "Abuja & Kaduna, Nigeria",
    date: "Jan 2024 to Dec 2024",
    icon: Microscope,
    desc: "A 12 month mass cancer literacy campaign targeting northern Nigerian states, deploying trained health educators into markets, schools, and mosques.",
    stats: [{ v:"1,200+", l:"Enrolled" }, { v:"6", l:"LGAs covered" }, { v:"82%", l:"Awareness lift" }],
    img: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80",
    tags: ["Education","Community"],
  },
  {
    id: 2, status: "Active", color: "#0284c7", bg: "#eff6ff", border: "#bfdbfe",
    title: "Mobile Mammography Drive",
    location: "Lagos, Ogun, Oyo States",
    date: "Mar 2024 to Feb 2025",
    icon: Heart,
    desc: "A fleet of three mobile mammography units conducting free breast cancer screenings in underserved peri urban and rural communities across south west Nigeria.",
    stats: [{ v:"890+", l:"Screened" }, { v:"34", l:"Referrals" }, { v:"3", l:"Mobile units" }],
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80",
    tags: ["Screening","Women's Health"],
  },
  {
    id: 3, status: "Completed", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    title: "Navigator Pilot, Ibadan",
    location: "Ibadan, Oyo State",
    date: "Jan 2023 to Dec 2023",
    icon: Users,
    desc: "A 12 month patient navigation pilot connecting newly diagnosed cancer patients to specialist oncologists, reducing time to treatment by 64%.",
    stats: [{ v:"78", l:"Patients navigated" }, { v:"64%", l:"Faster treatment" }, { v:"91%", l:"Satisfaction" }],
    img: "https://images.unsplash.com/photo-1573164574511-73c773193279?w=800&q=80",
    tags: ["Navigation","Pilot"],
  },
  {
    id: 4, status: "Completed", color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc",
    title: "Schools Awareness Tour",
    location: "FCT & Plateau State",
    date: "Sep 2022 to Jun 2023",
    icon: Globe2,
    desc: "Visiting 40 secondary schools with age appropriate cancer awareness curricula, training teachers and distributing resource packs.",
    stats: [{ v:"40", l:"Schools" }, { v:"8,200", l:"Students" }, { v:"120", l:"Teachers trained" }],
    img: "https://images.unsplash.com/photo-1509099652299-6f8a2e2c8082?w=800&q=80",
    tags: ["Youth","Education"],
  },
  {
    id: 5, status: "Upcoming", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a",
    title: "East Africa Expansion",
    location: "Nairobi, Kampala, Dar es Salaam",
    date: "Q1 2025 to Q4 2026",
    icon: Globe2,
    desc: "Scaling NCC's proven education and screening model to Kenya, Uganda, and Tanzania in partnership with three local health NGOs.",
    stats: [{ v:"3", l:"Countries" }, { v:"50,000+", l:"Target reach" }, { v:"2025", l:"Launch year" }],
    img: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=800&q=80",
    tags: ["Expansion","East Africa"],
  },
  {
    id: 6, status: "Upcoming", color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    title: "Cervical Cancer Initiative",
    location: "Rural Niger, Benue & Cross River",
    date: "Q2 2025 to Q4 2025",
    icon: Microscope,
    desc: "A focused cervical cancer screening and HPV education push targeting three Nigerian states with the highest incidence rates and least healthcare access.",
    stats: [{ v:"5,000+", l:"Target screens" }, { v:"3", l:"Focus states" }, { v:"HPV", l:"Education track" }],
    img: "https://images.unsplash.com/photo-1614859054685-e23ce3e1a6f7?w=800&q=80",
    tags: ["Women's Health","Upcoming"],
  },
];

/* Replace these src values with real .mp4 URLs in production */
const VIDEOS = [
  {
    src:    "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1573164574511-73c773193279?w=900&q=80",
    title:  "Mobile Clinic, Ibadan Day 1",
    location: "Ibadan, Oyo State",
    date:   "March 2024",
    tag:    "Screening Drive",
    tagColor: "#059669",
  },
  {
    src:    "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&q=80",
    title:  "Community Outreach, Abuja Markets",
    location: "Wuse Market, Abuja",
    date:   "February 2024",
    tag:    "Education",
    tagColor: "#0284c7",
  },
  {
    src:    "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1509099652299-6f8a2e2c8082?w=900&q=80",
    title:  "Schools Awareness Tour, Plateau State",
    location: "Jos, Plateau State",
    date:   "November 2023",
    tag:    "Youth",
    tagColor: "#7c3aed",
  },
];

/* ──────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────── */
function ProjectsHero() {
  return (
    <section
      aria-labelledby="projects-hero-heading"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(125% 125% at 0% 50%, #030712 45%, #011e10 100%)",
      }}
    >
      {/* Right-side image panel */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[52%] pointer-events-none" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1617791160505-6f00504f3519?w=1200&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.38) saturate(0.7)" }}
          fetchpriority="high"
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #030712 0%, rgba(3,7,18,0.82) 28%, rgba(3,7,18,0.18) 65%, transparent 100%)" }}/>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #030712 0%, rgba(3,7,18,0.4) 22%, transparent 55%)" }}/>
      </div>

      <GeometricDeco />

      {/* Subtle grid texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="pg-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pg-grid)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 min-h-screen flex flex-col justify-center pt-28 lg:pt-[130px] pb-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <motion.ol
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-2 mb-10 list-none p-0 m-0"
          >
            <li>
              <a href="/" className="text-[14px] text-white font-semibold tracking-widest uppercase hover:text-emerald-400 transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true"><ChevronRight size={9} className="text-white"/></li>
            <li aria-current="page">
              <span className="text-[14px] text-emerald-400/80 font-bold tracking-widest uppercase">Projects</span>
            </li>
          </motion.ol>
        </nav>

        <div className="flex flex-col max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="h-px w-10 bg-emerald-500" aria-hidden="true"/>
            <span className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400" style={M}>
              Our Projects
            </span>
          </motion.div>

          {/* H1 */}
          <div className="mb-7 overflow-hidden">
            {["Where mission", "meets the ground."].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 56, skewY: 1.5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ delay: 0.16 + i * 0.1, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1
                  id={i === 0 ? "projects-hero-heading" : undefined}
                  className="font-black text-white leading-[0.92] tracking-[-0.04em]"
                  style={{ fontSize: "clamp(2.8rem,6vw,6rem)", fontFamily: "'Montserrat', sans-serif" }}
                >
                  {line}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44, duration: 0.7 }}
            className="text-[15px] sm:text-base text-white/90 leading-[1.75] mb-10 max-w-lg"
            style={M}
          >
            Bringing lifesaving cancer education, early detection, and community care directly to
            underserved neighbourhoods across Nigeria through meaningful project partnerships.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-black text-white"
              style={{ ...M, background: "linear-gradient(135deg,#047857,#059669)", boxShadow: "0 10px 36px rgba(5,150,105,0.38)" }}
            >
              <Plus size={13} aria-hidden="true"/> Explore Projects
            </motion.a>
            <a
              href="/donate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold text-white border border-white/[0.12] hover:border-white/[0.28] transition-all duration-200"
              style={M}
            >
              Support Our Work <ChevronRight size={12} aria-hidden="true"/>
            </a>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
        aria-hidden="true"
        style={{ background: "linear-gradient(to bottom, transparent, #030712)" }}
      />
    </section>
  );
}

/* ──────────────────────────────────────────────────
   PROJECT CARD
────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });
  const Icon = project.icon;

  const STATUS_ICON = {
    Active:    { icon: Zap,          color:"#059669" },
    Completed: { icon: CheckCircle2, color:"#0284c7" },
    Upcoming:  { icon: Clock,        color:"#f59e0b" },
  };
  const si = STATUS_ICON[project.status];
  const SI = si.icon;

  return (
    <motion.div ref={ref}
      initial={{ opacity:0,y:28 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:index*0.07, duration:0.6, ease:[0.16,1,0.3,1] }}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col cursor-default"
      style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>

      {/* Photo */}
      <div className="relative overflow-hidden" style={{ aspectRatio:"16/9" }}>
        <img src={project.img} alt={project.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 65%)" }}/>
        {/* Status badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background:project.bg, border:`1px solid ${project.border}` }}>
          <SI size={10} strokeWidth={2.5} style={{ color:si.color }}/>
          <span className="text-[9.5px] font-black uppercase tracking-wider" style={{ ...M, color:si.color }}>{project.status}</span>
        </div>
        {/* Tags */}
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          {project.tags.map(t=>(
            <span key={t} className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ ...M, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold" style={M}>
              <MapPin size={10} style={{ color:project.color }}/> {project.location}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold" style={M}>
              <Calendar size={10} style={{ color:project.color }}/> {project.date}
            </span>
          </div>
          <h3 className="text-[15.5px] font-black text-slate-900 mb-2 leading-snug"
            style={{ ...M,letterSpacing:"-0.01em" }}>{project.title}</h3>
          <p className="text-[13px] text-slate-500 leading-[1.7]" style={M}>{project.desc}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-auto">
          {project.stats.map((s,i)=>(
            <div key={i} className="text-center">
              <p className="text-[15px] font-black leading-none" style={{ ...M,color:project.color,letterSpacing:"-0.02em" }}>{s.v}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide" style={M}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-black transition-colors group/link mt-1"
          style={{ color:project.color }}>
          View project
          <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"/>
        </a>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────
   PROJECTS GRID WITH FILTER
────────────────────────────────────────────────── */
function ProjectsGrid() {
  const ref    = useRef(null);
  const iv     = useInView(ref, { once:true, margin:"-60px" });
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.status === active);

  return (
    <section ref={ref} className="w-full bg-white border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>All Projects</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0,y:18 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.07, duration:0.65, ease:[0.16,1,0.3,1] }}
              className="text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ ...M,letterSpacing:"-0.03em" }}>
              Active, completed,<br/><span style={{ color:"#059669" }}>and what's coming.</span>
            </motion.h2>
          </div>

          {/* Filter tabs */}
          <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ delay:0.14 }}
            className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActive(f)}
                className="px-4 py-2 rounded-full text-[12px] font-black transition-all duration-200 border"
                style={{
                  ...M,
                  background:   active===f ? "#f0fdf4"  : "white",
                  color:        active===f ? "#059669"  : "#94a3b8",
                  borderColor:  active===f ? "#bbf7d0"  : "#e2e8f0",
                  boxShadow:    active===f ? "0 0 0 2px rgba(5,150,105,0.15)" : "none",
                }}>
                {f}
                <span className="ml-1.5 text-[10px] opacity-60">
                  {f === "All" ? PROJECTS.length : PROJECTS.filter(p=>p.status===f).length}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p,i) => <ProjectCard key={p.id} project={p} index={i}/>)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   FEATURED PROJECT  - full-width with video
────────────────────────────────────────────────── */
function FeaturedProject() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} className="w-full bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">
        <div className="flex items-center gap-3 mb-12">
          <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#F5C300]"/>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>Featured Project</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">

          {/* Video */}
          <motion.div initial={{ opacity:0,x:-24 }} animate={iv?{opacity:1,x:0}:{}}
            transition={{ duration:0.7,ease:[0.16,1,0.3,1] }}>
            <AutoPlayVideo
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              poster="https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=1200&q=85"
              className="rounded-2xl w-full"
              style={{ aspectRatio:"16/9" }}>
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-2"
                  style={{ ...M,background:"rgba(5,150,105,0.85)" }}>
                  <Zap size={9}/> Active Project
                </span>
                <p className="text-[15px] font-black text-white leading-snug"
                  style={{ ...M,letterSpacing:"-0.01em" }}>
                  Mobile Mammography Drive, Lagos
                </p>
              </div>
            </AutoPlayVideo>
          </motion.div>

          {/* Text */}
          <motion.div initial={{ opacity:0,x:24 }} animate={iv?{opacity:1,x:0}:{}}
            transition={{ delay:0.1,duration:0.7,ease:[0.16,1,0.3,1] }}
            className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-[#0284c7]"/>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>Spotlight</span>
              </div>
              <h2 className="text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.06] mb-4"
                style={{ ...M,letterSpacing:"-0.03em" }}>
                Mobile Mammography<br/>
                <span style={{ color:"#0284c7" }}>reaching the unreachable.</span>
              </h2>
              <p className="text-[14.5px] text-slate-500 leading-[1.8]" style={M}>
                Three custom fitted mobile mammography units are currently active across Lagos, Ogun,
                and Oyo states, bringing clinical grade breast cancer screening to communities
                that have never had access before. Since March 2024, we've screened 890+ women
                and generated 34 specialist referrals.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[{v:"890+",l:"Women screened"},{v:"34",l:"Referrals made"},{v:"3",l:"States active"}].map((s,i)=>(
                <div key={i} className="flex flex-col gap-1 p-4 rounded-xl border border-slate-100 bg-white">
                  <p className="text-[20px] font-black text-[#0284c7] leading-none"
                    style={{ ...M,letterSpacing:"-0.03em" }}>{s.v}</p>
                  <p className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wide" style={M}>{s.l}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <motion.a href="/projects/mobile-mammography"
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-black text-white"
                style={{ ...M,background:"linear-gradient(135deg,#0369a1,#0284c7)",boxShadow:"0 6px 24px rgba(2,132,199,0.28)" }}>
                View Full Project <ArrowUpRight size={13}/>
              </motion.a>
              <a href="/donate"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors group" style={M}>
                Support this project <MoveRight size={13} className="group-hover:translate-x-1 transition-transform duration-200"/>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   VIDEO SHOWCASE  - 3 auto-play-on-scroll videos
────────────────────────────────────────────────── */
function VideoShowcase() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} className="w-full bg-[#030712] border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div>
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40" style={M}>Project Videos</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0,y:18 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.07,duration:0.65,ease:[0.16,1,0.3,1] }}
              className="text-[2.2rem] sm:text-[2.6rem] font-black text-white leading-[1.04]"
              style={{ ...M,letterSpacing:"-0.03em" }}>
              See the work<br/>
              <span style={{ color:"#F5C300" }}>in the field.</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ delay:0.14 }}
            className="text-[13.5px] text-white/40 leading-relaxed max-w-xs" style={M}>
            Videos play automatically as you scroll. Click to pause. Toggle audio with the icon.
          </motion.p>
        </div>

        {/* ── PRIMARY LARGE VIDEO ── */}
        <motion.div initial={{ opacity:0,y:20 }} animate={iv?{opacity:1,y:0}:{}}
          transition={{ duration:0.7,ease:[0.16,1,0.3,1] }}
          className="mb-5">
          <AutoPlayVideo
            src={VIDEOS[0].src}
            poster={VIDEOS[0].poster}
            className="w-full rounded-2xl"
            style={{ aspectRatio:"21/9" }}>
            <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-2"
                style={{ ...M,background:VIDEOS[0].tagColor }}>
                {VIDEOS[0].tag}
              </span>
              <h3 className="text-[1.4rem] sm:text-[1.8rem] font-black text-white leading-snug"
                style={{ ...M,letterSpacing:"-0.02em",maxWidth:560 }}>
                {VIDEOS[0].title}
              </h3>
              <p className="flex items-center gap-3 text-[11.5px] text-white/55 font-semibold mt-2" style={M}>
                <MapPin size={11}/> {VIDEOS[0].location}
                <span className="text-white/25">·</span>
                <Calendar size={11}/> {VIDEOS[0].date}
              </p>
            </div>
          </AutoPlayVideo>
        </motion.div>

        {/* ── TWO SMALLER VIDEOS SIDE BY SIDE ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VIDEOS.slice(1).map((vid, i) => (
            <motion.div key={i}
              initial={{ opacity:0,y:20 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.15+i*0.1,duration:0.65,ease:[0.16,1,0.3,1] }}>
              <AutoPlayVideo
                src={vid.src}
                poster={vid.poster}
                className="w-full rounded-2xl"
                style={{ aspectRatio:"16/9" }}>
                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-2"
                    style={{ ...M,background:vid.tagColor }}>
                    {vid.tag}
                  </span>
                  <h4 className="text-[14px] font-black text-white leading-snug"
                    style={{ ...M,letterSpacing:"-0.01em" }}>{vid.title}</h4>
                  <p className="flex items-center gap-2 text-[10.5px] text-white/50 font-semibold mt-1" style={M}>
                    <MapPin size={9}/> {vid.location}
                  </p>
                </div>
              </AutoPlayVideo>
            </motion.div>
          ))}
        </div>

        {/* Note about replacing placeholders */}
        <motion.p initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ delay:0.5 }}
          className="text-[11px] text-white/20 text-center mt-8 font-medium" style={M}>
          Replace src URLs in VIDEOS[] with your actual .mp4 files to display real footage.
        </motion.p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   STATS BAND
────────────────────────────────────────────────── */
function StatsBand() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });
  const stats = [
    { v:"6",  l:"Active Projects"    },
    { v:"14", l:"Total Programmes"   },
    { v:"5+", l:"Countries"          },
    { v:"50k",l:"Target lives 2025"  },
  ];
  return (
    <section ref={ref} className="w-full bg-white border-t border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s,i)=>(
            <motion.div key={i}
              initial={{ opacity:0,y:16 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.08+i*0.07,duration:0.55,ease:[0.16,1,0.3,1] }}
              className="flex flex-col items-center justify-center py-12 border-r border-b border-slate-100 last:border-r-0 text-center">
              <p className="text-[2.2rem] font-black text-slate-900 leading-none tabular-nums"
                style={{ ...M,letterSpacing:"-0.035em" }}>{s.v}</p>
              <p className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest mt-2" style={M}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   PARTNERS STRIP
────────────────────────────────────────────────── */
const PARTNERS = [
  { name:"WHO",                      abbr:"WHO",    color:"#0284c7" },
  { name:"NHS Charities",            abbr:"NHS",    color:"#059669" },
  { name:"King's College London",    abbr:"KCL",    color:"#7c3aed" },
  { name:"Lagos State Ministry",     abbr:"LSMOH",  color:"#dc2626" },
  { name:"Abuja Health Dept",        abbr:"AHD",    color:"#f59e0b" },
  { name:"Africa Cancer Foundation", abbr:"ACF",    color:"#0891b2" },
];

function PartnersStrip() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });
  return (
    <section ref={ref} className="w-full bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-14">
        <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
          className="flex items-center justify-center gap-3 mb-10">
          <span className="h-px w-8 bg-[#F5C300]"/>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 text-center" style={M}>Project Partners</span>
          <span className="h-px w-8 bg-[#F5C300]"/>
        </motion.div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {PARTNERS.map((p,i)=>(
            <motion.div key={i}
              initial={{ opacity:0,scale:0.88 }} animate={iv?{opacity:1,scale:1}:{}}
              transition={{ delay:0.08+i*0.07,duration:0.45,ease:[0.16,1,0.3,1] }}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-slate-100 bg-white"
              style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:`${p.color}14`, border:`1px solid ${p.color}22` }}>
                <span className="text-[9px] font-black" style={{ ...M,color:p.color }}>{p.abbr}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 text-center leading-tight px-1" style={M}>{p.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   DARK CTA
────────────────────────────────────────────────── */
function CTABanner() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true,margin:"-60px" });
  return (
    <section ref={ref} className="relative w-full overflow-hidden"
      style={{ background:"radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="cp-g" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#cp-g)"/>
        </svg>
        <motion.div className="absolute inset-y-0 w-px"
          style={{ background:"linear-gradient(to bottom,transparent,rgba(245,195,0,0.12) 40%,rgba(245,195,0,0.2) 50%,rgba(245,195,0,0.12) 60%,transparent)" }}
          animate={{ left:["0%","100%","0%"] }} transition={{ repeat:Infinity,duration:28,ease:"linear" }}/>
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/65" style={M}>Get Involved</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0,y:22 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.08,duration:0.72,ease:[0.16,1,0.3,1] }}
              className="font-black text-white leading-[0.95] mb-5"
              style={{ ...M,fontSize:"clamp(2.2rem,5vw,4.5rem)",letterSpacing:"-0.04em" }}>
              Support our<br/>projects on<br/>
              <span style={{ color:"#F5C300" }}>the ground.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0,y:10 }} animate={iv?{opacity:1,y:0}:{}} transition={{ delay:0.17 }}
              className="text-[14.5px] text-white leading-relaxed max-w-md" style={M}>
              Your donation directly funds the mobile clinics, screening drives, and patient navigation
              programmes you've just seen in action.
            </motion.p>
          </div>
          <motion.div initial={{ opacity:0,x:20 }} animate={iv?{opacity:1,x:0}:{}}
            transition={{ delay:0.24,duration:0.65,ease:[0.16,1,0.3,1] }}
            className="flex flex-col gap-3 min-w-[200px]">
            <motion.a href="/donate" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[13px] font-black text-[#030712]"
              style={{ ...M,background:"linear-gradient(135deg,#F5C300,#e8b800)",boxShadow:"0 10px 36px rgba(245,195,0,0.28)" }}>
              <Heart size={13} fill="#030712"/> Donate Now
            </motion.a>
            <a href="/get-involved/volunteer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[13px] font-bold text-white/60 border border-white/12 hover:border-white/28 hover:text-white/82 transition-all duration-200"
              style={M}>
              Volunteer <ArrowUpRight size={12}/>
            </a>
            <a href="/get-involved/partners"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[13px] font-bold text-white/60 border border-white/12 hover:border-white/28 hover:text-white/82 transition-all duration-200"
              style={M}>
              Partner With Us <ChevronRight size={12}/>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────── */
export default function ProjectsPage() {
  return (
    <main className="w-full">
      <ProjectsHero/>
      <StatsBand/>
      <ProjectsGrid/>
      <FeaturedProject/>
      <VideoShowcase/>
      <PartnersStrip/>
      <CTABanner/>
    </main>
  );
}
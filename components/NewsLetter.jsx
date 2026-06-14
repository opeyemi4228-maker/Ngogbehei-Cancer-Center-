"use client";

/**
 * @file ContactSection.jsx
 * @project Ngogbehei Cancer Center
 * @description "Get in Touch" section.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Users,
  Microscope,
  Heart,
} from "lucide-react";
import Mr_Marcel from "@/assets/Mr Marcel.jpg";

/* ─── NCC photo stats ────────────────────────────────────── */
const PHOTO_STATS = [
  {
    icon: Users,
    value: "3,400+",
    label: "People Educated",
    color: "#059669",
    bg: "rgba(5,150,105,0.12)",
    border: "rgba(5,150,105,0.25)",
  },
  {
    icon: Microscope,
    value: "890+",
    label: "Free Screenings",
    color: "#0284c7",
    bg: "rgba(2,132,199,0.12)",
    border: "rgba(2,132,199,0.25)",
  },
  {
    icon: Heart,
    value: "210+",
    label: "Patients Guided",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.25)",
  },
];

/* ─── Field ──────────────────────────────────────────────── */
function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  multiline,
  rows = 4,
  required,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    width: "100%",
    background: "white",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#1e293b",
    padding: "12px 16px",
    borderRadius: 12,
    border: `1.5px solid ${
      error ? "#fca5a5" : focused ? "#059669" : "#e2e8f0"
    }`,
    boxShadow: focused
      ? `0 0 0 3px ${error ? "rgba(239,68,68,0.1)" : "rgba(5,150,105,0.1)"}`
      : "none",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    resize: multiline ? "none" : undefined,
    appearance: "none",
  };

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-montserrat text-[10.5px] font-black uppercase tracking-[0.2em] text-slate-500"
      >
        {label}
        {required && (
          <span className="text-emerald-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="font-montserrat"
          style={baseStyle}
        />
      ) : (
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="font-montserrat"
          style={baseStyle}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-montserrat text-[11px] font-semibold text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Form ───────────────────────────────────────────────── */
function ContactForm({ iv }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required.";
    if (!form.message.trim()) e.message = "Please share your message.";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
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
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center py-14 text-center gap-5"
      >
        <span
          aria-hidden="true"
          className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
        >
          <CheckCircle2
            size={30}
            className="text-emerald-600"
            strokeWidth={1.8}
          />
        </span>
        <div>
          <h3
            className="font-montserrat text-[20px] font-black text-slate-900 mb-1.5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Message received!
          </h3>
          <p className="font-montserrat text-[13.5px] text-slate-500 leading-relaxed max-w-[260px]">
            Our team will get back to you within 24 hours. Thank you for
            reaching out.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
          className="font-montserrat text-[13px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Send another message →
        </button>
      </motion.div>
    );
  }

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-4"
    >
      <motion.div {...fw(0.1)}>
        <Field
          id="contact-name"
          label="Full Name"
          autoComplete="name"
          placeholder="Amina Okafor"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          required
        />
      </motion.div>

      <motion.div
        {...fw(0.16)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Field
          id="contact-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
        />
        <Field
          id="contact-phone"
          label="Phone (Optional)"
          type="tel"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          value={form.phone}
          onChange={set("phone")}
        />
      </motion.div>

      <motion.div {...fw(0.22)}>
        <Field
          id="contact-message"
          label="Your Message"
          placeholder="Tell us how we can help…"
          value={form.message}
          onChange={set("message")}
          error={errors.message}
          multiline
          rows={4}
          required
        />
      </motion.div>

      <motion.div {...fw(0.28)}>
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-montserrat text-[13px] font-black text-white transition-all duration-200 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          style={{
            background: "linear-gradient(135deg,#047857,#059669)",
            boxShadow: "0 6px 24px rgba(5,150,105,0.28)",
          }}
        >
          {status === "loading" ? (
            <>
              <span
                aria-hidden="true"
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              Sending…
            </>
          ) : (
            <>
              <Send size={13} strokeWidth={2.5} aria-hidden="true" />
              Send Message
            </>
          )}
        </motion.button>
        <p className="font-montserrat text-[11px] text-slate-400 mt-2.5">
          We respond within 24 hours. Your data is never shared.
        </p>
      </motion.div>
    </form>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function ContactSection() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-80px" });

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      ref={ref}
      className="w-full bg-white py-20 lg:py-28 font-montserrat"
      style={{ borderTop: "1px solid #f1f5f9" }}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-14">
          <div>
            <motion.div {...fw(0)} className="flex items-center gap-3 mb-4">
              <span aria-hidden="true" className="h-px w-8 bg-[#F5C300]" />
              <span className="font-montserrat text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                Get in Touch
              </span>
            </motion.div>
            <motion.h2
              id="contact-heading"
              {...fw(0.07)}
              className="font-montserrat text-[2.2rem] sm:text-[2.8rem] font-black text-slate-900 leading-[1.04]"
              style={{ letterSpacing: "-0.03em" }}
            >
              We&apos;re here to
              <br />
              <span style={{ color: "#059669" }}>listen and help.</span>
            </motion.h2>
          </div>
          <motion.p
            {...fw(0.14)}
            className="font-montserrat text-[14px] text-slate-500 leading-relaxed max-w-sm"
          >
            Donor, partner, patient, or volunteer: share your message and
            we&apos;ll reply within 24 hours.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-stretch">
          {/* Photo card - uses Next.js Image with fill */}
          <motion.aside
            {...fw(0.06)}
            aria-label="NCC community impact"
            className="relative overflow-hidden rounded-3xl"
            style={{ minHeight: 520 }}
          >
            <Image
              src={Mr_Marcel}
              alt="African NCC volunteers and community members at a Nigerian outreach event"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              placeholder="blur"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.72) saturate(0.82)",
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(3,7,18,0.75) 0%, rgba(3,7,18,0.25) 45%, transparent 75%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(3,7,18,0.35) 0%, transparent 60%)",
              }}
            />

            {/* Top tag */}
            <div className="absolute top-6 left-6">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={iv ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                style={{
                  background: "rgba(245,195,0,0.18)",
                  border: "1px solid rgba(245,195,0,0.35)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-[5px] h-[5px] rounded-full bg-[#F5C300]"
                />
                <span className="font-montserrat text-[10px] font-black tracking-[0.22em] uppercase text-[#F5C300]">
                  NCC Community
                </span>
              </motion.div>
            </div>

            {/* Floating stats */}
            <ul className="absolute top-16 right-5 flex flex-col gap-2.5 list-none p-0">
              {PHOTO_STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={iv ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: 0.45 + i * 0.12,
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      minWidth: 150,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                      }}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.8}
                        style={{ color: s.color }}
                      />
                    </span>
                    <div>
                      <p className="font-montserrat text-[13px] font-black text-white leading-none">
                        {s.value}
                      </p>
                      <p className="font-montserrat text-[10px] text-white/65 font-semibold mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {/* Bottom contact */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={iv ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                <p className="font-montserrat text-[11px] font-bold text-white/55 uppercase tracking-widest mb-3">
                  Reach us directly
                </p>

                <address className="not-italic space-y-3">
                  <a
                    href="mailto:info@ngogbeheicc.org"
                    className="group flex items-center gap-3 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:underline"
                  >
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-xl bg-[#F5C300]/[0.18] border border-[#F5C300]/30 flex items-center justify-center flex-shrink-0"
                    >
                      <Mail size={14} style={{ color: "#F5C300" }} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-montserrat text-[10px] text-white/45 font-semibold uppercase tracking-wider">
                        Email
                      </span>
                      <span className="font-montserrat text-[13px] font-black text-white group-hover:text-[#F5C300] transition-colors">
                        info@ngogbeheicc.org
                      </span>
                    </span>
                  </a>

                  <a
                    href="tel:+2348001234567"
                    className="group flex items-center gap-3 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:underline"
                  >
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-xl bg-emerald-500/[0.18] border border-emerald-500/30 flex items-center justify-center flex-shrink-0"
                    >
                      <Phone size={14} className="text-emerald-400" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-montserrat text-[10px] text-white/45 font-semibold uppercase tracking-wider">
                        Call
                      </span>
                      <span className="font-montserrat text-[13px] font-black text-white group-hover:text-emerald-400 transition-colors">
                        +234 800 NCC CARE
                      </span>
                    </span>
                  </a>

                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0"
                    >
                      <MapPin size={14} className="text-white/55" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-montserrat text-[10px] text-white/45 font-semibold uppercase tracking-wider">
                        Address
                      </span>
                      <span className="font-montserrat text-[13px] font-bold text-white/80">
                        Wuse 2, Abuja, FCT, Nigeria
                      </span>
                    </span>
                  </div>
                </address>
              </motion.div>
            </div>
          </motion.aside>

          {/* Form panel */}
          <motion.div
            {...fw(0.12)}
            className="relative bg-white rounded-3xl border border-slate-100 flex flex-col justify-center"
            style={{
              boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
              padding: "clamp(28px,5vw,48px)",
            }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute top-0 left-8 right-8 h-[2.5px] rounded-full"
              style={{
                background:
                  "linear-gradient(to right,transparent,#059669 30%,#10b981 50%,#059669 70%,transparent)",
                originX: 0,
              }}
              initial={{ scaleX: 0 }}
              animate={iv ? { scaleX: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.div {...fw(0.08)} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span aria-hidden="true" className="h-px w-8 bg-emerald-500" />
                <span className="font-montserrat text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                  Send a Message
                </span>
              </div>
              <h3
                className="font-montserrat text-[1.75rem] font-black text-slate-900 leading-tight"
                style={{ letterSpacing: "-0.025em" }}
              >
                How can we
                <span style={{ color: "#059669" }}> help you?</span>
              </h3>
            </motion.div>

            <ContactForm iv={iv} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 mt-7 pt-7 border-t border-slate-100"
            >
              <span className="font-montserrat text-[10.5px] font-black uppercase tracking-wider text-slate-400 mr-1">
                Or reach us via
              </span>
              {[
                { label: "Email", href: "mailto:info@ngogbeheicc.org" },
                { label: "Phone", href: "tel:+2348001234567" },
                { label: "WhatsApp", href: "https://wa.me/2348001234567" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-montserrat text-[11.5px] font-bold text-slate-600 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {label}
                  <ArrowUpRight size={10} aria-hidden="true" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
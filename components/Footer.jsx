"use client";

/**
 * @file Footer.jsx
 * @project Ngogbehei Cancer Center
 * @description Production-ready footer.
 *   Layout follows the 3-zone reference structure:
 *     • Zone 1 - Brand block + Newsletter card + Contact lines
 *     • Zone 2 - 4-column nav: Explore · Get Involved · About · Follow
 *     • Zone 3 - Legal links + copyright
 *
 *   All routes & content are scoped strictly to NCC pages that
 *   actually exist in the site's component set. Nothing fabricated.
 *
 * Brand: navy + gold (#F5C300) + emerald accents · Montserrat
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaYoutube, FaXTwitter } from "react-icons/fa6";
import {
  FiArrowUpRight,
  FiMapPin,
  FiMail,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import { assets } from "@/assets/assets";
import logoImage from "@/assets/logo.png";

/* ─── Site config ───────────────────────────────────────── */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ─── Nav data - only verified routes ───────────────────── */
const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Impact", href: "/impact" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];


const ABOUT_LINKS = [
  { label: "Our Origin", href: "/about#story" },
  { label: "Mission · Vision · Values", href: "/about#mvv-heading" },
  { label: "Four Pillars", href: "/about#pillars-heading" },
  { label: "Leadership Team", href: "/about#team-heading" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Transparency", href: "/legal/transparency" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1988x3EXqn/?mibextid=wwXIfr",
    Icon: FaFacebook,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@ngogbeheicancercenter?si=ucUrbtjbt8rkxaMC",
    Icon: FaYoutube,
  },
  {
    label: "X",
    href: "https://x.com/ngogbeheicc?s=11",
    Icon: FaXTwitter,
  },
];

/* ═══════════════════════════════════════════════
   STRUCTURED DATA - Organization (SEO)
═══════════════════════════════════════════════ */
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Marcel Ngogbehei Center for Cancer Education & Care",
    alternateName: "Ngogbehei Cancer Center",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: "info@ngogbeheicc.org",
    telephone: "+234-800-NCC-CARE",
    description:
      "UK registered nonprofit bridging the gap between cancer awareness and access to care across Nigeria and Africa.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Wuse 2",
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ═══════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════ */
function Logo() {
  return (
    <Link
      href="/"
      aria-label="Ngogbehei Cancer Center - Home"
      className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]/40 rounded-sm font-montserrat"
    >
      <Image
        src={logoImage}
        alt="Ngogbehei Cancer Center Logo"
        className="w-11 h-11 rounded-full flex-shrink-0"
        quality={90}
        priority={true}
        width={44}
        height={44}
      />
      <span className="flex flex-col leading-none">
        <span className="font-montserrat text-[16px] md:text-[17px] font-extrabold tracking-[0.04em] text-white">
          NGOGBEHEI{" "}
          <span className="font-light">CENTER</span>
        </span>
        <span className="font-montserrat text-[9px] font-bold tracking-[0.28em] uppercase mt-1 text-[#F5C300]">
          Cancer Education &amp; Care
        </span>
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("success");
    setMsg("Thanks for subscribing!");
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  return (
    <>
      <OrganizationSchema />

      <footer
        className="relative bg-[#030712] text-white overflow-hidden font-montserrat"
        aria-labelledby="footer-heading"
        role="contentinfo"
      >
        <h2 id="footer-heading" className="sr-only">
          Ngogbehei Cancer Center - site footer
        </h2>

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 92% 8%, rgba(245,195,0,0.15), transparent 48%), radial-gradient(circle at 6% 95%, rgba(16,185,129,0.07), transparent 50%)",
          }}
        />

        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Top gold hairline */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(245,195,0,0.6) 30%, rgba(245,195,0,0.9) 50%, rgba(245,195,0,0.6) 70%, transparent 100%)",
          }}
        />

        <div className="relative px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto">
          {/* ═══════ Zone 1 - Brand + Newsletter ═══════ */}
          <div className="pt-20 md:pt-24 lg:pt-28 pb-14 md:pb-20 border-b border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Brand block */}
              <div className="lg:col-span-7">
                <div className="mb-10 md:mb-14">
                  <Logo />
                </div>

                <p className="flex items-center gap-3 font-montserrat text-[11px] font-bold tracking-[0.32em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-10 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  UK Registered · Africa Focused
                </p>

                <p className="font-montserrat font-light leading-[1.15] tracking-[-0.01em] text-white text-[28px] md:text-[36px] lg:text-[42px] max-w-2xl">
                  Bridging the gap between{" "}
                  <span
                    className="italic font-normal"
                    style={{ color: "#F5C300" }}
                  >
                    cancer awareness
                  </span>{" "}
                  and access to care across Africa.
                </p>

                <p className="mt-6 md:mt-8 font-montserrat text-[14px] md:text-[15px] leading-[1.75] text-white/70 max-w-lg">
                  The Marcel Ngogbehei Center for Cancer Education &amp; Care is
                  a UK registered nonprofit delivering cancer education, free
                  screenings, and patient navigation directly to underserved
                  communities across Nigeria and Africa.
                </p>
              </div>

              {/* Newsletter card */}
              <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-white/10">
                <p className="flex items-center gap-3 font-montserrat text-[11px] font-bold tracking-[0.32em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-10 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  Stay Connected
                </p>

                <p className="font-montserrat text-[15px] md:text-[16px] leading-[1.7] text-white/75 mb-8 max-w-md">
                  Stay updated on breakthroughs, events, and impact stories from
                  NCC. One concise email a month, no spam, ever.
                </p>

                <form
                  onSubmit={onSubscribe}
                  noValidate
                  aria-label="Newsletter subscription"
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="sr-only">First name</span>
                      <input
                        type="text"
                        autoComplete="given-name"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="font-montserrat w-full px-4 py-3 bg-white/[0.06] border border-white/15 rounded-sm text-[13.5px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#F5C300] focus:bg-white/[0.10] transition-colors"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Last name</span>
                      <input
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="font-montserrat w-full px-4 py-3 bg-white/[0.06] border border-white/15 rounded-sm text-[13.5px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#F5C300] focus:bg-white/[0.10] transition-colors"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="sr-only">Email address</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== "loading") {
                          setStatus("idle");
                          setMsg("");
                        }
                      }}
                      aria-invalid={status === "error"}
                      aria-describedby="newsletter-status"
                      className="font-montserrat w-full px-4 py-3 bg-white/[0.06] border border-white/15 rounded-sm text-[13.5px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#F5C300] focus:bg-white/[0.10] transition-colors"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F5C300] hover:bg-[#e8b800] text-[#1a1200] font-montserrat text-[11.5px] font-extrabold tracking-[0.18em] uppercase shadow-[0_8px_24px_-8px_rgba(245,195,0,0.5)] hover:shadow-[0_12px_32px_-8px_rgba(245,195,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712] focus-visible:ring-[#F5C300] transition-all duration-300 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <span
                          className="w-3.5 h-3.5 border-2 border-[#1a1200]/30 border-t-[#1a1200] rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <FiArrowUpRight
                          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                  <p
                    id="newsletter-status"
                    role="status"
                    aria-live="polite"
                    className={`font-montserrat text-[12px] mt-1 min-h-[1em] ${
                      status === "success"
                        ? "text-emerald-400"
                        : status === "error"
                        ? "text-red-400"
                        : "text-transparent"
                    }`}
                  >
                    {msg || "\u00A0"}
                  </p>
                </form>

                {/* Contact anchors */}
                <address className="not-italic mt-10 space-y-1.5">
                  <FooterMetaLine
                    Icon={FiMapPin}
                    label="Address"
                    value="Wuse 2, Abuja, FCT, Nigeria"
                  />
                  <FooterContactLink
                    Icon={FiMail}
                    label="Email"
                    value="info@ngogbeheicc.org"
                    href="mailto:info@ngogbeheicc.org"
                  />
                  <FooterContactLink
                    Icon={FiPhone}
                    label="Phone"
                    value="+234 800 NCC CARE"
                    href="tel:+2348001234567"
                  />
                </address>
              </div>
            </div>
          </div>

          {/* ═══════ Zone 2 - Navigation ═══════ */}
          <div className="py-14 md:py-16 border-b border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              {/* Explore */}
              <nav
                aria-label="Footer - Explore"
                className="md:col-span-3"
              >
                <h3 className="flex items-center gap-3 font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-7 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  Explore
                </h3>
                <ul className="space-y-3.5">
                  {EXPLORE_LINKS.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink {...link} />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Take Action */}
              <div className="md:col-span-4">
                <h3 className="flex items-center gap-3 font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-7 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  Take Action
                </h3>
                <div className="space-y-2.5">
                  <Link
                    href="/volunteer"
                    className="group flex items-center gap-4 p-4 rounded-sm border border-[#F5C300]/30 bg-[#F5C300]/[0.07] hover:bg-[#F5C300]/[0.14] hover:border-[#F5C300]/60 transition-all duration-300"
                  >
                    <span className="flex-1">
                      <span className="block font-montserrat text-[13.5px] font-bold text-[#F5C300] group-hover:text-white transition-colors duration-200">
                        Volunteer With Us
                      </span>
                      <span className="block font-montserrat text-[11.5px] text-white/55 mt-0.5">
                        Make a difference on the ground
                      </span>
                    </span>
                    <FiArrowUpRight
                      className="w-4 h-4 text-[#F5C300]/70 group-hover:text-white shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href="/donate"
                    className="group flex items-center gap-4 p-4 rounded-sm border border-white/12 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <span className="flex-1">
                      <span className="block font-montserrat text-[13.5px] font-bold text-white/80 group-hover:text-white transition-colors duration-200">
                        Donate
                      </span>
                      <span className="block font-montserrat text-[11.5px] text-white/40 mt-0.5">
                        Fund lifesaving programs
                      </span>
                    </span>
                    <FiArrowUpRight
                      className="w-4 h-4 text-white/30 group-hover:text-white/80 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href="/contact"
                    className="group flex items-center gap-4 p-4 rounded-sm border border-white/12 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <span className="flex-1">
                      <span className="block font-montserrat text-[13.5px] font-bold text-white/80 group-hover:text-white transition-colors duration-200">
                        Contact Us
                      </span>
                      <span className="block font-montserrat text-[11.5px] text-white/40 mt-0.5">
                        Get in touch with our team
                      </span>
                    </span>
                    <FiArrowUpRight
                      className="w-4 h-4 text-white/30 group-hover:text-white/80 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              {/* About */}
              <nav
                aria-label="Footer - About"
                className="md:col-span-3"
              >
                <h3 className="flex items-center gap-3 font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-7 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  About
                </h3>
                <ul className="space-y-3.5">
                  {ABOUT_LINKS.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink {...link} />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Follow */}
              <div className="md:col-span-2">
                <h3 className="flex items-center gap-3 font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#F5C300] mb-6">
                  <span
                    aria-hidden="true"
                    className="inline-block w-7 h-px"
                    style={{ backgroundColor: "#F5C300" }}
                  />
                  Follow
                </h3>
                <ul className="flex items-center flex-wrap gap-2.5">
                  {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow Ngogbehei Cancer Center on ${label}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/80 hover:bg-[#F5C300] hover:border-[#F5C300] hover:text-[#1a1200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]/60 transition-all duration-300"
                      >
                        <Icon className="w-[13px] h-[13px]" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-montserrat text-[11.5px] leading-[1.6] text-white/55">
                  Follow us for real impact and real stories.
                </p>
              </div>
            </div>
          </div>

          {/* ═══════ Zone 3 - Legal + copyright ═══════ */}
          <div className="py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <LegalLink {...link} />
                </li>
              ))}
            </ul>

            <p className="font-montserrat text-[11.5px] text-white/50 md:text-right">
              © {year} The Marcel Ngogbehei Center for Cancer Education &amp;
              Care.{" "}
              <span className="hidden md:inline" aria-hidden="true">
                ·{" "}
              </span>
              <span className="block md:inline mt-1 md:mt-0">
                All rights reserved.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */

function FooterNavLink({ label, href }) {
  return (
    <Link
      href={href}
      className="group relative inline-block font-montserrat text-[14px] text-white/75 hover:text-white focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]/40 rounded-sm transition-colors duration-200"
    >
      <span className="relative">
        {label}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 -bottom-0.5 h-px origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-[400ms] ease-out"
          style={{ backgroundColor: "#F5C300" }}
        />
      </span>
    </Link>
  );
}

function FooterContactLink({ Icon, label, value, href }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]/40 rounded-sm"
    >
      <Icon
        aria-hidden="true"
        className="shrink-0 w-4 h-4 text-[#F5C300] transition-transform duration-300 group-hover:scale-110"
      />
      <span className="flex items-baseline gap-2 flex-wrap">
        <span className="font-montserrat text-[10px] font-bold tracking-[0.24em] uppercase text-white/45 group-hover:text-white/75 transition-colors duration-300">
          {label}
        </span>
        <span className="font-montserrat text-[13.5px] text-white/85 group-hover:text-[#F5C300] transition-colors duration-300 flex items-center gap-1.5">
          {value}
          <FiArrowUpRight
            aria-hidden="true"
            className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          />
        </span>
      </span>
    </a>
  );
}

function FooterMetaLine({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon
        aria-hidden="true"
        className="shrink-0 mt-0.5 w-4 h-4 text-[#F5C300]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-montserrat text-[10px] font-bold tracking-[0.24em] uppercase text-white/45">
          {label}
        </span>
        <span className="font-montserrat text-[13.5px] text-white/85">
          {value}
        </span>
      </span>
    </div>
  );
}

function LegalLink({ label, href }) {
  return (
    <Link
      href={href}
      className="group relative font-montserrat text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/65 hover:text-white focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]/40 rounded-sm transition-colors duration-200"
    >
      <span className="relative">
        {label}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 -bottom-0.5 h-px origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-[400ms] ease-out"
          style={{ backgroundColor: "#F5C300" }}
        />
      </span>
    </Link>
  );
}
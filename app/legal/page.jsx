"use client";

/**
 * @file app/legal/[[...section]]/page.jsx
 * @project Ngogbehei Cancer Center
 *
 * @description One-page Legal hub. The four URLs below all render this same
 *              page; the slug is used only to auto-scroll to the matching
 *              section and pre-highlight it in the side TOC.
 *
 *                /legal              → top of page (Privacy first)
 *                /legal/privacy      → scroll to #privacy
 *                /legal/terms        → scroll to #terms
 *                /legal/accessibility→ scroll to #accessibility
 *                /legal/transparency → scroll to #transparency
 *
 *              The catch-all `[[...section]]` keeps existing footer links
 *              working without redirects. Each section is its own <article>
 *              with proper heading hierarchy and JSON-LD WebPage schema.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Accessibility,
  Eye,
  ChevronRight,
  ArrowUpRight,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────── */
const LAST_UPDATED = "1 January 2025";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

const VALID_SLUGS = ["privacy", "terms", "accessibility", "transparency"];

/* ─── TOC sections ───────────────────────────────────────── */
const SECTIONS = [
  {
    slug: "privacy",
    label: "Privacy Policy",
    Icon: ShieldCheck,
    eyebrow: "Section 01",
    summary: "How we collect, use, and protect your personal information.",
  },
  {
    slug: "terms",
    label: "Terms of Use",
    Icon: FileText,
    eyebrow: "Section 02",
    summary: "The rules that apply when you use the NCC website.",
  },
  {
    slug: "accessibility",
    label: "Accessibility",
    Icon: Accessibility,
    eyebrow: "Section 03",
    summary: "Our commitment to an inclusive, barrier free digital experience.",
  },
  {
    slug: "transparency",
    label: "Transparency",
    Icon: Eye,
    eyebrow: "Section 04",
    summary:
      "How we report on funds, governance, and the impact of every donation.",
  },
];

/* ═══════════════════════════════════════════════
   STRUCTURED DATA
═══════════════════════════════════════════════ */
function LegalSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Legal | Ngogbehei Cancer Center",
    url: `${SITE_URL}/legal`,
    description:
      "Privacy Policy, Terms of Use, Accessibility statement, and Transparency commitments for the Ngogbehei Cancer Center.",
    dateModified: "2025-01-01",
    publisher: {
      "@type": "NGO",
      name: "Marcel Ngogbehei Center for Cancer Education & Care",
      url: SITE_URL,
    },
    hasPart: SECTIONS.map((s) => ({
      "@type": "WebPageElement",
      name: s.label,
      url: `${SITE_URL}/legal/${s.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ═══════════════════════════════════════════════
   HEADER (page hero)
═══════════════════════════════════════════════ */
function LegalHero({ activeSlug }) {
  const active =
    SECTIONS.find((s) => s.slug === activeSlug) ?? SECTIONS[0];

  return (
    <section
      className="relative w-full overflow-hidden font-montserrat"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)",
      }}
      aria-labelledby="legal-heading"
    >
      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 92% 8%, rgba(245,195,0,0.12), transparent 48%), radial-gradient(circle at 6% 100%, rgba(16,185,129,0.1), transparent 50%)",
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

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-[calc(var(--navbar-h,102px)+48px)] pb-20 lg:pt-[calc(var(--navbar-h,102px)+72px)] lg:pb-28">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-8 font-montserrat text-[11px] font-bold tracking-[0.2em] uppercase text-white/55"
        >
          <Link
            href="/"
            className="hover:text-[#F5C300] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Home
          </Link>
          <ChevronRight size={11} aria-hidden="true" className="opacity-50" />
          <span className="text-white" aria-current="page">
            Legal
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            {/* Eyebrow */}
            <p className="flex items-center gap-3 font-montserrat text-[11px] font-bold tracking-[0.32em] uppercase text-[#F5C300] mb-6">
              <span
                aria-hidden="true"
                className="inline-block w-10 h-px"
                style={{ backgroundColor: "#F5C300" }}
              />
              Legal &amp; Compliance
            </p>

            <h1
              id="legal-heading"
              className="font-montserrat font-black text-white leading-[1.02] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Clear policies.
              <br />
              <span style={{ color: "#F5C300" }}>Honest commitments.</span>
            </h1>

            <p className="mt-6 max-w-2xl font-montserrat text-[15px] md:text-[16px] leading-[1.75] text-white/70">
              Trust is foundational to our work. This page consolidates the
              four documents that govern how the Ngogbehei Cancer Center
              operates online: our{" "}
              <strong className="text-white font-semibold">
                Privacy Policy
              </strong>
              ,{" "}
              <strong className="text-white font-semibold">Terms of Use</strong>
              ,{" "}
              <strong className="text-white font-semibold">
                Accessibility statement
              </strong>
              , and our{" "}
              <strong className="text-white font-semibold">
                Transparency commitments
              </strong>
              .
            </p>

            <p className="mt-5 inline-flex items-center gap-2 font-montserrat text-[12px] font-bold tracking-[0.18em] uppercase text-white/50">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              Last updated · {LAST_UPDATED}
            </p>
          </div>

          {/* Active section card */}
          <aside
            aria-label="Currently viewing"
            className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10"
          >
            <p className="font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#F5C300] mb-4">
              You&apos;re viewing
            </p>
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(245,195,0,0.12)",
                  border: "1px solid rgba(245,195,0,0.3)",
                }}
              >
                <active.Icon
                  size={20}
                  strokeWidth={1.8}
                  style={{ color: "#F5C300" }}
                />
              </span>
              <div>
                <p className="font-montserrat text-[10px] font-bold tracking-[0.22em] uppercase text-white/45 mb-1">
                  {active.eyebrow}
                </p>
                <p className="font-montserrat text-[18px] font-black text-white leading-tight">
                  {active.label}
                </p>
                <p className="mt-2 font-montserrat text-[13.5px] text-white/65 leading-relaxed">
                  {active.summary}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STICKY SIDE TOC
═══════════════════════════════════════════════ */
function SideToc({ activeSlug, setActiveSlug }) {
  return (
    <nav
      aria-label="Legal sections"
      className="lg:sticky lg:top-[calc(var(--navbar-h,102px)+24px)] font-montserrat"
    >
      <p className="flex items-center gap-3 text-[10.5px] font-bold tracking-[0.28em] uppercase text-emerald-600 mb-5">
        <span
          aria-hidden="true"
          className="inline-block w-7 h-px bg-emerald-500"
        />
        On this page
      </p>

      <ol className="space-y-2 list-none p-0">
        {SECTIONS.map((s) => {
          const isActive = s.slug === activeSlug;
          return (
            <li key={s.slug}>
              <Link
                href={`/legal/${s.slug}`}
                scroll={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSlug(s.slug);
                  document
                    .getElementById(s.slug)
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  window.history.replaceState(null, "", `/legal/${s.slug}`);
                }}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  background: isActive ? "#ecfdf5" : "white",
                  borderColor: isActive ? "#a7f3d0" : "#f1f5f9",
                  boxShadow: isActive
                    ? "0 8px 24px rgba(5,150,105,0.08)"
                    : "0 1px 0 rgba(0,0,0,0.02)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{
                    background: isActive
                      ? "#059669"
                      : "rgba(16,185,129,0.08)",
                    border: isActive
                      ? "1px solid #059669"
                      : "1px solid rgba(16,185,129,0.18)",
                  }}
                >
                  <s.Icon
                    size={15}
                    strokeWidth={1.8}
                    style={{ color: isActive ? "white" : "#059669" }}
                  />
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className="block font-montserrat text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5"
                    style={{ color: isActive ? "#047857" : "#94a3b8" }}
                  >
                    {s.eyebrow}
                  </span>
                  <span
                    className="block font-montserrat text-[14.5px] font-black leading-tight"
                    style={{ color: isActive ? "#0A2240" : "#1e293b" }}
                  >
                    {s.label}
                  </span>
                </span>
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  className="flex-shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: isActive ? "#047857" : "#cbd5e1" }}
                />
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Quick contact */}
      <div className="mt-8 rounded-2xl p-5 bg-slate-50 border border-slate-100">
        <p className="font-montserrat text-[10.5px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-2">
          Have a question?
        </p>
        <p className="font-montserrat text-[13.5px] text-slate-600 leading-relaxed mb-4">
          Reach our compliance team directly for any legal or policy enquiry.
        </p>
        <a
          href="mailto:info@ngogbeheicc.org"
          className="inline-flex items-center gap-1.5 font-montserrat text-[13px] font-black text-emerald-700 hover:text-emerald-800 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          info@ngogbeheicc.org
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   SECTION WRAPPER
═══════════════════════════════════════════════ */
function PolicySection({ id, eyebrow, title, children, lead }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = SECTIONS.find((s) => s.slug === id)?.Icon ?? FileText;

  return (
    <motion.article
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="font-montserrat scroll-mt-[calc(var(--navbar-h,102px)+24px)]"
      aria-labelledby={`${id}-title`}
    >
      <header className="mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(245,195,0,0.1)",
              border: "1px solid rgba(245,195,0,0.25)",
            }}
          >
            <Icon size={17} strokeWidth={1.8} style={{ color: "#8a6e00" }} />
          </span>
          <span className="font-montserrat text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#8a6e00]">
            {eyebrow}
          </span>
        </div>
        <h2
          id={`${id}-title`}
          className="font-montserrat font-black text-slate-900 leading-[1.05] tracking-[-0.025em]"
          style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
        >
          {title}
        </h2>
        {lead && (
          <p className="mt-4 max-w-2xl font-montserrat text-[15px] text-slate-500 leading-[1.75]">
            {lead}
          </p>
        )}
      </header>

      <div className="legal-prose font-montserrat text-[14.5px] text-slate-600 leading-[1.8] space-y-6 max-w-3xl">
        {children}
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════
   POLICY BLOCKS
═══════════════════════════════════════════════ */
function PrivacyBlock() {
  return (
    <PolicySection
      id="privacy"
      eyebrow="Section 01 · Privacy Policy"
      title="Your privacy, plainly stated."
      lead="The Ngogbehei Cancer Center treats your personal information as carefully as we treat the patients we serve. This policy explains what we collect, why, and the rights you keep at every stage."
    >
      <h3>1. Information we collect</h3>
      <p>
        We collect only the information necessary to deliver our programmes
        and respond to you. This includes:
      </p>
      <ul>
        <li>
          <strong>Contact details</strong>: name, email, phone number, and
          mailing address provided through our forms (newsletter, contact,
          donation, volunteer, partner enquiry).
        </li>
        <li>
          <strong>Donation information</strong>: gift amount, frequency, and
          payment confirmation handled by our regulated payment partners. We
          do not store full card numbers on our servers.
        </li>
        <li>
          <strong>Programme participation data</strong>: anonymised
          attendance and screening counts used to report on impact.
        </li>
        <li>
          <strong>Technical data</strong>: IP address, browser type, pages
          viewed, and time on page for analytics and security.
        </li>
      </ul>

      <h3>2. How we use your information</h3>
      <p>
        We use your data to deliver services you have requested, send
        communications you have opted in to, comply with our legal and
        accounting obligations as a UK registered nonprofit, and improve our
        programmes. We do{" "}
        <strong>not sell, rent, or trade your personal information</strong>{" "}
        to anyone, ever.
      </p>

      <h3>3. Lawful basis</h3>
      <p>
        Under the UK GDPR and the Nigeria Data Protection Act 2023, we
        process your data on one or more of these bases: your explicit
        consent (e.g. newsletter), the performance of a contract (e.g.
        donor receipt), our legitimate interests (e.g. site security), or
        legal obligation (e.g. financial reporting).
      </p>

      <h3>4. Sharing &amp; processors</h3>
      <p>
        We share data only with vetted processors who help us run NCC -
        payment platforms, email delivery services, analytics, and cloud
        hosting. Each is bound by a data-processing agreement. We may also
        disclose information where required by law.
      </p>

      <h3>5. International transfers</h3>
      <p>
        Because NCC operates between the UK and Africa, your data may be
        transferred between these jurisdictions using safeguards approved by
        the UK ICO and the NDPC.
      </p>

      <h3>6. How long we keep data</h3>
      <p>
        We retain personal data only as long as needed for the purpose
        collected or required by law (typically up to 7 years for financial
        records). Marketing data is removed within 30 days of you
        unsubscribing.
      </p>

      <h3>7. Your rights</h3>
      <p>You can at any time:</p>
      <ul>
        <li>Request a copy of the data we hold about you</li>
        <li>Correct inaccurate data</li>
        <li>Ask us to delete data we no longer need</li>
        <li>Withdraw consent for marketing</li>
        <li>Object to processing or request portability</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:info@ngogbeheicc.org">info@ngogbeheicc.org</a>. We
        respond within 30 days.
      </p>

      <h3>8. Cookies</h3>
      <p>
        Our site uses essential cookies for security and optional analytics
        cookies that help us understand how visitors use the site. You can
        accept or decline non essential cookies through the banner shown on
        your first visit.
      </p>

      <h3>9. Children</h3>
      <p>
        We do not knowingly collect data from anyone under 16 without a
        parent or guardian&apos;s consent. If you believe a child has
        provided us with personal information, contact us and we will remove
        it.
      </p>

      <h3>10. Updates to this policy</h3>
      <p>
        We may update this policy as our programmes evolve or laws change.
        Material changes will be announced on this page and, where
        appropriate, by email.
      </p>
    </PolicySection>
  );
}

function TermsBlock() {
  return (
    <PolicySection
      id="terms"
      eyebrow="Section 02 · Terms of Use"
      title="The terms that govern your use of NCC."
      lead="These terms apply to anyone using the ngogbeheicc.org website. By accessing the site you agree to use it lawfully, respectfully, and only for the purposes described below."
    >
      <h3>1. About these terms</h3>
      <p>
        This website is operated by the Marcel Ngogbehei Center for Cancer
        Education &amp; Care (&ldquo;NCC&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;), a UK registered nonprofit. By using the site you
        accept these terms. If you don&apos;t accept them, please don&apos;t
        use the site.
      </p>

      <h3>2. Permitted use</h3>
      <p>You may use this website to:</p>
      <ul>
        <li>Learn about our programmes, impact, and partners</li>
        <li>Make a donation, volunteer, or apply to partner with us</li>
        <li>Subscribe to our newsletter or contact us</li>
        <li>Share our published content with appropriate attribution</li>
      </ul>

      <h3>3. Prohibited conduct</h3>
      <p>You may not:</p>
      <ul>
        <li>
          Reproduce, modify, or commercially exploit our content without
          written permission
        </li>
        <li>
          Use automated tools to scrape, harvest, or interfere with the site
        </li>
        <li>
          Attempt to gain unauthorised access to any part of the site or
          related systems
        </li>
        <li>Submit false, misleading, or unlawful information</li>
        <li>
          Impersonate NCC, its founders, staff, partners, or beneficiaries
        </li>
      </ul>

      <h3>4. Donations</h3>
      <p>
        All donations made through this site are processed by regulated
        payment partners. Donations are voluntary and, except where required
        by law, non refundable. We will issue a digital receipt. If a
        donation is made in error, contact{" "}
        <a href="mailto:info@ngogbeheicc.org">info@ngogbeheicc.org</a> within
        14 days.
      </p>

      <h3>5. Medical disclaimer</h3>
      <p>
        Information on this site is provided for educational and awareness
        purposes only. It does not constitute medical advice, diagnosis, or
        treatment, and is not a substitute for consultation with a qualified
        healthcare professional. Always seek the advice of a doctor with any
        questions about a medical condition.
      </p>

      <h3>6. Intellectual property</h3>
      <p>
        All content on this site, including text, graphics, logos, photographs, and
        downloadable resources, is owned by or licensed to NCC and
        protected by copyright. The Ngogbehei Cancer Center name, logo, and
        related marks are our property and may not be used without
        permission.
      </p>

      <h3>7. Third party links</h3>
      <p>
        The site may link to external pages (partner organisations, news
        articles, social platforms). We are not responsible for the content
        or practices of those sites and inclusion of a link does not imply
        endorsement.
      </p>

      <h3>8. Site availability</h3>
      <p>
        We work hard to keep the site running smoothly but cannot guarantee
        uninterrupted access. We may at any time suspend, withdraw, or
        change parts of the site without notice.
      </p>

      <h3>9. Liability</h3>
      <p>
        To the fullest extent permitted by law, NCC and its trustees,
        employees, and volunteers are not liable for any indirect,
        consequential, or incidental loss arising from your use of the site.
        Nothing in these terms excludes liability for death or personal
        injury caused by negligence, or for fraud.
      </p>

      <h3>10. Governing law</h3>
      <p>
        These terms are governed by the laws of England and Wales. Any
        dispute will be subject to the non exclusive jurisdiction of the
        English courts, without prejudice to mandatory consumer protection
        rights you may have in your country of residence.
      </p>

      <h3>11. Changes</h3>
      <p>
        We may update these terms from time to time. The date at the top of
        this page reflects the most recent revision. Continued use of the
        site after a revision means you accept the updated terms.
      </p>
    </PolicySection>
  );
}

function AccessibilityBlock() {
  return (
    <PolicySection
      id="accessibility"
      eyebrow="Section 03 · Accessibility"
      title="A digital experience that works for everyone."
      lead="NCC believes that access to cancer information is a human right, and that includes access to this website. We design and maintain ngogbeheicc.org to be usable by people with the widest possible range of abilities."
    >
      <h3>1. Our standard</h3>
      <p>
        We aim to meet the{" "}
        <strong>
          Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
        </strong>
        . These guidelines cover four core principles: content must be
        perceivable, operable, understandable, and robust.
      </p>

      <h3>2. What we&apos;ve done</h3>
      <ul>
        <li>
          Semantic HTML throughout: proper headings, landmarks, lists, and
          form labels
        </li>
        <li>
          Visible focus indicators on all interactive elements for keyboard
          users
        </li>
        <li>
          Alternative text on every meaningful image; decorative images are
          marked accordingly
        </li>
        <li>
          Colour contrast ratios that meet or exceed WCAG AA on body text
          and UI controls
        </li>
        <li>
          Skip to content link, ARIA roles on menus and dialogs, and
          consistent navigation
        </li>
        <li>
          Animations honour the user&apos;s{" "}
          <em>prefers-reduced-motion</em> system setting
        </li>
        <li>Forms with clear labels, error messages, and status updates</li>
        <li>Captions and transcripts for video content where available</li>
      </ul>

      <h3>3. Known limitations</h3>
      <p>
        Some embedded third party content (donation widgets, social embeds)
        may not yet meet our internal standard. We are actively working with
        each partner to close these gaps and welcome feedback on any barrier
        you encounter.
      </p>

      <h3>4. Assistive technology</h3>
      <p>
        The site is tested with the latest versions of major screen readers
        (NVDA, JAWS, VoiceOver, TalkBack), keyboard only navigation, and
        high contrast modes. If a tool you rely on doesn&apos;t work as
        expected, please tell us.
      </p>

      <h3>5. Reporting an accessibility issue</h3>
      <p>
        If you find a barrier on this site, contact us with the page URL and
        a brief description of the issue. We respond to accessibility
        reports within 5 working days.
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:info@ngogbeheicc.org">info@ngogbeheicc.org</a>
        </li>
        <li>Phone: +234 800 NCC CARE</li>
      </ul>

      <h3>6. Alternatives</h3>
      <p>
        If you cannot access information on this site, we are happy to
        provide it in another format: large print, plain text, or a
        verbal walkthrough by phone, at no cost to you.
      </p>

      <h3>7. Continuous improvement</h3>
      <p>
        Accessibility is not a one time project. We audit the site at least
        annually, train our content team on inclusive practices, and
        prioritise accessibility fixes in every release.
      </p>
    </PolicySection>
  );
}

function TransparencyBlock() {
  return (
    <PolicySection
      id="transparency"
      eyebrow="Section 04 · Transparency"
      title="Where every Naira and Pound goes."
      lead="As a UK registered nonprofit operating across Africa, we hold ourselves to a higher standard of openness than the law requires. Trust isn't claimed, it's reported."
    >
      <h3>1. Registration &amp; governance</h3>
      <p>
        The Marcel Ngogbehei Center for Cancer Education &amp; Care is
        registered with the Charity Commission for England &amp; Wales.
        We operate under a board of trustees who meet quarterly and approve
        every major programme decision, partnership, and budget.
      </p>

      <h3>2. How donations are used</h3>
      <p>
        We commit that{" "}
        <strong>100% of donations fund our African programmes</strong> -
        cancer education, free screening, and patient navigation. Operating
        costs in the UK are covered separately by foundational grants and
        unrestricted gifts clearly designated for that purpose.
      </p>
      <p>
        Indicative programme costs for context:
      </p>
      <ul>
        <li>
          <strong>₦5,000</strong>: cancer awareness materials reaching 100
          people
        </li>
        <li>
          <strong>₦25,000</strong>: free screening for 5 women
        </li>
        <li>
          <strong>₦100,000</strong>: a mobile clinic running for a full day
        </li>
      </ul>

      <h3>3. Annual reporting</h3>
      <p>
        Each year we publish:
      </p>
      <ul>
        <li>
          An <strong>impact report</strong> with verified programme metrics
          (communities reached, people educated, screenings conducted,
          patients supported)
        </li>
        <li>
          <strong>Audited financial statements</strong> filed with the
          Charity Commission
        </li>
        <li>
          A <strong>governance summary</strong> covering trustee changes,
          policy updates, and risk register highlights
        </li>
      </ul>

      <h3>4. Our partners</h3>
      <p>
        We disclose our institutional partners: federal and state health
        departments, universities, NGOs, and corporate CSR programmes, on
        our partners page. Where a partnership involves a financial
        relationship, the nature of that relationship is summarised in the
        annual report.
      </p>

      <h3>5. Conflicts of interest</h3>
      <p>
        Trustees and senior staff annually disclose any interest that could
        conflict with NCC&apos;s mission. Disclosed interests are recorded
        in a register and the relevant person recuses themselves from any
        decision in which they have a stake.
      </p>

      <h3>6. Safeguarding</h3>
      <p>
        Every staff member, volunteer, and partner working with patients,
        children, or vulnerable adults is screened, trained, and bound by
        our safeguarding policy. Concerns can be raised confidentially to
        our designated safeguarding lead at{" "}
        <a href="mailto:info@ngogbeheicc.org">info@ngogbeheicc.org</a>.
      </p>

      <h3>7. Whistleblowing</h3>
      <p>
        We support and protect anyone, whether staff, volunteer, beneficiary, or
        member of the public, who raises a concern in good faith about
        wrongdoing at NCC. All reports are investigated and the reporter is
        protected from retaliation.
      </p>

      <h3>8. Asking us anything</h3>
      <p>
        If you cannot find the information you need, ask. We will do our
        best to provide it within 14 days, or explain why we cannot.
      </p>
    </PolicySection>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER STRIP
═══════════════════════════════════════════════ */
function ContactStrip() {
  return (
    <section
      aria-labelledby="legal-contact-heading"
      className="relative overflow-hidden rounded-3xl mt-16 px-8 sm:px-12 py-10 font-montserrat"
      style={{
        background:
          "linear-gradient(135deg,#064e3b 0%,#065f46 35%,#047857 65%,#059669 100%)",
        boxShadow:
          "0 24px 60px rgba(5,150,105,0.18), 0 4px 12px rgba(5,150,105,0.1)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-8 top-1/2 -translate-y-1/2 font-montserrat font-black text-white/[0.05] leading-none select-none pointer-events-none"
        style={{ fontSize: "clamp(64px,10vw,120px)" }}
      >
        LEGAL
      </span>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="flex items-center gap-3 font-montserrat text-[10.5px] font-bold tracking-[0.3em] uppercase text-emerald-300/85 mb-3">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-px bg-emerald-300/60"
            />
            Need clarification?
          </p>
          <h2
            id="legal-contact-heading"
            className="font-montserrat text-2xl sm:text-3xl font-black text-white leading-tight tracking-[-0.025em]"
          >
            Our compliance team is one email away.
          </h2>
        </div>
        <address className="not-italic flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <a
            href="mailto:info@ngogbeheicc.org"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-montserrat text-[13px] font-black text-emerald-900 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Mail size={13} aria-hidden="true" />
            Email us
          </a>
          <a
            href="tel:+2348001234567"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-montserrat text-[13px] font-bold text-white border border-white/25 hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <Phone size={13} aria-hidden="true" />
            +234 800 NCC CARE
          </a>
        </address>
      </div>

      <p className="relative z-10 mt-6 flex items-center gap-2 font-montserrat text-[12px] text-white/70">
        <MapPin size={12} aria-hidden="true" className="text-[#F5C300]" />
        Wuse 2, Abuja, FCT, Nigeria
      </p>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   BACK-TO-TOP FAB
═══════════════════════════════════════════════ */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-[80] w-12 h-12 rounded-full bg-[#0A2240] text-white shadow-[0_12px_28px_rgba(10,34,64,0.3)] hover:bg-[#1a3658] active:scale-95 transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
    >
      <ArrowUp size={16} aria-hidden="true" />
    </button>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function LegalPage() {
  const params = useParams();
  const pathname = usePathname();

  /* Resolve the slug from the URL - catch-all gives an array */
  const rawSlug = Array.isArray(params?.section)
    ? params.section[0]
    : params?.section;
  const initialSlug = VALID_SLUGS.includes(rawSlug) ? rawSlug : "privacy";

  const [activeSlug, setActiveSlug] = useState(initialSlug);

  /* Scroll to the requested section on first paint and on URL change */
  useEffect(() => {
    if (!VALID_SLUGS.includes(rawSlug)) return;
    setActiveSlug(rawSlug);
    /* Wait one frame so the section is in the DOM */
    const id = requestAnimationFrame(() => {
      const el = document.getElementById(rawSlug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [rawSlug, pathname]);

  /* Track which section is in view (IntersectionObserver) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = SECTIONS
      .map((s) => document.getElementById(s.slug))
      .filter(Boolean);

    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]?.target?.id) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <LegalSchema />

      <main id="main-content" className="bg-white font-montserrat">
        <LegalHero activeSlug={activeSlug} />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
            {/* Side TOC */}
            <aside aria-label="Table of contents">
              <SideToc
                activeSlug={activeSlug}
                setActiveSlug={setActiveSlug}
              />
            </aside>

            {/* Policy content */}
            <div className="min-w-0 space-y-20 lg:space-y-24">
              <PrivacyBlock />
              <TermsBlock />
              <AccessibilityBlock />
              <TransparencyBlock />

              <ContactStrip />
            </div>
          </div>
        </div>

        <BackToTop />
      </main>

      {/* Prose typography for the policy bodies */}
      <style>{`
        .legal-prose h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #0A2240;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .legal-prose h3:first-child { margin-top: 0; }
        .legal-prose p { margin-bottom: 1rem; }
        .legal-prose ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
        }
        .legal-prose ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.625rem;
        }
        .legal-prose ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: #F5C300;
        }
        .legal-prose strong { color: #0A2240; font-weight: 700; }
        .legal-prose a {
          color: #047857;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
          transition: color 0.15s;
        }
        .legal-prose a:hover { color: #064e3b; }
        .legal-prose a:focus-visible {
          outline: 2px solid #059669;
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
"use client";

/**
 * @file DiscoverSection.jsx
 * @project Ngogbehei Cancer Center
 * @description "Discover NCC" section - editorial intro + 4 image cards.
 */

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FP1 from "@/assets/FP1.jpg";
import FP2 from "@/assets/FP2.jpg";
import FP3 from "@/assets/FP3.jpg";
import FP4 from "@/assets/FP4.jpg";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ─── NCC discover cards ─────────────────────────────────── */
const CARDS = [
  {
    id: "screening",
    category: "Free Screenings",
    headline:
      "Free cancer screening, delivered directly to underserved communities.",
    href: "/services/screening",
    img: FP1,
    alt: "African NCC medical professional performing a free cancer screening in Nigeria",
  },
  {
    id: "navigation",
    category: "Patient Navigation",
    headline:
      "From diagnosis to treatment, no patient walks the road alone.",
    href: "/services/navigation",
    img: FP2,
    alt: "African NCC patient navigator supporting a Nigerian cancer patient",
  },
  {
    id: "outreach",
    category: "Community Outreach",
    headline:
      "Cancer education that reaches every corner of Nigeria, in local languages.",
    href: "/services/outreach",
    img: FP3,
    alt: "African NCC community health workers engaging with rural Nigerian residents",
  },
  {
    id: "impact",
    category: "Our Impact",
    headline:
      "Measurable outcomes across Nigeria and West Africa, and counting.",
    href: "/impact",
    img: FP4,
    alt: "Ngogbehei Cancer Center impact across Nigerian communities",
  },
];

/* ─── JSON-LD structured data ────────────────────────────── */
function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Discover Ngogbehei Cancer Center",
    description:
      "Key programmes and impact areas of the Ngogbehei Cancer Center: free screening, patient navigation, community outreach, and impact reporting.",
    numberOfItems: CARDS.length,
    itemListElement: CARDS.map((card, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: card.category,
      description: card.headline,
      url: `${SITE_URL}${card.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

const cardVar = (i) => ({
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: 0.1 + i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const lineVar = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Card ───────────────────────────────────────────────── */
function DiscoverCard({ card, index }) {
  return (
    <motion.article
      variants={cardVar(index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="group relative rounded-2xl overflow-hidden aspect-[3/4] font-montserrat"
    >
      <Link
        href={card.href}
        aria-label={`${card.category}: ${card.headline}`}
        className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300] rounded-2xl"
      >
        {/* Image fills the article which is already relative + has aspect-ratio */}
        <Image
          src={card.img}
          alt={card.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          quality={95}
          priority={false}
          placeholder="blur"
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 rounded-2xl"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div>
            <span className="inline-block font-montserrat text-[10.5px] font-bold tracking-[.18em] uppercase text-white/85 group-hover:text-white transition-colors duration-300">
              {card.category}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <h3
              className="font-montserrat text-white font-semibold leading-[1.3] transition-all duration-300 group-hover:translate-y-[-2px]"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
            >
              {card.headline}
            </h3>

            <div className="flex items-center justify-end">
              <span
                aria-hidden="true"
                className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/40 group-hover:border-white overflow-hidden transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out origin-center" />
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="relative z-10 text-white group-hover:text-[#0A2240] transition-colors duration-300 group-hover:translate-x-[1px]"
                />
              </span>
            </div>
          </div>
        </div>

        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F5C300] origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </Link>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function DiscoverSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <>
      <StructuredData />

      <section
        ref={sectionRef}
        className="w-full bg-[#F4F4F2] py-20 lg:py-28 font-montserrat"
        aria-labelledby="discover-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="mb-16 lg:mb-20">
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-5"
            >
              <motion.span
                aria-hidden="true"
                variants={lineVar}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="block h-[2px] w-8 bg-[#F5C300] origin-left"
              />
              <span className="font-montserrat text-[11px] font-bold tracking-[.2em] uppercase text-[#F5C300]">
                Discover NCC
              </span>
            </motion.div>

            <motion.h2
              id="discover-heading"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="font-montserrat font-normal text-[#0A2240] leading-[1.25] max-w-[720px]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Bridging the gap between cancer awareness and care, delivering
              free screening, education, and support to{" "}
              <em className="not-italic font-bold text-[#F5C300]">
                every community
              </em>{" "}
              that needs us.
            </motion.h2>
          </div>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 list-none p-0"
            aria-label="NCC programmes and impact areas"
          >
            {CARDS.map((card, i) => (
              <li key={card.id}>
                <DiscoverCard card={card} index={i} />
              </li>
            ))}
          </ul>

          <motion.div
            variants={fadeUp(0.5)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <p className="font-montserrat text-[14.5px] text-[#6B7280] max-w-[480px] leading-relaxed">
              From Abuja and Lagos to Port Harcourt and Kano, Ngogbehei Cancer
              Center is wherever Nigerians need cancer care most.
            </p>

            <Link
              href="/about"
              className="group flex items-center gap-3 font-montserrat text-[14px] font-bold text-[#0A2240] hover:text-[#F5C300] transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:underline"
            >
              Learn about our foundation
              <span
                aria-hidden="true"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-[#0A2240]/25 group-hover:border-[#F5C300] group-hover:bg-[#F5C300] transition-all duration-300 overflow-hidden"
              >
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="text-[#0A2240] group-hover:text-white transition-colors duration-300 group-hover:translate-x-[1px]"
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
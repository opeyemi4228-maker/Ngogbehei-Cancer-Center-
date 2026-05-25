/**
 * @file app/page.jsx
 * @project Ngogbehei Cancer Center
 * @description Homepage — composes the seven production NCC sections in
 *              editorial reading order. Server Component (no "use client") so
 *              `metadata` export works and JSON-LD streams in the initial HTML.
 *
 *              Reading order:
 *                1. HeroSection      — cinematic 4-slide intro
 *                2. WhoWeAre         — mission, stats, world map
 *                3. DiscoverSection  — 4 programmes
 *                4. ImpactSection    — 5 metric cards + 12-month target
 *                5. StorySection     — founder + community stories
 *                6. PartnersSection  — 4 partner categories
 *                7. ContactSection   — get in touch form
 *
 *              Navbar + Footer are rendered by app/layout.jsx so they appear
 *              on every page; they are NOT included here.
 */

import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import FeaturedProduct from "@/components/FeaturedProduct";
import Mission from "@/components/Mission";
import Check from "@/components/check";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

/* ─── Page metadata (SEO) ─────────────────────────────────── */
export const metadata = {
  title:
    "Ngogbehei Cancer Center — Bridging the Gap in African Cancer Care",
  description:
    "UK-registered nonprofit delivering free cancer screening, education, and patient navigation across Nigeria and Africa. Donate, volunteer, or partner with NCC today.",
  keywords: [
    "cancer foundation Nigeria",
    "free cancer screening Abuja",
    "cancer education Africa",
    "patient navigation Nigeria",
    "Ngogbehei Cancer Center",
    "NCC donate",
    "cancer awareness Africa",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ngogbehei Cancer Center",
    title:
      "Ngogbehei Cancer Center — Bridging the Gap in African Cancer Care",
    description:
      "Free cancer screening, education, and patient navigation across Nigeria and Africa.",
    locale: "en_NG",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ngogbehei Cancer Center — UK-registered nonprofit serving Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@NgogbeheiCC",
    creator: "@NgogbeheiCC",
    title: "Ngogbehei Cancer Center — Cancer care across Nigeria & Africa",
    description:
      "Free cancer screening, education, and patient navigation. Donate or partner with NCC today.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ─── Homepage JSON-LD ────────────────────────────────────── */
function HomeSchema() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ngogbehei Cancer Center",
    url: SITE_URL,
    publisher: {
      "@type": "NGO",
      name: "Marcel Ngogbehei Center for Cancer Education & Care",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HomeSchema />

      <main id="main-content" className="font-montserrat">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Mission />
        <Check />
        <Banner />
        <NewsLetter />
      </main>
    </>
  );
}
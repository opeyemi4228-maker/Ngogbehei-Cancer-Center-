import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── FONT ─────────────────────────────────────────────────────────────────────
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
});

// ─── METADATA ─────────────────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org"
  ),

  title: {
    default: "Ngogbehei Cancer Center | Hope. Healing. Humanity.",
    template: "%s | Ngogbehei Cancer Center",
  },

  description:
    "Ngogbehei Cancer Center is Nigeria's leading cancer foundation, delivering world-class screening, treatment, and patient support programs across Abuja and beyond.",

  keywords: [
    "cancer center Nigeria",
    "cancer treatment Abuja",
    "oncology Nigeria",
    "cancer screening Nigeria",
    "cancer foundation Africa",
    "breast cancer Nigeria",
    "prostate cancer screening",
    "chemotherapy Abuja",
    "palliative care Nigeria",
    "Ngogbehei Cancer Center",
    "NCC Abuja",
    "cancer awareness Nigeria",
  ],

  authors: [{ name: "Ngogbehei Cancer Center", url: "https://www.ngogbeheicc.org" }],
  creator: "Ngogbehei Cancer Center",
  publisher: "Ngogbehei Cancer Center",

  // ── Canonical & Robots ──
  alternates: {
    canonical: "/",
    languages: {
      "en-NG": "/",
      "en-US": "/",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ── Open Graph ──
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org",
    siteName: "Ngogbehei Cancer Center",
    title: "Ngogbehei Cancer Center | Hope. Healing. Humanity.",
    description:
      "Nigeria's leading cancer foundation. World-class screening, treatment, and patient support in Abuja.",
    images: [
      {
        url: "/images/og/default-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ngogbehei Cancer Center — Hope. Healing. Humanity.",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X ──
  twitter: {
    card: "summary_large_image",
    site: "@NgogbeheiCC",
    creator: "@NgogbeheiCC",
    title: "Ngogbehei Cancer Center | Hope. Healing. Humanity.",
    description:
      "Nigeria's leading cancer foundation. World-class screening, treatment, and patient support in Abuja.",
    images: ["/images/og/default-og-image.jpg"],
  },

  // ── Icons ──
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", rel: "shortcut icon" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
        color: "#0A2240",
      },
    ],
  },

  // ── Manifest ──
  manifest: "/site.webmanifest",

  // ── Verification ──
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // ── Misc ──
  category: "healthcare",
  applicationName: "Ngogbehei Cancer Center",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

// ─── STRUCTURED DATA (JSON-LD) ────────────────────────────────────────────────
function StructuredData() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "NGO", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "Ngogbehei Cancer Center",
    alternateName: "NCC",
    description:
      "Ngogbehei Cancer Center is Nigeria's leading cancer foundation, delivering world-class screening, treatment, and patient support programs across Abuja and beyond.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo/ngogbehei-logo.svg`,
      width: 280,
      height: 80,
    },
    image: `${SITE_URL}/images/og/default-og-image.jpg`,
    foundingDate: "2010",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 123, Cadastral Zone, Wuse 2",
      addressLocality: "Abuja",
      addressRegion: "FCT",
      postalCode: "900288",
      addressCountry: "NG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+234-800-NCC-CARE",
        contactType: "customer service",
        areaServed: "NG",
        availableLanguage: ["English"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        telephone: "+234-800-123-4567",
        contactType: "emergency",
        areaServed: "NG",
        availableLanguage: ["English"],
      },
    ],
    email: "info@ngogbeheicc.org",
    sameAs: [
      "https://twitter.com/NgogbeheiCC",
      "https://facebook.com/NgogbeheiCC",
      "https://instagram.com/NgogbeheiCC",
      "https://linkedin.com/company/ngogbehei-cancer-center",
      "https://youtube.com/@NgogbeheiCC",
    ],
    medicalSpecialty: [
      "Oncology",
      "Hematology",
      "Pathology",
      "Radiology",
      "Palliative Medicine",
    ],
    nonprofitStatus: "Nonprofit501c3",
    legalName: "Ngogbehei Cancer Center",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Ngogbehei Cancer Center",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-NG",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

// ─── ROOT LAYOUT ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html
      lang="en-NG"
      dir="ltr"
      className={`${montserrat.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* ── Preconnect to critical origins ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ── DNS Prefetch ── */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ── Theme Color ── */}
        <meta name="theme-color" content="#0A2240" />
        <meta name="msapplication-TileColor" content="#0A2240" />

        {/* ── Geo Tags ── */}
        <meta name="geo.region" content="NG-FC" />
        <meta name="geo.placename" content="Abuja, FCT, Nigeria" />
        <meta name="geo.position" content="9.0579;7.4951" />
        <meta name="ICBM" content="9.0579, 7.4951" />

        {/* ── Structured Data ── */}
        <StructuredData />
      </head>

      <body
        suppressHydrationWarning
        className={`
          ${montserrat.className}
          antialiased
          bg-white
          text-[#0A2240]
          min-h-screen
          flex
          flex-col
          overflow-x-hidden
          selection:bg-[#C8962E]
          selection:text-white
        `}
      >
        {/* ── Toast Notifications ── */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 90,
            right: 20,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontSize: "14.5px",
              fontWeight: "500",
              color: "#0A2240",
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "12px 16px",
              boxShadow:
                "0 10px 15px rgba(10,34,64,0.1), 0 4px 6px rgba(10,34,64,0.05)",
              maxWidth: "380px",
            },
            success: {
              iconTheme: {
                primary: "#059669",
                secondary: "#FFFFFF",
              },
              style: {
                borderLeft: "4px solid #059669",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#FFFFFF",
              },
              style: {
                borderLeft: "4px solid #DC2626",
              },
            },
            loading: {
              iconTheme: {
                primary: "#C8962E",
                secondary: "#FFFFFF",
              },
              style: {
                borderLeft: "4px solid #C8962E",
              },
            },
          }}
        />

        {/* ── App Context + Page Content ── */}
        <AppContextProvider>
          <Navbar />
          {children}
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  );
}
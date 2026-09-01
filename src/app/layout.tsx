import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/sites/awrs-me-f38a6f68/shared/SmoothScrollProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollProgress } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ScrollProgress";
import { OG_IMAGE, SITE, SITE_URL } from "@/lib/site";
import {
  graph,
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/structured-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Makes every relative URL below (canonicals, OG images) resolve to the
  // canonical origin instead of the deploy's own hostname.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} | ${SITE.jobTitle}`,
    // Pages set a short title; the site name is appended here so every tab and
    // SERP entry is unique but consistently branded.
    template: `%s | ${SITE.name}`,
  },
  description:
    "Portfolio of Lander Cuypers, a full-stack developer based in Belgium, building web applications front to back.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "Lander Cuypers",
    "full-stack developer",
    "web developer Belgium",
    "portfolio",
  ],
  // No canonical here on purpose: an inherited canonical would silently point
  // every future page at "/". Each page declares its own.
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE.name} | ${SITE.jobTitle}`,
    description: "Projects, experience and contact details for Lander Cuypers, a full-stack developer based in Belgium.",
    images: [{ ...OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.jobTitle}`,
    description: "Projects, experience and contact details for Lander Cuypers, a full-stack developer based in Belgium.",
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Scroll reveals hide their content until JavaScript observes them.
            Without JS there is no observer, so the hidden state is lifted. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;translate:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        {/* Site-wide entities. Page-level nodes reference these by @id. */}
        <JsonLd
          data={graph(personSchema(), websiteSchema(), professionalServiceSchema())}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

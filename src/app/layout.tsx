import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/sites/awrs-me-f38a6f68/shared/SmoothScrollProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { ChatWidget } from "@/components/sites/awrs-me-f38a6f68/en-7a4ba3ba/ChatWidget";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline theme script below sets .dark on
    // this element before React hydrates, so its class list intentionally
    // differs from what the server rendered.
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before the first paint. In a component this
            would run after hydration, and the page would flash white on its way
            to dark. Falls back to the visitor's system preference. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        {/* Scroll reveals hide their content until JavaScript observes them.
            Without JS there is no observer, so the hidden state is lifted. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;translate:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        <ChatWidget />
        {/* Site-wide entities. Page-level nodes reference these by @id. */}
        <JsonLd
          data={graph(personSchema(), websiteSchema(), professionalServiceSchema())}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

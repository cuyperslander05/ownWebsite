import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/sites/awrs-me-f38a6f68/shared/SmoothScrollProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdulwahed Aldaghir | Portfolio",
  description:
    "Official portfolio of Abdulwahed Aldaghir (Abdulwahed Rifaat), a Software Engineer & Full-Stack Mobile Developer based in Oman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

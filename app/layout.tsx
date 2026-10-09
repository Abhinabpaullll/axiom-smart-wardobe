import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import Navigation from "@/components/Navigation";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axiom Smart Wardrobe | The Machined Monolith",
  description:
    "AI-powered outfit generation from your RFID-tagged wardrobe. Project Ref: 11456649540610009134. Machined titanium precision meets personal style.",
  keywords: [
    "Axiom",
    "Smart Wardrobe",
    "RFID Wardrobe",
    "AI Stylist",
    "Machined Monolith",
    "Virtual Mirror",
    "Biometric Try-On",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <body className="relative min-h-dvh bg-[#0A0A0A] text-[#E7E5E4] font-sans selection:bg-amber selection:text-black">
        <SmoothScrollProvider>
          <Navigation />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

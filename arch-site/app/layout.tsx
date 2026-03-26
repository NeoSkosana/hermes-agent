import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Hermes Agent | Architecture Overview",
  description:
    "A sophisticated self-improving AI agent by Nous Research. Explore the complete architecture with 40+ tools, 13 messaging platforms, and advanced RL training integration.",
  keywords: [
    "AI Agent",
    "Hermes",
    "Nous Research",
    "Tool Calling",
    "LLM",
    "Architecture",
  ],
  authors: [{ name: "Nous Research" }],
  openGraph: {
    title: "Hermes Agent Architecture",
    description: "Self-improving AI agent with 40+ tools and 13 platforms",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

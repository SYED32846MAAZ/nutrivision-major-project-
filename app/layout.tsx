import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ResultProvider } from "./context/ResultContext";
import { NextAuthProvider } from "./components/NextAuthProvider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriVision | AI Neural Food Intelligence",
  description: "Advanced neural computer vision to decode every calorie, micro-nutrient, and long-term health risk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ResultProvider>
            <Navbar />
            {children}
          </ResultProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

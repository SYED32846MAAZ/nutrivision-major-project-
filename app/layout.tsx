import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ResultProvider } from "./context/ResultContext";
import { NextAuthProvider } from "./components/NextAuthProvider";
import Navbar from "./components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balanced Bites | AI Neural Food Intelligence",
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
        className={`${outfit.variable} ${spaceGrotesk.variable} antialiased font-sans`}
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


import { Outfit, Space_Grotesk } from "next-auth/next/font/google"; // Using next/font/google
import { Outfit as OutfitFont, Space_Grotesk as SpaceFont } from "next/font/google";
import "./globals.css";
import { ResultProvider } from "./context/ResultContext";
import { NextAuthProvider } from "./components/NextAuthProvider";
import Navbar from "./components/Navbar";

const outfit = OutfitFont({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = SpaceFont({
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

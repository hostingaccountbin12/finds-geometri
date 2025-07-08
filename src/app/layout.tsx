import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { GameProvider } from "@/context/GameContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const bernoru = localFont({
  src: "./fonts/Bernoru.otf",
  variable: "--font-bernoru",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Find Geometri",
  description: "Game Find Geometri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bernoru.variable} antialiased`}
      >
        <GameProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </GameProvider>
      </body>
    </html>
  );
}

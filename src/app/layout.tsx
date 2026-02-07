import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catering Tanne – Asiatisk meny",
  description: "Asiatisk meny med bilder. Klicka på en bild för att förstora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#12110D] antialiased text-[#E5E7E3]`}>
        {children}
      </body>
    </html>
  );
}

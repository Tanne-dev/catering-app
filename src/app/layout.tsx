import type { Metadata } from "next";
import { Lato, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import BackgroundMusic from "@/components/BackgroundMusic";
import ScrollToQuoteOnHash from "@/components/ScrollToQuoteOnHash";
import ServiceDetailPanel from "@/components/ServiceDetailPanel";
import SessionProvider from "@/components/SessionProvider";
import { SelectedMenuProvider } from "@/contexts/SelectedMenuContext";
import { SelectedServiceProvider } from "@/contexts/SelectedServiceContext";
import { CartProvider } from "@/contexts/CartContext";
import { SITE } from "@/data/site";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.defaultDescription,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${lato.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>
        <JsonLd />
        <SessionProvider>
        <SelectedMenuProvider>
          <CartProvider>
          <SelectedServiceProvider>
            <a
              href="#services"
              className="fixed left-2 top-2 z-[100] rounded-lg bg-[#EAC84E] px-3 py-2 text-xs font-semibold text-[#12110D] opacity-0 shadow-lg transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white sm:left-4 sm:top-4 sm:px-4 sm:text-sm"
            >
              Hoppa till innehåll
            </a>
            <Header />
            <ScrollToQuoteOnHash />
            <ServiceDetailPanel />
            {children}
            <ScrollToTop />
            <BackgroundMusic />
            <ChatWidget />
          </SelectedServiceProvider>
          </CartProvider>
        </SelectedMenuProvider>
        </SessionProvider>
        </div>
      </body>
    </html>
  );
}

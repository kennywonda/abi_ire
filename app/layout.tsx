/**
 * Root Layout
 * 
 * Main application layout wrapping all pages.
 * Sets up global providers, fonts, metadata, and persistent UI elements.
 * 
 * Features:
 * - Custom Google Fonts (Geist Sans, Geist Mono)
 * - SessionProvider for NextAuth authentication
 * - CartSidebar for global cart access
 * - Toaster for toast notifications
 * - Global CSS styles
 * - SEO metadata (title, description)
 * - HTML lang attribute for accessibility
 * 
 * @layout
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abi Ire - Bespoke Fashion Design",
  description: "Bith of goodness, quality fashion designs from Abi Ire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
          <CartSidebar />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}

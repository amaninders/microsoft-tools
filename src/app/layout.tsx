import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  adjustFontFallback: false  // Add this line
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  adjustFontFallback: false  // Add this line
});

export const metadata: Metadata = {
  title: "Microsoft 365 Tools",
  description: "Microsoft 365 Tools is a collection of tools to help you manage your Microsoft 365 tenant.",
  metadataBase: new URL('https://www.amaninder.com/microsoft-tools'),  // Replace with your domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

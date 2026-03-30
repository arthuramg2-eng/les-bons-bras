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
  title: {
    template: '%s — Les Bons Bras',
    default: 'Les Bons Bras — Trouvez votre pro de renovation a Montreal',
  },
  description: 'Marketplace quebecoise de professionnels de renovation verifies. Plombiers, electriciens, architectes et plus dans le Grand Montreal.',
  openGraph: {
    siteName: 'Les Bons Bras',
    locale: 'fr_CA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const title = "Cairn — Débriefer nos sorties en montagne";
const description =
  "Une application simple, collective et open source, pour capitaliser sur chaque sortie en montagne.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cairn.lat"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://cairn.lat",
    siteName: "Cairn",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.tagline,
  metadataBase: new URL("https://tanisha-portfolio.vercel.app"),
  openGraph: {
    title: site.title,
    description: site.tagline,
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
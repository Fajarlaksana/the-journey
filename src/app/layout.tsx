import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TheJourney – Automotive Modification Media",
    template: "%s | TheJourney",
  },
  description: "Discover the world's most inspiring modified cars from automotive events. Explore JDM builds, stance cars, track builds, drift machines, and show cars.",
  keywords: ["modified cars", "automotive", "JDM", "stance", "drift", "track build", "car modification", "auto show"],
  authors: [{ name: "TheJourney" }],
  creator: "TheJourney",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thejourney.com",
    siteName: "TheJourney",
    title: "TheJourney – Automotive Modification Media",
    description: "Discover the world's most inspiring modified cars from automotive events.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheJourney – Automotive Modification Media",
    description: "Discover the world's most inspiring modified cars from automotive events.",
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
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className={`${inter.className} ${oswald.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

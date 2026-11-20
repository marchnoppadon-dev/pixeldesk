import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const GA_ID = "G-PS2VDBXPG5";

// Brand profiles: add each social profile here as it is created (Facebook, X, Threads,
// TikTok, Pinterest, Letterboxd...). Google uses sameAs to tie them to this site.
const SAME_AS = ["https://github.com/marchnoppadon-dev/pixeldesk"];

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pixeldeskth.com/#org",
      name: "pixeldesk",
      alternateName: "pixeldeskth",
      url: "https://pixeldeskth.com",
      logo: "https://pixeldeskth.com/logo.png",
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": "https://pixeldeskth.com/#website",
      url: "https://pixeldeskth.com",
      name: "pixeldesk",
      inLanguage: "th",
      publisher: { "@id": "https://pixeldeskth.com/#org" },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pixeldeskth.com"),
  title: {
    default: "pixeldeskth — แนะนำหนัง Netflix ดูอะไรดี",
    template: "%s | pixeldeskth",
  },
  description:
    "แนะนำหนัง Netflix ดูอะไรดี รีวิวหนังพร้อมเช็คว่าดูได้ที่ไหนบ้าง อัปเดตทุกวัน",
  keywords: [
    "แนะนำหนัง Netflix",
    "ดูหนัง Netflix อะไรดี",
    "รีวิวหนัง สปอยล์",
    "หนังเรื่องนี้ดูได้ที่ไหน",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "pixeldeskth",
    title: "pixeldeskth — รีวิวหนัง ดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV",
    description:
      "รีวิวหนังภาษาไทยตรงประเด็น พร้อมเช็คว่าดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV และแพลตฟอร์มอื่น",
    // TODO: เปลี่ยนเป็น banner 1200x630 เมื่อมีไฟล์จริง
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "pixeldeskth — รีวิวหนัง ดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV",
    description:
      "รีวิวหนังภาษาไทยตรงประเด็น พร้อมเช็คว่าดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV และแพลตฟอร์มอื่น",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Script
          src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
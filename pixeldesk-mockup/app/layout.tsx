import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixeldeskth.com"),
  title: {
    default: "pixeldeskth — รีวิวหนัง ดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV",
    template: "%s | pixeldeskth",
  },
  description:
    "รีวิวหนังภาษาไทยตรงประเด็น พร้อมเช็คว่าดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV และแพลตฟอร์มอื่น อัปเดตทุกวัน",
  keywords: [
    "รีวิวหนัง",
    "หนังออนไลน์",
    "ดูหนังที่ไหน",
    "Netflix หนังน่าดู",
    "Viu หนัง",
    "HBO Max หนัง",
    "Apple TV หนัง",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "pixeldeskth",
    title: "pixeldeskth — รีวิวหนัง ดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV",
    description:
      "รีวิวหนังภาษาไทยตรงประเด็น พร้อมเช็คว่าดูได้ที่ไหนบ้าง Netflix, Viu, HBO Max, Apple TV และแพลตฟอร์มอื่น",
    // TODO: เพิ่ม images: ["/og-default.png"] ตอนมีไฟล์ banner/โลโก้จริงแล้ว
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
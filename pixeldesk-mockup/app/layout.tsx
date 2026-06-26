import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixeldesk.example.com"),
  title: {
    default: "PixelDesk — ของแต่งโต๊ะเกมมิ่ง/สตรีมมิ่ง โดยดำเกิง",
    template: "%s | PixelDesk",
  },
  description: "ดำเกิงเลือกของแต่งโต๊ะเกมมิ่งและสตรีมมิ่งงบจำกัดมาให้แล้ว รีวิวจริง ราคาจริง อัปเดตทุกเดือน",
  keywords: [
    "ของแต่งโต๊ะคอม",
    "ของแต่งโต๊ะเกมมิ่ง",
    "ไฟแต่งห้อง",
    "gadget แต่งโต๊ะ",
    "จัดโต๊ะคอม งบน้อย",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "PixelDesk",
    title: "PixelDesk — ของแต่งโต๊ะเกมมิ่ง/สตรีมมิ่ง โดยดำเกิง",
    description: "ดำเกิงเลือกของแต่งโต๊ะเกมมิ่งและสตรีมมิ่งงบจำกัดมาให้แล้ว",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelDesk — ของแต่งโต๊ะเกมมิ่ง/สตรีมมิ่ง โดยดำเกิง",
    description: "ดำเกิงเลือกของแต่งโต๊ะเกมมิ่งและสตรีมมิ่งงบจำกัดมาให้แล้ว",
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

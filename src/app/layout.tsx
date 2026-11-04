import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CrosshairCursor from "@/components/cursor/CrosshairCursor";
import Hotjar from "@/components/analytics/Hotjar";
import { SITE } from "@/lib/site";
import { ZOOM_SCRIPT } from "@/lib/zoom";

// 폰트는 모두 self-host (학교망·CI에서 Google Fonts 접속 실패 방지)
const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${SITE.title} | ${SITE.fullTitle}`, template: `%s | ${SITE.title}` },
  description: `${SITE.fullTitle} — ${SITE.period}, ${SITE.place}`,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.title,
    // TODO: public/og.png (1200×630) 추가
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jakarta.variable} ${pretendard.variable}`} suppressHydrationWarning>
      <head>
        {/* 노트북 폭에서 1920 시안 비율로 축소 — 첫 페인트 전에 (lib/zoom.ts). html style 이 서버와 달라져 suppressHydrationWarning */}
        <script dangerouslySetInnerHTML={{ __html: ZOOM_SCRIPT }} />
      </head>
      <body className="min-h-(--svh)">
        <SmoothScroll>{children}</SmoothScroll>
        <CrosshairCursor />
        <Hotjar />
      </body>
    </html>
  );
}

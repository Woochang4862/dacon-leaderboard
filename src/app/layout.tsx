import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Dacon Leaderboard Viewer",
  description:
    "Dacon 리더보드 결과를 실시간으로 확인하고 필터링할 수 있는 Next.js 기반 대시보드"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background-light text-slate-900 antialiased transition-colors duration-500 ease-out dark:bg-background-dark dark:text-slate-100`}
      >
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.08),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.22),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.18),transparent_55%)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white dark:from-slate-950/80 dark:via-slate-950/90 dark:to-slate-950/95" />
            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}


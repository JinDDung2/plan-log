import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Timeboxing Planner",
  description: "개인용 데일리 타임박싱 플래너 (planlog)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIFIX Enterprise ESG Portal",
  description: "ESG 관계사 조회 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}


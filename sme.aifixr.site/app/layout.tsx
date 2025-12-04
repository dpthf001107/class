import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIFIX ESG Platform SME",
  description: "AIFIX ESG Platform for Small and Medium Enterprises",
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


import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIFIX ESG Platform Landing Page",
  description: "AIFIX ESG Platform Landing Page",
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


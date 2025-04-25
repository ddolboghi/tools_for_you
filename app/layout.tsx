import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GoogleAdsense from "../components/GoogleAdSense";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "ABT TOOL",
  description: "판촉 ABT 근무자의 칼퇴근을 위해!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAdsense />
      </head>
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}

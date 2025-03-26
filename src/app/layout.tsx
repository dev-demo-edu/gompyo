import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Navbar from "@/containers/navbar";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gompyo",
  description: "Gompyo Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSans.variable} antialiased flex`}>
        <ThemeRegistry>
          <Navbar />
          <main className="flex-1">{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}

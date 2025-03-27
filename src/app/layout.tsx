import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Navbar from "@/containers/navbar";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gompyo",
  description: "Gompyo Dashboard",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body
        className={`${notoSans.variable} antialiased flex flex-col sm:flex-row min-h-screen`}
      >
        <ThemeRegistry>
          <Navbar />
          <main className="flex-1 w-full min-h-screen bg-gray-50 pt-16 sm:pt-0 sm:pl-0 overflow-x-hidden">
            <div className="container-fluid h-full">{children}</div>
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { LayoutWrapper } from "@/containers/LayoutWrapper";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
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
    <html lang="ko" className="h-full">
      <body
        className={`${notoSans.variable} antialiased flex flex-col sm:flex-row min-h-screen`}
      >
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

"use client";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/styles/theme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

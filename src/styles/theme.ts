import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#22C55E", // green-500
      light: "#DCFCE7", // green-100
      dark: "#16A34A", // green-600
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#64748B", // slate-500
      light: "#94A3B8", // slate-400
      dark: "#475569", // slate-600
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

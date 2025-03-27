import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
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
    background: {
      default: "#F9FAFB", // gray-50
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937", // gray-800
      secondary: "#4B5563", // gray-600
    },
    divider: "#E5E7EB", // gray-200
  },
  typography: {
    fontFamily: "var(--font-noto-sans), Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.2,
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      "@media (min-width:600px)": {
        fontSize: "1.75rem",
      },
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          fontWeight: 500,
        },
        sizeSmall: {
          padding: "6px 12px",
        },
        sizeLarge: {
          padding: "10px 20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: "8px 16px",
          borderRadius: "8px",
          margin: "4px 8px",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "40px",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

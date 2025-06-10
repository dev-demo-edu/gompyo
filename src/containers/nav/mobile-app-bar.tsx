import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

interface MobileAppBarProps {
  onMenuClick: () => void;
  isDrawerOpen: boolean;
  isSidebarCollapsed: boolean;
  drawerWidth: number;
  collapsedWidth: number;
  zIndex: number;
}

export default function MobileAppBar({
  onMenuClick,
  isDrawerOpen,
  isSidebarCollapsed,
  drawerWidth,
  collapsedWidth,
  zIndex,
}: MobileAppBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:640px)");

  const currentDrawerWidth = isDrawerOpen
    ? isSidebarCollapsed
      ? collapsedWidth
      : drawerWidth
    : 0;

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        marginLeft: isMobile ? 0 : `${currentDrawerWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${currentDrawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin-left"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex,
        height: "64px",
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px" }}>
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {isMobile && (
            <Image
              src="/gompyo.svg"
              alt="Logo"
              width={100}
              height={22}
              priority
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

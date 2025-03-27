import { AppBar, IconButton, Toolbar } from "@mui/material";
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
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        marginLeft: {
          sm: isDrawerOpen
            ? isSidebarCollapsed
              ? collapsedWidth
              : drawerWidth
            : 0,
        },
        width: {
          xs: "100%",
          sm: `calc(100% - ${
            isDrawerOpen
              ? isSidebarCollapsed
                ? collapsedWidth
                : drawerWidth
              : 0
          }px)`,
        },
        zIndex,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <div className="ml-4">
          <Image src="/logo.png" alt="Logo" width={100} height={22} priority />
        </div>
      </Toolbar>
    </AppBar>
  );
}

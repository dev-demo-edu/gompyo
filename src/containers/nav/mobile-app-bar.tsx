import { AppBar, IconButton, Toolbar, Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

interface MobileAppBarProps {
  onMenuClick: () => void;
  zIndex: number;
}

export default function MobileAppBar({
  onMenuClick,
  zIndex,
}: MobileAppBarProps) {
  const isMobile = useMediaQuery("(max-width:640px)");

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        width: "100%",
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
            aria-label="open menu"
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

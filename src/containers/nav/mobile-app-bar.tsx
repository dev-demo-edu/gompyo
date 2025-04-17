import {
  AppBar,
  IconButton,
  Toolbar,
  Badge,
  Avatar,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
              src="/logo.png"
              alt="Logo"
              width={100}
              height={22}
              priority
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="알림">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={3} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="프로필">
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

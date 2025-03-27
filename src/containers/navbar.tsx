"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Drawer, List, useMediaQuery, useTheme, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ScienceIcon from "@mui/icons-material/Science";
import NavigationItem from "./nav/navigation-item";
import SidebarHeader from "./nav/sidebar-header";
import MobileAppBar from "./nav/mobile-app-bar";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export default function Navbar() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setIsMobileDrawerOpen(!isMobileDrawerOpen);
      setIsSidebarCollapsed(false);
    } else {
      setIsDesktopDrawerOpen(!isDesktopDrawerOpen);
    }
  };

  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navigationItems = [
    { text: "대시보드", href: "/", icon: <DashboardIcon /> },
    { text: "계획 관리", href: "/plan", icon: <ScheduleIcon /> },
    { text: "선적 관리", href: "/shipment", icon: <LocalShippingIcon /> },
    { text: "테스트", href: "/test", icon: <ScienceIcon /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <SidebarHeader
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onToggleCollapse={handleSidebarCollapse}
      />
      <List className="flex-grow">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isActive={pathname === item.href}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
          />
        ))}
      </List>
    </div>
  );

  return (
    <>
      {isMobile && (
        <MobileAppBar
          onMenuClick={handleDrawerToggle}
          isDrawerOpen={isDesktopDrawerOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          zIndex={theme.zIndex.drawer - 1}
        />
      )}
      <Box
        component="nav"
        sx={{
          width: {
            sm: isDesktopDrawerOpen
              ? isSidebarCollapsed
                ? COLLAPSED_WIDTH
                : DRAWER_WIDTH
              : 0,
          },
          flexShrink: { sm: 0 },
          zIndex: theme.zIndex.drawer,
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? isMobileDrawerOpen : isDesktopDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              width: isSidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              boxSizing: "border-box",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {sidebarContent}
        </Drawer>
      </Box>
    </>
  );
}

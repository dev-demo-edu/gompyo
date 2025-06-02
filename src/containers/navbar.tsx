"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Drawer,
  List,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigationItem from "./nav/navigation-item";
import SidebarHeader from "./nav/sidebar-header";
import MobileAppBar from "./nav/mobile-app-bar";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import SavingsIcon from "@mui/icons-material/Savings";
import AssignmentIcon from "@mui/icons-material/Assignment";
// import PeopleIcon from "@mui/icons-material/People";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export default function Navbar() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:640px)");
  const isTablet = useMediaQuery("(min-width:641px) and (max-width:900px)");
  const pathname = usePathname();

  // Auto-collapse sidebar on tablet view
  useEffect(() => {
    if (isTablet && !isMobile) {
      setIsSidebarCollapsed(true);
    } else if (!isTablet) {
      setIsSidebarCollapsed(true);
    }
  }, [isTablet, isMobile]);

  // Close mobile drawer when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileDrawerOpen(false);
    }
  }, [pathname, isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setIsMobileDrawerOpen(!isMobileDrawerOpen);
    } else {
      setIsDesktopDrawerOpen(!isDesktopDrawerOpen);
    }
  };

  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navigationItems = [
    {
      text: "대시보드",
      href: "/",
      icon: <DashboardIcon />,
    },
    {
      text: "계획 관리",
      href: "/plan",
      icon: <ScheduleIcon />,
    },
    {
      text: "선적 관리",
      href: "/shipment",
      icon: <LocalShippingIcon />,
    },
    {
      text: "수금 지출 관리",
      href: "/cashflow",
      icon: <SavingsIcon />,
    },
    {
      text: "견적 관리",
      href: "/quotation",
      icon: <AssignmentIcon />,
    },
    // {
    //   text: "거래처 관리",
    //   href: "/partner",
    //   icon: <PeopleIcon />,
    // },
    {
      text: "정보",
      href: "/info",
      icon: <InfoIcon />,
      subItems: [
        {
          text: "계좌 번호",
          href: "/info/account-number",
          icon: <AccountBalanceIcon />,
        },
        {
          text: "사업자 번호",
          href: "/info/business-number",
          icon: <BusinessIcon />,
        },
        {
          text: "링크 모음",
          href: "/info/links",
          icon: <LinkIcon />,
        },
      ],
    },
  ];

  const isActive = (item: { href: string }) => {
    return pathname === item.href;
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <SidebarHeader
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onToggleCollapse={handleSidebarCollapse}
      />
      <Divider className="my-2" />
      <List className="flex-grow py-2 px-1">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isActive={isActive(item)}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
            subItems={item.subItems}
          />
        ))}
      </List>
      <Divider className="my-2" />
      <div className="p-3 flex justify-center items-center">
        {!isSidebarCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            <p>Gompyo Dashboard v0.1.0</p>
            <p> 2025 Gompyo</p>
          </div>
        ) : (
          <Tooltip title="Gompyo Dashboard v0.1.0" placement="right">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-xs text-gray-500">G</span>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );

  // Floating collapse button for desktop
  const collapseButton = !isMobile && isDesktopDrawerOpen && (
    <IconButton
      onClick={handleSidebarCollapse}
      size="small"
      className="absolute -right-3 top-20 bg-white shadow-md border border-gray-200 z-10"
      sx={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: { xs: "none", sm: "flex" },
      }}
    >
      {isSidebarCollapsed ? (
        <MenuOpenIcon fontSize="small" />
      ) : (
        <ChevronLeftIcon fontSize="small" />
      )}
    </IconButton>
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
          position: "relative",
        }}
      >
        {collapseButton}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? isMobileDrawerOpen : isDesktopDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              width: isSidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              boxSizing: "border-box",
              transition: theme.transitions.create(
                ["width", "visibility", "overflow"],
                {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                },
              ),
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

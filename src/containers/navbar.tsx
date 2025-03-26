"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ScienceIcon from "@mui/icons-material/Science";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "대시보드", href: "/", icon: <DashboardIcon /> },
    { text: "계획 관리", href: "/plan", icon: <ScheduleIcon /> },
    { text: "선적 관리", href: "/shipment", icon: <LocalShippingIcon /> },
    { text: "테스트", href: "/test", icon: <ScienceIcon /> },
  ];

  const drawer = (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={27} priority />
        </Link>
      </div>
      <List className="flex-grow">
        {menuItems.map((item) => (
          <ListItem
            key={item.href}
            component={Link}
            href={item.href}
            className={`hover:bg-primary-100 transition-colors ${
              pathname === item.href
                ? "bg-primary-100 text-primary-900 font-bold"
                : ""
            }`}
          >
            <ListItemIcon
              className={pathname === item.href ? "text-primary-900" : ""}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {isMobile && (
        <AppBar position="fixed" color="default" elevation={1}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <div className="ml-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={22}
                priority
              />
            </div>
          </Toolbar>
        </AppBar>
      )}
      <nav className={isMobile ? "mt-16" : ""}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? handleDrawerToggle : undefined}
          className="w-64"
          classes={{
            paper: "w-64",
          }}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}

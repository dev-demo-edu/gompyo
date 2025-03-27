import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import Link from "next/link";
import React from "react";

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
  isMobile: boolean;
}

export default function NavigationItem({
  href,
  icon,
  text,
  isActive,
  isSidebarCollapsed,
  isMobile,
}: NavigationItemProps) {
  return (
    <Tooltip title={isSidebarCollapsed ? text : ""} placement="right">
      <ListItem
        component={Link}
        href={href}
        className={`hover:bg-primary-100 transition-colors ${
          isActive ? "bg-primary-100 text-primary-900 font-bold" : ""
        }`}
      >
        <ListItemIcon className={isActive ? "text-primary-900" : ""}>
          {icon}
        </ListItemIcon>
        {(isMobile || !isSidebarCollapsed) && <ListItemText primary={text} />}
      </ListItem>
    </Tooltip>
  );
}

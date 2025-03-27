import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from "@mui/material";
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
    <Tooltip title={isSidebarCollapsed ? text : ""} placement="right" arrow>
      <ListItem
        component={Link}
        href={href}
        className={`my-1 rounded-lg transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-primary-100 text-primary-900 font-medium"
            : "hover:bg-gray-100"
        }`}
        sx={{
          minHeight: "48px",
          px: 2.5,
          justifyContent: isSidebarCollapsed ? "center" : "flex-start",
          "&:hover": {
            "& .MuiListItemIcon-root": {
              color: isActive ? "inherit" : "primary.main",
            },
          },
        }}
      >
        <ListItemIcon
          className={`min-w-8 ${isActive ? "text-primary-900" : "text-gray-700"}`}
          sx={{
            minWidth: 0,
            mr: isSidebarCollapsed ? 0 : 2,
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        {(isMobile || !isSidebarCollapsed) && (
          <ListItemText
            primary={text}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              lineHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
        )}
        {isActive && !isSidebarCollapsed && (
          <Box
            sx={{
              width: 4,
              height: 32,
              bgcolor: "primary.main",
              position: "absolute",
              right: 0,
              borderRadius: "4px 0 0 4px",
            }}
          />
        )}
      </ListItem>
    </Tooltip>
  );
}

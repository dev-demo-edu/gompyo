import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Collapse,
  List,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { usePathname } from "next/navigation";

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
  isMobile: boolean;
  subItems?: {
    text: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export default function NavigationItem({
  href,
  icon,
  text,
  isActive,
  isSidebarCollapsed,
  isMobile,
  subItems,
}: NavigationItemProps) {
  const pathname = usePathname();
  const isSubActive = subItems?.some((sub) => pathname === sub.href) ?? false;
  const [open, setOpen] = useState(isSubActive);

  useEffect(() => {
    if (isSubActive) setOpen(true);
  }, [pathname, isSubActive]);

  const handleClick = (e: React.MouseEvent) => {
    if (subItems) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <li className="block">
      <Tooltip title={isSidebarCollapsed ? text : ""} placement="right" arrow>
        <ListItem
          component={Link}
          href={href}
          onClick={handleClick}
          className={`my-1 mx-3 rounded-lg transition-all duration-200 ease-in-out ${
            isActive
              ? "bg-primary-100 text-primary-900 font-medium"
              : "hover:bg-gray-100"
          }`}
          sx={{
            minHeight: "48px",
            px: 2,
            width: "auto",
            position: "relative",
            justifyContent: isSidebarCollapsed ? "center" : "flex-start",
            "&:hover": {
              "& .MuiListItemIcon-root": {
                color: isActive ? "inherit" : "text-primary-900",
              },
            },
          }}
        >
          <ListItemIcon
            className={`min-w-8 ${isActive ? "text-primary-900" : "text-gray-700"}`}
            sx={{
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
          {subItems &&
            !isSidebarCollapsed &&
            (open ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            ))}
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
      {/* 사이드바가 줄어든 상태에서는 서브아이템 드롭다운을 렌더링하지 않음 */}
      {subItems && !isSidebarCollapsed && (
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}
        >
          <List
            component="div"
            disablePadding
            sx={{ width: "100%", minWidth: 0 }}
          >
            {subItems.map((sub) => {
              const isSubItemActive = pathname === sub.href;
              return (
                <ListItem
                  key={sub.href}
                  component={Link}
                  href={sub.href}
                  sx={{
                    minHeight: "48px",
                    px: 2,
                    pl: 2,
                    width: "auto",
                    position: "relative",
                    justifyContent: "flex-start",
                    borderRadius: "12px",
                    marginY: "4px",
                    marginX: "12px",
                    marginLeft: "24px",
                  }}
                  className={`transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                    isSubItemActive
                      ? "bg-primary-100 text-primary-900 font-medium"
                      : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      mr: 2,
                      justifyContent: "center",
                      color: isSubItemActive
                        ? "primary.main"
                        : "text.secondary",
                    }}
                  >
                    {sub.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.text}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                    sx={{ minWidth: 0 }}
                  />
                  {isSubItemActive && (
                    <Box
                      sx={{
                        width: 4,
                        height: 32,
                        bgcolor: "primary.main",
                        position: "absolute",
                        right: 0,
                        borderRadius: "4px 0 0 4px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </li>
  );
}

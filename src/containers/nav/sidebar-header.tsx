import { IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface SidebarHeaderProps {
  isSidebarCollapsed: boolean;
  isMobile: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarHeader({
  isSidebarCollapsed,
  isMobile,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div
      className={`p-6 border-b border-gray-200 ${
        isSidebarCollapsed ? "flex justify-center" : "flex justify-between"
      } items-center`}
    >
      {!isSidebarCollapsed && (
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={27} priority />
        </Link>
      )}
      {!isMobile && (
        <IconButton onClick={onToggleCollapse} size="small">
          {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      )}
    </div>
  );
}

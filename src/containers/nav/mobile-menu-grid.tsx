import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SavingsIcon from "@mui/icons-material/Savings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";

interface MobileMenuGridProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  text: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
}

export default function MobileMenuGrid({ open, onClose }: MobileMenuGridProps) {
  const router = useRouter();

  const mainMenuItems: MenuItem[] = [
    {
      text: "대시보드",
      href: "/",
      icon: <DashboardIcon />,
      color: "#22C55E", // Blue
    },
    {
      text: "계획 관리",
      href: "/plan",
      icon: <ScheduleIcon />,
      color: "#22C55E",
    },
    {
      text: "선적 관리",
      href: "/shipment",
      icon: <LocalShippingIcon />,
      color: "#22C55E",
    },
    {
      text: "수금 지출",
      href: "/cashflow",
      icon: <SavingsIcon />,
      color: "#22C55E",
    },
    {
      text: "견적 관리",
      href: "/quotation",
      icon: <AssignmentIcon />,
      color: "#22C55E",
    },
    {
      text: "거래처 관리",
      href: "/partner",
      icon: <PeopleIcon />,
      color: "#22C55E",
    },
    {
      text: "계좌 번호",
      href: "/info/account-number",
      icon: <AccountBalanceIcon />,
      color: "#22C55E", // Red
    },
    {
      text: "사업자 번호",
      href: "/info/business-number",
      icon: <BusinessIcon />,
      color: "#22C55E",
    },
    {
      text: "링크 모음",
      href: "/info/links",
      icon: <LinkIcon />,
      color: "#22C55E",
    },
  ];

  const handleItemClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header with close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            메뉴
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Grid Menu Items */}
        <Box
          sx={{
            flex: 1,
            padding: "24px 16px",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Grid container spacing={2} sx={{ maxWidth: "100%" }}>
            {mainMenuItems.map((item, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  onClick={() => handleItemClick(item.href)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "12px 8px",
                    borderRadius: "12px",
                    backgroundColor: item.color || "#4285f4",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    minHeight: "80px",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "24px",
                      marginBottom: "6px",
                      "& svg": {
                        fontSize: "24px",
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    textAlign="center"
                    sx={{
                      fontSize: "11px",
                      lineHeight: "14px",
                      wordBreak: "keep-all",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            padding: "16px 20px",
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Gompyo Dashboard v0.1.0 © 2025 Gompyo
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

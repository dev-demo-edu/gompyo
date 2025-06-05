import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

export type ButtonVariant =
  | "primary" // 초록색 - 주요 액션 (추가, 완료)
  | "secondary" // 회색 - 중성적 액션 (편집 모드)
  | "danger" // 빨간색 - 삭제, 위험한 액션
  | "info" // 파란색 - 정보성 액션 (품목 관련)
  | "special" // 보라색 - 특별한 액션 (견적서 작성)
  | "outline" // 기본 아웃라인
  | "outline-danger"; // 빨간색 아웃라인 (편집 취소)

interface CommonButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: ButtonVariant;
  children: ReactNode;
  minWidth?: number;
}

const getButtonStyles = (variant: ButtonVariant = "primary") => {
  const baseStyles = {
    fontWeight: 600,
    boxShadow: "none",
    "&:disabled": {
      backgroundColor: "#9CA3AF",
      color: "#FFFFFF",
    },
  };

  switch (variant) {
    case "primary":
      return {
        ...baseStyles,
        backgroundColor: "#22C55E",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#16A34A",
        },
      };

    case "secondary":
      return {
        ...baseStyles,
        backgroundColor: "#64748b",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#475569",
        },
      };

    case "danger":
      return {
        ...baseStyles,
        backgroundColor: "#EF4444",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#DC2626",
        },
      };

    case "info":
      return {
        ...baseStyles,
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#2563EB",
        },
      };

    case "special":
      return {
        ...baseStyles,
        backgroundColor: "#6366F1",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#4F46E5",
        },
      };

    case "outline":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        borderColor: "#D1D5DB",
        color: "#374151",
        "&:hover": {
          backgroundColor: "#F9FAFB",
          borderColor: "#9CA3AF",
        },
        "&:disabled": {
          backgroundColor: "transparent",
          borderColor: "#9CA3AF",
          color: "#9CA3AF",
        },
      };

    case "outline-danger":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        borderColor: "#EF4444",
        color: "#EF4444",
        "&:hover": {
          backgroundColor: "#FEF2F2",
          borderColor: "#DC2626",
          color: "#DC2626",
        },
        "&:disabled": {
          backgroundColor: "transparent",
          borderColor: "#9CA3AF",
          color: "#9CA3AF",
        },
      };

    default:
      return baseStyles;
  }
};

export default function CommonButton({
  variant = "primary",
  children,
  minWidth = 120,
  sx,
  ...props
}: CommonButtonProps) {
  const buttonStyles = getButtonStyles(variant);
  const isOutline = variant.includes("outline");

  return (
    <Button
      variant={isOutline ? "outlined" : "contained"}
      color="primary"
      sx={{
        ...buttonStyles,
        minWidth,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

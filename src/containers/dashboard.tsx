"use client";

import { Box, Card, Icon, Stack, Typography } from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

interface WidgetSummaryProps {
  title: string;
  total: number;
}

function WidgetSummary({ title, total }: WidgetSummaryProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "0 24px",
        width: { xs: "100%", sm: "134px" },
        boxShadow:
          "0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.2)",
        borderRadius: "16px",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: "#636363",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.57,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#1C252E",
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        {total}
      </Typography>
    </Card>
  );
}

interface ShipmentCardProps {
  title: string;
  code: string;
  origin: string;
  destination: string;
  originPort: string;
  destinationPort: string;
  createdAt: string;
}

function ShipmentCard({
  title,
  code,
  origin,
  destination,
  originPort,
  destinationPort,
  createdAt,
}: ShipmentCardProps) {
  return (
    <Card
      sx={{
        p: 2,
        boxShadow: "1px 1px 5px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
      }}
    >
      <Stack spacing={50} width="100%">
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 900,
                fontSize: "16px",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {code}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <DirectionsBoatIcon sx={{ mt: 2, mr: 1 }}></DirectionsBoatIcon>
            <Stack spacing={1} sx={{ mt: -1 }}>
              <Stack spacing={-0.5}>
                <Box sx={{ display: "flex", gap: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: "12px",
                    }}
                  >
                    {origin}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    {originPort}
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={0}>
                <Box sx={{ display: "flex", gap: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: "12px",
                    }}
                  >
                    {destination}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    {destinationPort}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Box sx={{ display: "flex", gap: 1, opacity: 0.6 }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                생성일
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                {createdAt}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        padding: "80px 40px",
      }}
    >
      {/* 계획 현황 섹션 */}
      <Stack direction="row" alignItems="flex-end" spacing={1} width="100%">
        <Typography
          variant="h4"
          sx={{
            color: "#484848",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: 1.5,
          }}
        >
          계획 현황
        </Typography>
        <Typography
          sx={{
            color: "#484848",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: 1.57,
          }}
        >
          (최근 1개월)
        </Typography>
      </Stack>

      {/* 계획 현황 위젯 */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        width="100%"
        sx={{ height: { xs: "auto", sm: "60px" } }}
      >
        <WidgetSummary title="검토중" total={0} />
        <WidgetSummary title="계약중" total={0} />
        <WidgetSummary title="입항전" total={0} />
        <WidgetSummary title="통관전" total={0} />
        <WidgetSummary title="통관후" total={0} />
        <WidgetSummary title="판매중" total={0} />
        <WidgetSummary title="판매완료" total={0} />
      </Stack>

      {/* 계획 현황 리스트 */}
      <Stack direction="row" spacing={3} width="100%" height="320px">
        <Stack spacing={3} width="100%">
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
        </Stack>
      </Stack>

      {/* 선적 현황 섹션 */}
      <Stack direction="row" alignItems="flex-end" spacing={1} width="100%">
        <Typography
          variant="h4"
          sx={{
            color: "#484848",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: 1.5,
          }}
        >
          선적 현황
        </Typography>
        <Typography
          sx={{
            color: "#484848",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: 1.57,
          }}
        >
          (최근 1개월)
        </Typography>
      </Stack>

      {/* 선적 현황 위젯 */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} width="100%">
        <WidgetSummary title="선적 준비" total={0} />
        <WidgetSummary title="진행중" total={0} />
        <WidgetSummary title="입항 및 통관" total={0} />
        <WidgetSummary title="운송" total={0} />
        <WidgetSummary title="거래 완료" total={0} />
      </Stack>

      {/* 선적 현황 리스트 */}
      <Stack direction="row" spacing={3} width="100%" height="320px">
        <Stack spacing={3} width="100%">
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
          <ShipmentCard
            title="남해 병아리콩"
            code="10000-100000-1000"
            origin="India"
            destination="Korea, Republic of"
            originPort="[Port] Haldia"
            destinationPort="[Port] Busan"
            createdAt="2025-02-25"
          />
        </Stack>
      </Stack>
    </Box>
  );
}

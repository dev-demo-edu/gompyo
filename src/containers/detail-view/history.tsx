"use client";

import { Box, Typography, Button } from "@mui/material";
import { HistoryData } from "@/types/history";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";

interface HistoryProps {
  data: HistoryData;
}

export default function History({ data }: HistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll
    ? data.historyItems
    : data.historyItems.slice(0, 3);

  return (
    <Box className="w-full bg-white rounded-2xl shadow-lg p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-bold text-gray-900">
          진행 현황
        </Typography>
      </Box>

      <Box className="flex gap-8">
        <Box className="flex-1">
          {displayItems.map((item) => (
            <Box key={item.id} className="relative pl-8 pb-6 last:pb-0">
              {/* 타임라인 라인 */}
              <Box className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />

              {/* 타임라인 포인트 */}
              <Box className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-primary-main" />

              {/* 컨텐츠 */}
              <Box className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-gray-900"
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  {item.description}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 mt-2 block"
                >
                  {item.time}
                </Typography>
              </Box>
            </Box>
          ))}

          {data.historyItems.length > 3 && (
            <Button
              variant="text"
              size="small"
              endIcon={showAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-primary-main"
            >
              {showAll ? "숨기기" : "더 보기"}
            </Button>
          )}
        </Box>

        <Box className="w-64 bg-gray-50 rounded-xl p-4 shadow-sm">
          <Box className="space-y-4">
            <Box>
              <Typography variant="caption" className="text-gray-500">
                계약 일자
              </Typography>
              <Typography variant="body2" className="text-gray-900">
                {data.orderTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gray-500">
                결제 일자
              </Typography>
              <Typography variant="body2" className="text-gray-900">
                {data.paymentTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gray-500">
                출발 일자
              </Typography>
              <Typography variant="body2" className="text-gray-900">
                {data.deliveryTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gray-500">
                도착 일자
              </Typography>
              <Typography variant="body2" className="text-gray-900">
                {data.completionTime}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

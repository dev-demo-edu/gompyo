"use client";

import { CargoHistoryTimeline } from "@/containers/detail-view/cargo-history/cargo-history-timeline";
import { useAtom } from "jotai";
import { cargoDetailAtom } from "@/states/detail";
import { useEffect, useState } from "react";
import { HistoryItem } from "@/containers/detail-view/cargo-history/types";
import { getHistoryLogs } from "@/actions/detail-view/history";
import { CircularProgress } from "@mui/material";
export default function History() {
  const [cargoData] = useAtom(cargoDetailAtom);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!cargoData?.cargo.id) return;

      try {
        setIsLoading(true);
        const items = await getHistoryLogs(cargoData.cargo.id);
        setHistoryItems(items);
      } catch (error) {
        console.error("히스토리 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [cargoData?.cargo.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return <CargoHistoryTimeline items={historyItems} />;
}

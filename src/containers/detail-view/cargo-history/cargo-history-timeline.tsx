import React, { useState, useMemo } from "react";
import { HistoryItem, FilterOption } from "./types";
import { HistoryItemCard } from "./history-item";
import { DateGroup } from "./date-group";
import { DetailsModal } from "./details-modal";
import { ButtonGroup } from "@mui/material";
import { formatISO, startOfDay, parseISO } from "date-fns";
import CommonButton from "@/components/common-button";

interface CargoHistoryTimelineProps {
  items: HistoryItem[];
  showFilters?: boolean;
  showDateGroups?: boolean;
}

export function CargoHistoryTimeline({
  items,
  showFilters = true,
  showDateGroups = true,
}: CargoHistoryTimelineProps) {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter items based on selected filter
  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  // Group items by date for date headers
  const groupedByDate = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {};

    filteredItems.forEach((item) => {
      const date = formatISO(startOfDay(parseISO(item.created_at)));
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    // Sort dates in descending order (newest first)
    return Object.entries(groups)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateB).getTime() - new Date(dateA).getTime(),
      )
      .map(([date, items]) => ({
        date,
        items: items.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      }));
  }, [filteredItems]);

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // If there are no items, show a message
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#6c757d" }}>
        기록된 변경 이력이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {showFilters && (
        <div
          style={{
            display: "flex",
            marginBottom: "16px",
            position: "sticky",
            top: 0,
            backgroundColor: "transparent",
            zIndex: 10,
            padding: "8px",
          }}
        >
          <ButtonGroup size="small" variant="outlined">
            {/* <Button
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={() => setFilter("all")}
            >
              전체
            </Button> */}
            <CommonButton
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => setFilter("all")}
            >
              전체
            </CommonButton>
            <CommonButton
              variant={filter === "change" ? "primary" : "outline"}
              onClick={() => setFilter("change")}
            >
              단일변경
            </CommonButton>
            <CommonButton
              variant={filter === "multi-change" ? "primary" : "outline"}
              onClick={() => setFilter("multi-change")}
            >
              다중변경
            </CommonButton>
            <CommonButton
              variant={filter === "status" ? "primary" : "outline"}
              onClick={() => setFilter("status")}
            >
              상태변경
            </CommonButton>
          </ButtonGroup>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {showDateGroups
          ? groupedByDate.map(({ date, items }) => (
              <div key={date}>
                <DateGroup date={date} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {items.map((item, index) => (
                    <HistoryItemCard
                      key={`${item.type}-${index}-${item.created_at}`}
                      item={item}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              </div>
            ))
          : filteredItems
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              )
              .map((item, index) => (
                <HistoryItemCard
                  key={`${item.type}-${index}-${item.created_at}`}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
      </div>

      <DetailsModal
        item={selectedItem}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

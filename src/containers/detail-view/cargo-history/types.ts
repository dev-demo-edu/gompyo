// Cargo history item types
export type HistoryType = "change" | "status" | "multi-change";

export interface BaseHistoryItem {
  type: HistoryType;
  user: string;
  created_at: string;
}

export interface ChangeHistoryItem extends BaseHistoryItem {
  type: "change";
  field: string;
  from: string;
  to: string;
}

export interface MultiChangeHistoryItem extends BaseHistoryItem {
  type: "multi-change";
  changes: {
    field: string;
    from: string;
    to: string;
  }[];
}

export interface StatusHistoryItem extends BaseHistoryItem {
  type: "status";
  status: string;
}

export type HistoryItem =
  | ChangeHistoryItem
  | StatusHistoryItem
  | MultiChangeHistoryItem;

// Timeline filter options
export type FilterOption = "all" | "change" | "status" | "multi-change";

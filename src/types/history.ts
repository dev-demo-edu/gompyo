export interface HistoryLog {
  id: string;
  targetType: string;
  targetId: string;
  type: string;
  user: string;
  changes: {
    field: string;
    from: string;
    to: string;
  }[];
  status: string;
  createdAt: Date;
}

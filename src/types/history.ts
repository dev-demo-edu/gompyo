export interface HistoryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isActive: boolean;
  type: "contract" | "payment" | "shipment" | "completion";
}

export interface HistoryData {
  orderTime: string;
  paymentTime: string;
  deliveryTime: string;
  completionTime: string;
  historyItems: HistoryItem[];
}

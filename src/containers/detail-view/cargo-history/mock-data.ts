import { HistoryItem } from "./types";

// Mock data for testing the timeline
export const mockHistoryItems: HistoryItem[] = [
  {
    type: "change",
    user: "김대리",
    field: "목적지",
    from: "부산",
    to: "인천",
    created_at: "2025-04-20T14:32:00",
  },
  {
    type: "status",
    user: "시스템 처리",
    status: "선적 완료",
    created_at: "2025-04-20T14:45:00",
  },
  {
    type: "multi-change",
    user: "정팀장",
    changes: [
      {
        field: "화물 등급",
        from: "일반",
        to: "특송",
      },
      {
        field: "운임",
        from: "150,000원",
        to: "220,000원",
      },
      {
        field: "포장 방식",
        from: "일반 포장",
        to: "특수 포장",
      },
    ],
    created_at: "2025-04-20T11:30:00",
  },
  {
    type: "change",
    user: "이과장",
    field: "물품 수량",
    from: "50개",
    to: "75개",
    created_at: "2025-04-20T10:15:00",
  },
  {
    type: "status",
    user: "박대리",
    status: "통관 진행중",
    created_at: "2025-04-19T16:22:00",
  },
  {
    type: "change",
    user: "김대리",
    field: "운송 방법",
    from: "해상 운송",
    to: "항공 운송",
    created_at: "2025-04-19T11:05:00",
  },
  {
    type: "multi-change",
    user: "김차장",
    changes: [
      {
        field: "수취인",
        from: "(주)한국물류",
        to: "(주)대한글로벌",
      },
      {
        field: "연락처",
        from: "010-1234-5678",
        to: "010-9876-5432",
      },
    ],
    created_at: "2025-04-18T14:25:00",
  },
  {
    type: "status",
    user: "시스템 처리",
    status: "화물 접수",
    created_at: "2025-04-18T09:30:00",
  },
  {
    type: "change",
    user: "최부장",
    field: "배송 예정일",
    from: "2025-04-25",
    to: "2025-04-22",
    created_at: "2025-04-18T09:10:00",
  },
];

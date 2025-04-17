// 화물 상태 enum 정의
export enum CargoStatus {
  REVIEW = "검토중",
  CONTRACTING = "계약중",
  BEFORE_LC = "L/C오픈전",
  BEFORE_ARRIVAL = "입항전",
  WAREHOUSE_MOVING = "창고 이동중",
  BEFORE_QUARANTINE = "검역전",
  QUARANTINING = "검역중",
  CUSTOMS_DECLARING = "세관신고중",
  BEFORE_CUSTOMS = "통관전",
  AFTER_CUSTOMS = "통관후",
  SELLING = "판매중",
}

// 영어 상태값과 한글 상태값 매핑
export const statusMapping: Record<string, CargoStatus> = {
  REVIEW: CargoStatus.REVIEW,
  CONTRACTING: CargoStatus.CONTRACTING,
  BEFORE_LC: CargoStatus.BEFORE_LC,
  BEFORE_ARRIVAL: CargoStatus.BEFORE_ARRIVAL,
  WAREHOUSE_MOVING: CargoStatus.WAREHOUSE_MOVING,
  BEFORE_QUARANTINE: CargoStatus.BEFORE_QUARANTINE,
  QUARANTINING: CargoStatus.QUARANTINING,
  CUSTOMS_DECLARING: CargoStatus.CUSTOMS_DECLARING,
  BEFORE_CUSTOMS: CargoStatus.BEFORE_CUSTOMS,
  AFTER_CUSTOMS: CargoStatus.AFTER_CUSTOMS,
  SELLING: CargoStatus.SELLING,
};

// 한글 상태값과 영어 상태값 매핑 (역방향)
export const reverseStatusMapping: Partial<Record<CargoStatus, string>> = {
  [CargoStatus.REVIEW]: "REVIEW",
  [CargoStatus.CONTRACTING]: "CONTRACTING",
  [CargoStatus.BEFORE_LC]: "BEFORE_LC",
  [CargoStatus.BEFORE_ARRIVAL]: "BEFORE_ARRIVAL",
  [CargoStatus.WAREHOUSE_MOVING]: "WAREHOUSE_MOVING",
  [CargoStatus.BEFORE_QUARANTINE]: "BEFORE_QUARANTINE",
  [CargoStatus.QUARANTINING]: "QUARANTINING",
  [CargoStatus.CUSTOMS_DECLARING]: "CUSTOMS_DECLARING",
  [CargoStatus.BEFORE_CUSTOMS]: "BEFORE_CUSTOMS",
  [CargoStatus.AFTER_CUSTOMS]: "AFTER_CUSTOMS",
  [CargoStatus.SELLING]: "SELLING",
};

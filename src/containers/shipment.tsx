import ShipmentGrid from "@/components/shipment-grid";

export default function Shipment() {
  return (
    <div className="w-full h-screen p-4 space-y-4">
      {/* 통계 정보 */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-32">
          <span className="text-sm text-gray-600">전체 상품</span>
          <span className="text-2xl font-bold">0</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-32">
          <span className="text-sm text-gray-600">금액 총액</span>
          <span className="text-2xl font-bold">0</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-32">
          <span className="text-sm text-gray-600">부합 상품</span>
          <span className="text-2xl font-bold">0</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-32">
          <span className="text-sm text-gray-600">부합 금액</span>
          <span className="text-2xl font-bold">0</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-32">
          <span className="text-sm text-gray-600">금액 총액</span>
          <span className="text-2xl font-bold">0</span>
        </div>
      </div>

      {/* 조회 기간 선택 */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">조회 기간</span>
          <input type="date" className="border rounded px-2 py-1" />
          <span>~</span>
          <input type="date" className="border rounded px-2 py-1" />
        </div>
      </div>

      {/* 그리드 */}
      <div className="flex-1">
        <ShipmentGrid />
      </div>
    </div>
  );
}

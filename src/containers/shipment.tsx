import ShipmentGrid from "@/components/shipment-grid";

export default function Shipment() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">선적 현황</h1>
        {/* 통계 정보 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              견적 요청
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              견적 등록
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              부킹 요청
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              부킹 완료
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              견적 종료
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
        </div>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ShipmentGrid />
        </div>
      </div>
    </div>
  );
}

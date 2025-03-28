import PlanGrid from "@/components/plan-grid";
import PlanButton from "./plan-button";

export default function Plan() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계획 현황
        </h1>

        {/* 통계 정보 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              전체 상품
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              전체 물량
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              부합 상품
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              부합 물량
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              금액 총액
            </div>
            <div className="text-lg sm:text-2xl font-bold">0</div>
          </div>
          <PlanButton />
        </div>

        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <PlanGrid />
        </div>
      </div>
    </div>
  );
}

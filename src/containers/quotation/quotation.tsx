"use client";
import QuotationGrid from "./quotation-grid";
export default function QuotationContainer() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          견적서 작성
        </h1>

        {/* 그리드 */}

        <div className="overflow-hidden">
          <QuotationGrid />
        </div>
      </div>
    </div>
  );
}

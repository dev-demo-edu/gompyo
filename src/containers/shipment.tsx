import ShipmentGrid from "@/components/shipment-grid";

export default function Shipment() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">선적 현황</h1>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ShipmentGrid />
        </div>
      </div>
    </div>
  );
}

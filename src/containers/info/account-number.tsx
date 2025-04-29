import AccountNumberGrid from "./account-number-grid";

export default function AccountNumber() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계좌 정보
        </h1>
        <div className="w-full flex justify-end mb-4 sm:mb-6">
          {/* <PlanButton /> */}
        </div>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AccountNumberGrid />
        </div>
      </div>
    </div>
  );
}

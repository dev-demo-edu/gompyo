import Link from "next/link";
import type { ICellRendererParams } from "ag-grid-community";

export const DetailButtonRenderer = (params: ICellRendererParams) => (
  <div className="flex justify-center items-center h-full">
    <Link
      href={`/detail/${params.data.id}`}
      className="inline-block px-4 py-1.5 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition-colors text-sm font-medium text-center"
    >
      상세보기
    </Link>
  </div>
);

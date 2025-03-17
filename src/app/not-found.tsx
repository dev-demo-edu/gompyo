import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-color-background text-color-foreground">
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold mt-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-4 text-gray-500">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-400 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-primary-400"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

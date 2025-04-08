import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인이 필요하지 않은 경로들
const publicPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 사용자 ID 확인
  const userId = request.cookies.get("userId")?.value;
  const isLoggedIn = !!userId;

  // 현재 경로가 public 경로인지 확인
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // 로그인되지 않은 상태에서 보호된 경로에 접근하려고 할 때
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 이미 로그인된 상태에서 로그인 페이지에 접근하려고 할 때
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 미들웨어를 적용할 경로 지정 (모든 경로에 적용)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

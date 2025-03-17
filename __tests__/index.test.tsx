import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Next.js 서버 컴포넌트를 Mock으로 처리
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: "",
    };
  },
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "",
}));

// 서버 컴포넌트를 클라이언트 컴포넌트처럼 테스트하기 위한 래퍼
const HomeWrapper = () => {
  return <Home />;
};

describe("Home", () => {
  it("renders a heading", async () => {
    render(<HomeWrapper />);

    // 비동기적으로 렌더링될 수 있으므로 findByRole 사용
    const heading = await screen.findByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});

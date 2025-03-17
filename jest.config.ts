import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // next.config.js 및 .env 파일을 테스트 환경에 로드하기 위해 Next.js 앱 경로를 제공합니다.
  dir: "./",
});

// Jest에 전달할 사용자 정의 구성을 추가합니다.
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // 모듈 경로 매핑 설정
  moduleNameMapper: {
    // 중요: '@/' 경로 별칭을 인식하도록 설정
    "^@/(.*)$": "<rootDir>/src/$1",

    // CSS 모듈 처리
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // 이미지 파일 처리
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i":
      "<rootDir>/__mocks__/fileMock.js",

    // next/font 처리
    "@next/font/(.*)": "<rootDir>/__mocks__/nextFontMock.js",
    "next/font/(.*)": "<rootDir>/__mocks__/nextFontMock.js",

    // server-only 비활성화
    "server-only": "<rootDir>/__mocks__/empty.js",
  },

  // 각 테스트가 실행되기 전에 추가 설정 옵션을 추가합니다.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // 변환 설정
  transform: {
    // TypeScript/JavaScript 파일 변환
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

// next/jest가 Next.js 구성을 로드할 수 있도록 createJestConfig가 이 방식으로 내보내집니다.
export default createJestConfig(config);

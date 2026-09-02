import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // MDX 를 페이지로 인식시킨다 (Foundations 산문 문서용)
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@chansikchoi/next-ui"],
  // Next 가 AGENTS.md / CLAUDE.md 를 자동 생성하지 않도록 끈다.
  // 이 저장소는 .claude/ 에 자체 규칙 체계를 둔다.
  agentRules: false,
};

// GFM 표·취소선을 파싱한다. MDX 기본은 CommonMark 라 `| a | b |` 가
// 표가 아니라 문단으로 렌더된다 — 실제로 설치와 사용 페이지의 표 2개가 그랬다.
//
// ⚠️ 플러그인을 import 가 아니라 **문자열**로 지정한다.
//    Next 16 은 dev·build 모두 Turbopack 이 기본이고, Turbopack 은 함수 참조를
//    직렬화하지 못한다. 문자열은 webpack 에서도 동작한다.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);

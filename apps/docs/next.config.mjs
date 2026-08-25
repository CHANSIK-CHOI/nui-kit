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

const withMDX = createMDX({});

export default withMDX(nextConfig);

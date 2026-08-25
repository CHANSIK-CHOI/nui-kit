/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 워크스페이스 패키지를 문서 앱 빌드 파이프라인에서 함께 처리한다.
  transpilePackages: ["@chansikchoi/next-ui"],
  // Next 가 AGENTS.md / CLAUDE.md 를 자동 생성하지 않도록 끈다.
  // 이 저장소는 .claude/ 에 자체 규칙 체계를 둔다.
  agentRules: false,
};

export default nextConfig;

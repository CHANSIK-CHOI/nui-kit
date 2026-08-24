/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 워크스페이스 패키지를 문서 앱 빌드 파이프라인에서 함께 처리한다.
  transpilePackages: ["@chansikchoi/next-ui"],
};

export default nextConfig;

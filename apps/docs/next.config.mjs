import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 실기기 확인용 — dev 서버는 localhost 밖의 출처에서 오는 `/_next/*` 요청을 **막는다**
  // (Next 16 · `references/vercel-next.js/allowed-dev-origins.md`). 막히면 HTML 은 그려지는데
  // JS 가 한 조각도 안 내려와 hydration 이 안 일어난다 — 화면은 멀쩡한데 아무것도 안 눌린다.
  // 호스트명만 적는다(스킴 · 포트 제외). 프로덕션 빌드에는 영향이 없다.
  //
  // 사설 대역을 패턴으로 연다 — `*` 는 라벨 하나라 IP 의 마지막 두 자리에 맞는다(2026-09-15 실측:
  // `192.168.*.*` 200 · 맞지 않는 `10.0.*.*` 403). DHCP 로 IP 가 바뀌어도 고칠 것이 없고
  // 공개 저장소에 집 주소가 남지 않는다. 다른 대역을 쓰는 공유기면 그 대역을 더한다.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  // MDX 를 페이지로 인식시킨다 (Foundations 산문 문서용)
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@nui-kit/react"],
  // Next 16 의 에이전트 규칙 파일(AGENTS.md) 자동 생성을 끈다 —
  // 저장소에 우리가 만들지 않은 파일이 생기지 않게 한다.
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

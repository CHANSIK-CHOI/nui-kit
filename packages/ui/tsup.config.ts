import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    rhf: "src/rhf.ts",
    // 컴포넌트별 서브패스 — 트리셰이킹 + 'use client' 경계 최소화
    button: "src/button.ts",
    field: "src/field.ts",
    textfield: "src/textfield.ts",
    icon: "src/icon.ts",
  },
  // App Router 전용 라이브러리 — ESM 단일 포맷.
  // 듀얼 패키지 해저드(CJS/ESM 인스턴스 이중화)를 원천 차단한다.
  format: ["esm"],
  // ⚠️ dts 생성은 tsup 에 맡기지 않는다.
  // tsup 내부 rollup-plugin-dts 가 TypeScript 내부 API 에 의존해 TS 7 에서 깨진다.
  // 선언 파일은 tsconfig.build.json + tsc --emitDeclarationOnly 로 생성한다.
  dts: false,
  clean: true,
  sourcemap: true,
  // rollup treeshake 패스는 module-level directive("use client")를 제거한다.
  // esbuild 자체 treeshaking + splitting + sideEffects 선언으로 충분하므로 끈다.
  treeshake: false,
  splitting: true,
  target: "es2022",
  // 모든 컴포넌트를 클라이언트 컴포넌트로 배포한다.
  // tsup 은 기본적으로 'use client' 지시어를 제거하므로 banner 로 강제 보존한다.
  banner: { js: '"use client";' },
  // peer 는 절대 번들에 인라인하지 않는다 (React/RHF 인스턴스 싱글톤 보장)
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-hook-form",
    // ButtonLink 만 사용. next 는 optional peer 이므로 절대 번들하지 않는다.
    "next",
    "next/link",
  ],
});

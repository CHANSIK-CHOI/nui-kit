#!/usr/bin/env node
/**
 * `gates.mjs` 검출력 시험 — 합성 사례 다섯 (`rules/scripts.md §4`). 0건 통과는 증거가 아니다.
 * 실제 결과 하나를 복제해 값을 비틀고, 같은 `checkTheme` 에 넣는다.
 *
 *   node scripts/color/gates-selftest.mjs
 *
 * 예전에는 `gates.mjs --self-test` 였다. `gates.mjs` 는 `dist/cli.js` 에 번들되는 라이브러리라
 * 최상위의 `process.argv` 판정이 소비자 명령의 인자를 그대로 읽었다 — `nui-theme … --self-test`
 * 가 이 시험을 돌리려다 번들 안에서 죽었다(2026-09-28 실측). 진입점은 따로 둔다.
 */
import { generate } from "./generate.mjs";
import { checkTheme } from "./gates.mjs";

const clone = (r) => JSON.parse(JSON.stringify(r));
const base = generate("#b1002a");

const v1 = clone(base);
v1.light.contrastRatio = 2.9; // 위반 1 — 9번 위 글자 3:1 미달
const v2 = clone(base);
v2.dark.brand[11] = v2.dark.gray[2]; // 위반 2 — 11번이 배경과 같다
const p1 = base; // 통과 1 — 우리 프리셋 42
const p2 = generate("#01796f"); // 통과 2 — 기본 브랜드
const trap = clone(base);
trap.accent = "#b1002b"; // 함정 — 9번이 입력과 다르지만 대비는 전부 통과 → info 지 fail 이 아니다

const cases = [
  ["위반 1 · 9번 글자 2.9", v1, { fails: 1, infos: 0 }],
  ["위반 2 · 11번 = 배경", v2, { fails: 1, infos: 0 }],
  ["통과 1 · #b1002a", p1, { fails: 0, infos: 0 }],
  ["통과 2 · #01796f", p2, { fails: 0, infos: 0 }],
  ["함정 · 9번만 다름", trap, { fails: 0, infos: 2 }],
];
let ok = 0;
for (const [name, r, want] of cases) {
  const got = checkTheme(r);
  const pass =
    got.fails.length === want.fails && got.infos.length === want.infos;
  if (pass) ok++;
  console.log(
    `  ${pass ? "✅" : "❌"} ${name} — fail ${got.fails.length}/${want.fails} · info ${got.infos.length}/${want.infos}`,
  );
}
console.log(
  `RECEIPT gates-self-test cases=${cases.length} passed=${ok} exit=${ok === cases.length ? 0 : 1}`,
);
process.exit(ok === cases.length ? 0 : 1);

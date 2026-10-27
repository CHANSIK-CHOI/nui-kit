/**
 * `nui-theme` 명령 약속(README 「버전 정책」)의 단언과 그 사례 — `check-cli-bundle.mjs` 의 ■종료 코드 절이 쓴다.
 * 판정과 사례만 둔다. 명령을 부르고 영수증을 찍는 일은 check-cli-bundle 이 한다.
 *
 * 단언 일곱
 *   ① exit 이 약속대로(0 성공 · 1 이 입력으로 못 만듦 · 2 파일을 읽거나 쓰지 못함)
 *   ② 실패면 stdout 이 비었다 ③ 실패면 stderr 에 까닭이 있다 ④ 실패면 `--out` 파일이 없다
 *   ⑤ 성공이면 stdout 에 결과가 있다 ⑥ 성공의 stderr 는 경고를 낼 때만 찬다
 *   ⑦ stderr 에 Node 스택 줄이 없다(잡지 못한 예외가 아니다)
 */

/** Node 가 잡지 못한 예외를 찍을 때의 스택 줄 — `    at fn (file:///…:1:2)` · `    at node:fs:…` */
const STACK = /^\s+at\s.*(?:\(.*:\d+:\d+\)|node:|file:\/\/|:\d+:\d+$)/m;

/**
 * 어긴 단언을 돌려준다. 빈 배열이면 약속대로다.
 * @param {{ exit: number, warn?: boolean }} want  약속한 종료 코드, 성공일 때 경고를 내는 경우인가
 * @param {{ status: number | null, stdout: string, stderr: string, outMade: boolean }} r
 * @returns {string[]}
 */
export function judge(want, r) {
  const broken = [];
  const so = r.stdout.trim();
  const se = r.stderr.trim();
  if (r.status !== want.exit) {
    broken.push(`① exit ${r.status}, 약속 ${want.exit}`);
  }
  if (want.exit !== 0) {
    if (so) broken.push("② 실패인데 stdout 에 글");
    if (!se) broken.push("③ 실패인데 stderr 가 빔");
    if (r.outMade) broken.push("④ 실패인데 --out 파일이 생김");
  } else {
    if (!so) broken.push("⑤ 성공인데 stdout 이 빔");
    if (Boolean(se) !== Boolean(want.warn)) {
      broken.push(
        want.warn
          ? "⑥ 경고가 stderr 에 없음"
          : "⑥ 경고할 일이 없는데 stderr 에 글",
      );
    }
  }
  if (STACK.test(r.stderr)) broken.push("⑦ stderr 에 Node 스택 줄");
  return broken;
}

/**
 * 실제 번들로 부를 경우 — 성공, 잘못된 인자, 없는 파일. `broken` 이면 패키지의 styles/themes 없이 번들만 부른다.
 * 읽기 전용 layout(2 로 멈추고 아무것도 안 씀)은 넣지 않았다 — root 로 도는 러너에서는 권한 시험이 헛돈다.
 */
export const CONTRACT_RUNS = [
  { kind: "성공", args: ["--preset", "42", "--no-apply"], want: { exit: 0 } },
  {
    kind: "성공",
    args: ["--accent", "#b1002a", "--no-apply"],
    want: { exit: 0 },
  },
  { kind: "성공", args: ["--help"], want: { exit: 0 } },
  {
    kind: "성공 · layout 없음 경고",
    args: ["--preset", "42"],
    want: { exit: 0, warn: true },
  },
  {
    kind: "성공 · 모르는 옵션 경고",
    args: ["--preset", "42", "--no-apply", "--no-aply"],
    want: { exit: 0, warn: true },
  },
  { kind: "인자", args: [], want: { exit: 1 } },
  { kind: "인자", args: ["--accent", "zzz", "--no-apply"], want: { exit: 1 } },
  {
    kind: "인자",
    args: ["--preset", "42", "--accent", "#b1002a"],
    want: { exit: 1 },
  },
  {
    kind: "인자 · 기준 미달",
    args: ["--accent", "#888888", "--no-apply"],
    want: { exit: 1 },
  },
  {
    kind: "없는 파일 · 프리셋",
    args: ["--preset", "999", "--no-apply"],
    want: { exit: 1 },
  },
  {
    kind: "없는 파일 · --out 폴더",
    args: ["--preset", "42", "--no-apply", "--out", "nodir/x.css"],
    want: { exit: 2 },
  },
  {
    kind: "없는 파일 · 설치 깨짐",
    args: ["--preset", "42", "--no-apply"],
    want: { exit: 2 },
    broken: true,
  },
];

const STACK_SAMPLE =
  "node:fs:2415\n  return binding.writeFileUtf8(\n\nError: ENOENT: no such file or directory, open '/w/nodir/x.css'\n" +
  "    at Object.writeFileSync (node:fs:2415:20)\n    at file:///w/dist/cli.js:12:345";

/**
 * 검출력 시험(scripts.md §4) — 위반 넷 · 통과 둘 · 함정 하나. 위반은 0.2.0 번들을 실제로 부른 꼴이다
 * (2026-10-27 실측). `expect` 는 걸려야 할 단언 번호.
 */
export const JUDGE_SELFTEST = [
  {
    name: "위반 1 · 인자 없음에 사용법을 stdout 으로",
    want: { exit: 1 },
    r: { status: 1, stdout: "nui-theme — 사용법", stderr: "", outMade: false },
    expect: ["②", "③"],
  },
  {
    name: "위반 2 · 없는 폴더를 스택으로 끝냄",
    want: { exit: 2 },
    r: { status: 1, stdout: "", stderr: STACK_SAMPLE, outMade: false },
    expect: ["①", "⑦"],
  },
  {
    name: "위반 3 · layout 못 찾음 경고를 stdout 으로",
    want: { exit: 0, warn: true },
    r: {
      status: 0,
      stdout: "✅ 프리셋 42\n루트 layout 을 찾지 못해",
      stderr: "",
      outMade: true,
    },
    expect: ["⑥"],
  },
  {
    name: "위반 4 · 실패인데 파일을 씀",
    want: { exit: 1 },
    r: { status: 1, stdout: "", stderr: "✗ 회색", outMade: true },
    expect: ["④"],
  },
  {
    name: "통과 1 · 성공",
    want: { exit: 0 },
    r: {
      status: 0,
      stdout: "✅ 프리셋 42 → /w/nui-theme.css",
      stderr: "",
      outMade: true,
    },
    expect: [],
  },
  {
    name: "통과 2 · 기준 미달",
    want: { exit: 1 },
    r: {
      status: 1,
      stdout: "",
      stderr: "✗ #888888 는 회색에 가깝다",
      outMade: false,
    },
    expect: [],
  },
  {
    name: "함정 · 사람 문장의 at",
    want: { exit: 1 },
    r: {
      status: 1,
      stdout: "",
      stderr: "✗ 기준 미달\n   at least 4.5:1 대비가 필요하다",
      outMade: false,
    },
    expect: [],
  },
];

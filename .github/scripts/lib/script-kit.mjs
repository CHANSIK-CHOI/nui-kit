// 검사 스크립트가 똑같이 하는 세 동작 — 마지막 줄 영수증, 저장소 맨 위 폴더, dev server 확인.
// 새 스크립트와 고치는 스크립트는 이것을 가져다 쓰고 복사하지 않는다(규칙 문서 scripts.md §11).
//
//   import { onExitReceipt, repoRoot, requireDevServer } from "<상대경로>/.github/scripts/lib/script-kit.mjs";
//
// 왜 여기인가 — 공개 저장소에 있어야 CI 체크아웃에도 있다. 루트 scripts/ 는 프라이빗이라 CI 에 없다.
//   .github/scripts/ 는 CI 와 npm 스크립트가 함께 부르는 공개 도구 자리다. 배포되지 않는다(packages/ui files 밖).
// 넘지 말 선 — 함수가 받는 것은 지금 꼴 그대로 둔다. 스크립트 하나 때문에 옵션 인자나 분기를 더해야 하면 더하지
//   않고 그 스크립트가 자기 안에 쓴다. 이미 붙은 인자가 스크립트마다 갈라 쓰이기 시작하면 부르는 곳으로 다시
//   펴 넣고 여기서 뺀다(Sandi Metz 「The Wrong Abstraction」). 검사 로직은 넣지 않는다.
// 막는 것 — 스크립트 폴더의 .mjs 가 process.on("exit") 를 직접 쓰면 Biome 플러그인
//   .github/lint/no-direct-exit-hook.grit 이 오류를 낸다. 이 파일만 그 검사에서 뺀다.
import { execFileSync } from "node:child_process";

/**
 * 어느 길로 끝나든 마지막 줄에 `RECEIPT <name> <k=v …> exit=<code>` 를 찍는다(scripts.md §1).
 * `fields` 는 끝날 때 부른다 — 그때의 수를 적으려고. 키 차례가 출력 차례다.
 * `requireDevServer` 보다 뒤에 건다. 앞에 걸면 dev server 가 없어 죽은 것도 영수증이 남아 「돌았다」로 읽힌다.
 * @param {string} name
 * @param {() => Record<string, string | number | boolean>} fields
 */
export function onExitReceipt(name, fields) {
  process.on("exit", (code) => {
    const counts = Object.entries(fields()).map(([k, v]) => `${k}=${v}`);
    console.log(["RECEIPT", name, ...counts, `exit=${code}`].join(" "));
  });
}

/**
 * 지금 cwd 가 든 저장소(worktree 면 그 worktree)의 맨 위 폴더(scripts.md §8).
 * import.meta.url 로 잡지 않는다 — worktree 의 심볼릭 링크를 타고 메인으로 풀린다.
 * @returns {string}
 */
export function repoRoot() {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  }).trim();
}

/**
 * `base` 에 아무 응답이라도 오면 돌아온다. 3 초 안에 안 오면 stderr 에 알리고 exit 1 —
 * 영수증 없이 죽는 것이 「미실시 — dev server 없음」이다(scripts.md §8). 서버를 띄우지 않는다.
 * 아직 부르는 스크립트가 없다 — 옛 복사본 9 벌은 고칠 때 옮겨 온다(결정 A). `@public` 은 knip 이 「안 쓰는 export」로
 * 세지 않게 하는 표시다.
 * @public
 * @param {string} base
 */
export async function requireDevServer(base) {
  try {
    await fetch(base, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.error(
      `❌ dev server 가 없다 — ${base}. \`npm run dev\` 를 먼저 띄운다`,
    );
    process.exit(1);
  }
}

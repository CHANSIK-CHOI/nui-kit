/**
 * Select 메뉴의 배치 해석을 조합 전수로 잰다 — `hasPortal` × `menuPosition` × `menuPortalTarget`.
 *
 * ── 무엇을 못 보고 있었나 (scripts.md 「새 스크립트를 쓸 때」 1)
 *    `resolveMenuPlacementProps` 는 넷을 겹쳐 해석한다(Select.md §6-7 「해석 순서」). 문서 데모는
 *    그중 넷(기본 · `hasPortal` · `static` · `hasPortal menuPosition="absolute"`)만 보여 주고,
 *    **`hasPortal` + `menuPortalTarget={null}`(§10 #23) · `menuPortalTarget={요소}` 만(§10 #24)**
 *    은 어디에도 없어 qa 가 「미실시」로 냈다(2026-09-17). 둘 다 **타입은 통과하고 조용히
 *    틀리는** 자리다 — `??` 로 기본값을 주면 `null` 이 삼켜지고, `fixed` 기준을 「portal 이
 *    생겼나」로 넓히면 `menuPortalTarget={요소}` 만 준 소비자가 0.1.2 의 `absolute` 에서 `fixed`
 *    로 바뀐다. 둘 다 spec 의 ⚠️ 에 적힌, 실제로 설계 중에 한 번씩 밟은 함정이다.
 *
 * ── 왜 브라우저가 아닌가
 *    보는 것이 순수 함수의 반환값이다. 24칸을 데모로 깔면 페이지가 조합표가 된다. 그리고 이
 *    함수는 **배럴에서도 dist 청크에서도 export 되지 않는다** — 공개 API 가 아니라서다
 *    (Select.md §3-3). 그래서 `Select.utils.ts` 를 **esbuild 로 메모리에서 번들해** 부른다.
 *    esbuild 는 `packages/ui` 의 devDependency 로 명시했다 — `tsup` 을 따라 들어온 것에 기대면 번들러를
 *    바꾸는 날 배포 게이트가 `Cannot find module` 로 막힌다(리뷰 WARN · 2026-09-17). 파일을 쓰지 않는다.
 *    ⚠️ 번들은 트리 셰이킹으로 두 함수만 남지만(실측 2.4KB) **external import 는 남는다** —
 *    esbuild 는 외부 모듈의 부작용을 모르므로 `require("react")` · `require("react-select")` 를
 *    지우지 않는다. 불러오기는 하고 쓰지는 않는다(리뷰 WARN · 2026-09-17). 그래서 react-select 가
 *    모듈 최상단에서 `document` 를 건드리게 되면 이 검사는 Select 와 무관하게 **요란하게** 깨진다 —
 *    조용한 통과는 아니다. 그때는 두 패키지를 빈 모듈로 바꾸는 esbuild 플러그인을 둔다.
 *
 * ── 기대값은 **리터럴 표**다
 *    구현을 한 번 더 쓰면 같은 실수를 두 번 한다. 행마다 spec §6-7 의 어느 단계가 이겼는지를
 *    적었다 — 읽는 사람이 spec 과 한 줄씩 맞춰 본다. reviewer 가 A 안 1판에서 손으로 그린
 *    조합표와 같다.
 *
 * ── 검출력 (`--selftest`)
 *    기대를 뒤집는 대신 **틀린 구현(변이)을 넣고 표가 그것을 잡는가**를 본다. 변이는 spec 의 ⚠️
 *    가 경고한 함정 그대로다. 변이마다 **하나 이상의 행이 실패해야** 검출이다. 기대 수는 변이
 *    목록의 길이에서 센다.
 *
 * 헛짚기 — 첫 실행(2026-09-17) 행 24 · 키 유무 8 · placement 4 · 일치 24 · 헛짚기 0.
 *
 * 사용:
 *   node scripts/check-select-placement.mjs              전수
 *   node scripts/check-select-placement.mjs --selftest   변이 검출력
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SELFTEST = process.argv.includes("--selftest");

// 한글 경로가 `import.meta.url` 에서 percent-encoding 된다 — `fileURLToPath` 로 푼다
const UI = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(UI, "package.json"));

let checks = 0;
let failures = 0;
const counts = { rows: 0, keys: 0, placement: 0, agree: 0 };
let mutantsDetected = 0;

process.on("exit", (code) => {
  console.log(
    `RECEIPT check-select-placement rows=${counts.rows} keys=${counts.keys} placement=${counts.placement} agree=${counts.agree} checks=${checks} failures=${failures}` +
      (SELFTEST
        ? ` mutants=${MUTANTS.length} detected=${mutantsDetected}`
        : "") +
      ` exit=${code}`,
  );
});

async function loadUtils() {
  const esbuild = require("esbuild");
  const out = await esbuild.build({
    stdin: {
      contents: `export { resolveMenuPlacementProps, needsSelectPortalRoot } from "./src/components/Select/Select.utils.ts";`,
      resolveDir: UI,
      loader: "ts",
    },
    bundle: true,
    format: "cjs",
    platform: "node",
    packages: "external",
    write: false,
    logLevel: "silent",
    loader: { ".scss": "empty", ".css": "empty" },
  });
  const mod = { exports: {} };
  new Function("require", "module", "exports", out.outputFiles[0].text)(
    require,
    mod,
    mod.exports,
  );
  return mod.exports;
}

/** 우리 portal 컨테이너(`#nui-select-root`) 자리 · 소비자가 준 요소 자리 — 동일성으로만 본다 */
const ROOT = { __sentinel: "우리 컨테이너" };
const EL = { __sentinel: "소비자 요소" };
const name = (v) =>
  v === ROOT ? "ROOT" : v === EL ? "EL" : v === null ? "null" : String(v);

/**
 * 24칸 — [hasPortal, menuPosition, menuPortalTarget] → [menuPosition, menuPortalTarget, 컨테이너 필요]
 * 끝 칸은 spec §6-7 「해석 순서」에서 **이긴 단계**다.
 * `menuPortalTarget` 칸의 `"absent"` 는 키 자체가 없는 것이다(명시적 `undefined` 는 아래 「키 유무」 절).
 */
const U = "absent";
const TABLE = [
  // ── 소비자 target 없음 → 3단계 hasPortal 이 정한다
  [false, undefined, U, "absolute", null, false, "3 끔 → 제자리 · absolute"],
  [false, "absolute", U, "absolute", null, false, "3 끔 · 명시값"],
  [false, "fixed", U, "fixed", null, false, "3 끔 · 명시 fixed(래퍼 제자리)"],
  [false, "static", U, "absolute", null, false, "1 static"],
  [
    true,
    undefined,
    U,
    "fixed",
    ROOT,
    true,
    "3 켬 → 우리 컨테이너 · 기본 fixed",
  ],
  [true, "absolute", U, "absolute", ROOT, true, "3 켬 · 명시 absolute"],
  [true, "fixed", U, "fixed", ROOT, true, "3 켬 · 명시 fixed"],
  [
    true,
    "static",
    U,
    "absolute",
    null,
    false,
    "1 static 이 hasPortal 을 이긴다",
  ],
  // ── target null → 2단계: 제자리 · hasPortal 통째 무시 (#23)
  [false, undefined, null, "absolute", null, false, "2 null"],
  [false, "absolute", null, "absolute", null, false, "2 null · 명시값"],
  [false, "fixed", null, "fixed", null, false, "2 null · 명시 fixed"],
  [false, "static", null, "absolute", null, false, "1 static"],
  [
    true,
    undefined,
    null,
    "absolute",
    null,
    false,
    "2 null 이 hasPortal 을 이긴다 — #23",
  ],
  [true, "absolute", null, "absolute", null, false, "2 null · 명시값"],
  [true, "fixed", null, "fixed", null, false, "2 null · 명시 fixed"],
  [true, "static", null, "absolute", null, false, "1 static"],
  // ── target 요소 → 2단계: 그 요소로 · 위치 기본 absolute (#24)
  [
    false,
    undefined,
    EL,
    "absolute",
    EL,
    false,
    "2 요소 → absolute — #24 (0.1.2 와 같다)",
  ],
  [false, "absolute", EL, "absolute", EL, false, "2 요소 · 명시값"],
  [false, "fixed", EL, "fixed", EL, false, "2 요소 · 명시 fixed"],
  [false, "static", EL, "absolute", null, false, "1 static 이 요소를 이긴다"],
  [
    true,
    undefined,
    EL,
    "absolute",
    EL,
    false,
    "2 요소가 hasPortal 을 이긴다 · absolute 유지",
  ],
  [true, "absolute", EL, "absolute", EL, false, "2 요소 · 명시값"],
  [true, "fixed", EL, "fixed", EL, false, "2 요소 · 명시 fixed"],
  [true, "static", EL, "absolute", null, false, "1 static"],
];

/** `menuPlacement` — 4단계. static 만 강제로 아래 */
const PLACEMENT = [
  [{ hasPortal: false }, "bottom", "안 주면 bottom"],
  [{ hasPortal: true, menuPlacement: "auto" }, "auto", "명시값 통과"],
  [{ hasPortal: false, menuPlacement: "top" }, "top", "명시값 통과"],
  [
    { hasPortal: true, menuPosition: "static", menuPlacement: "top" },
    "bottom",
    "static 은 뒤집지 않는다",
  ],
];

function inputOf([hasPortal, menuPosition, target]) {
  const input = { hasPortal };
  if (menuPosition !== undefined) input.menuPosition = menuPosition;
  if (target !== U) input.menuPortalTarget = target;
  return input;
}

/**
 * 표 전체를 한 구현에 돌린다. `report` 가 거짓이면 조용히 실패 수만 센다(변이 시험).
 * 반환 — 실패한 행의 수.
 */
function runTable({ resolve, needsRoot }, report) {
  let bad = 0;
  const line = (pass, label, detail) => {
    if (!report) {
      if (!pass) bad += 1;
      return;
    }
    checks += 1;
    if (pass) console.log(`   ✅ ${label}`);
    else {
      failures += 1;
      bad += 1;
      console.log(`   ❌ ${label} — ${detail}`);
    }
  };

  if (report)
    console.log("\n■ 조합 24칸 — hasPortal × menuPosition × menuPortalTarget");
  for (const row of TABLE) {
    const [hp, pos, tgt, wantPos, wantTarget, wantRoot, why] = row;
    const input = inputOf(row);
    const got = resolve(input, ROOT);
    const gotRoot = needsRoot(input);
    const pass =
      got.menuPosition === wantPos &&
      got.menuPortalTarget === wantTarget &&
      gotRoot === wantRoot;
    if (report) counts.rows += 1;
    line(
      pass,
      `hasPortal=${hp} menuPosition=${pos ?? "-"} target=${tgt === U ? "-" : name(tgt)} → ${wantPos} · ${name(wantTarget)} · 컨테이너 ${wantRoot} (${why})`,
      `받은 값 ${got.menuPosition} · ${name(got.menuPortalTarget)} · 컨테이너 ${gotRoot}`,
    );
  }

  // 키 유무 — `menuPortalTarget={undefined}` 를 **명시해도** 안 준 것과 같아야 한다 (spec §3-1 ⚠️)
  if (report) console.log("\n■ 키 유무 — 명시적 undefined 는 「안 준 것」이다");
  for (const row of TABLE.filter((r) => r[2] === U)) {
    const absent = inputOf(row);
    const explicit = { ...absent, menuPortalTarget: undefined };
    const a = resolve(absent, ROOT);
    const b = resolve(explicit, ROOT);
    const pass =
      a.menuPosition === b.menuPosition &&
      a.menuPortalTarget === b.menuPortalTarget &&
      needsRoot(absent) === needsRoot(explicit);
    if (report) counts.keys += 1;
    line(
      pass,
      `hasPortal=${row[0]} menuPosition=${row[1] ?? "-"} — 키 없음 = undefined 명시`,
      `키 없음 ${a.menuPosition}·${name(a.menuPortalTarget)} vs 명시 ${b.menuPosition}·${name(b.menuPortalTarget)}`,
    );
  }

  if (report) console.log("\n■ menuPlacement");
  for (const [input, want, why] of PLACEMENT) {
    const got = resolve(input, ROOT).menuPlacement;
    if (report) counts.placement += 1;
    line(
      got === want,
      `${JSON.stringify(input)} → ${want} (${why})`,
      `받은 값 ${got}`,
    );
  }

  // 두 함수의 일치 — 컨테이너를 잡는데 메뉴가 거기로 안 가면(또는 그 반대면) 메뉴가 제자리로 떨어진다.
  // ⚠️ **표가 통과하면 이 절은 실패할 수 없다** — 표에서 컨테이너 true 인 행과 target 이 ROOT 인 행이
  //    같은 셋이라서다. 독립 증거가 아니라 **표를 고칠 때 두 칸이 어긋나지 않게 하는 안전망**이다.
  //    `--selftest` 의 「실패한 행 N」도 행 수가 아니라 이 절까지 합친 실패 검사 수다 (리뷰 INFO)
  if (report)
    console.log(
      "\n■ 일치 — needsSelectPortalRoot ↔ 실제로 우리 컨테이너로 가는가",
    );
  for (const row of TABLE) {
    const input = inputOf(row);
    const goesToRoot = resolve(input, ROOT).menuPortalTarget === ROOT;
    if (report) counts.agree += 1;
    line(
      goesToRoot === needsRoot(input),
      `hasPortal=${row[0]} menuPosition=${row[1] ?? "-"} target=${row[2] === U ? "-" : name(row[2])} — 컨테이너 ${needsRoot(input)} · 거기로 간다 ${goesToRoot}`,
      "두 판정이 어긋난다",
    );
  }
  return bad;
}

/**
 * 변이 — spec 의 ⚠️ 가 경고한 함정. 진짜 구현을 감싸 한 자리만 틀리게 만든다.
 * 하나라도 표를 통과하면 그 함정에 대해 이 검사는 눈이 없다.
 */
const MUTANTS = [
  {
    name: "`??` 가 null 을 삼킨다 (§3-1 ⚠️)",
    make: ({ resolve, needsRoot }) => ({
      needsRoot,
      resolve: (input, root) => {
        const r = resolve(input, root);
        if (input.menuPosition === "static") return r;
        return {
          ...r,
          menuPortalTarget:
            input.menuPortalTarget ?? (input.hasPortal ? root : null),
        };
      },
    }),
  },
  {
    name: "fixed 기준을 「portal 이 생겼나」로 넓힌다 (§6-7 해석 순서 ⚠️)",
    make: ({ resolve, needsRoot }) => ({
      needsRoot,
      resolve: (input, root) => {
        const r = resolve(input, root);
        if (input.menuPosition !== undefined) return r;
        return {
          ...r,
          menuPosition: r.menuPortalTarget ? "fixed" : "absolute",
        };
      },
    }),
  },
  {
    name: "static 이 portal 을 해제하지 않는다",
    make: ({ resolve, needsRoot }) => ({
      needsRoot,
      resolve: (input, root) =>
        input.menuPosition === "static"
          ? resolve({ ...input, menuPosition: "absolute" }, root)
          : resolve(input, root),
    }),
  },
  {
    name: "컨테이너 판정이 소비자 target 을 안 본다 (두 함수 어긋남)",
    make: ({ resolve }) => ({
      resolve,
      needsRoot: (input) => input.hasPortal && input.menuPosition !== "static",
    }),
  },
  {
    name: '키의 유무로 가른다 (`"menuPortalTarget" in props`)',
    make: ({ resolve, needsRoot }) => ({
      resolve: (input, root) =>
        "menuPortalTarget" in input && input.menuPosition !== "static"
          ? {
              ...resolve(input, root),
              menuPortalTarget: input.menuPortalTarget ?? null,
              menuPosition: input.menuPosition ?? "absolute",
            }
          : resolve(input, root),
      needsRoot: (input) =>
        "menuPortalTarget" in input ? false : needsRoot(input),
    }),
  },
  {
    name: "menuPlacement 기본이 auto 다",
    make: ({ resolve, needsRoot }) => ({
      needsRoot,
      resolve: (input, root) => ({
        ...resolve(input, root),
        menuPlacement:
          input.menuPosition === "static"
            ? "bottom"
            : (input.menuPlacement ?? "auto"),
      }),
    }),
  },
];

async function run() {
  const utils = await loadUtils();
  const real = {
    resolve: utils.resolveMenuPlacementProps,
    needsRoot: utils.needsSelectPortalRoot,
  };
  if (
    typeof real.resolve !== "function" ||
    typeof real.needsRoot !== "function"
  ) {
    console.error(
      "❌ Select.utils.ts 에서 두 함수를 못 찾았다 — 이름이 바뀌었으면 이 스크립트도 고친다",
    );
    process.exit(1);
  }

  runTable(real, true);

  for (const [key, n] of Object.entries(counts)) {
    if (n === 0) {
      console.error(`\n❌ 절 ${key} 이 0건이다 — 표가 비었다 (scripts.md §2)`);
      process.exit(1);
    }
  }

  if (SELFTEST) {
    // 진짜 구현이 먼저 통과해야 변이 결과가 뜻을 갖는다
    if (failures > 0) {
      console.error(
        "\n❌ 진짜 구현이 표를 통과하지 못했다 — 검출력 시험을 할 수 없다",
      );
      process.exit(1);
    }
    console.log("\n■ 검출력 — 변이");
    for (const m of MUTANTS) {
      const bad = runTable(m.make(real), false);
      checks += 1;
      if (bad > 0) {
        mutantsDetected += 1;
        console.log(`   🎯 검출 — ${m.name} (실패한 행 ${bad})`);
      } else {
        failures += 1;
        console.log(`   ❌ 못 잡았다 — ${m.name}`);
      }
    }
    console.log(`\n🎯 검출력 ${mutantsDetected}/${MUTANTS.length}`);
    process.exit(failures === 0 ? 0 : 1);
  }

  console.log(
    failures === 0
      ? `\n✅ Select 배치 해석 통과 — 조합 ${counts.rows} · 키 유무 ${counts.keys} · placement ${counts.placement} · 일치 ${counts.agree}`
      : `\n❌ ${failures}건 실패`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

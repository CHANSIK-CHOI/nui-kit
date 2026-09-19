/**
 * Accordion 의 `index` 해석 계약을 서버 렌더로 잰다.
 *
 * ── 무엇을 못 보고 있었나 (scripts.md 「새 스크립트를 쓸 때」 1)
 *    `index` 는 **런타임에 Context 로 해석**된다. 어느 항목이 열리는지는 문자열 검사로
 *    보이지 않고, 타입도 통과한다 — spec §13-1 이 닫으려던 결함이 정확히 그것이었다
 *    (「하나만 어긋나도 타입은 통과하고 화면에서만 드러난다」). 그리고 **던져야 하는 경로**는
 *    문서 데모에 넣을 수 없다. 렌더 중 `throw` 라 페이지가 통째로 깨지기 때문이다.
 *    그래서 qa 가 spec §10 의 두 항목을 「미실시 — 데모에 없음」으로 냈다 (2026-09-14).
 *
 * ── 실제로 났던 일
 *    루트가 항목 Context 를 끊지 않던 판에서, 아코디언을 패널 안에 중첩하고 안쪽 `Button` 의
 *    `index` 를 생략하면 **던지지 않고 바깥 항목의 index 를 조용히 집어 갔다**
 *    (실측 `aria-expanded=[true,false]`). reviewer 가 코드로 찾았고 이 스크립트가 재현했다.
 *
 * ── 왜 브라우저가 아닌가
 *    보는 것이 마크업과 예외뿐이라 `react-dom/server` 로 충분하다. 3초면 끝나고 dev server 가
 *    필요 없다 — `verify:pkg` 안에서 돈다. 화면(높이·색·눌림)은 qa 와 `verify:a11y` 의 몫이다.
 *
 * 검출력 시험: `node scripts/check-accordion-index.mjs --selftest`
 */
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion } from "../dist/accordion.js";

const SELFTEST = process.argv.includes("--selftest");

let failures = 0;
let checks = 0;

const ok = (msg) => {
  checks += 1;
  console.log(`  ✅ ${msg}`);
};
const bad = (msg) => {
  checks += 1;
  failures += 1;
  console.log(`  ❌ ${msg}`);
};

/** 렌더 결과를 「무엇이 열렸나」로 요약한다. 던지면 메시지를 담는다. */
function render(node) {
  try {
    const html = renderToStaticMarkup(node);
    return {
      threw: false,
      // 열린 항목 = `aria-expanded="true"` 인 버튼의 자리
      expanded: [...html.matchAll(/aria-expanded="(\w+)"/g)].map(
        (m) => m[1] === "true",
      ),
      // 패널 id 의 꼬리 숫자 — 어느 항목의 본문이 그려졌나
      panels: [...html.matchAll(/id="[^"]*-panel-(\d+)"/g)].map((m) =>
        Number(m[1]),
      ),
      regions: (html.match(/role="region"/g) || []).length,
    };
  } catch (error) {
    return { threw: true, message: error.message };
  }
}

const item = (index, extra = {}) =>
  h(
    Accordion.Item,
    { index, key: `item-${index}` },
    h(
      Accordion.Button,
      extra.button ?? null,
      h(Accordion.Head, null, `제목 ${index}`),
    ),
    h(Accordion.Panel, extra.panel ?? null, `본문 ${index}`),
  );

// ─────────────────────────────────────────────────────────────
console.log("■ index 를 Item 에만 줘도 같게 동작한다 (spec §6-1 · §10)");

const onlyItem = render(
  h(Accordion, { defaultActiveIndices: [1] }, item(0), item(1)),
);
const allThree = render(
  h(
    Accordion,
    { defaultActiveIndices: [1] },
    item(0, { button: { index: 0 }, panel: { index: 0 } }),
    item(1, { button: { index: 1 }, panel: { index: 1 } }),
  ),
);

if (onlyItem.threw || allThree.threw) {
  bad(
    `던지면 안 되는 자리에서 던졌다 — ${onlyItem.message ?? allThree.message}`,
  );
} else if (
  JSON.stringify(onlyItem.expanded) !== JSON.stringify(allThree.expanded) ||
  JSON.stringify(onlyItem.panels) !== JSON.stringify(allThree.panels)
) {
  bad(
    `「Item 에만」과 「세 곳 모두」의 결과가 다르다 — ` +
      `expanded ${JSON.stringify(onlyItem.expanded)} ↔ ${JSON.stringify(allThree.expanded)} · ` +
      `panels ${JSON.stringify(onlyItem.panels)} ↔ ${JSON.stringify(allThree.panels)}`,
  );
} else if (
  JSON.stringify(onlyItem.expanded) !== JSON.stringify([false, true])
) {
  bad(
    `열린 자리가 틀렸다 — defaultActiveIndices=[1] 인데 expanded=${JSON.stringify(onlyItem.expanded)}`,
  );
} else {
  ok(`둘의 출력이 같다 — expanded=[false,true] · panels=[1]`);
}

// ─────────────────────────────────────────────────────────────
console.log("■ 명시값이 Context 를 이긴다 (spec §6-1)");

// Item 은 0 인데 Button·Panel 에 1 을 준다. 루트는 1 을 열어 두었다
const explicitWins = render(
  h(
    Accordion,
    { defaultActiveIndices: [1] },
    item(0, { button: { index: 1 }, panel: { index: 1 } }),
  ),
);

if (explicitWins.threw) {
  bad(`던졌다 — ${explicitWins.message}`);
} else if (JSON.stringify(explicitWins.expanded) !== JSON.stringify([true])) {
  bad(
    `Context 의 0 이 명시한 1 을 이겼다 — expanded=${JSON.stringify(explicitWins.expanded)}`,
  );
} else {
  ok("Item 이 0 이어도 명시한 1 이 쓰인다");
}

// `index={0}` 이 falsy 라 Context 로 새지 않는지 — 반대 방향
const zeroIsExplicit = render(
  h(
    Accordion,
    { defaultActiveIndices: [0] },
    item(1, { button: { index: 0 }, panel: { index: 0 } }),
  ),
);

if (zeroIsExplicit.threw) {
  bad(`index={0} 에서 던졌다 — ${zeroIsExplicit.message}`);
} else if (JSON.stringify(zeroIsExplicit.expanded) !== JSON.stringify([true])) {
  bad(
    `index={0} 이 falsy 로 취급돼 Context(1)가 쓰였다 — expanded=${JSON.stringify(zeroIsExplicit.expanded)}`,
  );
} else {
  ok("index={0} 도 명시값이다 (falsy 함정 없음)");
}

// ─────────────────────────────────────────────────────────────
console.log("■ 자리를 못 찾으면 던진다 (spec §6-1 · §10)");

for (const [label, node] of [
  [
    "Accordion.Button",
    h(
      Accordion,
      null,
      h(Accordion.Button, null, h(Accordion.Head, null, "제목")),
    ),
  ],
  ["Accordion.Panel", h(Accordion, null, h(Accordion.Panel, null, "본문"))],
]) {
  const result = render(node);
  if (!result.threw) {
    bad(`${label} 이 Item 밖 · index 없음인데 던지지 않았다`);
  } else if (!result.message.includes("index")) {
    bad(`${label} 의 메시지에 index 안내가 없다 — ${result.message}`);
  } else if (!/[가-힣]/.test(result.message)) {
    bad(`${label} 의 메시지가 한국어가 아니다 — ${result.message}`);
  } else {
    ok(`${label} — ${result.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
console.log("■ 중첩에서 바깥 항목의 index 가 새지 않는다 (spec §6-1 · §12)");

// 바깥 Item(0) 의 패널 안에 아코디언을 중첩하고, 안쪽 Button 의 index 를 생략한다.
// 루트가 항목 Context 를 끊지 않으면 바깥의 0 을 집어 가서 던지지 않는다.
const nestedLeak = render(
  h(
    Accordion,
    { defaultActiveIndices: [0] },
    h(
      Accordion.Item,
      { index: 0 },
      h(Accordion.Button, null, h(Accordion.Head, null, "바깥")),
      h(
        Accordion.Panel,
        null,
        h(
          Accordion,
          null,
          h(Accordion.Button, null, h(Accordion.Head, null, "안쪽")),
        ),
      ),
    ),
  ),
);

if (!nestedLeak.threw) {
  bad(
    `안쪽 Button 이 바깥 항목의 index 를 집어 갔다 — expanded=${JSON.stringify(nestedLeak.expanded)}`,
  );
} else {
  ok(`안쪽이 자기 Item 을 못 찾아 던진다 — ${nestedLeak.message}`);
}

// 자기 Item 이 있는 정상 중첩은 그대로 돌아야 한다
const nestedOk = render(
  h(
    Accordion,
    { defaultActiveIndices: [0] },
    h(
      Accordion.Item,
      { index: 0 },
      h(Accordion.Button, null, h(Accordion.Head, null, "바깥")),
      h(
        Accordion.Panel,
        null,
        h(Accordion, { defaultActiveIndices: [0] }, item(0)),
      ),
    ),
  ),
);

if (nestedOk.threw) {
  bad(`자기 Item 이 있는 중첩에서 던졌다 — ${nestedOk.message}`);
} else if (nestedOk.regions !== 2) {
  bad(`중첩 둘이 다 열려야 하는데 region 이 ${nestedOk.regions}개다`);
} else {
  ok("자기 Item 이 있으면 중첩이 그대로 돈다 — region 2개");
}

// ─────────────────────────────────────────────────────────────
// 검출력 시험 (scripts.md §4) — 판정이 위반을 실제로 잡는지 합성 결과로 확인한다.
// 현재 트리에서 0건이 나온 것은 「검출력이 있다」와 「아무것도 못 본다」를 못 가른다.
if (SELFTEST) {
  console.log("\n■ 검출력 시험 — 합성 사례");

  const cases = [
    // [이름, 합성 결과, 잡아야 하나]
    [
      "중첩이 새는 판 (끊기 없음)",
      { threw: false, expanded: [true, false], panels: [0], regions: 1 },
      true,
    ],
    ["중첩이 던지는 판", { threw: true, message: "… index …" }, false],
    [
      "명시값이 Context 에 먹힌 판",
      { threw: false, expanded: [false], panels: [], regions: 0 },
      true,
    ],
    [
      "명시값이 이긴 판",
      { threw: false, expanded: [true], panels: [1], regions: 1 },
      false,
    ],
    ["메시지가 영어인 판", { threw: true, message: "index is required" }, true],
  ];

  let caught = 0;
  let missed = 0;
  for (const [name, synthetic, shouldCatch] of cases) {
    // 각 절의 판정식을 그대로 재사용한다
    let flagged;
    if (name.startsWith("중첩")) {
      flagged = !synthetic.threw;
    } else if (name.startsWith("명시값")) {
      flagged = JSON.stringify(synthetic.expanded) !== JSON.stringify([true]);
    } else {
      flagged =
        synthetic.threw &&
        (!synthetic.message.includes("index") ||
          !/[가-힣]/.test(synthetic.message));
    }
    if (flagged === shouldCatch) {
      caught += 1;
      console.log(`  ✅ ${name} — ${shouldCatch ? "잡았다" : "통과시켰다"}`);
    } else {
      missed += 1;
      failures += 1;
      console.log(`  ❌ ${name} — ${shouldCatch ? "못 잡았다" : "헛짚었다"}`);
    }
  }
  console.log(`  합성 ${cases.length}건 · 맞음 ${caught} · 틀림 ${missed}`);
}

// ─────────────────────────────────────────────────────────────
if (checks === 0) {
  console.log("\n❌ 검사한 것이 하나도 없다 — 경로나 import 가 늙었다");
  failures += 1;
}

console.log(
  failures === 0
    ? `\n✅ Accordion index 계약 통과 (${checks}건)`
    : `\n❌ ${failures}건 — spec §6-1 · §12 를 본다`,
);

process.on("exit", () => {
  console.log(
    `RECEIPT check-accordion-index checks=${checks} failures=${failures} selftest=${SELFTEST ? "on" : "off"} exit=${failures === 0 ? 0 : 1}`,
  );
});
process.exit(failures === 0 ? 0 : 1);

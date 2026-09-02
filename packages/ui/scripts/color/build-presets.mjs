#!/usr/bin/env node
/**
 * Figma 400색에서 **브랜드 색으로 쓸 수 있는 것만** 골라 목록을 만든다.
 * 계획: `plan/03-color-engine.html` 5장 · 결정 `Q-2`.
 *
 * 소비자가 고르는 것은 색깔(H) 하나다. 밝기·선명함은 우리 곡선을 쓰므로
 * 고른 색이 얼마나 밝은지는 상관없다 — 필요한 건 "이 색이 무슨 색깔인가" 뿐이다.
 *
 * ⚠️ 그런데 거의 회색인 색에는 색깔이라는 게 없다.
 *    물 한 컵에 물감을 눈에 안 보일 만큼 넣으면 그냥 물이고,
 *    "무슨 색이야?"에 답할 수가 없다. 그런 색에서 뽑은 H 는 우연한 숫자이고,
 *    그 숫자로 화면 전체를 물들이면 엉뚱한 색이 나온다.
 *    그래서 선명함이 낮은 색은 목록에서 뺀다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hexToOklch } from "./oklch.mjs";
import { generate } from "./generate.mjs";
import { contrast, AA, MUTED_TEXT } from "./contrast.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "..", "..", "..", "..", "research", "figma-palettes", "palettes.json");
const OUT = join(HERE, "..", "..", "presets.json");

/**
 * 색깔을 믿을 수 있는 최소 선명함.
 * 0.05 미만은 회색에 가까워 H 가 조금만 달라도 크게 튄다 — 336색 중 151색이 여기 걸린다.
 */
export const MIN_CHROMA = 0.05;

/**
 * 결과가 이만큼도 다르지 않으면 같은 색으로 본다.
 *
 * ⏸️ **지금은 끄고 있다**(`0`). 켜면 185색이 39색으로 줄어든다.
 *
 * 왜 이런 게 필요했나 — 고른 색에서 **색깔(H)만** 가져오던 시절에는
 * 밝기가 아무리 달라도 색깔이 비슷하면 결과가 같았다. `#d8abb7`(연분홍)과
 * `#511628`(진자주)은 밝기가 하늘과 땅 차이인데 H 가 0.7° 와 5.5° 라
 * 결과가 ΔE 0.5 이내였다. 실측으로 이웃 쌍의 91%가 구분 불가였다.
 *
 * 고른 색의 **밝기·선명함까지 결과에 반영**하면 이 중복이 사라지므로
 * 걸러낼 이유도 없어진다. 그 방향으로 가는 중이라 꺼둔다.
 */
export const MIN_DELTA_E = 0;

/** OKLab 거리 = 지각 색차. 1.0 이 훈련된 눈으로 겨우 구분하는 정도다. */
function deltaE(hexA, hexB) {
  const a = hexToOklch(hexA);
  const b = hexToOklch(hexB);
  const rad = (d) => (d * Math.PI) / 180;
  return (
    Math.hypot(
      (a.L - b.L) / 100,
      a.C * Math.cos(rad(a.H)) - b.C * Math.cos(rad(b.H)),
      a.C * Math.sin(rad(a.H)) - b.C * Math.sin(rad(b.H)),
    ) * 100
  );
}

const round = (n, d) => Number(n.toFixed(d));

export function buildPresets(source, defaultAccent) {
  const seen = new Map(); // hex → 첫 등장
  for (const palette of source.palettes) {
    for (const [hex, name] of palette.colors) {
      const key = hex.toLowerCase();
      if (!seen.has(key)) seen.set(key, { hex: key, name, palette: palette.n });
    }
  }

  // ① 색깔을 믿을 수 없는 색을 뺀다.
  const candidates = [];
  const grayish = [];
  for (const item of seen.values()) {
    const { L, C, H } = hexToOklch(item.hex);
    const row = { ...item, L: round(L, 2), C: round(C, 4), h: round(H, 2) };
    (C >= MIN_CHROMA ? candidates : grayish).push(row);
  }
  candidates.sort((a, b) => a.h - b.h || a.L - b.L);

  // ② 만들어본 결과가 기준을 못 넘는 색은 뺀다.
  //
  //    1차 목표가 "미리 검증된 색 중에서 고르게 한다"이므로, 목록에 올리기 전에
  //    실제로 만들어보고 잰다. 소비자가 무엇을 고르든 통과한 색이다.
  const unsafe = [];
  const safe = [];
  for (const row of candidates) {
    const r = generate(row.hex);
    const bad = ["light", "dark"].some((theme) => {
      const t = r[theme];
      if (t.belowStandard) return true; // 9번 위 글자가 3:1 미달
      // 11번은 저대비 글자라 4.0, 12번은 고대비라 AA
      return (
        contrast(t.brand[11], t.gray[2]) < MUTED_TEXT ||
        contrast(t.brand[12], t.gray[2]) < AA
      );
    });
    (bad ? unsafe : safe).push(row);
  }

  // ③ 실제로 만들어지는 색(9번)이 같으면 하나만 남긴다.
  //    이름이 있는 쪽을 대표로 고른다 — 소비자가 부를 이름이 있어야 한다.
  const kept = [];
  const merged = [];
  for (const row of safe) {
    row.solid = generate(row.hex).light.brand[9];
    const twin =
      MIN_DELTA_E > 0 ? kept.find((k) => deltaE(k.solid, row.solid) < MIN_DELTA_E) : null;
    if (!twin) {
      kept.push({ ...row, alias: [] });
      continue;
    }
    // 이름이 없던 대표가 이름 있는 후보를 만나면 자리를 넘긴다.
    if (!twin.name && row.name) {
      twin.alias.push(twin.hex);
      twin.hex = row.hex;
      twin.name = row.name;
      twin.h = row.h;
      twin.L = row.L;
      twin.C = row.C;
    } else {
      twin.alias.push(row.hex);
    }
    merged.push(row);
  }

  // ④ 우리 기본 브랜드 색을 목록에 넣는다.
  //
  //    팔레트 출신이 아니므로 가장 가까운 색도 ΔE 8 이상 떨어져 있다.
  //    "지금 쓰는 색이 몇 번인가"에 답하려면 목록에 있어야 한다.
  const { L, C, H } = hexToOklch(defaultAccent);
  kept.push({
    hex: defaultAccent,
    name: "Next UI 기본",
    palette: null,
    L: round(L, 2),
    C: round(C, 4),
    h: round(H, 2),
    solid: generate(defaultAccent).light.brand[9],
    alias: [],
    isDefault: true,
  });

  kept.sort((a, b) => a.h - b.h);
  kept.forEach((row, i) => {
    row.n = i + 1;
  });

  return { kept, grayish, merged, unsafe, uniqueCount: seen.size };
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const source = JSON.parse(readFileSync(SOURCE, "utf8"));
  const { kept, grayish, merged, unsafe, uniqueCount } = buildPresets(source, "#01796f");

  const payload = {
    "//": "Figma 400색에서 자동 생성. 손으로 고치지 말 것 — npm run color:presets 로 다시 만든다.",
    source: { name: source.source, collected: source.collected, total: source.count * source.swatchesPerPalette },
    rule:
      MIN_DELTA_E > 0
        ? `선명함(OKLCH C) ${MIN_CHROMA} 이상만 남기고, 결과가 ΔE ${MIN_DELTA_E} 안으로 겹치는 색은 하나로 합쳤다.`
        : `선명함(OKLCH C) ${MIN_CHROMA} 이상만 남겼다. 그 아래는 회색에 가까워 색깔을 믿을 수 없다.`,
    count: kept.length,
    presets: kept.map(({ n, hex, name, h, alias, isDefault }) => ({
      n,
      hex,
      name,
      h,
      merged: alias.length,
      ...(isDefault ? { isDefault: true } : {}),
    })),
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");

  const def = kept.find((k) => k.isDefault);
  console.log(`✅ 프리셋 목록 — ${kept.length}색`);
  console.log(
    `   원본 ${payload.source.total} → 같은 hex 제거 ${uniqueCount} → 선명함 미달 ${grayish.length} 제외` +
      ` → 대비 미달 ${unsafe.length} 제외 → 결과 중복 ${merged.length} 병합`,
  );
  console.log(
    `   기본 브랜드 색(${def.hex})은 ${def.n}번`,
  );

  // 색깔이 어디에 몰려 있는지 — 파랑·보라가 적다는 사실을 매번 눈에 띄게 한다.
  const buckets = new Map();
  for (const row of kept) {
    const k = Math.floor(row.h / 30) * 30;
    buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }
  const NAMES = ["빨강","주황","노랑","연두","초록","청록","하늘","파랑","남색","보라","자주","분홍"];
  console.log("\n   색깔 분포");
  for (let k = 0; k < 360; k += 30) {
    const n = buckets.get(k) ?? 0;
    console.log(`     ${String(k).padStart(3)}~${String(k + 30).padStart(3)}°  ${NAMES[k / 30].padEnd(3)} ${"█".repeat(Math.round(n / 2)).padEnd(28)} ${n}`);
  }
  console.log(`\n   → ${OUT.split("/").slice(-2).join("/")}`);
}

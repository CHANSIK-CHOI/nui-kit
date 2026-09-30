#!/usr/bin/env node
/**
 * 색 하나가 이 시스템의 브랜드 색이 될 수 있는가 — 기준 한 벌.
 *
 * 프리셋 검사(`verify.mjs` 관문 3) · 소비자 명령(`cli.mjs --accent`) · 문서 미리보기
 * (`apps/docs/scripts/extract-presets.mjs`) 셋이 **이 파일 하나**를 읽는다. 예전에는 관문 3 에만
 * 손으로 적혀 있었고, CLI 는 그중 하나(`belowStandard`)를 베껴 갔는데 구조적으로 참이 될 수
 * 없는 조건이라 죽어 있었다(2026-09-11 · HANDOFF §9).
 *
 * 정의 — 브랜드 색은 색조의 원천이고 9번은 그 색조로 만든 채움이다. 페이지 배경과 구분되는 한
 * 그 hex 가 9번에 그대로 앉는다. 아니면 같은 색조의 가장 가까운 채움이 앉고 **그 사실을 알린다**.
 *
 * level
 *   fail  — 이 색은 브랜드 색이 될 수 없다. 프리셋이었어도 목록에 못 들어갔을 색이다
 *   info  — 브랜드 색이 되지만 9번이 입력과 다르다. 프리셋 185색 중 라이트 80 · 다크 19 도 같다
 *
 * 예외 — 11번은 4.5 가 아니라 4.0 이다. Radix 공식 색을 실측하면 amber 4.43 · yellow 4.42 ·
 * orange 4.25 · teal 4.34 로 10색 중 4색이 4.5 미달이라, 우리가 만든 색에 공식 색보다 엄한 잣대를
 * 댈 수 없다(`contrast.mjs` MUTED_TEXT 와 같은 문장). 12번은 그대로 AA 다.
 */
import { hexToOklch, inGamut } from "./oklch.mjs";
import { contrast, AA, SOLID_TEXT, MUTED_TEXT } from "./contrast.mjs";

/**
 * OKLab 공간의 거리 = 지각 색차. 1.0 이 훈련된 눈으로 겨우 구분하는 정도.
 * `verify.mjs` 관문 2 의 재현 검사도 이것을 쓴다.
 */
export function deltaE(hexA, hexB) {
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

/** 본문 글자(11·12번)를 재는 배경 — Radix 가 11번을 보장하는 조건이 「1·2번 배경 위」이고 우리 layer-default 도 gray-2 다. */
const BODY_BG_STEP = 2;

/** 이름 · 무엇을 재나 · 기준. 순서가 곧 보고 순서다. */
export const GATES = [
  { id: "solid-text", label: "9번 위 글자", min: SOLID_TEXT },
  { id: "secondary-text", label: "보조 9번 위 글자", min: SOLID_TEXT },
  { id: "text-11", label: "11번 본문 (gray-2 위)", min: MUTED_TEXT },
  { id: "text-12", label: "12번 본문 (gray-2 위)", min: AA },
  { id: "gamut", label: "화면 밖 색", min: null },
];

const norm = (hex) => String(hex).toLowerCase();

/**
 * `generate()` 결과 하나를 검사한다.
 * @returns {{ checks: number, fails: Finding[], infos: Finding[] }}
 *   Finding = { gate, level, theme, measured, min, message }
 */
export function checkTheme(result) {
  const fails = [];
  const infos = [];
  let checks = 0;
  const accent = norm(result.accent);

  for (const theme of ["light", "dark"]) {
    const t = result[theme];
    const bg = t.gray[BODY_BG_STEP];
    const fail = (gate, measured, min, message) =>
      fails.push({ gate, level: "fail", theme, measured, min, message });

    // 1) 9번 위 글자 · 2) 보조 9번 위 글자
    checks++;
    if (t.contrastRatio < SOLID_TEXT)
      fail(
        "solid-text",
        t.contrastRatio,
        SOLID_TEXT,
        `${theme} 9번 위 글자 대비 ${t.contrastRatio}:1 (기준 ${SOLID_TEXT})`,
      );
    checks++;
    if (t.secondaryContrastRatio < SOLID_TEXT)
      fail(
        "secondary-text",
        t.secondaryContrastRatio,
        SOLID_TEXT,
        `${theme} 보조 9번 위 글자 대비 ${t.secondaryContrastRatio}:1 (기준 ${SOLID_TEXT})`,
      );

    // 3) 11번 · 4) 12번 본문
    for (const [gate, step, min] of [
      ["text-11", 11, MUTED_TEXT],
      ["text-12", 12, AA],
    ]) {
      checks++;
      const onBg = Number(contrast(t.brand[step], bg).toFixed(2));
      if (onBg < min)
        fail(
          gate,
          onBg,
          min,
          `${theme} ${step}번 본문 글자 대비 ${onBg}:1 (기준 ${min}). 조금 더 진한 색을 고른다`,
        );
    }

    // 5) 화면 밖 색 — 세 스케일 전부
    checks++;
    for (const [group, colors] of [
      ["brand", t.brand],
      ["secondary", t.secondary],
      ["gray", t.gray],
    ]) {
      for (const [step, hex] of Object.entries(colors)) {
        if (!inGamut(hexToOklch(hex)))
          fail(
            "gamut",
            hex,
            null,
            `${theme} ${group}-${step} ${hex} 가 화면 밖 색이다`,
          );
      }
    }

    // info) 9번 재조정 — 입력이 페이지 배경과 구분되지 않아(Radix: 1번과 ΔE 25 미만) 참조 스케일의 9번이 앉았다
    checks++;
    const solid = norm(t.brand[9]);
    if (solid !== accent) {
      const lowered = hexToOklch(solid).L < hexToOklch(accent).L;
      const dE = deltaE(accent, t.brand[1]);
      infos.push({
        gate: "solid-shift",
        level: "info",
        theme,
        measured: solid,
        min: null,
        from: accent,
        to: solid,
        // 방향만 말한다. 「밝아서」「어두워서」는 틀릴 수 있다 — 노랑 16색은 라이트에서 더 밝고 선명한 9번으로 갔다
        reason: lowered ? "더 어둡게" : "더 밝게",
        deltaE: Number(dE.toFixed(1)),
        message: `${theme} 9번 ${accent} → ${solid} (${lowered ? "더 어둡게" : "더 밝게"} · 배경과 ΔE ${dE.toFixed(1)})`,
      });
    }
  }

  return { checks, fails, infos };
}

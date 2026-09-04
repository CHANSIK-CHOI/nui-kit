#!/usr/bin/env node
/**
 * WCAG 명도 대비. 계획: `plan/03-color-engine.html` 4장.
 *
 * 왜 필요한가 — OKLCH 가 RGB 보다 낫지만 완벽하지 않다. 같은 밝기 숫자여도
 * 노랑 계열은 더 밝아 보여서 흰 글자를 얹으면 대비가 안 나온다. 우리
 * `warning`(#ffca2f) 만 글자가 검정인 이유가 그것이다. 생성기는 같은 판단을
 * 자동으로 해야 하고, 그러려면 재는 도구가 필요하다.
 *
 * ⚠️ 반투명 색은 그냥 못 잰다. "그 색의 밝기"라는 게 없고 뒤에 뭐가 있느냐로
 * 결정되기 때문이다. 반드시 배경 위에 합성한 뒤 잰다(`contrastOn`).
 */
import { parseHex, compositeOver } from "./oklch.mjs";

/** WCAG 기준값. 본문 글자는 AA(4.5:1) 를 넘어야 한다. */
export const AA = 4.5;
export const AA_LARGE = 3;
export const AAA = 7;

/**
 * **9번 solid 배경 위의 글자**에 적용하는 기준 — 3:1.
 *
 * 왜 4.5 가 아닌가 — 9번은 버튼·뱃지처럼 **채워진 면**의 배경이고, 그 위 글자는
 * WCAG 가 UI 구성요소·큰 글자에 인정하는 3:1 범위에 든다. 주요 디자인 시스템의
 * 관행이기도 하다.
 *
 * 실측이 이 판단을 밀어줬다 — **Radix 공식 23색 중 AA 4.5 를 넘는 것은 5색뿐**이다.
 * 4.5 를 요구하면 노랑·초록·하늘 계열 브랜드를 아예 고를 수 없게 된다.
 *
 * ⚠️ **본문 글자는 여전히 AA 다.** 본문은 11·12번을 쓰고 그 단계는 4.5 를 넘는다.
 *    이 완화는 9번 배경 한 자리에만 적용한다.
 */
export const SOLID_TEXT = 3;

/**
 * **11번(저대비 본문 글자)** 에 적용하는 기준 — 4.0.
 *
 * Radix 는 11번을 "1·2번 배경 위에서 4.5:1" 로 설계했다고 말하지만
 * **공식 색을 실측하면 그 말이 정확하지 않다.**
 *
 *   amber 4.43 · yellow 4.42 · orange 4.25 · teal 4.34   ← 10색 중 4색이 미달
 *
 * 노랑·주황 계열은 그 색을 유지하면서 4.5 를 넘기가 물리적으로 어렵다.
 * 우리가 만든 색에 Radix 공식 색보다 엄한 잣대를 댈 수는 없으므로
 * **경고선을 4.0 으로 둔다.** 이 아래로 떨어지면 그때는 진짜 문제다.
 *
 * ⚠️ 12번(고대비 본문)은 그대로 AA 다. 긴 글은 12번을 쓴다.
 */
export const MUTED_TEXT = 4.0;

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/**
 * WCAG 상대 휘도. OKLCH 의 L 과 다른 값이다 —
 * 이쪽은 접근성 기준이 정한 고정 계수이고, 사람의 지각 균등성을 노리지 않는다.
 */
export function relativeLuminance(hex) {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * 두 **불투명** 색의 대비비. 1(같은 색) ~ 21(흰 종이에 검은 글씨).
 * 반투명이 섞였을 수 있으면 `contrastOn` 을 쓴다.
 */
export function contrast(hexA, hexB) {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * 배경 위에 얹힌 상태로 재는 대비.
 * 앞·뒤 어느 쪽이 반투명이든 먼저 `bg` 위에 합성한 뒤 계산한다.
 */
export function contrastOn(fgHex, overHex, bgHex) {
  return contrast(compositeOver(fgHex, bgHex), compositeOver(overHex, bgHex));
}

/**
 * 이 배경에 얹을 글자색을 고른다.
 * 흰색이 AA 를 넘으면 흰색, 아니면 준비된 어두운 색을 쓴다.
 *
 * 노랑 배경이 정확히 이 분기를 탄다 — 어둡게 만들면 갈색이 되어 "주의"의
 * 의미를 잃으므로, 배경을 밝게 두고 글자를 어둡게 하는 쪽을 택한다.
 */
export function pickTextColor(
  bgHex,
  { light = "#ffffff", dark = "#000000" } = {},
) {
  const onLight = contrast(bgHex, light);
  const onDark = contrast(bgHex, dark);
  if (onLight >= AA) return { color: light, ratio: onLight, which: "light" };
  if (onDark >= AA) return { color: dark, ratio: onDark, which: "dark" };
  // 둘 다 미달이면 더 나은 쪽을 돌려주되 미달임을 알린다. 호출부가 배경을 조정한다.
  return onLight >= onDark
    ? { color: light, ratio: onLight, which: "light", belowAA: true }
    : { color: dark, ratio: onDark, which: "dark", belowAA: true };
}

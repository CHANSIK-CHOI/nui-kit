#!/usr/bin/env node
/**
 * hex ↔ OKLCH 변환. 색 엔진의 바닥에 깔리는 모듈이다.
 * 계획: `plan/03-color-engine.html` 3장.
 *
 * 왜 직접 만드나 — 표준 수식이라 60줄이면 되고, 외부 라이브러리를 쓰면
 * 버전이 오를 때 값이 미세하게 달라질 수 있다. 우리는 생성 결과를
 * 기존 `_seed.scss` 와 **완전 일치**로 대조하므로(관문 2) 값이 흔들리면 안 된다.
 *
 * 왜 OKLCH 인가 — RGB 세 숫자로는 "밝기만 바꾸기"가 안 된다. 사람 눈이
 * 초록에 가장 민감해서, 세 값을 같이 올려도 색이 변한다. OKLCH 는 사람이
 * 느끼는 대로 눈금을 다시 그린 좌표계라 L(밝기)·C(선명함)·H(색깔)를
 * 따로 만질 수 있다. 12단계를 만든다는 게 정확히 그 작업이다.
 *
 * L 은 0~100 으로 다룬다(계획서 표기와 맞춘다). 라이브러리 관행인 0~1 이 아니다.
 */

/** sRGB 감마 → 선형. 화면 밝기 값을 실제 빛의 양으로 되돌린다. */
const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/** 선형 → sRGB 감마. */
const toGamma = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * `#rgb` `#rrggbb` `#rrggbbaa` 를 0~1 채널로 푼다.
 * alpha 가 없으면 1 이다.
 */
export function parseHex(hex) {
  let h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.length !== 6 && h.length !== 8) {
    throw new Error(`hex 형식이 아니다: ${hex}`);
  }
  if (!/^[0-9a-fA-F]+$/.test(h)) throw new Error(`hex 형식이 아니다: ${hex}`);
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), alpha: h.length === 8 ? n(6) : 1 };
}

/** 0~1 채널을 hex 로. alpha 가 1 이면 6자리, 아니면 8자리다. */
export function formatHex({ r, g, b, alpha = 1 }) {
  const to2 = (v) =>
    Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, "0");
  const base = `#${to2(r)}${to2(g)}${to2(b)}`;
  return alpha >= 1 ? base : base + to2(alpha);
}

/** 선형 RGB → OKLab. */
function linearToOklab({ r, g, b }) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** OKLab → 선형 RGB. 범위를 벗어난 값도 그대로 돌려준다(gamut 판정에 쓴다). */
function oklabToLinear({ L, a, b }) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** hex → `{ L: 0~100, C, H: 0~360, alpha }`. */
export function hexToOklch(hex) {
  const { r, g, b, alpha } = parseHex(hex);
  const lab = linearToOklab({ r: toLinear(r), g: toLinear(g), b: toLinear(b) });
  const C = Math.hypot(lab.a, lab.b);
  // 무채색은 각도가 정의되지 않는다. 0 으로 고정해 왕복이 안정되게 한다.
  const H =
    C < 1e-9 ? 0 : ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360;
  return { L: lab.L * 100, C, H, alpha };
}

/** OKLCH → 선형 RGB (범위 검사 없음). */
function oklchToLinear({ L, C, H }) {
  const rad = (H * Math.PI) / 180;
  return oklabToLinear({
    L: L / 100,
    a: C * Math.cos(rad),
    b: C * Math.sin(rad),
  });
}

/** 이 색이 sRGB 화면에 나올 수 있나. 반올림 오차만큼 여유를 둔다. */
export function inGamut({ L, C, H }) {
  const { r, g, b } = oklchToLinear({ L, C, H });
  const eps = 1e-6;
  return (
    r >= -eps &&
    r <= 1 + eps &&
    g >= -eps &&
    g <= 1 + eps &&
    b >= -eps &&
    b <= 1 + eps
  );
}

/**
 * 화면에 나올 수 있는 지점까지 **선명함만** 줄인다.
 * 색깔(H)과 밝기(L)는 지킨다 — 그냥 잘라내면(clamp) 색깔이 변해버린다.
 *
 * 우리 곡선은 C 가 최대 0.101 이라 대부분 그냥 통과한다. 그래도 두는 이유는
 * 소비자가 아주 선명한 색을 골랐을 때 여기서 걸리기 때문이다.
 */
export function fitToGamut({ L, C, H, alpha = 1 }) {
  if (inGamut({ L, C, H })) return { L, C, H, alpha };
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ L, C: mid, H })) lo = mid;
    else hi = mid;
  }
  return { L, C: lo, H, alpha };
}

/**
 * OKLCH → hex. 기본으로 gamut 안으로 맞춘 뒤 변환한다.
 * `{ fit: false }` 를 주면 맞추지 않고 잘라낸다(검사용).
 */
export function oklchToHex({ L, C, H, alpha = 1 }, { fit = true } = {}) {
  const c = fit ? fitToGamut({ L, C, H, alpha }) : { L, C, H, alpha };
  const lin = oklchToLinear(c);
  return formatHex({
    r: toGamma(clamp01(lin.r)),
    g: toGamma(clamp01(lin.g)),
    b: toGamma(clamp01(lin.b)),
    alpha: c.alpha,
  });
}

/**
 * 반투명 색을 배경 위에 얹었을 때 실제로 보이는 색.
 * 반투명에는 "그 색의 밝기"라는 게 없다 — 뒤에 뭐가 있느냐로 결정된다.
 * 그래서 대비를 재려면 먼저 합쳐야 한다(계획서 4-2).
 */
export function compositeOver(fgHex, bgHex) {
  const f = parseHex(fgHex);
  const b = parseHex(bgHex);
  const a = f.alpha;
  return formatHex({
    r: f.r * a + b.r * (1 - a),
    g: f.g * a + b.g * (1 - a),
    b: f.b * a + b.b * (1 - a),
    alpha: 1,
  });
}

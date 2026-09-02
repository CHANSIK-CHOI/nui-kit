/**
 * framer-motion 용 트랜지션 토큰.
 *
 * framer-motion 은 CSS 변수를 읽지 못한다. 그래서 `--nui-duration-*` /
 * `--nui-easing-*` 과 **같은 값을 여기에도 적는다.**
 *
 * ⚠️ **이름을 SCSS 토큰과 똑같이 맞춰 뒀다.** 예전에는 `quick`·`fast`·`slow`
 *    같은 이름을 써서 어느 스케일 단계인지 알 수 없었고, 실제로 일곱 값 중
 *    둘만 SCSS 와 일치했다(120·180·240·340·380ms 는 스케일에 없는 값이었다).
 *    이제 `d4` 를 보면 `--nui-duration-4` 를 찾으면 된다.
 *
 * 한쪽만 고치면 CSS 전환과 framer-motion 이 다른 속도로 움직인다. 항상 함께 바꾼다.
 */
import type { Transition } from "framer-motion";

/** `--nui-duration-1` ~ `-8` 과 같은 값 (초 단위) */
export const motionDuration = {
  d1: 0.05,
  d2: 0.1,
  d3: 0.15,
  d4: 0.2, // 마이크로/매크로 경계
  d5: 0.25,
  d6: 0.3,
  d7: 0.35,
  d8: 0.4,
} as const;

/** `--nui-easing-*` 과 같은 값 */
export const motionEase = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.15, 1],
  exit: [0.35, 0, 1, 1],
  enterEmphasized: [0.16, 1, 0.3, 1],
  exitEmphasized: [0.35, 0, 0.95, 0.55],
  expand: [0.5, 1, 0.89, 1],
  pressed: [0, 0, 0.15, 1],
} as const;

export const motionTransition = {
  // dialog — 작은 요소, 빠른 인지
  panelDialog: {
    duration: motionDuration.d6,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelDialogExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // bottomSheet — 큰 면적, 아래에서 위로
  panelSheet: {
    duration: motionDuration.d8,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelSheetExit: {
    duration: motionDuration.d5,
    ease: motionEase.exit,
  } satisfies Transition,

  // fullPopup — 전체 화면 슬라이드
  panelFull: {
    duration: motionDuration.d7,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelFullExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // dim — 패널보다 살짝 길게
  overlayDialog: {
    duration: motionDuration.d5,
    ease: motionEase.standard,
  } satisfies Transition,
  overlayDialogExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // 레이아웃 전환
  panel: {
    duration: motionDuration.d5,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelExit: {
    duration: motionDuration.d3,
    ease: motionEase.exit,
  } satisfies Transition,

  // tooltip / popover — 가볍고 빠르게
  popover: {
    duration: motionDuration.d4,
    ease: motionEase.standard,
  } satisfies Transition,
  popoverExit: {
    duration: motionDuration.d3,
    ease: motionEase.exit,
  } satisfies Transition,

  toast: {
    duration: motionDuration.d5,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,

  // 접힘/펼침 — 높이가 움직이므로 팝업 개폐에 가까운 매크로 모션이다.
  // 크기 변화에는 전용 곡선을 쓴다 — tokens.md §3-6.
  collapse: {
    duration: motionDuration.d5,
    ease: motionEase.expand,
  } satisfies Transition,
  collapseExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,
} as const;

/**
 * `prefers-reduced-motion: reduce` 에서 **위치·크기 변화를 없애고 페이드만 남긴다.**
 *
 * ⚠️ framer-motion 은 CSS 의 `--nui-duration-*` 무력화(1ms)를 읽지 않는다.
 *    `MotionConfig.reducedMotion` 기본값도 `"never"` 다. 그래서 `motion.*` 에
 *    `y`·`scale` 을 직접 주는 컴포넌트는 이 헬퍼로 걸러야 한다
 *    (rules/design-system.md §6 · rules/a11y.md §6).
 *
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 * <motion.div
 *   initial={reduceMotion({ opacity: 0, y: 24 }, shouldReduceMotion)}
 *   transition={reduceMotionTransition(motionTransition.toast, shouldReduceMotion)}
 * />
 * ```
 */
export function reduceMotion<T extends Record<string, unknown>>(
  variant: T,
  shouldReduce: boolean | null,
): T | Pick<T, "opacity"> {
  if (!shouldReduce) return variant;

  // 페이드는 남긴다 — 완전히 없애면 요소가 갑자기 나타나 오히려 인지 부담이 크다.
  return "opacity" in variant
    ? ({ opacity: variant.opacity } as Pick<T, "opacity">)
    : variant;
}

/** 모션 감소 시 전환을 즉시 끝낸다. */
export function reduceMotionTransition<T>(
  transition: T,
  shouldReduce: boolean | null,
): T | { duration: 0 } {
  return shouldReduce ? { duration: 0 } : transition;
}

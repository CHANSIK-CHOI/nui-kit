/**
 * framer-motion 용 트랜지션 토큰.
 *
 * SCSS 의 --nui-duration-* / --nui-easing-* 과 **같은 값을 유지**한다.
 * (framer-motion 은 CSS 변수를 읽지 못하므로 부득이하게 이중 정의한다.
 *  한쪽만 고치면 CSS 전환과 모션이 어긋나므로 항상 함께 바꾼다.)
 */
import type { Transition } from "framer-motion";

export const motionDuration = {
  quick: 0.12,
  fast: 0.18,
  base: 0.2,
  slow: 0.24,
  deliberate: 0.3,
  measured: 0.34,
  relaxed: 0.38,
} as const;

export const motionEase = {
  linear: "linear",
  standard: [0.2, 0, 0, 1],
  emphasized: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const motionTransition = {
  // dialog — 작은 요소, 빠른 인지
  panelDialog: {
    duration: motionDuration.deliberate,
    ease: motionEase.emphasized,
  } satisfies Transition,
  panelDialogExit: {
    duration: motionDuration.base,
    ease: motionEase.exit,
  } satisfies Transition,
  // bottomSheet — 큰 면적, 아래에서 위로
  panelSheet: {
    duration: motionDuration.relaxed,
    ease: motionEase.emphasized,
  } satisfies Transition,
  panelSheetExit: {
    duration: motionDuration.slow,
    ease: motionEase.exit,
  } satisfies Transition,
  // fullPopup — 전체 화면 슬라이드
  panelFull: {
    duration: motionDuration.measured,
    ease: motionEase.emphasized,
  } satisfies Transition,
  panelFullExit: {
    duration: motionDuration.base,
    ease: motionEase.exit,
  } satisfies Transition,
  // dim — 패널보다 살짝 길게
  overlayDialog: {
    duration: 0.22,
    ease: motionEase.standard,
  } satisfies Transition,
  overlayDialogExit: {
    duration: motionDuration.fast,
    ease: motionEase.exit,
  } satisfies Transition,
  // 레이아웃 전환(아코디언 펼침 등)
  panel: {
    duration: motionDuration.slow,
    ease: motionEase.emphasized,
  } satisfies Transition,
  panelExit: {
    duration: motionDuration.fast,
    ease: motionEase.exit,
  } satisfies Transition,
  // tooltip / popover — 가볍고 빠르게
  popover: {
    duration: motionDuration.fast,
    ease: motionEase.standard,
  } satisfies Transition,
  popoverExit: {
    duration: motionDuration.quick,
    ease: motionEase.exit,
  } satisfies Transition,
  toast: {
    duration: motionDuration.slow,
    ease: motionEase.emphasized,
  } satisfies Transition,
  collapse: {
    duration: motionDuration.quick,
    ease: motionEase.linear,
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
  return "opacity" in variant ? ({ opacity: variant.opacity } as Pick<T, "opacity">) : variant;
}

/** 모션 감소 시 전환을 즉시 끝낸다. */
export function reduceMotionTransition<T>(
  transition: T,
  shouldReduce: boolean | null,
): T | { duration: 0 } {
  return shouldReduce ? { duration: 0 } : transition;
}

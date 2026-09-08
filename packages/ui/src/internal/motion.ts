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
  // ⚠️ **enter 와 같은 값이다.** 퇴장을 ease-in 으로 두면 닫기를 누른 뒤 100ms
  //    동안 27% 만 사라져 「안 닫힌다」로 읽힌다(실측). 비대칭은 duration 이
  //    만든다 — 이름은 자리를 말하려고 남긴다 (tokens.md §3-6 · §5-1).
  exit: [0, 0, 0.15, 1],
  enterEmphasized: [0.16, 1, 0.3, 1],
  exitEmphasized: [0.16, 1, 0.3, 1],
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

  // ── bottomSheet ★ 여기만 **스프링**이다 (2026-09-08 · prototype BS1)
  //
  // 시트는 **손으로 끌 수 있는 것**이다. Apple 이 `Drawer / sheet` 를 스프링 표에
  // 이름으로 올려 두고(damping 0.8 · response 0.3), Emil 도 "끊고 되돌릴 수 있는
  // 것은 스프링"이라고 한다. 값은 motion.md §8 이 되돌아감에 적어 둔 것과 같다 —
  // **등장과 놓았을 때가 한 물리가 된다.** G1(끌어서 닫기)이 붙는 순간 드러난다.
  //
  // `bounce: 0` 인 이유 — 튐은 **던졌을 때만**이다. 버튼으로 여는 등장이 튀면 어색하다.
  // `visualDuration` 은 "눈에 보이는 시간" 이라 duration 스케일과 같은 뜻으로 읽힌다.
  //
  // ⚠️ 예전에는 `d8`(400)이었다. Emil 의 **"UI animations stay under 300ms"** 규칙에
  //    걸렸고, 그 규칙의 반례가 정확히 400ms 였다. SEED 도 300 이다.
  panelSheet: {
    type: "spring",
    bounce: 0,
    visualDuration: 0.3,
  } satisfies Transition,
  panelSheetExit: {
    duration: motionDuration.d5,
    ease: motionEase.exit,
  } satisfies Transition,

  // fullPopup — 전체 화면 슬라이드.
  // ⚠️ `d7`(350)이었다. 같은 "300ms 아래" 규칙에 걸려 내렸다. 끌 수 없는 것이라
  //    스프링은 쓰지 않는다 — 스프링은 손으로 만질 수 있는 것의 도구다.
  panelFull: {
    duration: motionDuration.d6,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelFullExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // ── dim ★ 팝업 **세 변형이 함께 쓴다** (dialog · bottomSheet · full).
  //
  // 딤은 전환이 아니라 **상태 선언**이다 — "뒤는 이제 못 만진다". 그래서 빠르다.
  // 예전에는 d5(250)이라 패널(300)과 거의 같이 움직였고, 둘이 동시에 움직여 눈이
  // 갈렸다. 먼저 앉혀 두면 패널 착지만 보게 된다 — motion.md §2 「상태 표시」 ·
  // §7 「시스템이 답할 때는 즉시」. (2026-09-08 · prototype AL2)
  //
  // ⚠️ 이름에 `Dialog` 를 붙이지 않는다. 붙어 있던 시절 실제로 "다이얼로그만
  //    바뀐다"고 잘못 읽었다 — 시트와 풀팝업도 이 값으로 어두워진다.
  overlay: {
    duration: motionDuration.d2,
    ease: motionEase.standard,
  } satisfies Transition,
  // 퇴장은 패널과 같이 간다. 딤이 먼저 걷히면 패널이 밝은 배경 위에 잠깐 뜬다.
  overlayExit: {
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
 *    (design-system.md §6 · a11y.md §6).
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

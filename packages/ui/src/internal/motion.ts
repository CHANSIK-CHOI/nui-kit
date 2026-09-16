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

/** `--nui-duration-1` ~ `-6` 과 같은 값 (초 단위). 7 · 8 은 참조 0 이라 2026-09-11 에 지웠다 — UI 는 300ms 아래 */
export const motionDuration = {
  d1: 0.05,
  d2: 0.1,
  d3: 0.15,
  d4: 0.2, // 마이크로/매크로 경계
  d5: 0.25,
  d6: 0.3,
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
  // ── 큰 면이 한 방향으로 미끄러질 때 ★ (2026-09-15 · FullPopup)
  //
  // Emil 의 `--ease-drawer` 그대로다 (`review-animations/STANDARDS.md:34` · 드로어 레시피가 쓰는 곡선).
  // 예전에는 「시트를 스프링으로 열기로 해서 쓸 자리가 없다」며 안 들였는데, **풀팝업이 원래
  // 이 곡선의 자리**였다.
  //
  // 왜 필요한가 — `enterEmphasized` 는 420px 을 300ms 에 건널 때 **첫 프레임에 130px** 을 뛰고
  // 31ms 에 절반이 끝난다. 나머지 270ms 는 거의 멈춘 채 붙는 시간이라 「너무 빠르다」로 읽힌다.
  // 이 곡선은 같은 300ms 에 첫 프레임 58px · 절반 49ms 다 (실측 · spec §5).
  //
  // ⚠️ **SCSS 짝이 없다.** CSS 로 이 곡선을 쓰는 자리가 아직 없어서다 — 안 쓰는 토큰을 선언하면
  //    죽은 토큰이 된다(tokens.md §5-3). CSS 에서 쓸 자리가 생기면 그때 `_seed.scss` 에 더한다.
  drawer: [0.32, 0.72, 0, 1],
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
  // **등장과 놓았을 때가 한 물리다.** G1(2026-09-15)이 이 값 하나를 세 자리에 쓴다 —
  // 등장 · 끌다 놓았을 때의 되돌아감 · 끌어서 닫힐 때(+ 놓은 `velocity`). 여기를 고치면
  // 셋이 같이 움직인다. 따로 `panelSheetDrag*` 를 두지 않는 이유다 (`PopupBase.tsx`).
  //
  // `bounce: 0` 인 이유 — 튐은 **던졌을 때만**이다. 버튼으로 여는 등장이 튀면 어색하다.
  // 끌어서 닫힐 때도 0 이다 — 목표가 화면 밖이라 튐이 되돌아온 것처럼 읽힌다.
  // `visualDuration` 은 "눈에 보이는 시간" 이라 duration 스케일과 같은 뜻으로 읽힌다.
  //
  // ⚠️ 예전에는 `d8`(400)이었다. Emil 의 **"UI animations stay under 300ms"** 규칙에
  //    걸렸고, 그 규칙의 반례가 정확히 400ms 였다. SEED 도 300 이다.
  // ⚠️ **0.3 에서 0.25 로 당겼다** (2026-09-15 · 실기기). 시트는 팝업 중 가장 멀리 움직이는데
  //    (704px · 다이얼로그는 24px) 스프링의 꼬리가 길어 「아직 안 끝났다」가 남았다. 실측 —
  //    0.3 은 97% 에 307ms · 마지막 1px 까지 530ms, 0.25 는 256ms · 441ms.
  panelSheet: {
    type: "spring",
    bounce: 0,
    visualDuration: 0.25,
  } satisfies Transition,
  // 등장(0.25)보다 짧다 — 퇴장은 등장보다 짧다 (design-system.md §6-2). d5(250)였을 때는 둘이 같았다.
  panelSheetExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // ── 끌어서 닫힐 때만 ★ (2026-09-15 · G1 실기기 측정)
  //
  // 등장값(`panelSheet` 0.25)으로 나가면 **버튼으로 닫을 때(d4 200)보다 느리다.** 손으로 민 쪽이
  // 더 느린 것은 거꾸로다 — 퇴장은 등장보다 짧다(tokens.md §3-6 · design-system.md §6-2).
  //
  // 등장 · 되돌아감은 `panelSheet`(0.25) 그대로다. 놓았을 때 제자리로 돌아오는 것은 「퇴장」이
  // 아니라 취소라, 등장과 같은 물리여야 손에 붙는다.
  //
  // ⚠️ 딤과 견주지 않는다 — 딤은 전용 값 없이 **이 값을 그대로 따라온다**(위 dim 절).
  panelSheetDragExit: {
    type: "spring",
    bounce: 0,
    visualDuration: 0.2,
  } satisfies Transition,

  // fullPopup — 전체 화면 슬라이드.
  // ⚠️ `d7`(350)이었다. 같은 "300ms 아래" 규칙에 걸려 내렸다. 끌 수 없는 것이라
  //    스프링은 쓰지 않는다 — 스프링은 손으로 만질 수 있는 것의 도구다.
  //
  // ⚠️ **곡선이 `enterEmphasized` 에서 `drawer` 로 바뀌었다** (2026-09-15 · 실기기에서 「너무
  //    빠르다」). 시간은 300 그대로다 — 문제는 길이가 아니라 첫 프레임이었다(위 `drawer` 주석).
  panelFull: {
    duration: motionDuration.d6,
    ease: motionEase.drawer,
  } satisfies Transition,
  panelFullExit: {
    duration: motionDuration.d4,
    ease: motionEase.exit,
  } satisfies Transition,

  // ── dim ★ **딤 전용 값이 없다** (2026-09-15).
  //
  // 딤은 패널의 트랜지션을 **그대로** 쓴다 — 같은 시간 · 같은 곡선 · 같은 스프링. 그래서
  // 여기에 `overlay` · `overlayExit` 토큰이 없다. 자리는 `PopupBase` 의 `panelMotion` 하나다.
  //
  // 정본이 그렇게 말한다 — Emil `animate/RECIPES.md` 의 모달 레시피가 패널 250 · 백드롭 250 을
  // 같이 두고 *"Animate the backdrop's opacity **alongside** it so they read as **one surface**"*
  // 라고 적는다. 딤과 패널은 두 개가 아니라 **한 면**이다.
  //
  // ⚠️ 예전에는 딤을 먼저 앉혔다 — d5(250) → d2(100) → d4(200). 「딤은 전환이 아니라 상태
  //    선언이라 먼저 앉는다」는 2026-09-08 prototype AL2 의 결정이었는데, **정본에서 벗어난
  //    것이면서 대장에 이탈로 적히지 않았다.** 2026-09-15 에 사용자가 정본으로 돌아가기로
  //    정하면서 그 결정과 미기록 이탈이 함께 사라졌다. 이력은 `decisions/motion.md`.
  //
  //    딤이 패널마다 다른 값을 갖게 되므로 「팝업 셋이 한 값을 공유한다」도 함께 끝났다 —
  //    dialog 는 d6/d4 곡선, 시트는 스프링, 풀팝업은 drawer 곡선으로 각자 따라간다.

  // 레이아웃 전환
  panel: {
    duration: motionDuration.d5,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  panelExit: {
    duration: motionDuration.d3,
    ease: motionEase.exit,
  } satisfies Transition,

  // ── 툴팁 ★ 드롭다운과 **다른 시계**다 (2026-09-08 · 07 M2)
  //
  // motion.md §5-2 는 툴팁 150/100 · 드롭다운 200/250 을 **다른 행**으로 두는데
  // 코드가 `popover` 하나로 둘을 먹이고 있었다 — 툴팁이 표보다 느렸다.
  // Emil 표도 나눈다: Tooltips 125~200 · Dropdowns 150~250.
  tooltip: {
    duration: motionDuration.d3,
    ease: motionEase.enterEmphasized,
  } satisfies Transition,
  tooltipExit: {
    duration: motionDuration.d2,
    ease: motionEase.exit,
  } satisfies Transition,

  // 드롭다운 · 셀렉트 · 달력 — 트리거에서 자란다
  //
  // ⚠️ `standard` 는 첫 프레임이 10% 라 뜸을 들인다. 등장에는 쓰지 않는다
  //    (motion.md §5-1). `enterEmphasized` 는 43% 다.
  //
  // ⚠️ 08 SE1 이 이 값을 150/100 으로 내리자고 했는데 **따르지 않는다.**
  //    근거가 SEED 인데 **시간의 정본은 Emil** 이다(2026-09-06 결정). Emil 의
  //    드롭다운 범위는 150~250 이라 200 이 그 안이고, 우리 표는 드롭다운·셀렉트·
  //    달력을 한 행으로 묶는다 — Select 만 내리면 같은 역할이 갈린다.
  popover: {
    duration: motionDuration.d4,
    ease: motionEase.enterEmphasized,
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

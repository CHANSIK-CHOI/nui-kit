"use client";

import cn from "classnames";
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import { CloseIcon } from "../Icon/index.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import type { PopupBaseProps, PopupVariant } from "./Popup.types.js";
import { PopupHostContext, warnPopupHostMissing } from "./PopupHost.context.js";
import usePopupPanelA11y from "./usePopupPanelA11y.js";

const block = px("popup");

/** variant 값(카멜)을 kebab 클래스명으로 옮긴다 */
const VARIANT_CLASS: Record<PopupVariant, string> = {
  dialog: "dialog",
  bottomSheet: "bottom-sheet",
  full: "full",
};

/**
 * ⚠️ **`transform` 문자열로 준다** — `y`·`scale` 숏핸드가 아니다
 *    (2026-09-08 · 07 M5).
 *
 * framer 의 숏핸드는 메인 스레드 rAF 로 매 프레임 inline style 을 쓴다.
 * 페이지가 바쁠 때 프레임이 떨어진다. `transform` 문자열이면 WAAPI 로 넘어간다 —
 * Emil `animate/SKILL.md`: *"In Motion, use the full transform string. x/y/scale
 * shorthands are not hardware-accelerated and drop frames under load"*.
 *
 * ⚠️ **시트만 `y` 키다** (2026-09-15 · G1 · spec §5). 드래그가 `y` 모션값을 움직이는데
 *    `transform` 문자열을 함께 주면 둘이 같은 CSS 속성을 놓고 겨뤄 손가락을 따라오지
 *    않는다. 등장 · 되돌아감 · 날려서 닫기가 한 값 위에서 이어져야 해서 이 한 자리만
 *    규칙(motion.md §4)에서 벗어난다. `dialog` · `full` 은 문자열 그대로다.
 *
 * ⚠️ 시트의 `100%` 는 **퍼센트라 자기 크기 기준**이다. px 로 적으면
 *    시트 높이가 바뀔 때 어긋난다 (motion.md §4). `animate` 의 `0` 은 숫자여야 한다 —
 *    드래그가 `y.get()` 에 px 를 더하므로 문자열 `"0%"` 면 산술이 깨진다.
 */
function getPanelMotion(variant: PopupVariant, shouldReduce: boolean | null) {
  // 시트 · 전체는 **미끄러지는 것이 곧 등장**이라 투명도를 1 로 고정한다. 모션 감소에서만 0 에서
  // 시작한다 — 이동을 빼면 남는 것이 페이드뿐이라, 1 이면 패널이 딤 위에 한 프레임에 나타난다
  // (2026-09-17 사용자 결정 · Apple §14 *"replace slides … with short opacity cross-fades"*).
  const slideOpacity = shouldReduce ? 0 : 1;

  if (variant === "bottomSheet") {
    return {
      initial: { opacity: slideOpacity, y: "100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: slideOpacity, y: "100%" },
      enter: motionTransition.panelSheet,
      exitTransition: motionTransition.panelSheetExit,
    };
  }

  if (variant === "full") {
    return {
      initial: { opacity: slideOpacity, transform: "translateX(100%)" },
      animate: { opacity: 1, transform: "translateX(0%)" },
      exit: { opacity: slideOpacity, transform: "translateX(100%)" },
      enter: motionTransition.panelFull,
      exitTransition: motionTransition.panelFullExit,
    };
  }

  return {
    initial: { opacity: 0, transform: "translateY(24px) scale(0.96)" },
    animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
    exit: { opacity: 0, transform: "translateY(24px) scale(0.97)" },
    enter: motionTransition.panelDialog,
    exitTransition: motionTransition.panelDialogExit,
  };
}

// ── 끌어서 닫기 ★ (2026-09-15 · G1 · spec §6-7 · motion.md §8)
//
// 「BottomSheet 전용 로직」이 아니라 **「방향이 있는 variant 는 들어온 방향으로 끌어
// 나갈 수 있다」** 가 틀이다. `getPanelMotion` 이 variant 로 진입 방향을 가르듯 여기도
// **표 하나**로 축을 가르고, 아래 코드는 축 이름을 다시 적지 않는다 — `drag` · 모션값 키 ·
// `info.offset[axis]` · `info.velocity[axis]` · 치수 · exit 목표가 전부 이 표를 읽는다.
//
// 지금 문을 연 것은 `bottomSheet`(`y`) 하나다. `full` 은 배선(`x`)이 있으나 타입이 문을
// 안 열었다(`Popup.types.ts` — `FullPopupProps` 가 `shouldCloseOnDrag` 를 Omit). 여는 데
// 필요한 것 셋 — 타입 한 줄 · `getPanelMotion` 의 `full` 을 `transform` 문자열에서 `x` 키로 ·
// 끄는 면(손잡이는 시트 것이라 헤더만). `dialog` 는 방향이 없다.
type DragAxis = "x" | "y";
const DRAG_AXIS: Record<PopupVariant, DragAxis | null> = {
  bottomSheet: "y",
  full: "x",
  dialog: null,
};

/** 놓았을 때 닫히는 손가락 거리 — 축 방향 패널 치수에 대한 비율 (Apple §6 「거리 40%」) */
const DRAG_CLOSE_DISTANCE_RATIO = 0.4;
/**
 * 놓았을 때 닫히는 속도 — **px/s**.
 *
 * ⚠️ framer 타입 주석은 `px/ms` 라 적혀 있으나 `PanSession` 이 초로 나눈다
 *    (`references/grx7-framer-motion/drag-gesture.md`). `0.11` 로 적으면 살짝만 움직여도 닫힌다.
 *
 * motion.md §8 의 카드값은 `0.11 px/ms`(= 110)인데 **실기기에서 무거웠다** — 살짝 튕기는
 * 손짓이 문턱을 못 넘었다. 80 으로 내렸다(2026-09-15 · `sources/emil-apple.md` 이탈 행).
 * 거리 문턱(40%)은 카드 그대로다.
 */
const DRAG_CLOSE_VELOCITY = 80;
/** 축의 양끝을 0 에 묶는다 — 나가는 쪽은 러버밴드로만 따라온다 */
const DRAG_CONSTRAINTS: Record<DragAxis, Record<string, number>> = {
  y: { top: 0, bottom: 0 },
  x: { left: 0, right: 0 },
};
/** 러버밴드 — 들어온 쪽 0.1 (키우지 않는다) · 나가는 쪽 0.7 (motion.md §8) */
const DRAG_ELASTIC: Record<DragAxis, Record<string, number>> = {
  y: { top: 0.1, bottom: 0.7 },
  x: { left: 0.1, right: 0.7 },
};
/**
 * 모션 감소 — **탄성이 없다.** 들어온 쪽은 0(안 늘어남), 나가는 쪽은 1(손가락과 1:1).
 *
 * 끄는 것 자체는 남긴다 — 손가락이 움직인 만큼만 움직이는 직접 조작이고, 끄면 × 가 기본으로 없는
 * 시트의 닫는 길이 줄어든다. 빼는 것은 손가락보다 덜 따라오는 **탄성**이다 — Apple §14
 * *"Drop elastic/overshoot"* (2026-09-17 사용자 결정 · spec §6-7).
 */
const DRAG_ELASTIC_REDUCED: Record<DragAxis, Record<string, number>> = {
  y: { top: 0, bottom: 1 },
  x: { left: 0, right: 1 },
};
// ⚠️ 예전에 여기 `DRAG_START_EXCLUDE`(버튼 · 링크 · 입력)가 있었는데 **도달할 수 없는 코드였다**
//    (2026-09-15 리뷰). 끄는 면이 헤더였을 때는 헤더 안의 버튼을 걸러내야 했지만, 지금 리스너는
//    자식이 없는 띠 하나에만 붙는다 — 막대는 `::before` 라 이벤트 타겟이 될 수 없으므로
//    `event.target` 은 언제나 띠 자신이다. 닫기 버튼이 안 삼켜지는 것은 그 목록 덕이 아니라
//    **X 가 DOM 의 마지막이고 `z-index: 1`** 이기 때문이다(§6-1).

/**
 * 끌어서 닫을 때 exit 에 넘기는 값. `AnimatePresence custom` 으로 간다 — 나가는 요소의
 * props 는 마지막 렌더에 고정되므로 놓은 속도를 prop 으로는 못 넘긴다.
 *
 * 목표를 `"100%"` 가 아니라 **px** 로 주는 이유 — framer 는 단위가 다르면 원점을 목표
 * 단위로 바꾸고, 그러면 px/s 속도가 %/s 로 읽혀 날아간다 (spec §6-7).
 */
type DragExit = { velocity: number; distance: number };

/**
 * 모든 팝업의 공통 골격. 소비자가 쓰는 것은 LayerPopup / BottomSheet / FullPopup 이다.
 * dim + 위치 잡기 + 패널 + 헤더/본문/푸터 슬롯 + 모션 + 접근성을 담당한다.
 *
 * **Host 표식이 없으면 그리지 않는다** (2026-09-17 · spec §6-2). 팝업을 여는 길은
 * `PopupHost` 하나다 — 손으로 `<LayerPopup open>` 을 렌더하면 잠금 · inert · 포커스 복원이
 * 빠진 채 화면에만 뜨던 자리를 여기서 닫는다. 다섯 셸이 전부 이 문을 지난다.
 * 훅 규칙 때문에 골격 본체(`PopupBaseInner`) 앞에 얇은 문 하나를 둔다.
 */
export default function PopupBase(props: PopupBaseProps) {
  const isInsideHost = useContext(PopupHostContext);

  useEffect(() => {
    if (isInsideHost) return;

    warnPopupHostMissing(
      "render-outside-host",
      "팝업을 PopupHost 밖에서 렌더했다 — 그리지 않는다. 컴포넌트를 만들어 useLayerPopup() · useBottomSheet() · useFullPopup() 의 open({ component }) 로 연다.",
    );
  }, [isInsideHost]);

  if (!isInsideHost) return null;

  return <PopupBaseInner {...props} />;
}

function PopupBaseInner({
  children,
  id,
  className,
  panelClassName,
  bodyClassName,
  footerClassName,
  open,
  variant = "dialog",
  size = "medium",
  contentAlign = "center",
  title,
  titlePlacement = "head",
  icon,
  description,
  footer,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  hasCloseButton = true,
  closeLabel = "팝업 닫기",
  shouldCloseOnBackdrop = true,
  shouldCloseOnEscape = true,
  shouldCloseOnDrag = false,
  hasDragHandle = true,
  dialogLabel,
  onRequestClose,
  onClickClose,
  onCloseComplete,
  // 기본값은 `true` 다 — 스택을 아는 것은 `PopupHost` 뿐이고 그쪽은 열린 팝업마다
  // 값을 **항상 명시적으로** 넘긴다(`PopupHost.tsx`). 남는 자리는 소비자가 팝업을
  // 직접 렌더하는 선언형이고 거기서는 답이 사실상 언제나 `true` 다.
  //
  // ⚠️ `false` 를 기본으로 두면 최초 포커스 이동·포커스 트랩·ESC 셋이 **조용히**
  //    죽는다(`usePopupPanelA11y`). 화면은 멀쩡하고 마우스도 멀쩡해서 키보드
  //    사용자만 겪는다 — 소비자가 알아챌 수 없는 종류의 기본값이다 (a11y.md §5).
  isTopmost = true,
}: PopupBaseProps) {
  // framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6).
  const shouldReduceMotion = useReducedMotion();

  const generatedTitleId = useId();
  const generatedDescriptionId = useId();
  const panelMotion = getPanelMotion(variant, shouldReduceMotion);
  // 본문에 그리는 제목은 head 를 부르지 않는다 — `Alert`·`Confirm` 은 닫기 버튼도 없으므로
  // head 노드 자체가 사라진다 (spec §2 · §6-1).
  const isTitleInBody = titlePlacement === "body";
  const hasHeader = (Boolean(title) && !isTitleInBody) || hasCloseButton;
  // ── 끌어서 닫기 (spec §6-7)
  //
  // 축은 `DRAG_AXIS` 가 variant 로 가른다. `drag` 는 패널에 걸되 `dragListener={false}` 로
  // 자동 리스너를 끈다 — framer 는 리스너가 붙은 요소에 `touch-action` 을 스스로 걸어, 패널
  // 전체가 리스너면 본문 세로 스크롤이 죽는다. **띠**의 `pointerdown` 이 `dragControls.start` 로
  // 연다 — 헤더는 끄는 면이 아니다(§6-7).
  const dragAxis = DRAG_AXIS[variant];
  const isDraggable = dragAxis != null && shouldCloseOnDrag;
  const dragControls = useDragControls();
  // 등장(`initial` "100%" → 0) · 드래그 · 되돌아감 · 닫힘이 **이 값 하나**를 나눠 쓴다.
  const panelOffset = useMotionValue<number | string>(0);
  // 놓은 속도를 exit 에 넘기는 통로 — state 다. `onDragEnd` 에서 적고 바로 이어지는
  // `onRequestClose` 와 한 배치로 렌더되어 `AnimatePresence custom` 이 그 값을 본다.
  // 드래그가 아닌 닫기 길과 거절된 요청은 지워서 옛 속도가 다음 닫힘에 새지 않게 한다.
  const [dragExit, setDragExit] = useState<DragExit | null>(null);

  // 드래그가 아닌 닫기 길 셋(ESC · 딤 · 닫기 버튼)은 옛 속도를 지우고 닫는다.
  // `usePopupPanelA11y` 가 effect 의존성으로 쓰므로 참조가 안정돼야 한다 — 아니면
  // 본문 스크롤 경계가 바뀔 때마다 document 의 keydown 리스너가 떼고 붙는다.
  const requestClose = useCallback(() => {
    setDragExit(null);
    onRequestClose?.();
  }, [onRequestClose]);

  const { panelRef } = usePopupPanelA11y({
    open,
    isTopmost,
    shouldCloseOnEscape,
    onRequestClose: onRequestClose ? requestClose : undefined,
  });

  // 닫기 요청이 **거절됐다** — `onRequestClose` 를 불렀는데 `open` 이 그대로인 경우다(작성 중
  // 가드처럼 소비자가 닫기를 미루는 자리 · design-system.md §12-1). 그대로 두면 시트가 내려간
  // 자리에 남는다. 모션 감소에서는 위에서 되돌아감을 건너뛰므로 **여기가 유일한 복구 경로**다.
  //
  // 닫히는 경우에는 같은 배치에서 `open` 이 거짓이 되므로 이 effect 는 일찍 돌아간다.
  useEffect(() => {
    if (!open || dragExit == null) return;

    // 되돌아감은 **위치만 바뀌는** 전환이라 모션 감소에서 페이드로 바꿀 것이 없다 — 즉시다.
    // 헬퍼(`reduceMotionTransition`)를 쓰지 않는다: 그것은 같은 시간의 전환을 돌려주므로
    // 여기서는 250ms 이동이 남는다 (motion.ts 주석).
    animate(
      panelOffset,
      0,
      shouldReduceMotion ? { duration: 0 } : motionTransition.panelSheet,
    );
    setDragExit(null);
  }, [open, dragExit, panelOffset, shouldReduceMotion]);

  const titleId = title ? generatedTitleId : undefined;
  const descriptionId = description ? generatedDescriptionId : undefined;

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragControls.start(event);
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (!dragAxis) return;

    // `info.offset` 은 **손가락** 거리다 — 러버밴드가 걸린 패널 이동량이 아니다.
    const panel = panelRef.current;
    const distance =
      (dragAxis === "y" ? panel?.offsetHeight : panel?.offsetWidth) ?? 0;
    const velocity = info.velocity[dragAxis];
    const shouldClose =
      info.offset[dragAxis] >= distance * DRAG_CLOSE_DISTANCE_RATIO ||
      velocity > DRAG_CLOSE_VELOCITY;

    if (shouldClose && onRequestClose) {
      // 모션 감소면 속도를 이어받지 않는다 — 퇴장이 이동 없이 그 자리에서 페이드라 쓸 곳이 없다
      setDragExit({ velocity: shouldReduceMotion ? 0 : velocity, distance });
      onRequestClose();

      // ⚠️ 모션 감소에서는 제자리로 되돌리지 않는다 — **끌어 내린 자리에서 사라져야 한다.**
      //    그렇다고 아무것도 안 걸면 framer 가 드래그 종료에 스스로 건 복귀(경계 0 으로의 탄성)가
      //    그대로 돌아, 페이드되는 동안 패널이 원점으로 끌려간다(qa 실측 317 → 114px · 2026-09-17).
      //    예전에는 퇴장이 즉시라 안 보였다. 그래서 **지금 자리로 0ms 전환**을 걸어 그 복귀를 덮는다 —
      //    모션을 켠 경로가 우리 스프링으로 덮는 것과 같은 수단이다. 통로는 `handleExitComplete` 가 비운다.
      if (shouldReduceMotion) {
        animate(panelOffset, panelOffset.get(), { duration: 0 });
        return;
      }
    }

    // 되돌아감은 그 밖에 **언제나** 건다. 놓는 순간 framer 가 자기 inertia(bounceStiffness 200 ·
    // Damping 40)를 먼저 걸고 `onDragEnd` 는 그 뒤에 온다 — 같은 값에 우리 스프링을 걸어
    // 덮는다. 등장과 같은 `panelSheet` 라 **한 물리**다. 닫히면 exit 이 같은 값을 `start()`
    // 하며 이것을 멈추고(`stop` 은 `onComplete` 를 부르지 않는다), 요청이 거절돼 열린 채면
    // 끝까지 돌아와 통로를 비운다. 모션 감소면 즉시 제자리(위 effect 와 같은 이유로 헬퍼를 안 쓴다).
    animate(panelOffset, 0, {
      ...(shouldReduceMotion ? { duration: 0 } : motionTransition.panelSheet),
      onComplete: () => setDragExit(null),
    });
  };

  // ── 딤은 패널과 **한 면**이다 ★ (2026-09-15 · 정본으로 되돌림)
  //
  // Emil `animate/RECIPES.md` — *"Animate the backdrop's opacity **alongside** it so they read as
  // **one surface**"*. 그래서 딤 전용 시간이 없다. 등장은 아래 `panelMotion.enter`, 퇴장은
  // 패널이 쓰는 바로 그 값이다. variant 마다 패널이 다르므로 딤도 variant 마다 다르다.
  //
  // 끌어서 닫을 때도 같다 — 패널이 놓은 속도로 나가면 딤도 같은 스프링으로 걷힌다.
  //
  // ⚠️ **정지 기준을 속성마다 붙인다** (2026-09-17 · `/review-animations`). framer 는 거리 **그리고**
  //    속도가 둘 다 기준 안일 때 멈추고, AnimatePresence 는 패널과 딤이 **둘 다** 멈춰야 뺀다.
  //    기본값(패널 2px/s · 딤 opacity 0.01/s)이면 눈에 안 보이는 꼬리가 ~150ms 더 마운트를 붙들어
  //    명령형 경로의 배경 스크롤 잠금까지 늦췄다. 지금은 패널이 1px 안에 든 뒤 **두 프레임**(멈춤 판정 ·
  //    React 커밋)에 DOM 에서 빠진다 — 60fps 실측 348ms → 383ms (spec §6-7).
  //    `restDelta` 는 거리라 단위가 갈린다 — 패널에 준 `1`(px)을 딤에 주면 opacity 0~1 전체가
  //    「이미 도착」이라 첫 프레임에 끝난다. 그래서 공용 값(`motion.ts`)에 두지 않는다.
  //    딤에 opacity 단위의 `restDelta` 도 주지 않는다 — 딤은 WAAPI 로 돌고 framer 가 그 길이를
  //    0~100 스케일에서 재므로 오히려 300 → 450ms 로 늘어난다. `restSpeed` 만으로 패널보다 먼저 끝난다.
  const dimExit = (custom: DragExit | null) => ({
    opacity: 0,
    transition: reduceMotionTransition(
      custom != null
        ? { ...motionTransition.panelSheetDragExit, restSpeed: 10 }
        : panelMotion.exitTransition,
      shouldReduceMotion,
    ),
  });

  // 끌어서 닫았을 때만 exit 이 놓은 속도와 px 목표를 받는다. 나머지 닫기는 §5 의 `d4 + exit`.
  const panelDragExit = (custom: DragExit | null) => {
    const byDrag = custom != null && dragAxis != null;
    // 모션 감소면 투명도가 0 으로 간다 — 이동은 `reduceMotion` 이 빼므로 끌어 내린 자리에서 페이드된다.
    // 시간은 `panelSheetDragExit`(물리 스프링 · 시간 없음)라 헬퍼가 `d4` 200 을 쓴다.
    const dragOpacity = shouldReduceMotion ? 0 : 1;
    const target = byDrag
      ? dragAxis === "y"
        ? { opacity: dragOpacity, y: custom.distance }
        : { opacity: dragOpacity, x: custom.distance }
      : panelMotion.exit;
    const transition = byDrag
      ? {
          ...motionTransition.panelSheetDragExit,
          velocity: custom.velocity,
          restDelta: 1,
          restSpeed: 20,
        }
      : panelMotion.exitTransition;

    return {
      ...reduceMotion(target, shouldReduceMotion),
      transition: reduceMotionTransition(transition, shouldReduceMotion),
    };
  };

  const handleExitComplete = () => {
    // 열 때마다 0 에서 시작한다 — 모션 감소에서는 `initial` 이 축 값을 안 건드리므로
    // 여기서 되돌리지 않으면 끌어서 닫은 자리에서 다시 열린다 (spec §6-7).
    //
    // ⚠️ `set` 이 아니라 **`jump`** 다 (2026-09-15 · 실기기에서 잡혔다). `set` 은 값만 놓고
    //    **돌고 있는 애니메이션을 멈추지 않아서**, framer 가 드래그 종료에 스스로 건 관성이
    //    다음 프레임에 옛 값을 다시 쓴다. 모션 감소에서는 우리 되돌아감을 걸지 않으므로
    //    그 관성이 유일한 주인이고, 실제로 다시 열면 손을 뗀 자리에서 시작했다.
    //    `jump` 는 값을 놓으면서 `stop()` 까지 부른다.
    panelOffset.jump(0);
    setDragExit(null);
    onCloseComplete?.();
  };

  const handleBackdropClick = () => {
    if (!shouldCloseOnBackdrop) return;

    requestClose();
  };

  const handleCloseButtonClick = () => {
    onClickClose?.();
    requestClose();
  };

  // ── 표준 푸터 (2026-09-09)
  //
  // 취소는 line · 확인은 solid 이고, 둘 다 있으면 3:7 이다 (design-system.md §2-4-1 —
  // 첫 항목이 Dismiss 일 때). 하나만 있으면 비율 없이 그 하나가 폭을 채운다.
  // `onCancel` 을 안 주면 `onRequestClose` 가 대신한다 — 취소는 닫아 달라는 뜻이다.
  const hasStandardFooter =
    footer == null && (confirmLabel != null || cancelLabel != null);
  const standardFooter = hasStandardFooter ? (
    <ButtonGroup
      className={`${block}__actions`}
      ratio={confirmLabel != null && cancelLabel != null ? "3:7" : "equal"}
    >
      {cancelLabel != null ? (
        <ButtonGroupItem>
          <Button
            type="button"
            variant="line"
            size="medium"
            onClick={onCancel ?? onRequestClose}
          >
            {cancelLabel}
          </Button>
        </ButtonGroupItem>
      ) : null}
      {confirmLabel != null ? (
        <ButtonGroupItem>
          <Button type="button" size="medium" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ButtonGroupItem>
      ) : null}
    </ButtonGroup>
  ) : null;
  const resolvedFooter = footer ?? standardFooter;

  // ── 본문 스크롤 경계선 ★ (2026-09-08 · 08 DL2)
  //
  // SEED 는 스크롤이 시작되면 헤더 아래에 경계선을 노출하고(Divider Visibility),
  // 본문 하단에 Scroll Fog 를 깐다. **Fog 는 그라디언트라 쓰지 않는다** —
  // 「그라디언트는 쓰지 않는다. 고도는 표면색·그림자·선 셋으로 표현한다」
  // (design-system.md §2-5). 위아래 **같은 수단(선)** 으로 옮긴다 — 위는
  // "위로 더 있다", 아래는 "아래로 더 있다"를 말한다.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollEdges, setScrollEdges] = useState({ top: false, bottom: false });

  const syncScrollEdges = useCallback(() => {
    const element = bodyRef.current;

    if (!element) return;

    // 1px 여유 — 소수점 확대에서 scrollHeight 가 clientHeight 보다 살짝 커
    // 스크롤이 없는 본문에도 선이 그려지는 것을 막는다.
    const top = element.scrollTop > 1;
    const bottom =
      element.scrollHeight - element.scrollTop - element.clientHeight > 1;

    setScrollEdges((current) =>
      current.top === top && current.bottom === bottom
        ? current
        : { top, bottom },
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    syncScrollEdges();

    const element = bodyRef.current;

    if (!element || typeof ResizeObserver === "undefined") return;

    // ⚠️ 본문 **자식들**도 함께 관찰한다. 본문 자체는 높이가 고정이라 내용이
    //    늘어도 크기가 안 바뀐다 — 자식을 안 보면 나중에 채워지는 본문에서
    //    아래쪽 선이 뜨지 않는다.
    const observer = new ResizeObserver(syncScrollEdges);

    observer.observe(element);
    for (const child of element.children) observer.observe(child);

    return () => observer.disconnect();
  }, [open, syncScrollEdges]);

  const closeButton = hasCloseButton ? (
    <button
      type="button"
      className={`${block}__close`}
      aria-label={closeLabel}
      onClick={handleCloseButtonClick}
    >
      <CloseIcon width={20} height={20} />
    </button>
  ) : null;

  // 닫기 버튼은 DOM 의 가장 마지막에 둔다 (KRDS 가이드 397쪽 02).
  // 첫 포커스가 본문·푸터로 가고, 시각 위치는 CSS 가 우상단에 고정한다.
  // head 는 제목이 없어도 렌더한다 — 닫기 버튼이 앉을 자리를 비워 두는 몫이다.
  const titleNode = title ? (
    <span id={titleId} className={`${block}__title`}>
      {title}
    </span>
  ) : null;

  const headerContent = hasHeader ? (
    <div
      className={cn(`${block}__head`, {
        [`${block}__head--no-title`]: !title || isTitleInBody,
      })}
    >
      {titleNode && !isTitleInBody ? (
        <div className={`${block}__header-content`}>{titleNode}</div>
      ) : null}
    </div>
  ) : null;

  // ⑨ **끄는 띠** — 패널 위쪽 44px. 이것 **하나**가 끄는 면이다 (2026-09-15 · spec §6-7).
  //
  // 예전에는 손잡이 줄 24 + **헤더 전체**였다. 헤더를 뺀 이유 셋 — 제목이 두 줄이면 끄는
  // 면이 두 배가 되어 계약이 아니게 되고, 헤더의 `touch-action: none` 이 제목 선택을 막고,
  // 헤더에 컨트롤을 넣는 순간 그 컨트롤을 일일이 걸러 내야 한다. SEED
  // `bottom-sheet-handle.yaml` 도 `touchArea` 를 손잡이의 것(44×44)으로 두고 헤더를 모른다.
  //
  // 컨트롤이 아니다 — `aria-hidden` 장식이라 탭 순서에도 접근 이름에도 없다 (spec §7).
  // 막대(`::before`)는 `hasDragHandle` 일 때만 그려진다. 띠는 그것과 무관하게 남는다.
  //
  // ⚠️ 띠가 닫기 버튼과 겹치지만 X 가 DOM 의 마지막이고 `z-index: 1` 이라 X 가 클릭을 받는다.
  const handle = isDraggable ? (
    <div
      className={`${block}__handle`}
      aria-hidden="true"
      onPointerDown={startDrag}
    />
  ) : null;

  // 드래그가 켜진 것만 축 값을 우리 모션값에 물리고 exit 을 `custom` 으로 받는다.
  // 나머지(dialog · 드래그 없는 시트)는 예전 그대로다 — 갈림을 여기 한 곳에 모은다.
  const dragProps =
    isDraggable && dragAxis
      ? ({
          style: dragAxis === "y" ? { y: panelOffset } : { x: panelOffset },
          drag: dragAxis,
          dragListener: false,
          dragControls,
          dragConstraints: DRAG_CONSTRAINTS[dragAxis],
          dragElastic: shouldReduceMotion
            ? DRAG_ELASTIC_REDUCED[dragAxis]
            : DRAG_ELASTIC[dragAxis],
          dragMomentum: false,
          onDragEnd: handleDragEnd,
          variants: { exit: panelDragExit },
          exit: "exit",
        } as const)
      : {
          exit: {
            ...reduceMotion(panelMotion.exit, shouldReduceMotion),
            transition: reduceMotionTransition(
              panelMotion.exitTransition,
              shouldReduceMotion,
            ),
          },
        };

  return (
    // ⚠️ 표식을 여기서 다시 끈다 (2026-09-17 리뷰). Host 가 켠 표식은 portal 서브트리 전체에
    //    닿으므로, 이게 없으면 팝업 **안**에서 runtime 다섯을 손으로 지어내 셸을 렌더하는 길이
    //    남는다(dialog 가 중첩된다). 팝업 안에서 또 여는 것은 훅으로 한다.
    <PopupHostContext.Provider value={false}>
      <AnimatePresence onExitComplete={handleExitComplete} custom={dragExit}>
        {open ? (
          <motion.div
            id={id}
            className={cn(
              block,
              `${block}--${VARIANT_CLASS[variant]}`,
              size !== "medium" && `${block}--${size}`,
              contentAlign === "center" && `${block}--align-center`,
              hasCloseButton && `${block}--has-close`,
              // 띠가 있다(끌 수 있다) · 막대가 보인다 — 둘은 다른 것이다
              isDraggable && `${block}--has-drag`,
              isDraggable && hasDragHandle && `${block}--has-handle`,
              !hasHeader && `${block}--no-header`,
              // `--no-header` 와 다른 것을 잰다 — 앞은 "head 노드가 없다", 이쪽은 "제목이 없다".
              // `Alert`·`Confirm` 은 앞이 상수라 본문 최소 높이·설명 폭 보정이 이쪽에 걸린다 (spec §9).
              !title && `${block}--no-title`,
              !resolvedFooter && `${block}--no-footer`,
              className,
            )}
          >
            <motion.div
              className={`${block}__dim`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              variants={{ exit: dimExit }}
              exit="exit"
              // 패널과 같은 값 — 한 면으로 읽히게 (위 `dimExit` 주석)
              transition={reduceMotionTransition(
                panelMotion.enter,
                shouldReduceMotion,
              )}
              onClick={handleBackdropClick}
            />

            <div className={`${block}__positioner`}>
              <motion.section
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={titleId ? undefined : dialogLabel}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className={cn(`${block}__panel`, panelClassName)}
                tabIndex={-1}
                initial={reduceMotion(panelMotion.initial, shouldReduceMotion)}
                animate={reduceMotion(panelMotion.animate, shouldReduceMotion)}
                transition={reduceMotionTransition(
                  panelMotion.enter,
                  shouldReduceMotion,
                )}
                {...dragProps}
              >
                {handle}
                {headerContent}

                <div
                  ref={bodyRef}
                  className={cn(`${block}__body`, bodyClassName)}
                  data-scrolled-top={scrollEdges.top ? "true" : undefined}
                  data-scrolled-bottom={scrollEdges.bottom ? "true" : undefined}
                  onScroll={syncScrollEdges}
                >
                  {icon !== null && icon !== undefined ? (
                    <div className={`${block}__icon`}>{icon}</div>
                  ) : null}
                  {/* 아이콘 → 제목 → 설명. KRDS 390쪽의 「헤더」가 여기 들어온다 (spec §2) */}
                  {isTitleInBody ? titleNode : null}
                  {description ? (
                    <p id={descriptionId} className={`${block}__description`}>
                      {description}
                    </p>
                  ) : null}
                  {children}
                </div>

                {resolvedFooter ? (
                  <div className={cn(`${block}__foot`, footerClassName)}>
                    {resolvedFooter}
                  </div>
                ) : null}

                {closeButton}
              </motion.section>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PopupHostContext.Provider>
  );
}

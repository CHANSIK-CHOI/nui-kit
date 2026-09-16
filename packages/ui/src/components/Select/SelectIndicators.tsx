"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import {
  Children,
  useContext,
  useRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  components as reactSelectComponents,
  type ClearIndicatorProps,
  type ContainerProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type MenuProps,
  type MultiValueRemoveProps,
} from "react-select";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import Icon from "../Icon/Icon.js";
import SelectAriaContext from "./Select.context.js";
import { SELECT_BLOCK } from "./SelectBase.js";
import type { SelectOption } from "./Select.types.js";

/** react-select 의 `classNamePrefix` 가 이 블록 이름으로 클래스를 만든다. */
const REMOVE_BUTTON_SELECTOR = `.${SELECT_BLOCK}__multi-value__remove`;

/**
 * react-select 의 인디케이터 3종을 lucide 아이콘으로 바꾼다.
 *
 * react-select 기본 SVG 는 채움(fill) 도형이라 우리 아이콘(lucide, stroke 2)과
 * 선 스타일이 달랐다. 래퍼(`components.DropdownIndicator` 등)는 그대로 쓰고
 * **자식만** 바꾼다 — `classNamePrefix` 로 생성되는 클래스와 클릭 처리는
 * react-select 가 계속 소유한다. 크기는 `_select.scss` 가 정한다.
 *
 * ⚠️ 렌더 밖에서 선언한다 — 렌더 안에서 만들면 매 렌더 remount 된다
 *    (react-select 공식 문서 · Components → Replacing components).
 */
export function NuiDropdownIndicator<IsMulti extends boolean>(
  props: DropdownIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) {
  return (
    <reactSelectComponents.DropdownIndicator {...props}>
      <Icon icon={<ChevronDown />} />
    </reactSelectComponents.DropdownIndicator>
  );
}

export function NuiClearIndicator<IsMulti extends boolean>(
  props: ClearIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) {
  return (
    <reactSelectComponents.ClearIndicator {...props}>
      <Icon icon={<X />} />
    </reactSelectComponents.ClearIndicator>
  );
}

/**
 * 칩의 삭제 버튼. **래퍼를 쓰지 않고 통째로 바꾼다.**
 *
 * react-select 기본은 `<div role="button">` 이고 `tabIndex` 가 없어서
 *   · Tab 으로 닿지 않고 (KRDS 가이드 568쪽 · 체크리스트 [태그 3])
 *   · 초점을 못 받으니 초점 표시도 없고 (566쪽 01)
 *   · 접근 이름이 `"Remove {label}"` 영어로 고정돼 덮을 수단이 없다 (566쪽 02)
 * 세 가지가 한 뿌리라 요소 자체를 `<button>` 으로 바꿔 한 번에 푼다.
 *
 * ⚠️ `innerProps` 의 `onMouseDown`(preventDefault)은 그대로 살린다 —
 *    없으면 칩을 누를 때 입력창이 포커스를 잃고 메뉴가 열린다.
 */
export function NuiMultiValueRemove<IsMulti extends boolean>({
  innerProps,
  data,
  selectProps,
}: MultiValueRemoveProps<SelectOption, IsMulti, GroupBase<SelectOption>>) {
  const { getRemoveButtonLabel } = useContext(SelectAriaContext);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // react-select 은 이 핸들러들을 div 용으로 타이핑하지만 실제로는 평범한 DOM
  // 핸들러다. 요소만 button 으로 바뀌므로 타입만 맞춰 준다.
  // 영어 접근 이름은 버리고 우리 문구를 쓴다.
  const {
    "aria-label": _reactSelectLabel,
    onClick: removeValue,
    ...restInnerProps
  } = innerProps as unknown as ButtonHTMLAttributes<HTMLButtonElement>;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 지운 뒤 갈 자리를 **누르기 전에** 잡아 둔다.
    // 사라지는 것은 자기 자신뿐이라 이전 칩의 버튼 노드는 그대로 남는다.
    const container = buttonRef.current?.closest(`.${SELECT_BLOCK}__container`);
    const removeButtons = container
      ? [...container.querySelectorAll<HTMLElement>(REMOVE_BUTTON_SELECTOR)]
      : [];
    const currentIndex = buttonRef.current
      ? removeButtons.indexOf(buttonRef.current)
      : -1;
    const previousButton =
      currentIndex > 0 ? removeButtons[currentIndex - 1] : null;
    const comboboxInput = container?.querySelector<HTMLElement>("input");

    removeValue?.(event);

    // 옮기지 않으면 버튼이 사라지면서 포커스가 body 로 떨어져 이후 Tab 이
    // 문서 처음부터 다시 시작한다. 이전 칩, 없으면 컨트롤로
    // (KRDS 569쪽 · 체크리스트 [태그 5]).
    window.requestAnimationFrame(() => {
      if (previousButton?.isConnected) {
        previousButton.focus();
        return;
      }

      comboboxInput?.focus();
    });
  };

  // ⚠️ react-select 의 컨트롤이 Space 를 가로채 `preventDefault` 한다
  //    (검색이 꺼진 Select 에서 Space 는 메뉴를 여는 키다). 그대로 두면 버튼의
  //    기본 활성화가 취소되어 **Enter 로는 지워지는데 Space 로는 안 지워진다.**
  //    버튼 안에서 일어난 Space 는 위로 올려보내지 않는다.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " ") {
      event.stopPropagation();
    }
  };

  return (
    <button
      {...restInnerProps}
      ref={buttonRef}
      type="button"
      disabled={selectProps.isDisabled}
      aria-label={getRemoveButtonLabel(String(data.label))}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Icon icon={<X />} />
    </button>
  );
}

/**
 * 메뉴의 등장·퇴장 모션 (2026-09-08 · 07 M4 / 2026-09-16 퇴장과 방향).
 *
 * react-select 의 메뉴는 첫 프레임부터 완성된 채로 나타났다. 빈도는 「가끔」이고
 * 목적은 「급변 방지」라 Emil 의 게이트를 통과한다 (motion.md §1 · §2).
 * **값은 `Datepicker` 의 달력과 같다** — 드롭다운은 하나의 역할이다 (Select.md §6-7).
 *
 * ⚠️ **래퍼를 감싸는 대신 통째로 바꾼다.** 안쪽에 motion 을 넣으면 링과 그림자를
 *    가진 메뉴 면이 먼저 튀어나오고 내용만 자라 「패널이 번쩍인 뒤 글이 커지는」
 *    모양이 된다. 면 자체가 움직여야 한다.
 *
 * ⚠️ 클래스는 `cx` 로 **기본 Menu 와 똑같이** 만든다 — `classNamePrefix` 가
 *    만드는 블록 클래스(`SELECT_BLOCK` + `__menu`)가 우리 SCSS 의 유일한 진입점이다.
 *
 * ⚠️ **퇴장의 경계는 `NuiSelectContainer` 가 쥔다.** react-select 이 메뉴를
 *    언마운트하므로 여기서는 붙잡을 수 없다 — 컨테이너가 `AnimatePresence` 로
 *    감싸 준다(아래). `menuIsOpen` 을 제어하지 않으므로 `verify:select-rhf` 가
 *    지키는 remount 경로를 건드리지 않는다.
 *
 * ⚠️ **`key={placement}` 가 방향을 고친다.** framer 의 `initial` 은 마운트 때 한 번만
 *    읽히는데 `MenuPlacer` 의 `placement` state 초기값이 `null` 이라 **첫 렌더는
 *    언제나 `"bottom"`** 이고 `"top"` 은 `useLayoutEffect` 의 두 번째 렌더에 온다.
 *    그대로 두면 뒤집힌 메뉴가 **트리거 반대편에서 온다**(실측 — top 자리에서도
 *    `ty=-6.6`). key 가 바뀌면 remount 되어 `initial` 이 다시 읽힌다(`ty=+6.8`).
 *    layout effect 안이라 **페인트 전이고 깜빡임이 없다.** 열린 뒤에는 그 effect 의
 *    deps 에 스크롤이 없어 placement 가 다시 바뀌지 않는다.
 */
export function NuiMenu<IsMulti extends boolean>({
  children,
  innerRef,
  innerProps,
  className,
  cx,
  placement,
}: MenuProps<SelectOption, IsMulti, GroupBase<SelectOption>>) {
  const shouldReduceMotion = useReducedMotion();
  // ⚠️ framer 가 애니메이션·드래그 핸들러의 타입을 자기 것으로 덮어쓴다.
  //    react-select 의 `innerProps` 는 `div` 전체 속성 타입이라 그대로 펼치면
  //    타입이 부딪힌다. 실제로 오는 것은 `id` · `onMouseDown` 정도다.
  const {
    onAnimationStart: _onAnimationStart,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    ...restInnerProps
  } = innerProps ?? {};

  // 위로 뒤집히면 **배치 · 간격 · 모션 원점 · `translateY` 부호** 넷이 함께 뒤집힌다
  // (Select.md §6-7). 앞의 둘은 `--top` modifier 를 받은 CSS 가, 뒤의 둘은 여기가 한다.
  const isTop = placement === "top";
  // 트리거 쪽에서 자란다 — 아래로 펼치면 위에서, 뒤집히면 아래에서 (motion.md §6).
  // 숏핸드(`y` · `scale`)가 아니라 `transform` 문자열이다 — 숏핸드는 메인 스레드 rAF 다
  // (motion.md §4).
  const away = `translateY(${isTop ? 8 : -8}px) scale(0.97)`;

  return (
    <motion.div
      {...restInnerProps}
      // placement 가 확정되면 remount 되어 `initial` 이 다시 읽힌다 (머리 주석)
      key={placement}
      ref={innerRef}
      // `cx` 가 키마다 프리픽스를 붙인다 — `menu--top` → `…__menu--top`
      className={cx({ menu: true, "menu--top": isTop }, className)}
      style={{
        transformOrigin: isTop ? "bottom left" : "top left",
      }}
      initial={reduceMotion(
        { opacity: 0, transform: away },
        shouldReduceMotion,
      )}
      animate={reduceMotion(
        {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          pointerEvents: "auto",
        },
        shouldReduceMotion,
      )}
      // ⚠️ **퇴장에 `pointerEvents: "none"` 을 함께 준다.** 없으면 닫히는 동안 옵션이
      //    눌린다(실측 — 히트테스트가 메뉴를 집었다). 옵션은 `tabIndex: -1` 이라
      //    키보드로는 닿지 않으므로 막을 것이 포인터뿐이다.
      //    모션 감소에서는 `reduceMotion` 이 `opacity` 만 남기고 전환이 `duration: 0`
      //    이라 DOM 이 즉시 사라진다 — 눌릴 시간이 없다.
      exit={reduceMotion(
        {
          opacity: 0,
          transform: away,
          pointerEvents: "none",
          transition: motionTransition.popoverExit,
        },
        shouldReduceMotion,
      )}
      transition={reduceMotionTransition(
        motionTransition.popover,
        shouldReduceMotion,
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * 메뉴의 **퇴장 경계**를 만든다 (2026-09-16).
 *
 * react-select 의 `renderMenu()` 는 `menuIsOpen` 이 false 가 되는 즉시 `null` 을
 * 반환한다. 그래서 `AnimatePresence` 가 메뉴를 붙잡으려면 **메뉴보다 위**에 있어야
 * 하는데, 그 자리가 `SelectContainer` 다.
 *
 * ⚠️ **`SelectContainer` 를 대체하지 않고 안에서 그대로 부른다.** emotion 의
 *    `position: relative` · `boxSizing` · 비활성의 `pointerEvents: none` 이 살아 있어야
 *    한다 (Select.md §6-5).
 *
 * ⚠️ **`Children.map` 통과가 필수 조건이다.** children 은
 *    `[LiveRegion, Control, MenuPlacer|null, null]` **네 자리 고정**인데 원본 배열에
 *    key 가 없어 `AnimatePresence` 가 무엇이 사라졌는지 특정하지 못한다 — 그대로
 *    넘기면 메뉴가 **즉시 사라지고** key 중복 경고가 뜬다(대조군 실측).
 *    `Children.map` 이 위치 기반 key(`.0`~`.3`)를 만들면 메뉴는 언제나 `.2` 라
 *    안정적으로 추적된다. **메뉴를 배열에서 떼어내 재구성하지 않는다** — 위치 key 가
 *    밀려 non-portal 에서 깨진다.
 *
 * ⚠️ 메뉴는 `Menu`·`MenuPortal` 이 아니라 **`MenuPlacer`** 로 올라온다. 메뉴 노드를
 *    찾아 key 를 심는 코드는 필요 없다.
 *
 * ⚠️ **모듈 상수여야 한다.** 루트 컴포넌트라 identity 가 흔들리면 검색 input 까지
 *    트리 전체가 remount 된다 (§6-2 와 같은 함정).
 */
export function NuiSelectContainer<IsMulti extends boolean>({
  children,
  ...props
}: ContainerProps<SelectOption, IsMulti, GroupBase<SelectOption>>) {
  return (
    <reactSelectComponents.SelectContainer {...props}>
      <AnimatePresence initial={false}>
        {Children.map(children, (child) => child)}
      </AnimatePresence>
    </reactSelectComponents.SelectContainer>
  );
}

NuiSelectContainer.displayName = "NuiSelectContainer";

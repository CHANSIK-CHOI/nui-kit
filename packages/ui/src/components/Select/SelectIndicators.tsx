"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import {
  useContext,
  useRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  components as reactSelectComponents,
  type ClearIndicatorProps,
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
 * 메뉴에 등장 모션을 준다 (2026-09-08 · 07 M4).
 *
 * react-select 의 메뉴는 첫 프레임부터 완성된 채로 나타났다. 빈도는 「가끔」이고
 * 목적은 「급변 방지」라 Emil 의 게이트를 통과한다 (motion.md §1 · §2).
 *
 * ⚠️ **래퍼를 감싸는 대신 통째로 바꾼다.** 안쪽에 motion 을 넣으면 링과 그림자를
 *    가진 메뉴 면이 먼저 튀어나오고 내용만 자라 「패널이 번쩍인 뒤 글이 커지는」
 *    모양이 된다. 면 자체가 움직여야 한다.
 *
 * ⚠️ 클래스는 `cx` 로 **기본 Menu 와 똑같이** 만든다 — `classNamePrefix` 가
 *    만드는 블록 클래스(`SELECT_BLOCK` + `__menu`)가 우리 SCSS 의 유일한 진입점이다.
 *
 * ⚠️ **퇴장은 없다.** `AnimatePresence` 가 필요한데 react-select 이 메뉴를
 *    언마운트하므로 그 경계를 우리가 쥐려면 `menuIsOpen` 을 제어해야 한다 —
 *    그 길에 remount 회귀가 있어서 `verify:select-rhf` 가 따로 있다. 지금도
 *    퇴장 모션은 없으므로 잃는 것이 없다. 07 M4 의 남은 절반이다.
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

  // 위로 뒤집히면 **배치 · 간격 · 모션 원점** 셋이 함께 뒤집힌다 (Select.md §6-7).
  // 앞의 둘은 `--top` modifier 를 받은 CSS 가, 원점은 여기가 한다.
  const isTop = placement === "top";

  return (
    <motion.div
      {...restInnerProps}
      ref={innerRef}
      // `cx` 가 키마다 프리픽스를 붙인다 — `menu--top` → `…__menu--top`
      className={cx({ menu: true, "menu--top": isTop }, className)}
      // 트리거에서 자란다 — 위로 뒤집히면 아래 모서리에서 (motion.md §6)
      style={{
        transformOrigin: isTop ? "bottom left" : "top left",
      }}
      // ⚠️ **방향은 `transform-origin` 하나가 말한다 — `translateY` 를 쓰지 않는다**
      //    (2026-09-14). framer 의 `initial` 은 **마운트 때 한 번만** 읽히는데,
      //    react-select 의 `MenuPlacer` 는 placement 를 언제나 `"bottom"` 으로 먼저
      //    넘기고 `"top"` 은 layout effect 뒤에 준다. 그래서 `isTop` 으로 부호를
      //    뒤집어도 **뒤집힌 메뉴까지 `-4px` 로 등장**했다 — 트리거 반대편에서 오는
      //    모양이라 motion.md §6 을 어긴다(실측 `matrix(0.97,0,0,0.97,0,-4)` ·
      //    `origin: left bottom`). 원점은 재렌더로 따라오므로 그쪽에 맡긴다.
      initial={reduceMotion(
        { opacity: 0, transform: "scale(0.97)" },
        shouldReduceMotion,
      )}
      animate={reduceMotion(
        { opacity: 1, transform: "scale(1)" },
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

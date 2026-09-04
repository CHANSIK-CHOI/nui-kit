"use client";

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
  type MultiValueRemoveProps,
} from "react-select";
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
 *    (.claude/references/websites-react-select/components-replacement.md).
 */
export function NuiDropdownIndicator<IsMulti extends boolean>(
  props: DropdownIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) {
  return (
    <reactSelectComponents.DropdownIndicator {...props}>
      <ChevronDown aria-hidden="true" />
    </reactSelectComponents.DropdownIndicator>
  );
}

export function NuiClearIndicator<IsMulti extends boolean>(
  props: ClearIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) {
  return (
    <reactSelectComponents.ClearIndicator {...props}>
      <X aria-hidden="true" />
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
      <X aria-hidden="true" />
    </button>
  );
}

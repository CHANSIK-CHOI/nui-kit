"use client";

import { ChevronDown, X } from "lucide-react";
import {
  components as reactSelectComponents,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type MultiValueRemoveProps,
} from "react-select";
import type { SelectOption } from "./Select.types.js";

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

export function NuiMultiValueRemove<IsMulti extends boolean>(
  props: MultiValueRemoveProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) {
  return (
    <reactSelectComponents.MultiValueRemove {...props}>
      <X aria-hidden="true" />
    </reactSelectComponents.MultiValueRemove>
  );
}

"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { ComponentProps } from "react";
import type { Chevron } from "react-day-picker";

type ChevronProps = ComponentProps<typeof Chevron>;

const BY_ORIENTATION = {
  left: ChevronLeft,
  right: ChevronRight,
  up: ChevronUp,
  down: ChevronDown,
} as const;

/**
 * react-day-picker 의 이전/다음·드롭다운 화살표를 lucide 로 바꾼다.
 *
 * react-day-picker 는 `orientation` 하나로 네 방향을 구분한다
 * (react-day-picker 공식 문서 · Custom Components → Chevron).
 * 클래스는 react-day-picker 가 `classNames.chevron` 으로 넘겨주므로 그대로 붙이고,
 * 크기는 `_datepicker.scss` 의 `__chevron` 이 정한다. 접근 이름은 버튼이 갖는다.
 */
export function DaypickerChevron({
  orientation = "left",
  className,
}: ChevronProps) {
  const Icon = BY_ORIENTATION[orientation];
  return <Icon className={className} aria-hidden="true" />;
}

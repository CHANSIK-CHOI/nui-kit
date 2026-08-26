"use client";

import { format, type Locale } from "date-fns";
import {
  Animation,
  DayFlag,
  SelectionState,
  UI,
  type ClassNames,
  type DateRange,
} from "react-day-picker";
import { px } from "../../internal/prefix.js";

/** 달력 내부는 입력 필드(`nui-datepicker`)와 별개의 블록이다. */
const DAYPICKER_BLOCK = px("daypicker");

/**
 * react-day-picker 의 기본 클래스(`.rdp-*`)를 **전부** 우리 클래스로 갈아끼운다.
 *
 * 왜 덮어쓰지 않고 갈아끼우는가 (rules/styles.md §8)
 *   `.rdp-day` 를 우리 스코프 안에서 덮는 방법도 있지만, 그러면 우리 CSS 에
 *   `.nui-` 로 시작하지 않는 셀렉터가 남아 `verify:css` 가 막는다. 소비자가 같은
 *   라이브러리를 쓸 때 클래스 이름이 겹치는 것도 피하고 싶다.
 *   → 기본 CSS(`react-day-picker/style.css`)를 배포하지 않고 클래스만 치환하면
 *     달력이 통째로 우리 네임스페이스 안으로 들어온다.
 *
 * 키를 하나하나 적지 않고 enum 에서 생성한다 — 빠뜨린 키가 있으면 그 요소만
 * 클래스 없이 렌더되어 스타일이 조용히 빠진다. 라이브러리가 키를 추가해도
 * 자동으로 따라간다.
 *
 * `styles/components/_datepicker.scss` 와 짝을 이룬다.
 */
export const DAYPICKER_CLASS_NAMES: Partial<ClassNames> = Object.fromEntries(
  [
    ...Object.values(UI),
    ...Object.values(SelectionState),
    ...Object.values(DayFlag),
    ...Object.values(Animation),
  ].map((key) => [key, `${DAYPICKER_BLOCK}__${key.replace(/_/g, "-")}`]),
);

/**
 * 달력 컨트롤의 한국어 접근 이름.
 *
 * react-day-picker 의 `labels` 는 **`locale` 을 따라가지 않는다** — 날짜 셀과
 * 요일 헤더는 `locale`(기본 `ko`)로 한국어인데 년/월 셀렉트와 이전·다음 버튼만
 * 영어로 남아, 한 위젯 안에서 언어가 섞인다.
 * 우리가 기본값을 채우고, 소비자가 `dayPickerProps.labels` 로 덮을 수 있게 둔다.
 */
export const DAYPICKER_LABELS = {
  labelNav: () => "월 이동",
  labelPrevious: () => "이전 달",
  labelNext: () => "다음 달",
  labelYearDropdown: () => "연도 선택",
  labelMonthDropdown: () => "월 선택",
} as const;

/** 주말 modifier 에 붙일 클래스 (`modifiersClassNames`) */
export const DAYPICKER_WEEKEND_CLASS_NAMES = {
  saturday: `${DAYPICKER_BLOCK}__day--saturday`,
  sunday: `${DAYPICKER_BLOCK}__day--sunday`,
} as const;

type DatepickerFormatOptions<TSelected> = {
  displayFormat: string;
  locale: Locale;
  selected: TSelected | undefined;
};

type DatepickerCloseOptions<TSelected> = {
  shouldCloseOnSelect: boolean | undefined;
  nextSelected: TSelected | undefined;
};

type DatepickerDefaultMonthOptions<TSelected> = {
  selected: TSelected | undefined;
};

export function formatSingleDateValue({
  displayFormat,
  locale,
  selected,
}: DatepickerFormatOptions<Date>) {
  if (!selected) return "";

  return format(selected, displayFormat, { locale });
}

export function formatMultipleDateValue({
  displayFormat,
  locale,
  selected,
}: DatepickerFormatOptions<Date[]>) {
  if (!selected?.length) return "";

  return selected
    .map((date) => format(date, displayFormat, { locale }))
    .join(", ");
}

export function formatRangeDateValue({
  displayFormat,
  locale,
  selected,
}: DatepickerFormatOptions<DateRange>) {
  if (!selected?.from) return "";

  const from = format(selected.from, displayFormat, { locale });

  if (!selected.to) {
    return `${from} -`;
  }

  return `${from} - ${format(selected.to, displayFormat, { locale })}`;
}

export function getSingleDefaultMonth({
  selected,
}: DatepickerDefaultMonthOptions<Date>) {
  return selected;
}

export function getMultipleDefaultMonth({
  selected,
}: DatepickerDefaultMonthOptions<Date[]>) {
  return selected?.[0];
}

export function getRangeDefaultMonth({
  selected,
}: DatepickerDefaultMonthOptions<DateRange>) {
  return selected?.from ?? selected?.to;
}

export function getShouldCloseSingleOnSelect({
  shouldCloseOnSelect,
  nextSelected,
}: DatepickerCloseOptions<Date>) {
  if (typeof shouldCloseOnSelect === "boolean") {
    return shouldCloseOnSelect;
  }

  return Boolean(nextSelected);
}

export function getShouldCloseMultipleOnSelect({
  shouldCloseOnSelect,
}: DatepickerCloseOptions<Date[]>) {
  if (typeof shouldCloseOnSelect === "boolean") {
    return shouldCloseOnSelect;
  }

  return false;
}

export function getShouldCloseRangeOnSelect({
  shouldCloseOnSelect,
  nextSelected,
}: DatepickerCloseOptions<DateRange>) {
  if (typeof shouldCloseOnSelect === "boolean") {
    return shouldCloseOnSelect;
  }

  return Boolean(nextSelected?.from && nextSelected?.to);
}

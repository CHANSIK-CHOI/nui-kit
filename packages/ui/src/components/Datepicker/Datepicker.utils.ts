"use client";

import { format, isValid, parse, type Locale } from "date-fns";
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

/**
 * 범위 표시값의 구분자. `formatRangeDateValue` 와 `parseRangeDateValue` 가 함께 쓴다.
 *
 * ⚠️ 앞뒤 공백이 구분자의 일부다. `displayFormat` 이 `yyyy-MM-dd` 처럼 대시를
 *    포함할 수 있어서, 대시 하나만으로 나누면 날짜 안쪽에서 잘린다.
 */
const RANGE_SEPARATOR = " - ";
/** 뒤가 아직 비어 있는 `2026.09.01 -` 도 타이핑 도중에 나온다. */
const RANGE_SEPARATOR_PATTERN = /\s-\s|\s-$/;

export function formatRangeDateValue({
  displayFormat,
  locale,
  selected,
}: DatepickerFormatOptions<DateRange>) {
  if (!selected?.from) return "";

  const from = format(selected.from, displayFormat, { locale });

  if (!selected.to) {
    return `${from}${RANGE_SEPARATOR.trimEnd()}`;
  }

  return `${from}${RANGE_SEPARATOR}${format(selected.to, displayFormat, { locale })}`;
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

// ── 글자 → 값 (직접 입력)
//
// `formatDisplayValue` 의 역방향이다. **이 함수를 넘긴 모드만 타이핑이 열린다**
// (`DatepickerBase` 의 `parseDisplayValue`). 파싱 실패는 `undefined` 로 알리고,
// 그때 입력값은 그대로 두었다가 blur 에서 마지막 유효값으로 되돌아간다.
//
// `isDateAllowed` 는 base 가 준다 — 달력이 막아 둔 날짜(`dayPickerProps.disabled`)와
// 이동할 수 없는 구간(`startMonth`~`endMonth`) 밖을 타이핑으로 넣지 못하게 한다.

type DatepickerParseOptions = {
  text: string;
  displayFormat: string;
  locale: Locale;
  isDateAllowed: (date: Date) => boolean;
  /**
   * 타이핑이 끝난 시점(blur)의 판정인지.
   *
   * 치는 도중에는 절반만 읽혀도 값으로 인정해야 달력이 따라오지만,
   * 다 치고 났는데 절반이면 값이 아니다. 범위가 이 둘을 구분한다.
   */
  isFinal?: boolean;
};

function parseDateText({
  text,
  displayFormat,
  locale,
  isDateAllowed,
}: DatepickerParseOptions) {
  const trimmed = text.trim();

  if (!trimmed) return undefined;

  // date-fns 의 `parse` 는 이미 엄격하다 — 2026.02.31 · 2026.13.01 · 뒤에 붙은
  // 군더더기를 전부 Invalid Date 로 돌려준다. 자릿수는 너그러워서
  // `2026.9.5` 도 받는다(blur 에서 `2026.09.05` 로 정규화된다).
  const parsed = parse(trimmed, displayFormat, new Date(), { locale });

  if (!isValid(parsed) || !isDateAllowed(parsed)) return undefined;

  return parsed;
}

export function parseSingleDateValue(options: DatepickerParseOptions) {
  return parseDateText(options);
}

export function parseRangeDateValue({
  text,
  isFinal = false,
  ...restOptions
}: DatepickerParseOptions): DateRange | undefined {
  const trimmed = text.trim();

  if (!trimmed) return undefined;

  const parts = trimmed.split(RANGE_SEPARATOR_PATTERN);

  if (parts.length > 2) return undefined;

  const from = parseDateText({ ...restOptions, text: parts[0] ?? "" });

  if (!from) return undefined;

  const toText = parts[1]?.trim() ?? "";

  // 아직 뒤를 치는 중이면 시작일만으로도 값으로 인정한다 —
  // 달력에서 시작일만 고른 상태와 같다.
  // 다 치고도 뒤가 비어 있으면 기간이 아니므로 되돌린다.
  if (!toText) return isFinal ? undefined : { from };

  const to = parseDateText({ ...restOptions, text: toText });

  if (!to || to < from) return undefined;

  return { from, to };
}

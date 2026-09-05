"use client";

import type {
  AriaLiveMessages,
  GroupBase,
  Options,
  OptionsOrGroups,
} from "react-select";
import type { SelectOption } from "./Select.types.js";

/**
 * react-select 이 소유한 문자열의 한국어 기본값.
 *
 * 우리가 `placeholder` · `noOptionsMessage` · `removeButtonLabel` 을 한국어로
 * 채우면서 **스크린리더 전용 문자열만 영어로 남아 있었다** (2026-09-05).
 * `ariaLiveMessages` 와 `screenReaderStatus` 는 눈으로는 절대 드러나지 않아
 * 한국어 앱에서 목록을 훑을 때마다 영어가 읽혔다 — a11y.md §9 는 우리가
 * 소유한 문자열에 기본값을 채우고 소비자가 덮게 하라고 정한다.
 *
 * 전부 prop 으로 덮을 수 있다. `SelectSharedProps` 가 `ReactSelectProps` 를
 * 상속하므로 타입은 그대로다.
 */

/**
 * "12개 중 3번째" 로 읽어준다. 목록이 비면 빈 문자열이다.
 *
 * ⚠️ **슬래시를 쓰지 않는다.** `"3 / 12"` 는 시각적 표기이고 스크린리더는 그것을
 *    "삼 나누기 십이" 로 읽을 수 있다. 원본 영어(`"3 of 12"`)에 대응하는 한국어
 *    어순은 전체가 앞에 온다.
 */
function formatIndex<Option>(
  options: Options<Option> | OptionsOrGroups<Option, GroupBase<Option>>,
  target: Option,
): string {
  if (!options || options.length === 0) {
    return "";
  }

  const index = (options as readonly Option[]).indexOf(target);

  return `${options.length}개 중 ${index + 1}번째`;
}

/**
 * ⚠️ **라벨에 조사를 붙이지 않는다.** `${label} 을 선택했습니다` 로 쓰면 받침에 따라
 *    "서울을"·"부산을" 처럼 조사가 어긋난다. 원본 영어(`"option 서울, selected."`)처럼
 *    쉼표로 끊어 조사를 피한다.
 *
 * `IsMulti` 가 `onChange` 의 payload 타입을 가른다. 런타임 객체는 하나여도 되므로
 * 호출부에서 **모듈 스코프 상수**로 한 번만 만든다 — 매 렌더 새 객체를 넘기면
 * react-select 이 불필요하게 다시 그린다.
 */
export function createSelectAriaLiveMessages<
  IsMulti extends boolean,
>(): AriaLiveMessages<SelectOption, IsMulti, GroupBase<SelectOption>> {
  return {
    guidance: ({
      context,
      isSearchable,
      isMulti,
      tabSelectsValue,
      isInitialFocus,
      "aria-label": ariaLabel,
    }) => {
      switch (context) {
        case "menu":
          return `위아래 화살표로 항목을 고르고 Enter 로 선택합니다. Escape 로 목록을 닫습니다.${
            tabSelectsValue ? " Tab 을 누르면 선택하고 닫습니다." : ""
          }`;
        case "input":
          return isInitialFocus
            ? `${ariaLabel || "선택"}에 초점이 있습니다.${
                isSearchable ? " 입력하면 목록이 좁혀집니다." : ""
              } 아래 화살표로 목록을 엽니다.${
                isMulti ? " 왼쪽 화살표로 선택한 값으로 이동합니다." : ""
              }`
            : "";
        case "value":
          return "왼쪽과 오른쪽 화살표로 선택한 값 사이를 이동하고 Backspace 로 지웁니다.";
        default:
          return "";
      }
    },

    onChange: ({ action, label = "", labels, isDisabled }) => {
      switch (action) {
        case "deselect-option":
        case "pop-value":
        case "remove-value":
          return `${label}, 선택을 해제했습니다.`;
        case "clear":
          return "선택한 항목을 모두 지웠습니다.";
        case "initial-input-focus":
          // ⚠️ 고른 값이 없으면 아무 말도 하지 않는다. 원본 영어는 빈 배열에서도
          //    `"option , selected."` 를 읽는데, 선택된 것이 없는데 "선택되어
          //    있습니다" 를 읽으면 **틀린 안내**다.
          return labels.length > 0
            ? `${labels.join(", ")}, 선택되어 있습니다.`
            : "";
        case "select-option":
          return isDisabled
            ? `${label}, 선택할 수 없습니다. 다른 항목을 골라주세요.`
            : `${label}, 선택했습니다.`;
        default:
          return "";
      }
    },

    onFocus: ({
      context,
      focused,
      options,
      label = "",
      selectValue,
      isDisabled,
      isSelected,
      isAppleDevice,
    }) => {
      if (context === "value" && selectValue) {
        return `선택한 값 ${label}, ${formatIndex(selectValue, focused)}.`;
      }

      // 원본과 같은 분기다 — VoiceOver 는 메뉴 항목을 스스로 읽지 않아
      // Apple 기기에서만 우리가 읽어준다.
      if (context === "menu" && isAppleDevice) {
        const state = `${isSelected ? " 선택됨" : ""}${
          isDisabled ? " 사용 불가" : ""
        }`;

        return `${label}${state}, ${formatIndex(options, focused)}.`;
      }

      return "";
    },

    onFilter: ({ inputValue, resultsMessage }) =>
      `${resultsMessage}${inputValue ? `, 검색어 ${inputValue}` : ""}.`,
  };
}

/** 검색 결과 개수 안내. react-select 기본값은 `"N results available"` 이다. */
export function selectScreenReaderStatus({ count }: { count: number }): string {
  return `${count}개 항목이 있습니다`;
}

/** 비동기 로딩 문구. react-select 기본값은 `"Loading..."` 이다. */
export function selectLoadingMessage(): string {
  return "불러오는 중...";
}

export const DEFAULT_NO_OPTIONS_MESSAGE = () => "선택 가능한 항목이 없습니다";

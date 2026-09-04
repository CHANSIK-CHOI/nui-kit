"use client";

import cn from "classnames";
import { endOfMonth, getDay, startOfMonth, type Locale } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type Ref,
} from "react";
import {
  DayPicker,
  dateMatchModifiers,
  type DayPickerProps,
  type OnSelectHandler,
} from "react-day-picker";
import { px } from "../../internal/prefix.js";
import { DaypickerChevron } from "./DaypickerChevron.js";
import { motionTransition } from "../../internal/motion.js";
import Textfield, { type TextfieldProps } from "../Textfield/Textfield.js";
import TextfieldBtn from "../Textfield/TextfieldBtn.js";
import {
  DAYPICKER_CLASS_NAMES,
  DAYPICKER_LABELS,
  DAYPICKER_WEEKEND_CLASS_NAMES,
} from "./Datepicker.utils.js";

const block = px("datepicker");
const daypickerBlock = px("daypicker");
const CURRENT_YEAR = new Date().getFullYear();

export type DatepickerMode = "single" | "multiple" | "range";

type DayPickerSelectionShape = {
  className?: string;
  defaultMonth?: Date;
  disabled?: DayPickerProps["disabled"];
  locale?: DayPickerProps["locale"];
  navLayout?: DayPickerProps["navLayout"];
  onSelect?: unknown;
  required?: boolean;
  showOutsideDays?: boolean;
};

/**
 * `DayPicker` 로 그대로 흘려보내는 prop.
 *
 * ⚠️ `animate` 는 **의도적으로 막는다.** react-day-picker 의 월 전환 애니메이션은
 *    정리(이전 달 노드 제거)를 CSS `animationend` 이벤트에만 의존하는데, 우리는
 *    `react-day-picker/style.css` 를 배포하지 않아 대응 `@keyframes` 가 없다.
 *    → 이벤트가 영영 발생하지 않아 이전 달 DOM 이 계속 쌓이고, 내부 플래그가
 *      `true` 로 고정되어 이후 전환도 무력화된다.
 *    keyframes 를 구현하면 그때 열면 된다 (여는 것은 breaking 이 아니다).
 */
type DayPickerBasePassThroughProps = Omit<
  DayPickerProps,
  "animate" | "mode" | "onSelect" | "required" | "selected"
>;

export type DatepickerDayPickerProps<TProps extends DayPickerSelectionShape> =
  TProps extends unknown
    ? DayPickerBasePassThroughProps &
        Omit<TProps, "mode" | "onSelect" | "selected"> & {
          onSelect?: TProps["onSelect"];
        }
    : never;

export type DatepickerBaseProps<
  TSelected,
  TDayPickerProps extends DayPickerSelectionShape,
> = Omit<
  TextfieldProps,
  "children" | "onChange" | "type" | "value"
> & {
  mode: DatepickerMode;
  selected?: TSelected | undefined;
  onSelectedChange?: (selected: TSelected | undefined) => void;
  dayPickerProps?: DatepickerDayPickerProps<TDayPickerProps>;
  displayFormat?: string;
  formatDisplayValue: (options: {
    displayFormat: string;
    locale: Locale;
    selected: TSelected | undefined;
  }) => string;
  /**
   * 글자 → 값. `formatDisplayValue` 의 역방향이다.
   *
   * **이것을 넘긴 모드만 직접 입력이 열린다** (KRDS 가이드 675쪽 접근성 01 —
   * 선택기가 있어도 입력 필드를 읽기 전용으로 만들지 않는다).
   * 넘기지 않으면 예전처럼 `readonly` 입력이다.
   */
  parseDisplayValue?: (options: {
    text: string;
    displayFormat: string;
    locale: Locale;
    isDateAllowed: (date: Date) => boolean;
    /** 타이핑이 끝난 시점(blur)의 판정인지. 절반만 친 값을 걸러내는 데 쓴다. */
    isFinal?: boolean;
  }) => TSelected | undefined;
  getDefaultMonth: (options: {
    selected: TSelected | undefined;
  }) => Date | undefined;
  getShouldCloseOnSelect: (options: {
    shouldCloseOnSelect: boolean | undefined;
    nextSelected: TSelected | undefined;
  }) => boolean;
  calendarButtonTitle?: string;
  /** 캘린더 팝업의 접근 이름. i18n 을 위해 열어둔다. */
  calendarLabel?: string;
  shouldCloseOnSelect?: boolean;
  defaultIsCalendarOpen?: boolean;
  dropdownClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
};

type DatepickerBaseInternalProps = {
  onCalendarOpenChange?: (isOpen: boolean) => void;
};

export default function DatepickerBase<
  TSelected,
  TDayPickerProps extends DayPickerSelectionShape,
>({
  mode,
  selected,
  onSelectedChange,
  dayPickerProps,
  displayFormat = "yyyy.MM.dd",
  formatDisplayValue,
  parseDisplayValue,
  getDefaultMonth,
  getShouldCloseOnSelect,
  calendarButtonTitle,
  calendarLabel = "날짜 선택 캘린더",
  shouldCloseOnSelect,
  defaultIsCalendarOpen = false,
  onCalendarOpenChange,
  dropdownClassName,
  inputRef,
  className,
  placeholder = "날짜를 선택해주세요",
  readOnly = false,
  isTextInputBlocked = false,
  disabled = false,
  isClearable = false,
  onClear,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  ...restTextfieldProps
}: DatepickerBaseProps<TSelected, TDayPickerProps> &
  DatepickerBaseInternalProps) {
  // framer-motion 은 `prefers-reduced-motion` 을 자동으로 따르지 않는다
  // (`MotionConfig.reducedMotion` 기본값이 "never"). CSS duration 토큰의 1ms
  // 무력화도 framer-motion 이 읽지 않으므로 여기서 직접 처리한다 (rules/a11y.md §6).
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  // 포커스를 "되돌리는 중" 임을 표시한다. 아래 handleInputFocus 참조.
  const isRestoringFocusRef = useRef(false);
  // 직전 사용자 조작이 이 컨트롤을 향한 것이었는지. 아래 handleInputFocus 참조.
  const isSelfInitiatedFocusRef = useRef(false);
  const calendarDropdownId = useId();
  const [isCalendarOpen, setIsCalendarOpen] = useState(defaultIsCalendarOpen);
  // 타이핑 중인 글자. `null` 이면 표시값을 `selected` 에서 계산한다.
  const [draftText, setDraftText] = useState<string | null>(null);
  // 타이핑을 시작하기 직전의 값. 다 치고 났는데 읽을 수 없으면 여기로 되돌린다.
  const valueBeforeTypingRef = useRef<TSelected | undefined>(undefined);
  // 달력이 보고 있는 달. 소비자가 `dayPickerProps.month` 를 주면 그쪽이 이긴다.
  const [month, setMonth] = useState<Date | undefined>(undefined);
  // 선택도 기본 달도 없을 때의 기준. 렌더마다 새 Date 를 만들면 달력이 매번 다시 잡힌다.
  const todayRef = useRef(new Date());

  // 소비자(또는 RHF)의 ref 와 내부 ref 를 함께 채운다.
  // 내부 ref 는 캘린더를 닫을 때 포커스를 입력창으로 되돌리는 데 쓴다.
  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputElementRef.current = element;

      if (typeof inputRef === "function") {
        inputRef(element);
        return;
      }

      if (inputRef) {
        (inputRef as { current: HTMLInputElement | null }).current = element;
      }
    },
    [inputRef],
  );

  const resolvedLocale = (dayPickerProps?.locale as Locale | undefined) ?? ko;
  const resolvedDisplayValue = useMemo(
    () =>
      formatDisplayValue({
        displayFormat,
        locale: resolvedLocale,
        selected,
      }),
    [displayFormat, formatDisplayValue, resolvedLocale, selected],
  );
  const resolvedDefaultMonth =
    dayPickerProps?.defaultMonth ?? getDefaultMonth({ selected });
  // 달력을 열 때는 고른 값의 달로 돌아간다 — 닫을 때 `month` 를 비우기 때문이다.
  const resolvedMonth =
    dayPickerProps?.month ?? month ?? resolvedDefaultMonth ?? todayRef.current;
  const resolvedStartMonth =
    dayPickerProps?.startMonth ?? new Date(CURRENT_YEAR - 100, 0, 1);
  const resolvedEndMonth =
    dayPickerProps?.endMonth ?? new Date(CURRENT_YEAR + 20, 11, 1);
  const resolvedCalendarButtonTitle =
    calendarButtonTitle ?? (isCalendarOpen ? "캘린더 닫기" : "날짜 선택하기");
  const isDayPickerDisabled = readOnly ? true : dayPickerProps?.disabled;
  // 파서를 넘긴 모드만 타이핑이 열린다. 소비자는 `isTextInputBlocked` 로 다시 막을 수 있다.
  const canTypeDate = Boolean(parseDisplayValue) && !isTextInputBlocked;
  // 달력으로 고를 수 없는 날짜는 타이핑으로도 들어오지 못한다.
  const isDateAllowed = useCallback(
    (date: Date) => {
      if (date < startOfMonth(resolvedStartMonth)) return false;
      if (date > endOfMonth(resolvedEndMonth)) return false;

      const disabledMatcher = dayPickerProps?.disabled;

      return !(disabledMatcher && dateMatchModifiers(date, disabledMatcher));
    },
    [dayPickerProps?.disabled, resolvedEndMonth, resolvedStartMonth],
  );
  const resolvedIsClearable = isClearable && !dayPickerProps?.required;
  const resolvedCaptionLayout = dayPickerProps?.captionLayout ?? "dropdown";
  const resolvedModifiers = useMemo(
    () => ({
      saturday: (date: Date) => getDay(date) === 6,
      sunday: (date: Date) => getDay(date) === 0,
      ...dayPickerProps?.modifiers,
    }),
    [dayPickerProps?.modifiers],
  );
  const resolvedModifiersClassNames = useMemo(
    () => ({
      ...DAYPICKER_WEEKEND_CLASS_NAMES,
      ...dayPickerProps?.modifiersClassNames,
    }),
    [dayPickerProps?.modifiersClassNames],
  );
  // react-day-picker 의 기본 클래스를 우리 것으로 갈아끼운다.
  // 소비자가 개별 키를 덮을 수 있도록 뒤에 얹는다.
  const resolvedClassNames = useMemo(
    () => ({
      ...DAYPICKER_CLASS_NAMES,
      ...dayPickerProps?.classNames,
    }),
    [dayPickerProps?.classNames],
  );
  // 달력 컨트롤의 접근 이름을 한국어로 채운다 (라이브러리 기본값은 영어).
  // 소비자가 개별 키를 덮을 수 있도록 뒤에 얹는다.
  const resolvedLabels = useMemo(
    () => ({
      ...DAYPICKER_LABELS,
      ...dayPickerProps?.labels,
    }),
    [dayPickerProps?.labels],
  );

  /**
   * 캘린더 개폐 상태의 **유일한 writer**. 모든 경로가 이 함수를 통한다.
   *
   * `shouldRestoreFocus` — 닫을 때 포커스를 입력창으로 되돌릴지.
   * 팝업이 언마운트되면 그 안에 있던 포커스가 `document.body` 로 떨어져
   * 이후 Tab 이 문서 처음부터 다시 시작한다 (rules/a11y.md §5).
   * 단 **바깥을 클릭해 닫는 경우는 제외한다** — 사용자가 옮긴 포커스를 빼앗게 된다.
   */
  const setIsCalendarOpenState = useCallback(
    (nextIsOpen: boolean, shouldRestoreFocus = false) => {
      setIsCalendarOpen(nextIsOpen);
      onCalendarOpenChange?.(nextIsOpen);

      // 닫으면 보고 있던 달을 잊는다 — 다음에 열 때 고른 값의 달에서 시작한다.
      if (!nextIsOpen) {
        setMonth(undefined);
      }

      if (!nextIsOpen && shouldRestoreFocus) {
        // ⚠️ `focus()` 는 `handleInputFocus` 를 **동기적으로** 부른다.
        //    그대로 두면 방금 닫은 캘린더가 같은 배치에서 다시 열려
        //    "날짜를 골라도 닫히지 않는" 상태가 된다.
        //    복귀 중임을 표시해 focus 핸들러가 열지 않도록 한다.
        isRestoringFocusRef.current = true;
        inputElementRef.current?.focus();
        isRestoringFocusRef.current = false;
      }
    },
    [onCalendarOpenChange],
  );

  const handleCalendarToggle = () => {
    if (disabled || readOnly) return;

    setIsCalendarOpenState(!isCalendarOpen);
  };

  const handleInputClick: MouseEventHandler<HTMLInputElement> = (event) => {
    if (!disabled && !readOnly) {
      setIsCalendarOpenState(true);
    }

    onClick?.(event);
  };

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    // 사용자 조작에서 온 포커스만 캘린더를 연다.
    //
    // 열지 않아야 하는 두 경우:
    //   1. 캘린더를 닫으면서 포커스를 되돌리는 중 — 그대로 두면 닫자마자 다시 열려
    //      "날짜를 골라도 닫히지 않는" 상태가 된다
    //   2. 프로그램적 포커스 — react-hook-form 이 검증 실패 시 첫 에러 필드로
    //      포커스를 옮기는데, 그때 캘린더가 열리면 읽어야 할 에러 메시지를 가린다
    //
    // ⚠️ `:focus-visible` 로는 2번을 가려낼 수 없다. 직전 입력이 키보드였으면
    //    스크립트가 준 포커스에도 `:focus-visible` 이 붙는다 (RHF 의 setFocus 가
    //    정확히 그 경우다). 그래서 조작 자체를 직접 표시한다.
    const isUserInitiated = isSelfInitiatedFocusRef.current;

    if (
      !disabled &&
      !readOnly &&
      !isRestoringFocusRef.current &&
      isUserInitiated
    ) {
      setIsCalendarOpenState(true);
    }

    onFocus?.(event);
  };

  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!disabled && !readOnly) {
      // 타이핑이 열려 있으면 Space·Enter 를 가로채지 않는다 — 글자를 못 치게 되고
      // 폼 제출도 막힌다. 여는 키는 combobox 관습대로 ArrowDown 하나로 좁힌다.
      const isOpenKey = canTypeDate
        ? event.key === "ArrowDown"
        : event.key === "ArrowDown" ||
          event.key === "Enter" ||
          event.key === " ";

      if (isOpenKey) {
        event.preventDefault();
        setIsCalendarOpenState(true);
      } else if (canTypeDate && event.key === "Enter" && isCalendarOpen) {
        // 친 값은 이미 반영돼 있다. Enter 는 달력을 닫는 몫만 한다.
        event.preventDefault();
        setIsCalendarOpenState(false, true);
      }

      if (event.key === "Escape") {
        setIsCalendarOpenState(false, true);
      }
    }

    onKeyDown?.(event);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!canTypeDate) return;

    const text = event.target.value;

    // 타이핑의 첫 글자에서 되돌아갈 자리를 기억해 둔다.
    if (draftText === null) {
      valueBeforeTypingRef.current = selected;
    }

    setDraftText(text);

    if (!text.trim()) {
      onSelectedChange?.(undefined);
      return;
    }

    const parsed = parseDisplayValue?.({
      text,
      displayFormat,
      locale: resolvedLocale,
      isDateAllowed,
    });

    // 읽을 수 없는 글자에는 **아무 일도 하지 않는다.** 여기서 값을 지우면
    // `2026.0` 을 지나는 순간마다 소비자(또는 RHF)의 값이 날아간다.
    if (parsed === undefined) return;

    onSelectedChange?.(parsed);

    const nextMonth = getDefaultMonth({ selected: parsed });

    if (nextMonth) {
      setMonth(nextMonth);
    }
  };

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    // ⚠️ 글자마다 파싱하므로 **중간 단계가 값으로 확정될 수 있다.**
    //    `2021.02.31` 을 치면 `2021.02.3` 에서 한 번 성공해 3일이 남는다.
    //    다 친 글자를 다시 읽어보고 실패하면 **타이핑 전 값으로** 되돌린다 —
    //    화면의 글자와 실제 값이 어긋난 채로 끝나지 않게.
    if (draftText !== null && draftText.trim()) {
      const parsed = parseDisplayValue?.({
        text: draftText,
        displayFormat,
        locale: resolvedLocale,
        isDateAllowed,
        isFinal: true,
      });

      if (parsed === undefined) {
        onSelectedChange?.(valueBeforeTypingRef.current);
      }
    }

    // 초안을 버리면 표시값이 다시 `selected` 에서 계산된다 —
    // `2026.9.5` → `2026.09.05` 정규화도 여기서 따라온다.
    setDraftText(null);
    onBlur?.(event);
  };

  const handleDayPickerSelect: OnSelectHandler<TSelected | undefined> = (
    nextSelected,
    triggerDate,
    modifiers,
    event,
  ) => {
    if (readOnly || disabled) {
      return;
    }

    setDraftText(null);
    onSelectedChange?.(nextSelected);
    (
      dayPickerProps?.onSelect as
        OnSelectHandler<TSelected | undefined> | undefined
    )?.(nextSelected, triggerDate, modifiers, event);

    if (getShouldCloseOnSelect({ shouldCloseOnSelect, nextSelected })) {
      setIsCalendarOpenState(false, true);
    }
  };

  const handleClear = () => {
    setDraftText(null);
    onSelectedChange?.(undefined);
    onClear?.();
  };

  // 직전 사용자 조작이 **이 컨트롤을 향한 것인지** 문서 레벨에서 판별한다.
  //
  // 시간 창으로는 구분되지 않는다 — RHF 는 제출 버튼 클릭 후 2~3ms 만에 검증
  // 실패 필드로 포커스를 옮긴다(실측). 사용자 클릭과 같은 태스크 안이다.
  // 대신 **조작이 시작된 위치**를 본다.
  //   · 우리 입력창을 클릭 → 이 컨트롤을 향한 조작 → 연다
  //   · Tab 키 → 어디서 눌렀든 이동 의도이므로 연다
  //   · 다른 버튼(제출 등) 클릭 → 이 컨트롤을 향하지 않음 → 열지 않는다
  //
  // 요소에 붙이면 Tab 진입을 놓친다 — Tab 의 `keydown` 은 **이전 요소** 에서
  // 발생해 우리 입력창 핸들러에는 오지 않는다. document capture 로 받는다.
  useEffect(() => {
    const handlePointerDownCapture = (event: PointerEvent) => {
      isSelfInitiatedFocusRef.current = Boolean(
        rootRef.current?.contains(event.target as Node),
      );
    };

    const handleKeyDownCapture = (event: KeyboardEvent) => {
      // Tab 이동은 어디서 눌렸든 사용자의 이동 의도다.
      if (event.key === "Tab") {
        isSelfInitiatedFocusRef.current = true;
        return;
      }

      isSelfInitiatedFocusRef.current = Boolean(
        rootRef.current?.contains(event.target as Node),
      );
    };

    document.addEventListener("pointerdown", handlePointerDownCapture, true);
    document.addEventListener("keydown", handleKeyDownCapture, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownCapture,
        true,
      );
      document.removeEventListener("keydown", handleKeyDownCapture, true);
    };
  }, []);

  useEffect(() => {
    if (!isCalendarOpen) return;

    // pointerdown 을 쓴다 — 캘린더를 여는 외부 버튼 클릭이 같은 상호작용 안에서
    // 곧바로 "바깥 클릭" 으로 처리되지 않도록.
    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsCalendarOpenState(false);
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCalendarOpenState(false, true);
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isCalendarOpen, setIsCalendarOpenState]);

  useEffect(() => {
    if ((disabled || readOnly) && isCalendarOpen) {
      setIsCalendarOpenState(false);
    }
  }, [disabled, readOnly, isCalendarOpen, setIsCalendarOpenState]);

  return (
    <div ref={rootRef} className={block}>
      <Textfield
        {...restTextfieldProps}
        ref={setInputRef}
        className={cn(className, `${block}__textfield`)}
        value={draftText ?? resolvedDisplayValue}
        placeholder={placeholder}
        readOnly={readOnly}
        isTextInputBlocked={!canTypeDate}
        disabled={disabled}
        isClearable={resolvedIsClearable}
        onClear={handleClear}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        // `textbox` 롤은 `aria-expanded` 를 지원하지 않아 AT 가 무시한다.
        // `combobox` 로 올려 펼침 상태가 실제로 전달되게 한다 (APG Date Picker Combobox).
        role="combobox"
        // 팝업이 닫혀 있으면 그 id 를 가진 요소가 DOM 에 없다.
        // 존재하지 않는 id 를 가리키지 않는다 (Accordion 과 같은 규칙).
        aria-controls={
          isCalendarOpen && !disabled ? calendarDropdownId : undefined
        }
        aria-expanded={isCalendarOpen}
        aria-haspopup="dialog"
      >
        <TextfieldBtn
          icon="date"
          title={resolvedCalendarButtonTitle}
          onClick={handleCalendarToggle}
          disabled={disabled}
        />
      </Textfield>

      <AnimatePresence initial={false}>
        {isCalendarOpen && !disabled && (
          <motion.div
            id={calendarDropdownId}
            className={cn(`${block}__dropdown`, dropdownClassName)}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
                    transition: motionTransition.popoverExit,
                  }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : motionTransition.popover
            }
            role="dialog"
            aria-label={calendarLabel}
          >
            <DayPicker
              {...dayPickerProps}
              mode={mode}
              required={dayPickerProps?.required}
              selected={selected as never}
              onSelect={handleDayPickerSelect as never}
              modifiers={resolvedModifiers}
              modifiersClassNames={resolvedModifiersClassNames}
              classNames={resolvedClassNames}
              components={{
                Chevron: DaypickerChevron,
                ...dayPickerProps?.components,
              }}
              labels={resolvedLabels}
              month={resolvedMonth}
              onMonthChange={(nextMonth) => {
                setMonth(nextMonth);
                dayPickerProps?.onMonthChange?.(nextMonth);
              }}
              startMonth={resolvedStartMonth}
              endMonth={resolvedEndMonth}
              disabled={isDayPickerDisabled}
              showOutsideDays={dayPickerProps?.showOutsideDays ?? true}
              captionLayout={resolvedCaptionLayout}
              navLayout={dayPickerProps?.navLayout ?? "after"}
              locale={resolvedLocale}
              className={cn(daypickerBlock, dayPickerProps?.className)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

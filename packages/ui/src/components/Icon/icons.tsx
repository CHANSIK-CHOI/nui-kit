"use client";

import cn from "classnames";
import {
  Calendar,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";
import { px } from "../../internal/prefix.js";
import Icon, { type IconBaseProps } from "./Icon.js";

/**
 * 라이브러리가 쓰는 자리마다 이름을 붙인 프리셋이다. **`Icon` 에 lucide 아이콘 엘리먼트를
 * 고정해 넘기는 것이 전부**이고, 크기 · 색 · title · aria 처리는 `Icon` 이 한 벌로
 * 갖는다 (spec §6-2 · §6-2-1).
 *
 * 이름이 자리를 말한다 — `DelIcon` 과 `CloseIcon` 은 둘 다 lucide 의 `X` 지만
 * 하나는 입력값을 지우고 하나는 창을 닫는다. 값이 같아도 역할이 다르면 이름을
 * 나누는 토큰 규칙과 같다 (tokens.md §5-1).
 */
function preset(
  lucideIcon: LucideIcon,
  displayName: string,
  extraClassName?: string,
) {
  function NuiIcon({ className, ...rest }: IconBaseProps) {
    return (
      <Icon
        {...rest}
        icon={createElement(lucideIcon)}
        className={cn(extraClassName, className)}
      />
    );
  }

  NuiIcon.displayName = displayName;
  return NuiIcon;
}

/** 지우기 — Textfield · Textarea · Search 의 값 비우기 */
export const DelIcon = preset(X, "DelIcon");

/** 주의 — Message 의 에러 표시 · Alert · Confirm */
export const AttentionIcon = preset(CircleAlert, "AttentionIcon");

/**
 * 완료 — Toast 의 `tone="success"`.
 * `AttentionIcon`(CircleAlert)과 같은 동그라미 계열이라 나란히 놓아도 결이 맞는다.
 */
export const SuccessIcon = preset(CircleCheck, "SuccessIcon");

/** 검색 */
export const SearchIcon = preset(Search, "SearchIcon");

/** 비밀번호 보기 */
export const ShowPwIcon = preset(Eye, "ShowPwIcon");

/** 비밀번호 숨기기 */
export const HidePwIcon = preset(EyeOff, "HidePwIcon");

/** 닫기 — Popup */
export const CloseIcon = preset(X, "CloseIcon");

/** 캘린더 — Datepicker 의 달력 열기 버튼 */
export const CalendarIcon = preset(Calendar, "CalendarIcon");

/** 로딩 — Button 의 `isLoading`. 회전은 `_icon.scss` 의 `--spin` 이 담당한다 */
export const SpinnerIcon = preset(
  LoaderCircle,
  "SpinnerIcon",
  `${px("icon")}--spin`,
);

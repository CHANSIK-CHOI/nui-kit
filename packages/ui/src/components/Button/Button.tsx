"use client";

import cn from "classnames";
import {
  useId,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import { SpinnerIcon } from "../Icon/index.js";

const block = px("button");

// 기본은 medium(48px). 위아래로 large(56px)·small(36px)이 있는 형태가 표준이고,
// 소비자는 small 을 보고 "가장 작은 것"이라고 읽는다.
export type ButtonSize = "large" | "medium" | "small";
// 색이 아니라 역할이 이름이다 — "이 버튼은 삭제인가"만 물으면 된다.
export type ButtonColor = "neutral" | "primary" | "danger" | "warning";
export type ButtonVariant = "solid" | "line" | "text";
export type ButtonShape = "round" | "square";

export type ButtonDesignProps =
  | {
      variant?: Exclude<ButtonVariant, "text">;
      shape?: ButtonShape;
      size?: ButtonSize;
    }
  | {
      variant: "text";
      shape?: never;
      size?: never;
    };

export type ButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  color?: ButtonColor;
};

/**
 * 로딩은 `Button` · `IconButton` 만 받는다. `ButtonLink` 는 이동이라 "처리 중"이 없다.
 *
 * disabled 와 별개다 — disabled 는 "조건이 맞으면 된다", loading 은 "지금 처리 중".
 * 네이티브 `disabled` 를 쓰지 않는다. 포커스가 날아가 스크린리더가 위치를 잃기 때문이다.
 * 대신 클릭을 직접 막고 `aria-busy` 로 상태를 전한다 (specs/Button.md §5 · §6).
 */
export type ButtonLoadingProps = {
  /** 요청 처리 중. 스피너를 보이고 클릭을 무시하며 `aria-busy` 를 붙인다 */
  isLoading?: boolean;
  /** 로딩 중 스크린리더 안내. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  loadingLabel?: string;
};

export type ButtonProps = ButtonBaseProps &
  ButtonDesignProps &
  ButtonLoadingProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonClassNameParams = {
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
  shape?: ButtonShape;
};

export function getButtonClassName({
  className,
  size = "medium",
  color = "neutral",
  variant = "solid",
  shape = "square",
}: ButtonClassNameParams) {
  return cn(
    block,
    color !== "neutral" && `${block}--${color}`,
    variant !== "solid" && `${block}--${variant}`,
    variant !== "text" && shape !== "square" && `${block}--${shape}`,
    size !== "medium" && `${block}--${size}`,
    className,
  );
}

/**
 * 로딩 중에는 스피너가 아이콘 슬롯을 차지한다 — `icon` 이 있으면 대신, 없으면 라벨 앞에.
 * 라벨은 그대로 보인다. 맥락이 남고 접근 이름이 바뀌지 않는다.
 *
 * sr-only 안내는 접근 **이름**이 아니라 **설명**(`aria-describedby`)으로 연결한다.
 * `IconButton` 처럼 `aria-label` 을 쓰는 버튼은 이름이 통째로 대체되어 안에 둔 글자가
 * 이름에 들어가지 않는다 — 설명은 `aria-label` 과 무관하게 이름 뒤에 읽힌다.
 * 안내 span 은 `aria-hidden` 이다. 그래야 `Button` 의 이름("저장")에 섞이지 않는다 —
 * `aria-describedby` 가 참조하는 hidden 요소의 글자는 설명 계산에 그대로 들어간다.
 */
export function getButtonContentElement({
  icon,
  children,
  isLoading = false,
  loadingLabel,
  loadingLabelId,
}: Pick<ButtonBaseProps, "icon" | "children"> &
  ButtonLoadingProps & { loadingLabelId?: string }) {
  const slot = isLoading ? <SpinnerIcon /> : icon;
  return (
    <span className={`${block}__wrap`}>
      {slot ? <span className={`${block}__icon`}>{slot}</span> : null}
      {children}
      {isLoading && loadingLabel ? (
        <span id={loadingLabelId} className={px("sr-only")} aria-hidden="true">
          {loadingLabel}
        </span>
      ) : null}
    </span>
  );
}

/** 소비자의 `aria-describedby` 를 지우지 않고 로딩 안내 id 를 뒤에 붙인다. */
export function getLoadingDescribedBy(
  isLoading: boolean,
  loadingLabel: string | undefined,
  loadingLabelId: string,
  consumerDescribedBy: string | undefined,
) {
  if (!isLoading || !loadingLabel) return consumerDescribedBy;
  return [consumerDescribedBy, loadingLabelId].filter(Boolean).join(" ");
}

/**
 * 로딩 중 클릭을 삼킨다. `type="submit"` 의 Enter/Space 와 필드 Enter 의 암묵 제출도
 * 클릭 이벤트를 거치므로 `preventDefault` 하나로 함께 막힌다.
 */
export function getLoadingGuardedClick(
  isLoading: boolean,
  onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"],
) {
  if (!isLoading) return onClick;
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
}

export default function Button({
  children,
  icon,
  className,
  size = "medium",
  color = "neutral",
  variant = "solid",
  shape = "square",
  isLoading = false,
  loadingLabel = "처리 중",
  onClick,
  "aria-busy": ariaBusy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ButtonProps) {
  const loadingLabelId = useId();
  return (
    <button
      type="button"
      {...rest}
      onClick={getLoadingGuardedClick(isLoading, onClick)}
      // 소비자가 직접 준 aria-busy 는 로딩이 아닐 때 그대로 둔다
      aria-busy={isLoading ? true : ariaBusy}
      aria-describedby={getLoadingDescribedBy(
        isLoading,
        loadingLabel,
        loadingLabelId,
        ariaDescribedBy,
      )}
      className={getButtonClassName({ className, size, color, variant, shape })}
    >
      {getButtonContentElement({
        icon,
        children,
        isLoading,
        loadingLabel,
        loadingLabelId,
      })}
    </button>
  );
}

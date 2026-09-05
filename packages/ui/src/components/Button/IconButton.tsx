"use client";

import cn from "classnames";
import { useId } from "react";
import { px } from "../../internal/prefix.js";
import { SpinnerIcon } from "../Icon/index.js";
import {
  getButtonClassName,
  getLoadingDescribedBy,
  getLoadingGuardedClick,
  type ButtonProps,
} from "./Button.js";
import useLoadingStatus from "./useLoadingStatus.js";

const block = px("button");

export type IconButtonVariant = "solid" | "line";

/**
 * 접근 이름을 **타입으로 강제한다.**
 *
 * `IconButton` 은 `children` 이 아이콘이라 **글자에서 이름이 생길 길이 없다.**
 * 예외가 없는 자리라 누락되면 스크린리더가 "버튼" 이라고만 읽는다 (a11y.md §4).
 *
 * ⚠️ `aria-label` 만 필수로 두면 `aria-labelledby` 로 이름을 주는 정상 사용이 막힌다.
 *    유니온이라야 두 경로를 다 열면서 **누락만** 잡는다.
 */
type IconButtonAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type IconButtonProps = Omit<
  ButtonProps,
  "icon" | "variant" | "aria-label" | "aria-labelledby"
> & {
  variant?: IconButtonVariant;
} & IconButtonAccessibleName;

export default function IconButton({
  children,
  className,
  size = "medium",
  color = "neutral",
  variant = "solid",
  shape,
  isLoading = false,
  loadingLabel = "처리 중",
  onClick,
  "aria-busy": ariaBusy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: IconButtonProps) {
  const loadingLabelId = useId();
  const loadingStatus = useLoadingStatus({
    isLoading,
    loadingLabel,
    loadingLabelId,
  });

  return (
    <>
      <button
        type="button"
        {...rest}
        onClick={getLoadingGuardedClick(isLoading, onClick)}
        aria-busy={isLoading ? true : ariaBusy}
        // `aria-label` 이 이름을 통째로 대체하므로 안내는 설명으로 붙인다 (Button.tsx 참조)
        aria-describedby={getLoadingDescribedBy(
          isLoading,
          loadingLabel,
          loadingLabelId,
          ariaDescribedBy,
        )}
        className={getButtonClassName({
          className: cn(className, `${block}--icon`),
          size,
          color,
          variant,
          shape,
        })}
      >
        <span className={`${block}__wrap`}>
          {/* 로딩 중에는 아이콘 자리에 스피너. 정사각은 그대로다 */}
          <span className={`${block}__icon`}>
            {isLoading ? <SpinnerIcon /> : children}
          </span>
        </span>
      </button>
      {loadingStatus}
    </>
  );
}

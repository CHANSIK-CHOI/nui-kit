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

const block = px("button");

export type IconButtonVariant = "solid" | "line";

export type IconButtonProps = Omit<ButtonProps, "icon" | "variant"> & {
  variant?: IconButtonVariant;
};

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
  return (
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
        {isLoading && loadingLabel ? (
          <span
            id={loadingLabelId}
            className={px("sr-only")}
            aria-hidden="true"
          >
            {loadingLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
}

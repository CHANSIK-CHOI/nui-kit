"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import { AttentionIcon } from "../Icon/index.js";

const block = px("message");

export type MessageProps = {
  id?: string;
  className?: string;
  infoMessage?: string;
  errorMessage?: string;
};

/**
 * 폼 컨트롤 아래 안내·에러 메시지.
 *
 * **비어 있어도 렌더한다** — `aria-live` 영역은 내용이 바뀌기 **전에** DOM 에 있어야
 * 스크린리더가 변화를 읽는다. 내용과 함께 새로 끼워 넣은 live 영역은 읽히지 않는 경우가
 * 많다. 빈 상태는 `--empty` 로 시각적으로만 숨긴다 (`display: none` 이면 live 가 죽는다).
 * RHF 검증 실패처럼 포커스 이동 없이 메시지가 생기는 경우를 위한 장치다 (a11y.md §3).
 */
export default function Message({
  id,
  className,
  infoMessage = "",
  errorMessage = "",
}: MessageProps) {
  const hasErrorMessage = Boolean(errorMessage);
  // 에러가 있으면 도움말은 그리지 않는다 (SEED field.mdx — "Error Message와
  // Helper Text가 동시에 존재할 경우 Error Message만 표시합니다").
  //
  // 둘을 함께 보여 주면 읽는 사람이 무엇을 고쳐야 하는지 두 문장에서 골라야 한다.
  // 도움말은 "어떻게 쓰는가", 에러는 "지금 무엇이 잘못됐는가"라 **에러가 이긴다.**
  //
  // ⚠️ `hidden` 으로 숨기지 않고 **아예 렌더하지 않는다.** `__msg` 가
  //    `display: block` 이라 `[hidden]` 을 이겨 버려서, 숨긴 줄 알고 남겨 두면
  //    화면에 그대로 보인다.
  const hasInfoMessage = Boolean(infoMessage) && !hasErrorMessage;
  const isEmpty = !hasInfoMessage && !hasErrorMessage;

  return (
    <div
      id={id}
      className={cn(block, className, isEmpty && `${block}--empty`)}
      aria-live="polite"
    >
      {hasInfoMessage ? (
        <span className={`${block}__msg`}>{infoMessage}</span>
      ) : null}
      {hasErrorMessage ? (
        <span className={`${block}__msg ${block}__msg--error`}>
          <span className={`${block}__error-icon`}>
            <AttentionIcon />
          </span>
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

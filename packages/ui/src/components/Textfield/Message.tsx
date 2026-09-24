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
  /**
   * 글자 수 카운터 — **제한이 있을 때만** 그린다
   * (KRDS 가이드 683쪽 · 체크리스트 [텍스트 영역 4] · SEED `field.mdx`).
   *
   * 메시지와 **같은 줄**에 두는 것이 이 자리의 뜻이다 — 왼쪽은 무엇이 잘못됐는가,
   * 오른쪽은 얼마나 남았는가다 (SEED `field.yaml` 의 footer: description ·
   * errorMessage 는 왼쪽, characterCount 는 오른쪽).
   */
  count?: number;
  maxCount?: number;
  /** 카운터의 sr-only 라벨. 소비자의 어휘로 바꿀 수 있어야 한다 (a11y.md §9) */
  counterLabel?: string;
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
  count,
  maxCount,
  counterLabel = "글자 수",
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
  // 제한이 곧 카운터의 조건이다 — 제한이 없으면 남은 글자라는 개념 자체가 없다.
  const hasCounter = typeof maxCount === "number";
  const isOverLimit = hasCounter && (count ?? 0) > maxCount;
  // ⚠️ 카운터가 있으면 비어 있지 않다. `--empty` 는 자리를 없애는 클래스라
  //    메시지만 보고 판단하면 카운터가 화면에서 사라진다.
  const isEmpty = !hasInfoMessage && !hasErrorMessage && !hasCounter;

  return (
    <div id={id} className={cn(block, className, isEmpty && `${block}--empty`)}>
      {/*
        ⚠️ `aria-live` 는 **메시지에만** 붙인다. 카운터까지 감싸면 타이핑 한 글자마다
           스크린리더가 숫자를 읽는다 — 사용자가 직접 만드는 변화라 알릴 일이 아니고,
           그 사이 정작 중요한 에러 문구가 묻힌다. 카운터는 `aria-describedby` 로
           포커스 시점에 알리는 것으로 충분하다 (a11y.md §3).
      */}
      <span className={`${block}__live`} aria-live="polite">
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
      </span>
      {hasCounter ? (
        <span
          className={cn(`${block}__counter`, {
            [`${block}__counter--over`]: isOverLimit,
          })}
        >
          <span className={px("sr-only")}>{counterLabel}</span>
          <span className={`${block}__counter-current`}>{count ?? 0}</span>
          {" / "}
          <span className={`${block}__counter-max`}>{maxCount}</span>
        </span>
      ) : null}
    </div>
  );
}

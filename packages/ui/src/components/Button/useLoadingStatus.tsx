"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { px } from "../../internal/prefix.js";
import { PORTAL_ROOT_ATTRIBUTE } from "../../internal/portal.js";

const STATUS_ROOT_ID = px("status-root");

type UseLoadingStatusParams = {
  isLoading: boolean;
  loadingLabel: string | undefined;
  loadingLabelId: string;
};

/**
 * 로딩 시작을 **포커스 밖에서도** 알린다 (KRDS 가이드 595쪽 02).
 *
 * ⚠️ 버튼 **안**에 live 영역을 두면 대체로 무시된다 — AT 가 그 변화를 "live 갱신"이
 *    아니라 **버튼 이름의 변경**으로 처리하기 때문이다. 그래서 body 에 공용
 *    `role="status"` 영역을 하나 두고 로딩 중인 버튼만 자기 문구를 portal 로 넣는다.
 *
 * ⚠️ 영역은 **문구가 생기기 전에 DOM 에 있어야** 읽힌다. 내용과 함께 새로 끼워 넣은
 *    live 영역은 읽히지 않는 경우가 많다(`Message` 가 비어 있어도 렌더하는 것과 같은
 *    이유, a11y.md §3). 그래서 첫 버튼이 마운트될 때 **빈 채로** 만든다.
 *
 * **완료는 알리지 않는다.** 버튼은 결과를 모른다 — `isLoading` 이 내려간 것이 성공인지
 * 실패인지 알 수 없는데 "완료"라고 말하면 실패했을 때 거짓말이 된다. 결과 알림은
 * 소비자의 `Toast` 나 에러 메시지 몫이다. 문구가 사라지는 것 자체는 알림이 아니다.
 *
 * 반환값은 그대로 렌더한다. portal 이라 레이아웃에는 영향이 없다.
 */
export default function useLoadingStatus({
  isLoading,
  loadingLabel,
  loadingLabelId,
}: UseLoadingStatusParams) {
  const [statusRoot, setStatusRoot] = useState<HTMLElement | null>(null);

  // ⚠️ 마운트 이후에 잡는다. 렌더 중에 document 를 읽으면 서버 출력과 어긋나
  //    하이드레이션 불일치가 난다 (PopupHost·ToastHost 와 같은 규칙).
  useEffect(() => {
    let root = document.getElementById(STATUS_ROOT_ID);
    let createdByUs = false;

    if (!root) {
      root = document.createElement("div");
      root.id = STATUS_ROOT_ID;
      root.setAttribute("role", "status");
      root.setAttribute("aria-live", "polite");
      root.className = px("sr-only");
      document.body.appendChild(root);
      createdByUs = true;
    }

    // 팝업이 배경을 inert 처리할 때 건너뛰게 한다 — 팝업 안 버튼의 로딩도 알려야 한다
    root.setAttribute(PORTAL_ROOT_ATTRIBUTE, "");
    setStatusRoot(root);

    return () => {
      // 우리가 만든 컨테이너만, 비어 있을 때만 치운다
      if (createdByUs && root && root.childElementCount === 0) {
        root.remove();
      }
    };
  }, []);

  if (!statusRoot || !isLoading || !loadingLabel) return null;

  // `aria-hidden` 을 붙이지 않는다 — 버튼 밖이라 이름을 오염시키지 않고,
  // hidden 이면 live 알림 자체가 죽는다.
  return createPortal(
    <span id={loadingLabelId}>{loadingLabel}</span>,
    statusRoot,
  );
}

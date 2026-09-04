"use client";

/**
 * 우리가 `body` 에 붙이는 portal 컨테이너의 표시.
 *
 * 팝업이 열리면 `usePopupHostA11y` 가 body 직계 자식을 전부 `inert` +
 * `aria-hidden` 처리한다. 이 표시가 붙은 컨테이너는 건너뛴다 —
 * 토스트·툴팁은 **팝업 위에 떠서 동작해야** 하기 때문이다
 * (design-system.md §10 쌓임 계약).
 */
export const PORTAL_ROOT_ATTRIBUTE = "data-nui-portal-root";

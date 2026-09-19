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

/**
 * `body` 에 portal 컨테이너를 잡는다. 같은 id 를 여러 컴포넌트가 함께 쓰므로
 * 참조를 센다 — 마지막 하나가 놓을 때만 지운다.
 *
 * ⚠️ **마운트 이후에 부른다.** 렌더 중 `document` 를 읽으면 하이드레이션이 어긋난다.
 *
 * 반환값은 `release` 다. `useEffect` 의 정리 함수로 그대로 돌려준다.
 *
 * `Tooltip` · `DatepickerBase` 는 각자 같은 모양을 갖고 있다. 그 둘을 이리로 옮기는 것은
 * 이번 범위가 아니다 — **새로 쓰는 쪽만** 여기를 쓴다 (2026-09-14).
 */
const portalRootRefCounts = new Map<string, number>();
const portalRootsCreatedByUs = new Set<string>();

export function acquirePortalRoot(id: string): {
  root: HTMLElement;
  release: () => void;
} {
  let root = document.getElementById(id);

  if (!root) {
    root = document.createElement("div");
    root.id = id;
    document.body.appendChild(root);
    portalRootsCreatedByUs.add(id);
  }

  // 팝업이 배경을 inert 처리할 때 건너뛰게 한다 (design-system.md §10-1)
  root.setAttribute(PORTAL_ROOT_ATTRIBUTE, "");
  portalRootRefCounts.set(id, (portalRootRefCounts.get(id) ?? 0) + 1);

  const element = root;

  return {
    root: element,
    release: () => {
      const next = (portalRootRefCounts.get(id) ?? 1) - 1;
      portalRootRefCounts.set(id, next);

      if (
        next === 0 &&
        portalRootsCreatedByUs.has(id) &&
        element.childElementCount === 0
      ) {
        element.remove();
        portalRootsCreatedByUs.delete(id);
      }
    },
  };
}

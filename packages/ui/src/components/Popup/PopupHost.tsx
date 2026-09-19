"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { px } from "../../internal/prefix.js";
import { PORTAL_ROOT_ATTRIBUTE } from "../../internal/portal.js";
import Alert from "./Alert.js";
import Confirm from "./Confirm.js";
import { usePopupStore } from "./popup.store.js";
import { PopupHostContext, registerPopupHost } from "./PopupHost.context.js";
import usePopupHostA11y from "./usePopupHostA11y.js";

const POPUP_ROOT_ID = px("popup-root");

export type PopupHostProps = {
  children: ReactNode;
};

/**
 * 팝업이 그려지는 **유일한** 자리 (2026-09-17 · spec §6-2). 훅 다섯(useAlert / useConfirm /
 * useLayerPopup / useBottomSheet / useFullPopup)이 store 에 쌓은 것을 여기서 portal 로 그린다.
 * 앱 루트(App Router 라면 `app/layout.tsx`)에서 한 번만 감싼다 — 없으면 팝업이 뜨지 않는다.
 *
 * 배경 스크롤 잠금 · `inert` · 포커스 복원 · `isTopmost` 계산이 전부 여기 있다. 여는 길이
 * 하나라 빠지는 팝업이 없다.
 *
 * portal 컨테이너는 **없으면 직접 만든다** — 소비자가 `_document` 나 layout 에
 * 빈 div 를 심어야 하는 부담을 없애기 위해서다.
 */
export default function PopupHost({ children }: PopupHostProps) {
  const items = usePopupStore((state) => state.items);
  const closePopup = usePopupStore((state) => state.closePopup);
  const removePopup = usePopupStore((state) => state.removePopup);

  // Host 가 있다는 표식 — 훅 `open()` 이 Host 없이 불리면 개발 모드에서 경고한다
  useEffect(() => registerPopupHost(), []);

  // ⚠️ 마운트 이후에 컨테이너를 잡는다.
  //    렌더 중(useState initializer)에 document 를 읽으면 서버 출력과 어긋나
  //    하이드레이션 불일치가 난다.
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById(POPUP_ROOT_ID);
    let createdByUs = false;

    if (!root) {
      root = document.createElement("div");
      root.id = POPUP_ROOT_ID;
      document.body.appendChild(root);
      createdByUs = true;
    }

    // 다른 호스트가 배경을 inert 처리할 때 건너뛰게 한다
    root.setAttribute(PORTAL_ROOT_ATTRIBUTE, "");
    setPortalRoot(root);

    return () => {
      // 우리가 만든 컨테이너만, 비어 있을 때만 치운다
      if (createdByUs && root && root.childElementCount === 0) {
        root.remove();
      }
    };
  }, []);

  const topmostOpenPopupId = useMemo(
    () => [...items].reverse().find((item) => item.status === "open")?.id,
    [items],
  );

  usePopupHostA11y({ hasPopup: items.length > 0, portalRoot });

  return (
    <>
      {children}
      {portalRoot
        ? createPortal(
            // ⚠️ 표식은 portal 안에만 — `children` 을 감싸면 앱 안에서 손으로 렌더한 셸도
            //    표식을 얻어 둘째 길이 되살아난다 (`PopupHost.context.ts`)
            <PopupHostContext.Provider value={true}>
              {items.map((item) => {
                switch (item.type) {
                  case "alert": {
                    // 기본값은 구조분해로 둔다 — 문서 props 표(`extract-props`)가 여기서 `true` 를 읽는다
                    const { shouldCloseOnConfirm = true, ...alertProps } =
                      item.props;

                    return (
                      <Alert
                        key={item.id}
                        {...alertProps}
                        id={item.id}
                        open={item.status === "open"}
                        isTopmost={item.id === topmostOpenPopupId}
                        onConfirm={() => {
                          alertProps.onConfirm?.();

                          if (shouldCloseOnConfirm) {
                            closePopup(item.id);
                          }
                        }}
                        onCloseComplete={() => removePopup(item.id)}
                      />
                    );
                  }
                  case "confirm": {
                    const {
                      shouldCloseOnCancel = true,
                      shouldCloseOnConfirm = true,
                      ...confirmProps
                    } = item.props;

                    return (
                      <Confirm
                        key={item.id}
                        {...confirmProps}
                        id={item.id}
                        open={item.status === "open"}
                        isTopmost={item.id === topmostOpenPopupId}
                        onCancel={() => {
                          confirmProps.onCancel?.();

                          if (shouldCloseOnCancel) {
                            closePopup(item.id);
                          }
                        }}
                        onConfirm={() => {
                          confirmProps.onConfirm?.();

                          if (shouldCloseOnConfirm) {
                            closePopup(item.id);
                          }
                        }}
                        onCloseComplete={() => removePopup(item.id)}
                      />
                    );
                  }
                  case "layerPopup":
                  case "bottomSheet":
                  case "fullPopup": {
                    const PopupComponent = item.props.component;

                    return (
                      <PopupComponent
                        key={item.id}
                        id={item.id}
                        open={item.status === "open"}
                        isTopmost={item.id === topmostOpenPopupId}
                        onRequestClose={() => closePopup(item.id)}
                        onCloseComplete={() => removePopup(item.id)}
                      />
                    );
                  }
                  default:
                    return null;
                }
              })}
            </PopupHostContext.Provider>,
            portalRoot,
          )
        : null}
    </>
  );
}

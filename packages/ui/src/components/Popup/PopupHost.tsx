"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { px } from "../../internal/prefix.js";
import Alert from "./Alert.js";
import Confirm from "./Confirm.js";
import { usePopupStore } from "./popup.store.js";
import usePopupHostA11y from "./usePopupHostA11y.js";

const POPUP_ROOT_ID = px("popup-root");

type PopupHostProps = {
  children: ReactNode;
};

/**
 * 명령형 팝업(useAlert / useConfirm / useLayerPopup …)의 렌더링 지점.
 * 앱 루트(App Router 라면 `app/layout.tsx`)에서 한 번만 감싼다.
 *
 * portal 컨테이너는 **없으면 직접 만든다** — 소비자가 `_document` 나 layout 에
 * 빈 div 를 심어야 하는 부담을 없애기 위해서다.
 */
export default function PopupHost({ children }: PopupHostProps) {
  const items = usePopupStore((state) => state.items);
  const closePopup = usePopupStore((state) => state.closePopup);
  const removePopup = usePopupStore((state) => state.removePopup);

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
            <>
              {items.map((item) => {
                switch (item.type) {
                  case "alert": {
                    const { shouldCloseOnConfirm, ...alertProps } = item.props;

                    return (
                      <Alert
                        key={item.id}
                        {...alertProps}
                        id={item.id}
                        open={item.status === "open"}
                        isTopmost={item.id === topmostOpenPopupId}
                        onConfirm={() => {
                          alertProps.onConfirm?.();

                          if (shouldCloseOnConfirm ?? true) {
                            closePopup(item.id);
                          }
                        }}
                        onExited={() => removePopup(item.id)}
                      />
                    );
                  }
                  case "confirm": {
                    const {
                      shouldCloseOnCancel,
                      shouldCloseOnConfirm,
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

                          if (shouldCloseOnCancel ?? true) {
                            closePopup(item.id);
                          }
                        }}
                        onConfirm={() => {
                          confirmProps.onConfirm?.();

                          if (shouldCloseOnConfirm ?? true) {
                            closePopup(item.id);
                          }
                        }}
                        onExited={() => removePopup(item.id)}
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
                        onExited={() => removePopup(item.id)}
                      />
                    );
                  }
                  default:
                    return null;
                }
              })}
            </>,
            portalRoot,
          )
        : null}
    </>
  );
}

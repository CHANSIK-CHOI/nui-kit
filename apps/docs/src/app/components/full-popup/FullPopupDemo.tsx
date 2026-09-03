"use client";

import { useState } from "react";
import { Button } from "@chansikchoi/next-ui";
import {
  FullPopup,
  useFullPopup,
  type FullPopupComponentProps,
} from "@chansikchoi/next-ui/popup";
import { Example } from "@/components/guide";

/** 명령형으로 등록할 전체 팝업 내용. PopupHost 가 런타임 props 를 주입한다. */
function DetailPopup({
  open,
  onRequestClose,
  onExited,
  isTopmost,
}: FullPopupComponentProps) {
  return (
    <FullPopup
      open={open}
      onRequestClose={onRequestClose}
      onExited={onExited}
      isTopmost={isTopmost}
      title="상세 정보"
      footer={
        <Button color="primary" onClick={onRequestClose}>
          확인
        </Button>
      }
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        명령형으로 등록한 전체 팝업입니다. 긴 내용은 본문 영역 안에서
        스크롤됩니다.
      </p>
    </FullPopup>
  );
}

export function FullPopupDemo() {
  const fullPopup = useFullPopup();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h2>선언형 — 열림 상태를 직접 소유</h2>
      <Example
        caption="open · onRequestClose · isTopmost"
        code={`<FullPopup open={isOpen} onRequestClose={() => setIsOpen(false)} isTopmost title="상세 정보">…</FullPopup>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          FullPopup 열기
        </Button>
      </Example>

      <FullPopup
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        isTopmost
        title="상세 정보"
        footer={
          <Button color="primary" onClick={() => setIsOpen(false)}>
            확인
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          화면 전체를 덮고 오른쪽에서 슬라이드해 들어옵니다. 노치·홈 인디케이터
          영역(safe-area)을 피해 여백이 잡힙니다.
        </p>
      </FullPopup>

      <h2>명령형 — 컴포넌트를 등록해서 열기</h2>
      <p>
        <code>useFullPopup().open({"{ component }"})</code> 로 내용 컴포넌트를
        넘긴다.
      </p>
      <Example
        caption="useFullPopup().open({ component })"
        code={`fullPopup.open({ component: DetailPopup });`}
      >
        <Button
          size="medium"
          onClick={() => fullPopup.open({ component: DetailPopup })}
        >
          상세 팝업
        </Button>
      </Example>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import {
  BottomSheet,
  useBottomSheet,
  type BottomSheetComponentProps,
} from "@nui-kit/react/popup";
import { Example } from "@/components/guide";

const OPTIONS = ["링크 복사", "카카오톡", "메시지", "메일"];

/** 명령형으로 등록할 시트 내용. PopupHost 가 런타임 props 를 주입한다. */
function ShareSheet({
  open,
  onRequestClose,
  onExited,
  isTopmost,
}: BottomSheetComponentProps) {
  return (
    <BottomSheet
      open={open}
      onRequestClose={onRequestClose}
      onExited={onExited}
      isTopmost={isTopmost}
      title="공유하기"
    >
      <div style={{ display: "grid", gap: 8 }}>
        {OPTIONS.map((label) => (
          <Button
            key={label}
            variant="line"
            size="medium"
            onClick={onRequestClose}
          >
            {label}
          </Button>
        ))}
      </div>
    </BottomSheet>
  );
}

export function BottomSheetDemo() {
  const bottomSheet = useBottomSheet();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h2>선언형 — 열림 상태를 직접 소유</h2>
      <Example
        caption="open · onRequestClose · isTopmost"
        code={`<BottomSheet open={isOpen} onRequestClose={() => setIsOpen(false)} isTopmost title="공유하기">…</BottomSheet>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          BottomSheet 열기
        </Button>
      </Example>

      <BottomSheet
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        isTopmost
        title="공유하기"
        footer={
          <Button variant="line" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          아래에서 올라오는 시트입니다. 모바일 화면에서 선택지를 제시할 때
          씁니다. dim 을 누르거나 ESC 로 닫힙니다.
        </p>
      </BottomSheet>

      <h2>명령형 — 컴포넌트를 등록해서 열기</h2>
      <p>
        <code>useBottomSheet().open({"{ component }"})</code> 로 내용 컴포넌트를
        넘긴다. 시트 안의 선택지가 <code>onRequestClose</code> 를 부르면 닫힌다.
      </p>
      <Example
        caption="useBottomSheet().open({ component })"
        code={`bottomSheet.open({ component: ShareSheet });`}
      >
        <Button
          size="medium"
          onClick={() => bottomSheet.open({ component: ShareSheet })}
        >
          공유 시트
        </Button>
      </Example>
    </>
  );
}

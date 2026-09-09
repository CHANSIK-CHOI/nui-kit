"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import {
  BottomSheet,
  useBottomSheet,
  type BottomSheetComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

const SHARE_OPTIONS = ["링크 복사", "카카오톡", "메시지", "메일"];

export function BottomSheetDeclarativeDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Example
        caption="open 을 쓰는 쪽이 갖는다"
        code={`<BottomSheet open={isOpen} onRequestClose={() => setIsOpen(false)} title="정렬">…</BottomSheet>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          정렬 바꾸기
        </Button>
      </Example>

      <BottomSheet
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        title="정렬"
      >
        <div style={{ display: "grid", gap: 8 }}>
          {["최신순", "인기순", "낮은 가격순"].map((label) => (
            <Button
              key={label}
              variant="line"
              size="medium"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

/** 명령형으로 등록할 시트 내용. PopupHost 가 런타임 props 를 넣는다. */
function ShareSheet({
  open,
  onRequestClose,
  onCloseComplete,
  isTopmost,
}: BottomSheetComponentProps) {
  return (
    <BottomSheet
      open={open}
      onRequestClose={onRequestClose}
      onCloseComplete={onCloseComplete}
      isTopmost={isTopmost}
      title="공유하기"
    >
      <div style={{ display: "grid", gap: 8 }}>
        {SHARE_OPTIONS.map((label) => (
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

export function BottomSheetImperativeDemo() {
  const bottomSheet = useBottomSheet();

  return (
    <Example
      caption="내용 컴포넌트를 등록해서 연다"
      code={`bottomSheet.open({ component: ShareSheet });`}
    >
      <Button
        size="medium"
        onClick={() => bottomSheet.open({ component: ShareSheet })}
      >
        공유하기
      </Button>
    </Example>
  );
}

type OptionKey = "center" | "noClose";

export function BottomSheetOptionsDemo() {
  const [open, setOpen] = useState<OptionKey | null>(null);
  const close = () => setOpen(null);

  return (
    <>
      <CaseGrid
        columns={2}
        code={`<BottomSheet contentAlign="center" />
<BottomSheet hasCloseButton={false} />`}
      >
        <Case label='contentAlign="center"' note="짧은 안내">
          <Button variant="line" onClick={() => setOpen("center")}>
            가운데 정렬 열기
          </Button>
        </Case>
        <Case label="hasCloseButton={false}" note="dim · Esc 로만">
          <Button variant="line" onClick={() => setOpen("noClose")}>
            닫기 버튼 없이 열기
          </Button>
        </Case>
      </CaseGrid>

      <BottomSheet
        open={open === "center"}
        onRequestClose={close}
        contentAlign="center"
        title="주문을 접수했습니다"
        description="배송이 시작되면 알려 드릴게요."
        confirmLabel="주문 내역 보기"
        onConfirm={close}
      />
      <BottomSheet
        open={open === "noClose"}
        onRequestClose={close}
        hasCloseButton={false}
        title="필터"
        cancelLabel="닫기"
        confirmLabel="적용"
        onConfirm={close}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          × 가 없어도 dim 과 Esc 로 닫힙니다.
        </p>
      </BottomSheet>
    </>
  );
}

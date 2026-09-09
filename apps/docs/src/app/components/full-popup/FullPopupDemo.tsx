"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import {
  FullPopup,
  useFullPopup,
  type FullPopupComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

export function FullPopupDeclarativeDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Example
        caption="open 을 쓰는 쪽이 갖는다"
        code={`<FullPopup open={isOpen} onRequestClose={() => setIsOpen(false)} title="상품 상세">…</FullPopup>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          상품 상세 보기
        </Button>
      </Example>

      <FullPopup
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        title="상품 상세"
        confirmLabel="장바구니 담기"
        onConfirm={() => setIsOpen(false)}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          화면 전체를 덮고 오른쪽에서 들어옵니다. 긴 내용은 본문 안에서
          스크롤됩니다.
        </p>
      </FullPopup>
    </>
  );
}

/** 명령형으로 등록할 전체 팝업 내용. PopupHost 가 런타임 props 를 넣는다. */
function DetailPopup({
  open,
  onRequestClose,
  onCloseComplete,
  isTopmost,
}: FullPopupComponentProps) {
  return (
    <FullPopup
      open={open}
      onRequestClose={onRequestClose}
      onCloseComplete={onCloseComplete}
      isTopmost={isTopmost}
      title="주문 상세"
      confirmLabel="닫기"
      onConfirm={onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        명령형으로 연 전체 팝업입니다. 배경은 inert 가 되고 스크롤이 잠깁니다.
      </p>
    </FullPopup>
  );
}

export function FullPopupImperativeDemo() {
  const fullPopup = useFullPopup();

  return (
    <Example
      caption="내용 컴포넌트를 등록해서 연다"
      code={`fullPopup.open({ component: DetailPopup });`}
    >
      <Button
        size="medium"
        onClick={() => fullPopup.open({ component: DetailPopup })}
      >
        주문 상세 보기
      </Button>
    </Example>
  );
}

type OptionKey = "center" | "noClose";

export function FullPopupOptionsDemo() {
  const [open, setOpen] = useState<OptionKey | null>(null);
  const close = () => setOpen(null);

  return (
    <>
      <CaseGrid
        columns={2}
        code={`<FullPopup contentAlign="center" />
<FullPopup hasCloseButton={false} />`}
      >
        <Case label='contentAlign="center"' note="짧은 안내">
          <Button variant="line" onClick={() => setOpen("center")}>
            가운데 정렬 열기
          </Button>
        </Case>
        <Case label="hasCloseButton={false}" note="푸터 버튼과 Esc 로만">
          <Button variant="line" onClick={() => setOpen("noClose")}>
            닫기 버튼 없이 열기
          </Button>
        </Case>
      </CaseGrid>

      <FullPopup
        open={open === "center"}
        onRequestClose={close}
        contentAlign="center"
        title="가입을 완료했습니다"
        description="이제 모든 기능을 쓸 수 있습니다."
        confirmLabel="시작하기"
        onConfirm={close}
      />
      <FullPopup
        open={open === "noClose"}
        onRequestClose={close}
        hasCloseButton={false}
        title="본인 확인"
        confirmLabel="확인했습니다"
        onConfirm={close}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          × 가 없으면 푸터 버튼과 Esc 만 남으므로, 닫는 버튼은 푸터에 둡니다.
        </p>
      </FullPopup>
    </>
  );
}

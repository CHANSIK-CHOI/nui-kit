"use client";

import { useState } from "react";
import { Button, Field, Textfield } from "@nui-kit/react";
import {
  LayerPopup,
  useLayerPopup,
  type LayerPopupComponentProps,
} from "@nui-kit/react/popup";
import { Example } from "@/components/guide";

/** 명령형으로 등록할 팝업 내용. PopupHost 가 런타임 props 를 주입한다. */
function ProfilePopup({
  open,
  onRequestClose,
  onExited,
  isTopmost,
}: LayerPopupComponentProps) {
  return (
    <LayerPopup
      open={open}
      onRequestClose={onRequestClose}
      onExited={onExited}
      isTopmost={isTopmost}
      title="프로필 수정"
      footer={
        <Button color="primary" onClick={onRequestClose}>
          저장
        </Button>
      }
    >
      <Field>
        <Field.Label>이름</Field.Label>
        <Textfield placeholder="이름을 입력하세요" />
      </Field>
    </LayerPopup>
  );
}

export function LayerPopupDemo() {
  const layerPopup = useLayerPopup();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h2>선언형 — 열림 상태를 직접 소유</h2>
      <Example
        caption="open · onRequestClose · isTopmost"
        code={`<LayerPopup open={isOpen} onRequestClose={() => setIsOpen(false)} isTopmost title="약관 동의">…</LayerPopup>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          LayerPopup 열기
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`const [isOpen, setIsOpen] = useState(false);

<LayerPopup
  open={isOpen}
  onRequestClose={() => setIsOpen(false)}
  isTopmost
  title="약관 동의"
  footer={<Button color="primary" onClick={() => setIsOpen(false)}>동의합니다</Button>}
>
  내용
</LayerPopup>`}</code>
      </pre>

      <LayerPopup
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        isTopmost
        title="약관 동의"
        description="서비스 이용을 위해 아래 약관에 동의해주세요."
        footer={
          <Button color="primary" onClick={() => setIsOpen(false)}>
            동의합니다
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          dim 을 클릭하거나 ESC 를 눌러도 닫힙니다. Tab 을 눌러보면 포커스가
          팝업 밖으로 나가지 않습니다.
        </p>
      </LayerPopup>

      <h2>명령형 — 컴포넌트를 등록해서 열기</h2>
      <p>
        <code>useLayerPopup().open({"{ component }"})</code> 로 내용 컴포넌트를
        넘긴다. <code>PopupHost</code> 가 <code>open</code> ·{" "}
        <code>onRequestClose</code> · <code>onExited</code> ·{" "}
        <code>isTopmost</code> 를 넣어 렌더하므로 열림 상태를 화면 쪽에서 들고
        있을 필요가 없다.
      </p>
      <Example
        caption="useLayerPopup().open({ component })"
        code={`layerPopup.open({ component: ProfilePopup });`}
      >
        <Button
          size="medium"
          onClick={() => layerPopup.open({ component: ProfilePopup })}
        >
          프로필 팝업
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`function ProfilePopup({ open, onRequestClose, onExited, isTopmost }: LayerPopupComponentProps) {
  return (
    <LayerPopup open={open} onRequestClose={onRequestClose} onExited={onExited} isTopmost={isTopmost} title="프로필 수정">
      …
    </LayerPopup>
  );
}

const layerPopup = useLayerPopup();
layerPopup.open({ component: ProfilePopup });`}</code>
      </pre>
    </>
  );
}

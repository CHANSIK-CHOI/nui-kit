"use client";

import { useState } from "react";
import { Button, Field, SuccessIcon, Textfield } from "@nui-kit/react";
import {
  LayerPopup,
  useLayerPopup,
  type LayerPopupComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

export function LayerPopupDeclarativeDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Example
        caption="open 을 쓰는 쪽이 갖는다"
        code={`<LayerPopup open={isOpen} onRequestClose={() => setIsOpen(false)} title="약관 동의" footer={…}>…</LayerPopup>`}
      >
        <Button size="medium" variant="line" onClick={() => setIsOpen(true)}>
          약관 보기
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`const [isOpen, setIsOpen] = useState(false);

<LayerPopup
  open={isOpen}
  onRequestClose={() => setIsOpen(false)}
  title="약관 동의"
  footer={<Button onClick={() => setIsOpen(false)}>동의합니다</Button>}
>
  내용
</LayerPopup>`}</code>
      </pre>

      <LayerPopup
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        title="약관 동의"
        description="서비스 이용을 위해 아래 약관에 동의해 주세요."
        footer={<Button onClick={() => setIsOpen(false)}>동의합니다</Button>}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          dim 을 누르거나 Esc 를 눌러도 닫힙니다. Tab 은 팝업 밖으로 나가지
          않습니다.
        </p>
      </LayerPopup>
    </>
  );
}

/** 명령형으로 등록할 팝업 내용. PopupHost 가 런타임 props 를 넣는다. */
function ProfilePopup({
  open,
  onRequestClose,
  onCloseComplete,
  isTopmost,
}: LayerPopupComponentProps) {
  return (
    <LayerPopup
      open={open}
      onRequestClose={onRequestClose}
      onCloseComplete={onCloseComplete}
      isTopmost={isTopmost}
      title="프로필 수정"
      footer={<Button onClick={onRequestClose}>저장</Button>}
    >
      <Field>
        <Field.Label>이름</Field.Label>
        <Textfield placeholder="홍길동" autoComplete="name" />
      </Field>
    </LayerPopup>
  );
}

export function LayerPopupImperativeDemo() {
  const layerPopup = useLayerPopup();

  return (
    <>
      <Example
        caption="내용 컴포넌트를 등록해서 연다"
        code={`layerPopup.open({ component: ProfilePopup });`}
      >
        <Button
          size="medium"
          onClick={() => layerPopup.open({ component: ProfilePopup })}
        >
          프로필 수정
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`function ProfilePopup({ open, onRequestClose, onCloseComplete, isTopmost }: LayerPopupComponentProps) {
  return (
    <LayerPopup open={open} onRequestClose={onRequestClose} onCloseComplete={onCloseComplete} isTopmost={isTopmost} title="프로필 수정">
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

type OptionKey = "center" | "icon" | "noClose";

export function LayerPopupOptionsDemo() {
  const [open, setOpen] = useState<OptionKey | null>(null);
  const close = () => setOpen(null);

  return (
    <>
      <CaseGrid
        columns={3}
        code={`<LayerPopup contentAlign="center" />
<LayerPopup icon={<SuccessIcon />} />
<LayerPopup hasCloseButton={false} />`}
      >
        <Case label='contentAlign="center"' note="짧은 안내">
          <Button variant="line" onClick={() => setOpen("center")}>
            가운데 정렬 열기
          </Button>
        </Case>
        <Case label="icon" note="제목 위">
          <Button variant="line" onClick={() => setOpen("icon")}>
            아이콘 열기
          </Button>
        </Case>
        <Case label="hasCloseButton={false}" note="× 없음">
          <Button variant="line" onClick={() => setOpen("noClose")}>
            닫기 버튼 없이 열기
          </Button>
        </Case>
      </CaseGrid>

      <LayerPopup
        open={open === "center"}
        onRequestClose={close}
        size="small"
        contentAlign="center"
        title="업로드를 완료했습니다"
        description="파일 3개가 저장됐습니다."
        footer={<Button onClick={close}>닫기</Button>}
      />
      <LayerPopup
        open={open === "icon"}
        onRequestClose={close}
        size="small"
        icon={<SuccessIcon width={28} height={28} />}
        title="새 기능이 추가됐습니다"
        description="설정에서 알림 방식을 고를 수 있습니다."
        footer={<Button onClick={close}>설정 보기</Button>}
      />
      <LayerPopup
        open={open === "noClose"}
        onRequestClose={close}
        size="small"
        hasCloseButton={false}
        title="약관이 바뀌었습니다"
        description="계속 쓰려면 바뀐 약관에 동의해 주세요."
        footer={<Button onClick={close}>동의합니다</Button>}
      />
    </>
  );
}

export function LayerPopupCloseDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((prev) => [...prev, entry]);

  return (
    <>
      <Example
        caption="셋이 불리는 순서는 아래와 같다"
        code={`<LayerPopup onClickClose={…} onRequestClose={…} onCloseComplete={…} />`}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            size="medium"
            variant="line"
            onClick={() => {
              setLog([]);
              setIsOpen(true);
            }}
          >
            열기
          </Button>
          {log.length > 0 ? (
            <code style={{ fontSize: "var(--nui-font-size-3)" }}>
              {log.join(" → ")}
            </code>
          ) : null}
        </div>
      </Example>

      <LayerPopup
        open={isOpen}
        onClickClose={() => push("onClickClose")}
        onRequestClose={() => {
          push("onRequestClose");
          setIsOpen(false);
        }}
        onCloseComplete={() => push("onCloseComplete")}
        size="small"
        title="닫는 길 셋"
        description="× · dim · Esc 로 닫아 보세요."
      />
    </>
  );
}

export function LayerPopupStackDemo() {
  const [isOuterOpen, setIsOuterOpen] = useState(false);
  const [isInnerOpen, setIsInnerOpen] = useState(false);

  return (
    <>
      <Example
        caption="아래쪽은 isTopmost={false}. Esc 는 위쪽만 닫는다"
        code={`<LayerPopup open={isOuterOpen} isTopmost={!isInnerOpen} …>
  <LayerPopup open={isInnerOpen} …>…</LayerPopup>
</LayerPopup>`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => setIsOuterOpen(true)}
        >
          겹쳐 열기
        </Button>
      </Example>

      <LayerPopup
        open={isOuterOpen}
        onRequestClose={() => setIsOuterOpen(false)}
        isTopmost={!isInnerOpen}
        title="배송지"
        footer={<Button onClick={() => setIsInnerOpen(true)}>주소 찾기</Button>}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          「주소 찾기」를 누르면 위에 팝업이 하나 더 뜹니다. 그때 Esc 는 위쪽만
          닫습니다.
        </p>
        <LayerPopup
          open={isInnerOpen}
          onRequestClose={() => setIsInnerOpen(false)}
          size="small"
          title="주소 찾기"
          footer={<Button onClick={() => setIsInnerOpen(false)}>선택</Button>}
        >
          <Field>
            <Field.Label>도로명</Field.Label>
            <Textfield placeholder="세종대로 209" />
          </Field>
        </LayerPopup>
      </LayerPopup>
    </>
  );
}

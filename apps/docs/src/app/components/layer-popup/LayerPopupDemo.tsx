"use client";

import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Field,
  SuccessIcon,
  Textfield,
} from "@nui-kit/react";
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
        code={`<LayerPopup open={isOpen} onRequestClose={() => setIsOpen(false)} title="약관 동의" confirmLabel="동의합니다" onConfirm={agree}>…</LayerPopup>`}
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
  confirmLabel="동의합니다"
  onConfirm={() => setIsOpen(false)}
>
  내용
</LayerPopup>`}</code>
      </pre>

      <LayerPopup
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        title="약관 동의"
        description="서비스 이용을 위해 아래 약관에 동의해 주세요."
        confirmLabel="동의합니다"
        onConfirm={() => setIsOpen(false)}
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
      cancelLabel="취소"
      confirmLabel="저장"
      onConfirm={onRequestClose}
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
    <LayerPopup open={open} onRequestClose={onRequestClose} onCloseComplete={onCloseComplete} isTopmost={isTopmost} title="프로필 수정" cancelLabel="취소" confirmLabel="저장" onConfirm={onRequestClose}>
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
        confirmLabel="닫기"
        onConfirm={close}
      />
      <LayerPopup
        open={open === "icon"}
        onRequestClose={close}
        size="small"
        icon={<SuccessIcon width={28} height={28} />}
        title="새 기능이 추가됐습니다"
        description="설정에서 알림 방식을 고를 수 있습니다."
        confirmLabel="설정 보기"
        onConfirm={close}
      />
      <LayerPopup
        open={open === "noClose"}
        onRequestClose={close}
        size="small"
        hasCloseButton={false}
        title="약관이 바뀌었습니다"
        description="계속 쓰려면 바뀐 약관에 동의해 주세요."
        confirmLabel="동의합니다"
        onConfirm={close}
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
            <code style={{ fontSize: "var(--nui-font-size-2)" }}>
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

type FooterKey = "confirm" | "both" | "custom";

export function LayerPopupFooterDemo() {
  const [open, setOpen] = useState<FooterKey | null>(null);
  const close = () => setOpen(null);

  return (
    <>
      <CaseGrid
        columns={3}
        caption="라벨만 주면 표준 푸터. 둘 다 있으면 취소 : 확인 = 3 : 7"
        code={`<LayerPopup confirmLabel="저장" onConfirm={save} />
<LayerPopup cancelLabel="취소" confirmLabel="저장" onConfirm={save} />
<LayerPopup footer={
  <ButtonGroup>
    <ButtonGroup.Item><Button variant="line" onClick={call}>전화 걸기</Button></ButtonGroup.Item>
    <ButtonGroup.Item><Button onClick={navigate}>길 찾기</Button></ButtonGroup.Item>
  </ButtonGroup>
} />`}
      >
        <Case label="confirmLabel" note="확인 하나">
          <Button variant="line" onClick={() => setOpen("confirm")}>
            확인만 열기
          </Button>
        </Case>
        <Case label="cancelLabel + confirmLabel" note="3 : 7">
          <Button variant="line" onClick={() => setOpen("both")}>
            둘 다 열기
          </Button>
        </Case>
        <Case label="footer" note="확인 · 취소가 아닌 행동 둘. 5 : 5">
          <Button variant="line" onClick={() => setOpen("custom")}>
            footer 로 열기
          </Button>
        </Case>
      </CaseGrid>

      <LayerPopup
        open={open === "confirm"}
        onRequestClose={close}
        size="small"
        title="알림을 켤까요?"
        description="새 글이 오면 알려 드립니다."
        confirmLabel="켜기"
        onConfirm={close}
      />
      <LayerPopup
        open={open === "both"}
        onRequestClose={close}
        size="small"
        title="변경 사항을 저장할까요?"
        description="저장하지 않으면 입력한 내용이 사라집니다."
        cancelLabel="취소"
        confirmLabel="저장"
        onConfirm={close}
      />
      <LayerPopup
        open={open === "custom"}
        onRequestClose={close}
        size="small"
        title="매장 안내"
        description="영업시간은 10시부터 21시까지입니다."
        footer={
          <ButtonGroup>
            <ButtonGroup.Item>
              <Button variant="line" onClick={close}>
                전화 걸기
              </Button>
            </ButtonGroup.Item>
            <ButtonGroup.Item>
              <Button onClick={close}>길 찾기</Button>
            </ButtonGroup.Item>
          </ButtonGroup>
        }
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
          cancelLabel="취소"
          confirmLabel="선택"
          onConfirm={() => setIsInnerOpen(false)}
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

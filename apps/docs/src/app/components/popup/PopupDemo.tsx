"use client";

import { useState } from "react";
import { Button, Field, Textfield } from "@chansikchoi/next-ui";
import {
  BottomSheet,
  FullPopup,
  LayerPopup,
  useAlert,
  useConfirm,
  useLayerPopup,
  type LayerPopupComponentProps,
} from "@chansikchoi/next-ui/popup";
import { Example } from "@/components/Example";

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

export function PopupDemo() {
  const alert = useAlert();
  const confirm = useConfirm();
  const layerPopup = useLayerPopup();
  const [answer, setAnswer] = useState<string | null>(null);

  const [isLayerOpen, setIsLayerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFullOpen, setIsFullOpen] = useState(false);

  return (
    <>
      <h2>명령형 — Alert · Confirm</h2>
      <Example caption="useAlert() / useConfirm()">
        <div style={{ display: "flex", gap: 8, maxWidth: 480 }}>
          <Button
            size="medium"
            onClick={() =>
              alert.open({
                title: "저장 완료",
                description: "변경 사항이 저장되었습니다.",
              })
            }
          >
            Alert 열기
          </Button>
          <Button
            size="medium"
            variant="line"
            onClick={() =>
              confirm.open({
                title: "삭제할까요?",
                description: "삭제한 항목은 되돌릴 수 없습니다.",
                confirmText: "삭제",
                onConfirm: () => setAnswer("확인을 눌렀습니다"),
                onCancel: () => setAnswer("취소를 눌렀습니다"),
              })
            }
          >
            Confirm 열기
          </Button>
        </div>
      </Example>

      <h3>Promise 로 결과 받기</h3>
      <p>
        <code>openAsync</code> 는 사용자의 선택을{" "}
        <code>Promise&lt;boolean&gt;</code> 으로 돌려준다. 콜백을 나눠 쓰지 않고
        흐름대로 분기할 수 있다.
      </p>
      <Example caption="await confirm.openAsync(...)">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            maxWidth: 420,
          }}
        >
          <Button
            size="medium"
            color="danger"
            onClick={async () => {
              const isConfirmed = await confirm.openAsync({
                title: "정말 진행할까요?",
                description: "openAsync 로 결과를 기다립니다.",
              });
              setAnswer(
                isConfirmed ? "true 를 받았습니다" : "false 를 받았습니다",
              );
            }}
          >
            openAsync
          </Button>
          {answer ? (
            <span style={{ fontSize: "var(--nui-font-size-3)" }}>
              결과: <strong>{answer}</strong>
            </span>
          ) : null}
        </div>
      </Example>
      <pre className="doc-code">
        <code>{`const isConfirmed = await confirm.openAsync({
  title: "정말 진행할까요?",
});

if (isConfirmed) {
  // 확인을 누른 경우
}`}</code>
      </pre>

      <h3>컴포넌트를 등록해서 열기</h3>
      <p>
        <code>useLayerPopup().open({"{ component }"})</code> 로 내용 컴포넌트를
        넘긴다. 열림 상태를 화면 쪽에서 들고 있을 필요가 없다.
      </p>
      <Example caption="useLayerPopup — 내용 컴포넌트를 등록">
        <div style={{ maxWidth: 200 }}>
          <Button
            size="medium"
            onClick={() => layerPopup.open({ component: ProfilePopup })}
          >
            프로필 팝업
          </Button>
        </div>
      </Example>

      <h2>선언형 — 열림 상태를 직접 소유</h2>
      <Example caption="LayerPopup · BottomSheet · FullPopup">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
            maxWidth: 560,
          }}
        >
          <Button
            size="medium"
            variant="line"
            onClick={() => setIsLayerOpen(true)}
          >
            LayerPopup
          </Button>
          <Button
            size="medium"
            variant="line"
            onClick={() => setIsSheetOpen(true)}
          >
            BottomSheet
          </Button>
          <Button
            size="medium"
            variant="line"
            onClick={() => setIsFullOpen(true)}
          >
            FullPopup
          </Button>
        </div>
      </Example>
      <pre className="doc-code">
        <code>{`const [isOpen, setIsOpen] = useState(false);

<LayerPopup
  open={isOpen}
  onRequestClose={() => setIsOpen(false)}
  title="약관 동의"
>
  내용
</LayerPopup>`}</code>
      </pre>

      <LayerPopup
        open={isLayerOpen}
        onRequestClose={() => setIsLayerOpen(false)}
        isTopmost
        title="약관 동의"
        description="서비스 이용을 위해 아래 약관에 동의해주세요."
        footer={
          <Button color="primary" onClick={() => setIsLayerOpen(false)}>
            동의합니다
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          dim 을 클릭하거나 ESC 를 눌러도 닫힙니다. Tab 을 눌러보면 포커스가
          팝업 밖으로 나가지 않습니다.
        </p>
      </LayerPopup>

      <BottomSheet
        open={isSheetOpen}
        onRequestClose={() => setIsSheetOpen(false)}
        isTopmost
        title="공유하기"
        footer={
          <Button variant="line" onClick={() => setIsSheetOpen(false)}>
            닫기
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          아래에서 올라오는 시트입니다. 모바일 화면에서 선택지를 제시할 때
          씁니다.
        </p>
      </BottomSheet>

      <FullPopup
        open={isFullOpen}
        onRequestClose={() => setIsFullOpen(false)}
        isTopmost
        title="상세 정보"
        footer={
          <Button color="primary" onClick={() => setIsFullOpen(false)}>
            확인
          </Button>
        }
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          화면 전체를 덮고 오른쪽에서 슬라이드해 들어옵니다. 노치·홈 인디케이터
          영역(safe-area)을 피해 여백이 잡힙니다.
        </p>
      </FullPopup>
    </>
  );
}

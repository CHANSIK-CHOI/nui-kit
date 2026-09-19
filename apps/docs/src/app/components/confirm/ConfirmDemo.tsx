"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import { useConfirm } from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

export function ConfirmBasicDemo() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <Example
      caption="콜백으로 받는 방식"
      code={`confirm.open({ tone: "danger", title: "삭제할까요?", confirmLabel: "삭제", onConfirm, onCancel });`}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button
          size="medium"
          variant="line"
          color="danger"
          onClick={() =>
            confirm.open({
              tone: "danger",
              title: "삭제할까요?",
              description: "삭제한 항목은 되돌릴 수 없습니다.",
              confirmLabel: "삭제",
              onConfirm: () => setAnswer("삭제를 눌렀습니다"),
              onCancel: () => setAnswer("취소를 눌렀습니다"),
            })
          }
        >
          삭제
        </Button>
        {answer ? (
          <span style={{ fontSize: "var(--nui-font-size-2)" }}>{answer}</span>
        ) : null}
      </div>
    </Example>
  );
}

const TONES = [
  {
    tone: "info",
    label: "info",
    note: "기본 · 확인 버튼 중립",
    title: "지금 제출할까요?",
    description: "제출 뒤에도 마감 전까지 수정할 수 있어요.",
    confirmLabel: "제출",
  },
  {
    tone: "success",
    label: "success",
    note: "확인 버튼 중립",
    title: "이 주소로 배송할까요?",
    description: "서울시 강남구 테헤란로 1길",
    confirmLabel: "이 주소로 받기",
  },
  {
    tone: "warning",
    label: "warning",
    note: "확인 버튼 중립",
    title: "작성 중인 내용이 있습니다",
    description: "지금 나가면 쓰던 내용이 사라져요.",
    confirmLabel: "나가기",
  },
  {
    tone: "danger",
    label: "danger",
    note: "확인 버튼이 빨개진다",
    title: "계정을 삭제할까요?",
    description: "주문 내역과 쿠폰이 모두 사라지고 되돌릴 수 없어요.",
    confirmLabel: "계정 삭제",
  },
] as const;

export function ConfirmToneDemo() {
  const confirm = useConfirm();

  return (
    <CaseGrid
      columns={4}
      caption="danger 만 확인 버튼 색이 따라 바뀐다. 취소는 넷 다 중립 line 이다"
      code={`confirm.open({ tone: "danger", title: "계정을 삭제할까요?", confirmLabel: "계정 삭제" });`}
    >
      {TONES.map((item) => (
        <Case key={item.tone} label={item.label} note={item.note}>
          <Button
            size="medium"
            variant="line"
            onClick={() =>
              confirm.open({
                tone: item.tone,
                title: item.title,
                description: item.description,
                confirmLabel: item.confirmLabel,
              })
            }
          >
            열기
          </Button>
        </Case>
      ))}
    </CaseGrid>
  );
}

export function ConfirmAsyncDemo() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <>
      <Example
        caption="await 한 줄로 분기하는 방식"
        code={`const isConfirmed = await confirm.openAsync({ tone: "danger", title: "발송할까요?", confirmLabel: "발송" });`}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            size="medium"
            onClick={async () => {
              const isConfirmed = await confirm.openAsync({
                tone: "danger",
                title: "발송할까요?",
                description: "발송한 메시지는 취소할 수 없습니다.",
                confirmLabel: "발송",
              });
              setAnswer(
                isConfirmed ? "true 를 받았습니다" : "false 를 받았습니다",
              );
            }}
          >
            발송
          </Button>
          {answer ? (
            <span style={{ fontSize: "var(--nui-font-size-2)" }}>{answer}</span>
          ) : null}
        </div>
      </Example>
      <pre className="doc-code">
        <code>{`const isConfirmed = await confirm.openAsync({
  title: "발송할까요?",
  confirmLabel: "발송",
});

if (!isConfirmed) return;
await send();`}</code>
      </pre>
    </>
  );
}

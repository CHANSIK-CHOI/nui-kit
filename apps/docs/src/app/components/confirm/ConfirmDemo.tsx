"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import { useConfirm } from "@nui-kit/react/popup";
import { Example } from "@/components/guide";

export function ConfirmBasicDemo() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <Example
      caption="콜백으로 받는 방식"
      code={`confirm.open({ title: "삭제할까요?", confirmLabel: "삭제", onConfirm, onCancel });`}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button
          size="medium"
          variant="line"
          color="danger"
          onClick={() =>
            confirm.open({
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

export function ConfirmAsyncDemo() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <>
      <Example
        caption="await 한 줄로 분기하는 방식"
        code={`const isConfirmed = await confirm.openAsync({ title: "발송할까요?", confirmLabel: "발송" });`}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            size="medium"
            onClick={async () => {
              const isConfirmed = await confirm.openAsync({
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

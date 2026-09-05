"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import { useConfirm } from "@nui-kit/react/popup";
import { Example } from "@/components/guide";

export function ConfirmDemo() {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string | null>(null);

  const result = answer ? (
    <span style={{ fontSize: "var(--nui-font-size-3)" }}>
      결과: <strong>{answer}</strong>
    </span>
  ) : null;

  return (
    <>
      <Example
        caption="useConfirm().open() — 콜백으로 받는다"
        code={`confirm.open({ title: "삭제할까요?", confirmText: "삭제", onConfirm, onCancel });`}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
          {result}
        </div>
      </Example>

      <h3>Promise 로 결과 받기</h3>
      <p>
        <code>openAsync</code> 는 사용자의 선택을{" "}
        <code>Promise&lt;boolean&gt;</code> 으로 돌려준다. 콜백을 나눠 쓰지 않고
        흐름대로 분기한다. 확인이면 <code>true</code>, 취소나{" "}
        <code>close()</code> 로 닫히면 <code>false</code> 다.
      </p>
      <Example
        caption="await confirm.openAsync(...)"
        code={`const isConfirmed = await confirm.openAsync({ title: "정말 진행할까요?" });`}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
          {result}
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
    </>
  );
}

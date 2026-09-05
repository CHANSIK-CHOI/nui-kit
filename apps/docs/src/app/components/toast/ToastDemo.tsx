"use client";

import { Button } from "@nui-kit/react";
import { useToast } from "@nui-kit/react/toast";
import { Example } from "@/components/guide";

export function ToastDemo() {
  const toast = useToast();

  return (
    <>
      <h2>기본</h2>
      <Example
        row={false}
        caption="기본 지속시간 2400ms"
        code={`toast.open({ message: "저장되었습니다." });`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            maxWidth: 420,
          }}
        >
          <Button
            size="medium"
            onClick={() => toast.open({ message: "저장되었습니다." })}
          >
            기본 토스트
          </Button>
          <Button
            size="medium"
            color="danger"
            onClick={() =>
              toast.open({
                message: "저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
                tone: "error",
              })
            }
          >
            에러 토스트
          </Button>
        </div>
      </Example>

      <h2>지속시간</h2>
      <Example
        row={false}
        caption="duration — 0 이하면 자동으로 닫히지 않는다"
        code={`toast.open({ message: "저장 실패", tone: "error", duration: 0 });`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            maxWidth: 420,
          }}
        >
          <Button
            size="medium"
            variant="line"
            onClick={() =>
              toast.open({ message: "6초간 표시됩니다.", duration: 6000 })
            }
          >
            긴 토스트 (6s)
          </Button>
          <Button size="medium" variant="line" onClick={() => toast.close()}>
            가장 최근 것 닫기
          </Button>
        </div>
      </Example>

      <h2>여러 개 쌓기</h2>
      <p>
        토스트는 스택으로 쌓이고 아래에서 위로 정렬된다. <code>closeAll()</code>{" "}
        로 한 번에 닫을 수 있다.
      </p>
      <Example
        row={false}
        caption="스택 동작"
        code={`// ToastHost 를 앱 최상단에 한 번 놓는다\n<ToastHost>{children}</ToastHost>`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            maxWidth: 420,
          }}
        >
          <Button
            size="medium"
            variant="line"
            onClick={() => {
              toast.open({ message: "첫 번째 알림", duration: 8000 });
              toast.open({ message: "두 번째 알림", duration: 8000 });
              toast.open({
                message: "세 번째 알림",
                tone: "error",
                duration: 8000,
              });
            }}
          >
            3개 한 번에
          </Button>
          <Button size="medium" variant="line" onClick={() => toast.closeAll()}>
            전부 닫기
          </Button>
        </div>
      </Example>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@chansikchoi/next-ui";
import { useAlert } from "@chansikchoi/next-ui/popup";
import { Example } from "@/components/guide";

export function AlertDemo() {
  const alert = useAlert();
  const [count, setCount] = useState(0);

  return (
    <>
      <Example
        caption="useAlert().open()"
        code={`alert.open({ title: "저장 완료", description: "변경 사항이 저장되었습니다." });`}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button
            size="medium"
            onClick={() =>
              alert.open({
                title: "저장 완료",
                description: "변경 사항이 저장되었습니다.",
                onConfirm: () => setCount((n) => n + 1),
              })
            }
          >
            Alert 열기
          </Button>
          {count > 0 ? (
            <span style={{ fontSize: "var(--nui-font-size-3)" }}>
              확인을 {count}번 눌렀습니다
            </span>
          ) : null}
        </div>
      </Example>

      <h3>버튼 문구와 아이콘</h3>
      <p>
        <code>confirmText</code> 로 버튼 문구를, <code>icon</code> 으로 상단
        아이콘을 바꾼다. <code>icon={"{null}"}</code> 이면 아이콘 자리가
        없어진다.
      </p>
      <Example
        caption="confirmText · icon"
        code={`alert.open({ title: "…", confirmText: "알겠습니다", icon: null });`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            alert.open({
              title: "세션이 만료되었습니다",
              description: "다시 로그인해 주세요.",
              confirmText: "알겠습니다",
              icon: null,
            })
          }
        >
          아이콘 없이
        </Button>
      </Example>

      <h3>확인을 눌러도 닫지 않기</h3>
      <p>
        <code>shouldCloseOnConfirm: false</code> 면 확인을 눌러도 열려 있다.
        확인 처리에 시간이 걸려 직접 <code>close()</code> 해야 할 때 쓴다.
      </p>
      <Example
        caption="shouldCloseOnConfirm: false → close() 로 닫는다"
        code={`alert.open({ title: "…", shouldCloseOnConfirm: false, onConfirm: () => setTimeout(alert.close, 800) });`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            alert.open({
              title: "처리 중",
              description: "확인을 누르면 0.8초 뒤에 닫힙니다.",
              shouldCloseOnConfirm: false,
              onConfirm: () => setTimeout(() => alert.close(), 800),
            })
          }
        >
          직접 닫기
        </Button>
      </Example>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import { useAlert } from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

export function AlertBasicDemo() {
  const alert = useAlert();
  const [count, setCount] = useState(0);

  return (
    <Example
      caption="확인을 누르면 onConfirm 이 불리고 팝업이 닫힌다"
      code={`alert.open({ title: "저장했습니다", description: "변경 사항이 반영됐습니다.", onConfirm });`}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button
          size="medium"
          onClick={() =>
            alert.open({
              title: "저장했습니다",
              description: "변경 사항이 반영됐습니다.",
              onConfirm: () => setCount((n) => n + 1),
            })
          }
        >
          저장
        </Button>
        {count > 0 ? (
          <span style={{ fontSize: "var(--nui-font-size-3)" }}>
            확인을 {count}번 눌렀습니다
          </span>
        ) : null}
      </div>
    </Example>
  );
}

export function AlertOptionsDemo() {
  const alert = useAlert();

  return (
    <CaseGrid
      columns={3}
      caption="세 버튼이 각각 다른 옵션으로 연다"
      code={`alert.open({ title: "세션이 끝났습니다", confirmLabel: "다시 로그인", icon: null });`}
    >
      <Case label="icon={null}" note="아이콘 자리가 없다">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            alert.open({
              title: "세션이 끝났습니다",
              description: "다시 로그인해 주세요.",
              confirmLabel: "다시 로그인",
              icon: null,
            })
          }
        >
          아이콘 없이 열기
        </Button>
      </Case>
      <Case label="dialogLabel" note="제목 없이 본문만">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            alert.open({
              dialogLabel: "업로드 완료 알림",
              description: "파일 3개를 업로드했습니다.",
              confirmLabel: "닫기",
            })
          }
        >
          제목 없이 열기
        </Button>
      </Case>
      <Case label="shouldCloseOnConfirm: false" note="close() 로 닫는다">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            alert.open({
              title: "처리 중",
              description: "확인을 누르면 0.8초 뒤에 닫힙니다.",
              confirmLabel: "확인",
              shouldCloseOnConfirm: false,
              onConfirm: () => setTimeout(() => alert.close(), 800),
            })
          }
        >
          직접 닫기
        </Button>
      </Case>
    </CaseGrid>
  );
}

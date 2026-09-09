"use client";

import { useState } from "react";
import { Button } from "@nui-kit/react";
import { Toast, useToast } from "@nui-kit/react/toast";
import { Case, CaseGrid, Example } from "@/components/guide";

export function ToastBasicDemo() {
  const toast = useToast();

  return (
    <CaseGrid
      columns={3}
      caption="tone 셋. 성공과 에러에는 아이콘이 붙는다"
      code={`toast.open({ message: "저장을 완료했어요", tone: "success" });`}
    >
      <Case label="default" note="무슨 일이 있었다">
        <Button
          size="medium"
          variant="line"
          onClick={() => toast.open({ message: "저장했어요" })}
        >
          기본 토스트
        </Button>
      </Case>
      <Case label="success" note="됐다">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({ message: "저장을 완료했어요", tone: "success" })
          }
        >
          성공 토스트
        </Button>
      </Case>
      <Case label="error" note="잘못됐다. 즉시 읽힌다">
        <Button
          size="medium"
          variant="line"
          color="danger"
          onClick={() =>
            toast.open({
              message: "저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
              tone: "error",
            })
          }
        >
          에러 토스트
        </Button>
      </Case>
    </CaseGrid>
  );
}

export function ToastActionDemo() {
  const toast = useToast();

  return (
    <CaseGrid
      columns={3}
      code={`toast.open({ message: "항목을 삭제했어요", action: { label: "되돌리기", onClick: restore } });
toast.open({ message: "링크를 복사했어요", closable: true, closeLabel: "알림 닫기" });`}
    >
      <Case label="action" note="누르면 실행하고 닫힌다">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({
              message: "항목을 삭제했어요",
              action: {
                label: "되돌리기",
                onClick: () =>
                  toast.open({ message: "삭제를 되돌렸어요", tone: "success" }),
              },
            })
          }
        >
          되돌리기 있는 토스트
        </Button>
      </Case>
      <Case label="closable" note="× 가 붙는다">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({ message: "마우스를 올려 보세요", closable: true })
          }
        >
          닫기 버튼 있는 토스트
        </Button>
      </Case>
      <Case label="closeLabel" note="× 의 접근 이름">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({
              message: "링크를 복사했어요",
              closable: true,
              closeLabel: "알림 닫기",
            })
          }
        >
          접근 이름 바꾼 토스트
        </Button>
      </Case>
    </CaseGrid>
  );
}

export function ToastDurationDemo() {
  const toast = useToast();

  return (
    <CaseGrid
      columns={3}
      caption="0 이하면 저절로 닫히지 않는다"
      code={`toast.open({ message: "…", duration: 6000 });
toast.open({ message: "…", duration: 0, closable: true });`}
    >
      <Case label="duration={6000}" note="6초">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({ message: "6초 뒤에 사라져요", duration: 6000 })
          }
        >
          긴 토스트
        </Button>
      </Case>
      <Case label="duration={0}" note="닫기 버튼으로만">
        <Button
          size="medium"
          variant="line"
          onClick={() =>
            toast.open({
              message: "닫기를 누를 때까지 남아요",
              duration: 0,
              closable: true,
            })
          }
        >
          머무는 토스트
        </Button>
      </Case>
      <Case label="close()" note="지금 보이는 것">
        <Button size="medium" variant="line" onClick={() => toast.close()}>
          토스트 닫기
        </Button>
      </Case>
    </CaseGrid>
  );
}

export function ToastQueueDemo() {
  const toast = useToast();

  return (
    <Example
      row={false}
      caption="셋을 한 번에 열어도 하나씩 나온다"
      code={`toast.open({ message: "첫 번째" });
toast.open({ message: "두 번째" });
toast.open({ message: "세 번째", tone: "error" });`}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          size="medium"
          variant="line"
          onClick={() => {
            toast.open({ message: "첫 번째 알림", duration: 2500 });
            toast.open({ message: "두 번째 알림", duration: 2500 });
            toast.open({
              message: "세 번째 알림",
              tone: "error",
              duration: 2500,
            });
          }}
        >
          셋 한 번에 열기
        </Button>
        <Button size="medium" variant="line" onClick={() => toast.closeAll()}>
          전부 닫기
        </Button>
      </div>
    </Example>
  );
}

export function ToastDeclarativeDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((prev) => [...prev, entry]);

  return (
    <Example
      row={false}
      caption="제자리에 그려진다. 모션이 끝난 순서를 아래에 적는다"
      code={`<Toast open={isOpen} message="저장했어요" onRequestClose={() => setIsOpen(false)} onOpenComplete={…} onCloseComplete={…} />`}
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
          토스트 열기
        </Button>
        {log.length > 0 ? (
          <code style={{ fontSize: "var(--nui-font-size-3)" }}>
            {log.join(" → ")}
          </code>
        ) : null}
      </div>
      <div style={{ marginTop: 16, minHeight: 64 }}>
        <Toast
          open={isOpen}
          message="선언형으로 그린 토스트예요"
          duration={2500}
          onRequestClose={() => {
            push("onRequestClose");
            setIsOpen(false);
          }}
          onOpenComplete={() => push("onOpenComplete")}
          onCloseComplete={() => push("onCloseComplete")}
        />
      </div>
    </Example>
  );
}

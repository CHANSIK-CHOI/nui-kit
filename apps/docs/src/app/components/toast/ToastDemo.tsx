"use client";

import { Button } from "@nui-kit/react";
import { useToast } from "@nui-kit/react/toast";
import { Example } from "@/components/guide";

export function ToastDemo() {
  const toast = useToast();

  return (
    <>
      <h2>tone</h2>
      <p>
        <code>default</code> 는 &ldquo;무슨 일이 있었다&rdquo;,{" "}
        <code>success</code> 는 &ldquo;됐다&rdquo;, <code>error</code> 는
        &ldquo;잘못됐다&rdquo;를 말한다. 색만으로 구분하지 않도록{" "}
        <code>success</code> 와 <code>error</code> 에는 아이콘이 함께 붙는다.
      </p>
      <Example
        row={false}
        caption="기본 지속시간 4000ms"
        code={`toast.open({ message: "저장을 완료했어요", tone: "success" });`}
      >
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
            onClick={() => toast.open({ message: "저장되었습니다." })}
          >
            기본 토스트
          </Button>
          <Button
            size="medium"
            variant="line"
            onClick={() =>
              toast.open({
                message: "저장을 완료했어요",
                tone: "success",
              })
            }
          >
            성공 토스트
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

      <h2>읽는 동안은 사라지지 않는다</h2>
      <p>
        마우스가 올라가 있거나, 포커스가 안에 있거나, 다른 탭에 가 있으면 시간이
        멈추고 돌아오면 <strong>남은 시간부터</strong> 다시 간다. 아래 토스트를
        띄운 뒤 마우스를 올려 두고 기다려 보면 된다.
      </p>
      <Example
        row={false}
        caption="closable · action"
        code={`toast.open({
  message: "항목을 삭제했어요",
  closable: true,
  action: { label: "되돌리기", onClick: restore },
});`}
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
              toast.open({ message: "마우스를 올려 보세요", closable: true })
            }
          >
            닫기 버튼 있는 토스트
          </Button>
          <Button
            size="medium"
            variant="line"
            onClick={() =>
              toast.open({
                message: "항목을 삭제했어요",
                action: {
                  label: "되돌리기",
                  onClick: () =>
                    toast.open({
                      message: "삭제를 되돌렸어요",
                      tone: "success",
                    }),
                },
              })
            }
          >
            액션 있는 토스트
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

      <h2>한 번에 하나</h2>
      <p>
        토스트는 <strong>화면에 하나만</strong> 보인다. 여러 개를 띄우면 차례를
        기다렸다가 앞의 것이 사라진 뒤에 올라온다. 쌓이지 않으므로 화면 아래가
        덮이지 않고, 낭독도 겹치지 않는다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>duration: 0</code> 인 토스트는 스스로 사라지지 않으므로{" "}
        <strong>뒤의 것이 계속 기다린다.</strong> 자동으로 닫히지 않게 할 때는{" "}
        <code>closable</code> 을 함께 켜거나 직접 닫아 준다.
      </div>
      <Example
        row={false}
        caption="큐 동작 — 셋을 한 번에 띄워도 하나씩 나온다"
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
              toast.open({ message: "첫 번째 알림", duration: 2500 });
              toast.open({ message: "두 번째 알림", duration: 2500 });
              toast.open({
                message: "세 번째 알림",
                tone: "error",
                duration: 2500,
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

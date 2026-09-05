"use client";

import { useState, type FormEvent } from "react";
import { Button, ButtonGroup, Field, Textfield } from "@nui-kit/react";
import { Example } from "@/components/guide";

/**
 * 로딩 중 클릭·Enter·폼 제출이 막히는 것을 눈으로 확인하는 데모.
 * 호출 횟수가 로딩 중에 늘지 않으면 막힌 것이다.
 */
export function LoadingDemo() {
  const [isSaving, setIsSaving] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [name, setName] = useState("");

  const startSaving = () => {
    setIsSaving(true);
    window.setTimeout(() => setIsSaving(false), 2000);
  };

  const handleClick = () => {
    setClicks((n) => n + 1);
    startSaving();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmits((n) => n + 1);
    startSaving();
  };

  return (
    <>
      <Example
        row={false}
        caption="누르면 2초간 로딩 — 그동안 다시 눌러도 onClick 이 늘지 않는다"
        code={`<Button isLoading={isSaving} onClick={save}>저장</Button>`}
      >
        <ButtonGroup>
          <ButtonGroup.Item>
            <Button color="primary" isLoading={isSaving} onClick={handleClick}>
              저장
            </Button>
          </ButtonGroup.Item>
          <ButtonGroup.Item>
            <Button variant="line" onClick={() => setClicks(0)}>
              횟수 초기화
            </Button>
          </ButtonGroup.Item>
        </ButtonGroup>
        <p style={{ marginTop: 12 }} aria-live="polite">
          onClick 호출 {clicks}회
        </p>
      </Example>

      <Example
        row={false}
        caption="type=submit — 로딩 중에는 입력창에서 Enter 를 눌러도 제출되지 않는다"
        code={`<form onSubmit={submit}>
  <Textfield … />
  <Button type="submit" isLoading={isSaving}>제출</Button>
</form>`}
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Field>
            <Field.Label>이름</Field.Label>
            <Textfield
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="입력 후 Enter"
            />
          </Field>
          <Button type="submit" isLoading={isSaving}>
            제출
          </Button>
        </form>
        <p style={{ marginTop: 12 }} aria-live="polite">
          submit 호출 {submits}회
        </p>
      </Example>
    </>
  );
}

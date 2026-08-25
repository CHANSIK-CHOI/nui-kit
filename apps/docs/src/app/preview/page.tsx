// ⚠️ 2단계 검증용 임시 페이지. 4단계에서 정식 문서 페이지로 대체된다.
//    실제 배포 패키지(@chansikchoi/next-ui)를 그대로 import 해서
//    배럴 / 서브패스 / RHF 서브패스 / Context 공유가 모두 동작하는지 확인한다.
import type { CSSProperties } from "react";

// ① 배럴 import
import {
  Button,
  ButtonGroup,
  ButtonGroupItem,
  IconButton,
  Field,
  FieldLabel,
  FieldDescription,
  FieldGrid,
} from "@chansikchoi/next-ui";
// ② 서브패스 import — 같은 Context 를 공유해야 한다
import { Textfield } from "@chansikchoi/next-ui/textfield";
import { DelIcon } from "@chansikchoi/next-ui/icon";

import { RhfDemo } from "./RhfDemo";

export const metadata = { title: "Component Preview" };

const h2: CSSProperties = {
  fontSize: "var(--nui-font-size-body)",
  marginTop: "2rem",
  marginBottom: "0.5rem",
};
const row: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "1rem",
};

export default function PreviewPage() {
  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: 880, margin: "0 auto" }}>
      <h1 style={{ fontSize: "var(--nui-font-size-title)" }}>
        2단계 컴포넌트 검증
      </h1>

      <h2 style={h2}>Button — color (배럴 import)</h2>
      <div style={row}>
        <Button>black</Button>
        <Button color="primary">primary</Button>
        <Button color="secondary">secondary</Button>
        <Button color="point">point</Button>
      </div>

      <h2 style={h2}>Button — variant / shape / size</h2>
      <div style={row}>
        <Button variant="line" color="primary">
          line
        </Button>
        <Button variant="text">text</Button>
        <Button shape="round" color="primary">
          round
        </Button>
        <Button size="medium">medium</Button>
        <Button size="small">small</Button>
        <Button disabled>disabled</Button>
        <Button icon={<DelIcon />}>with icon</Button>
      </div>

      <h2 style={h2}>IconButton</h2>
      <div style={row}>
        <IconButton aria-label="삭제">
          <DelIcon />
        </IconButton>
        <IconButton
          variant="line"
          color="primary"
          aria-label="삭제"
          size="small"
        >
          <DelIcon />
        </IconButton>
      </div>

      <h2 style={h2}>
        커스터마이징 훅 — --nui-button-bg 는 기본 버튼만, variant 는 자기 훅
      </h2>
      <div
        style={
          {
            ...row,
            "--nui-button-bg": "#6d28d9",
            "--nui-button-radius": "999px",
          } as CSSProperties
        }
      >
        <Button>훅으로 덮어쓴 버튼</Button>
        <Button color="primary">primary 는 영향 없음</Button>
      </div>

      <h2 style={h2}>Field + Textfield (Context 공유 — 서브패스 import)</h2>
      <p
        style={{
          color: "var(--nui-color-text-secondary)",
          fontSize: "var(--nui-font-size-label)",
        }}
      >
        이 페이지는 Server Component 다 — dot notation 대신 named export
        (FieldLabel / FieldGrid …)를 쓴다. dot notation 은 아래 RHF
        데모(Client)에서 검증한다.
      </p>
      <Field>
        <FieldLabel>이름</FieldLabel>
        <Textfield placeholder="내용을 입력해주세요" />
        <FieldDescription>
          Field 가 생성한 id 가 label / input / description 에 자동 연결됩니다.
        </FieldDescription>
      </Field>

      <div style={{ height: 20 }} />

      <Field errorMessage="필수 입력 항목입니다.">
        <FieldLabel>에러 상태</FieldLabel>
        {/* Textfield 는 controlled 컴포넌트 — defaultValue 는 타입에서 제외되어 있다 */}
        <Textfield placeholder="금액" unit="원" />
      </Field>

      <div style={{ height: 20 }} />

      <Field>
        <FieldLabel>disabled / readonly</FieldLabel>
        <Textfield placeholder="disabled" disabled />
        <Textfield placeholder="readonly" readOnly />
      </Field>

      <h2 style={h2}>Field.Grid (columns=2)</h2>
      <FieldGrid columns={2}>
        <Field>
          <FieldLabel>좌측</FieldLabel>
          <Textfield placeholder="좌측" />
        </Field>
        <Field>
          <FieldLabel>우측</FieldLabel>
          <Textfield placeholder="우측" />
        </Field>
      </FieldGrid>

      <h2 style={h2}>RHF 래퍼 (@chansikchoi/next-ui/rhf)</h2>
      <RhfDemo />

      <h2 style={h2}>ButtonGroup</h2>
      <ButtonGroup>
        <ButtonGroupItem>
          <Button variant="line">취소</Button>
        </ButtonGroupItem>
        <ButtonGroupItem>
          <Button color="primary">확인</Button>
        </ButtonGroupItem>
      </ButtonGroup>
    </main>
  );
}

import Link from "next/link";
import { Field, FieldLabel, Textarea } from "@chansikchoi/next-ui";
import {
  GuideHeader,
  Case,
  CaseGrid,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { RHFTextareaDemo } from "./RHFTextareaDemo";

export const metadata = { title: "Textarea" };

export default function TextareaPage() {
  return (
    <>
      <GuideHeader title="Textarea" named={["Textarea"]} subpath="textarea">
        여러 줄 입력이다. <code>rows</code> 기본값은 4다.
      </GuideHeader>

      <h2>기본</h2>
      <CaseGrid
        columns={2}
        code={`<Textarea placeholder="내용" value={v} onChange={onChange} />`}
      >
        <Case label="기본" note="rows 4">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea placeholder="내용을 입력해주세요" />
          </Field>
        </Case>
        <Case label="value" note="값을 소유한다">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea value="입력한 내용" readOnly rows={4} />
          </Field>
        </Case>
      </CaseGrid>

      <h2>글자 수 카운터</h2>
      <p>
        <code>maxLength</code> 를 주면 <strong>영역 아래 오른쪽에 카운터가 붙는다.</strong>{" "}
        제한이 곧 조건이라 켜고 끄는 별도 prop 은 없다. 세는 단위는 브라우저의{" "}
        <code>maxlength</code> 와 같은 UTF-16 코드 단위여서 이모지는 2로 세진다 —
        카운터가 100 인데 더 쳐지는 일이 없다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Textarea maxLength={100} value={v} onChange={onChange} />`}
      >
        <Case label="maxLength" note="입력에 따라 갱신된다">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea placeholder="100자까지 쓸 수 있어요" maxLength={100} />
          </Field>
        </Case>
        <Case label="에러 메시지와 함께" note="왼쪽 메시지 · 오른쪽 카운터">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea
              value="내용을 조금 더 적어주세요"
              readOnly
              maxLength={100}
              errorMessage="10자 이상 입력해주세요."
            />
          </Field>
        </Case>
      </CaseGrid>
      <div className="doc-note">
        카운터에는 <code>aria-live</code> 를 붙이지 않는다. 글자마다 갱신되므로
        live 로 두면 스크린리더가 <strong>타이핑 한 글자마다 숫자를 읽는다.</strong>{" "}
        대신 <code>aria-describedby</code> 로 이어서 포커스가 들어올 때 &quot;글자
        수 12 / 100&quot; 으로 읽힌다. 이 앞말은 <code>counterLabel</code> 로
        바꾼다.
      </div>

      <h2>크기 조절</h2>
      <p>
        <code>resize</code> 기본값은 <code>vertical</code> 이라 사용자가 세로로
        늘릴 수 있다. <code>none</code> 을 주면 고정된다.
      </p>
      <CaseGrid columns={2} code={`<Textarea resize="none" rows={3} />`}>
        <Case label="vertical" note="기본">
          <Field>
            <FieldLabel>늘릴 수 있다</FieldLabel>
            <Textarea placeholder="오른쪽 아래를 끌어보세요" rows={3} />
          </Field>
        </Case>
        <Case label="none">
          <Field>
            <FieldLabel>고정</FieldLabel>
            <Textarea
              placeholder="크기를 바꿀 수 없다"
              resize="none"
              rows={3}
            />
          </Field>
        </Case>
      </CaseGrid>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="isError · disabled · readOnly"
        render={(p) => (
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea
              placeholder="내용을 입력해주세요"
              rows={2}
              value={p.disabled || p.readOnly ? "입력한 내용" : undefined}
              errorMessage={p.isError ? "10자 이상 입력해주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <RHFTextareaDemo />

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 <Link href="/brand-colors">브랜드 프리셋</Link>
        을 쓴다.
      </p>
      <HookTable group="textarea" />

      <h2>API</h2>
      <PropsTable of="Textarea" />
    </>
  );
}

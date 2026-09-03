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

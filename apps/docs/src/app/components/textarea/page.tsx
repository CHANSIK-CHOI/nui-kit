import Link from "next/link";
import { Field, FieldLabel, Textarea } from "@nui-kit/react";
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
      <GuideHeader title="Textarea" named={["Textarea"]} subpath="textarea" />

      <p>
        여러 줄 텍스트 입력이다. 높이는 <code>rows</code> 로 정하고(기본 4),
        사용자가 세로로 늘릴 수 있다.
      </p>

      <h2>기본</h2>
      <CaseGrid
        columns={2}
        caption="rows — 기본 4"
        code={`<Textarea value={v} onChange={onChange} rows={6} placeholder="…" />`}
      >
        <Case label="기본" note="rows 4">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea placeholder="주문 번호와 함께 적어 주세요" />
          </Field>
        </Case>
        <Case label="rows 2">
          <Field>
            <FieldLabel>한 줄 소개</FieldLabel>
            <Textarea placeholder="예: 프론트엔드 개발자" rows={2} />
          </Field>
        </Case>
      </CaseGrid>

      <h2>글자 수</h2>
      <p>
        <code>maxLength</code> 를 주면 아래 오른쪽에 카운터가 붙는다. 세는
        단위는 브라우저의 <code>maxlength</code> 와 같은 UTF-16 코드 단위라
        이모지는 2 로 세진다. 카운터가 100 인데 더 입력되는 일은 없다. 읽히는
        방식은 <Link href="/components/message">Message</Link> 에 있다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Textarea maxLength={100} value={v} onChange={onChange} />`}
      >
        <Case label="maxLength" note="입력에 따라 갱신된다">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea placeholder="100자까지" maxLength={100} />
          </Field>
        </Case>
        <Case label="에러와 함께" note="왼쪽 메시지 · 오른쪽 카운터">
          <Field>
            <FieldLabel>문의 내용</FieldLabel>
            <Textarea
              value="주문이 안 와요"
              readOnly
              maxLength={100}
              errorMessage="10자 이상 적어 주세요"
            />
          </Field>
        </Case>
      </CaseGrid>

      <h2>크기 조절</h2>
      <CaseGrid
        columns={2}
        caption="resize — vertical(기본) · none"
        code={`<Textarea resize="none" rows={3} />`}
      >
        <Case label="vertical" note="오른쪽 아래를 끌면 늘어난다">
          <Field>
            <FieldLabel>메모</FieldLabel>
            <Textarea placeholder="오른쪽 아래를 끌어 보세요" rows={3} />
          </Field>
        </Case>
        <Case label="none" note="고정">
          <Field>
            <FieldLabel>메모</FieldLabel>
            <Textarea placeholder="크기가 고정된다" resize="none" rows={3} />
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
              placeholder="주문 번호와 함께 적어 주세요"
              rows={2}
              value={p.disabled || p.readOnly ? "주문이 안 와요" : undefined}
              errorMessage={p.isError ? "10자 이상 적어 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <RHFTextareaDemo />

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열려 있지 않다. 한 곳만 바꾸려면{" "}
        <code>className</code> 을, 화면 전체를 바꾸려면{" "}
        <Link href="/brand-colors">브랜드 프리셋</Link>을 쓴다.
      </p>
      <HookTable group="textarea" />

      <h2>API</h2>
      <PropsTable of="Textarea" />
    </>
  );
}

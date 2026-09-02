import { Field, FieldLabel } from "@chansikchoi/next-ui";
import { Textarea } from "@chansikchoi/next-ui/textarea";
import { Example } from "@/components/guide";
import { HookTable } from "@/components/guide";
import { PropsTable } from "@/components/guide";

export const metadata = { title: "Textarea" };

export default function TextareaPage() {
  return (
    <>
      <h1>Textarea</h1>
      <p className="doc-lead">
        여러 줄 텍스트 입력. <code>Textfield</code> 와 같은 상태 체계와 메시지
        구조를 쓴다. <strong>controlled 컴포넌트</strong>다.
      </p>

      <pre className="doc-code">
        <code>{`import { Textarea } from "@chansikchoi/next-ui";`}</code>
      </pre>

      <h2>기본</h2>
      <Example row={false} caption="rows 기본값은 4">
        <Field>
          <FieldLabel>문의 내용</FieldLabel>
          <Textarea placeholder="내용을 입력해주세요" />
        </Field>
      </Example>

      <h2>크기 조절</h2>
      <p>
        기본은 <code>vertical</code> — 사용자가 세로로 늘릴 수 있다. 레이아웃이
        깨지면 안 되는 화면에서는 <code>none</code> 을 쓴다.
      </p>
      <Example row={false} caption='resize="none"'>
        <Field>
          <FieldLabel>고정 크기</FieldLabel>
          <Textarea placeholder="크기를 바꿀 수 없다" resize="none" rows={3} />
        </Field>
      </Example>

      <h2>상태</h2>
      <Example row={false} caption="disabled · readOnly · error">
        <Field>
          <FieldLabel>비활성</FieldLabel>
          <Textarea placeholder="disabled" disabled rows={2} />
        </Field>
        <div style={{ height: 12 }} />
        <Field errorMessage="10자 이상 입력해주세요.">
          <FieldLabel>에러</FieldLabel>
          <Textarea placeholder="내용" rows={2} />
        </Field>
      </Example>

      <h2>커스터마이징</h2>
      <p>
        <strong>색은 컴포넌트별로 열지 않는다.</strong> 폼 전체의 톤은{" "}
        <code>--nui-control-*</code> 역할 토큰으로 바꾼다 —{" "}
        <a href="/foundations/color">색 문서</a> 참조.
      </p>
      <HookTable group="textarea" />

      <h2>API</h2>
      <PropsTable of="Textarea" />
    </>
  );
}

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGrid,
  FieldItem,
} from "@chansikchoi/next-ui";
import { Textfield } from "@chansikchoi/next-ui/textfield";
import { Example } from "@/components/Example";
import { PropsTable } from "@/components/PropsTable";

export const metadata = { title: "Field" };

export default function FieldPage() {
  return (
    <>
      <h1>Field</h1>
      <p className="doc-lead">
        폼 컨트롤의 레이아웃과 <strong>접근성 연결</strong>을 담당한다. id 생성,
        label 연결, <code>aria-describedby</code> 수집을 Field 가 소유하므로
        컨트롤 쪽에서 id 를 직접 만들 필요가 없다.
      </p>

      <div className="doc-note">
        이 페이지는 Server Component 다. 그래서 dot notation 대신{" "}
        <code>FieldLabel</code> 같은 named export 를 쓴다. Client Component
        에서는 <code>Field.Label</code> 이 그대로 동작한다.
      </div>

      <h2>기본</h2>
      <p>
        <code>Field</code> 로 감싸기만 하면 label 의 <code>htmlFor</code> 와
        input 의 <code>id</code> 가 자동으로 연결된다.
      </p>
      <Example caption="label 클릭 시 input 에 포커스가 간다" row={false}>
        <Field>
          <FieldLabel>이름</FieldLabel>
          <Textfield placeholder="홍길동" />
        </Field>
      </Example>
      <pre className="doc-code">
        <code>{`<Field>
  <FieldLabel>이름</FieldLabel>
  <Textfield placeholder="홍길동" />
</Field>`}</code>
      </pre>

      <h2>설명과 메시지</h2>
      <p>
        <code>FieldDescription</code> 은 마운트 시 자기 id 를 Field 에 등록하고,
        컨트롤의 <code>aria-describedby</code> 에 자동으로 합쳐진다.
      </p>
      <Example
        row={false}
        caption="description 이 aria-describedby 로 연결된다"
      >
        <Field>
          <FieldLabel>이메일</FieldLabel>
          <Textfield placeholder="name@example.com" />
          <FieldDescription>회사 메일 주소를 입력해주세요.</FieldDescription>
        </Field>
      </Example>

      <h2>에러</h2>
      <p>
        <code>errorMessage</code> 를 주면 Field 하위 컨트롤이 전부 에러 상태가
        되고 <code>aria-invalid</code> 가 붙는다. 색만이 아니라 아이콘과
        텍스트로 함께 표현한다.
      </p>
      <Example row={false} caption="errorMessage 는 하위 컨트롤에 전파된다">
        <Field errorMessage="필수 입력 항목입니다.">
          <FieldLabel>연락처</FieldLabel>
          <Textfield placeholder="01012345678" />
        </Field>
      </Example>

      <h2>방향</h2>
      <Example row={false} caption='direction="row" · align="center"'>
        <Field direction="row" align="center">
          <FieldLabel>수량</FieldLabel>
          <Textfield placeholder="0" unit="개" />
        </Field>
      </Example>

      <h2>Field.Grid</h2>
      <p>
        여러 Field 를 열로 배치한다. <code>columns</code> 는{" "}
        <code>--nui-field-grid-columns</code> CSS 변수로 전달된다.
      </p>
      <Example row={false} caption="columns={2}">
        <FieldGrid columns={2}>
          <Field>
            <FieldLabel>시</FieldLabel>
            <Textfield placeholder="서울" />
          </Field>
          <Field>
            <FieldLabel>구</FieldLabel>
            <Textfield placeholder="강남구" />
          </Field>
        </FieldGrid>
      </Example>
      <div className="doc-note doc-note--warn">
        <strong>모바일 1열 붕괴는 현재 보류 상태다.</strong> 브레이크포인트
        대응은 별도 단계에서 일괄 적용한다. 지금은 모든 뷰포트에서 지정한 열
        수를 유지하며, 1열이 필요하면 <code>columns={1}</code> 로 제어한다.
      </div>

      <h2>Field.Item</h2>
      <p>Field 안에서 하위 그룹을 만든다. 자체 id 범위와 에러 상태를 갖는다.</p>
      <Example row={false} caption="FieldItem 은 기본이 row 방향이다">
        <Field>
          <FieldLabel>배송지</FieldLabel>
          <FieldItem direction="column" align="start">
            <Textfield placeholder="우편번호" />
            <Textfield placeholder="상세 주소" />
          </FieldItem>
        </Field>
      </Example>

      <h2>API</h2>
      <h3>Field</h3>
      <PropsTable of="Field" />
      <h3>Field.Item</h3>
      <PropsTable of="Field.Item" />
      <h3>Field.Grid</h3>
      <PropsTable of="Field.Grid" />
      <h3>Field.Description</h3>
      <PropsTable of="Field.Description" />
      <h3>Field.Message</h3>
      <PropsTable of="Field.Message" />
    </>
  );
}

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGrid,
  FieldItem,
  Textfield,
} from "@chansikchoi/next-ui";
import {
  GuideHeader,
  Case,
  CaseGrid,
  CaseMatrix,
  Example,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "Field" };

const DIRECTIONS = ["column", "row"] as const;
const ALIGNS = ["start", "center"] as const;

export default function FieldPage() {
  return (
    <>
      <GuideHeader
        title="Field"
        named={[
          "Field",
          "FieldLabel",
          "FieldDescription",
          "FieldGrid",
          "FieldItem",
        ]}
        subpath="field"
      >
        라벨과 설명, 메시지를 컨트롤에 묶는다. <code>id</code> 연결과{" "}
        <code>aria</code> 속성을 대신 처리한다.
      </GuideHeader>

      <div className="doc-note">
        이 페이지는 Server Component 라 dot notation 대신{" "}
        <code>FieldLabel</code> 같은 named export 를 쓴다. Client Component
        에서는 <code>Field.Label</code> 이 그대로 동작한다.
      </div>

      <h2>기본</h2>
      <p>
        라벨을 누르면 컨트롤에 포커스가 간다. <code>id</code> 는 Field 가
        만들어 라벨과 컨트롤에 같이 넣는다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Field>
  <FieldLabel>이름</FieldLabel>
  <Textfield placeholder="홍길동" />
</Field>`}
      >
        <Case label="기본">
          <Field>
            <FieldLabel>이름</FieldLabel>
            <Textfield placeholder="홍길동" />
          </Field>
        </Case>
        <Case label="FieldDescription" note="aria-describedby 로 연결된다">
          <Field>
            <FieldLabel>이메일</FieldLabel>
            <Textfield placeholder="name@example.com" />
            <FieldDescription>회사 메일 주소를 입력해주세요.</FieldDescription>
          </Field>
        </Case>
      </CaseGrid>

      <h2>에러</h2>
      <p>
        Field 에 <code>errorMessage</code> 를 주면 하위 컨트롤이 전부 에러
        상태가 된다. 컨트롤마다 따로 줄 필요가 없다.
      </p>
      <CaseGrid
        columns={2}
        caption="색만이 아니라 아이콘과 텍스트로 함께 표현한다"
        code={`<Field errorMessage="필수 입력 항목입니다.">…</Field>`}
      >
        <Case label="errorMessage">
          <Field errorMessage="필수 입력 항목입니다.">
            <FieldLabel>연락처</FieldLabel>
            <Textfield placeholder="01012345678" />
          </Field>
        </Case>
        <Case label="설명과 함께" note="둘 다 연결된다">
          <Field errorMessage="숫자만 입력해주세요.">
            <FieldLabel>연락처</FieldLabel>
            <Textfield placeholder="01012345678" />
            <FieldDescription>하이픈 없이 입력합니다.</FieldDescription>
          </Field>
        </Case>
      </CaseGrid>

      <h2>방향과 정렬</h2>
      <p>
        <code>direction</code> 이 <code>column</code> 이면 라벨이 위,{" "}
        <code>row</code> 면 옆이다. <code>align</code> 은 <code>row</code> 일
        때 세로 정렬을 정한다.
      </p>
      <CaseMatrix
        rows={DIRECTIONS}
        cols={ALIGNS}
        caption="direction × align"
        code={`<Field direction="row" align="center">…</Field>`}
        render={(direction, align) => (
          <div style={{ minWidth: 200 }}>
            <Field direction={direction} align={align}>
              <FieldLabel>수량</FieldLabel>
              <Textfield placeholder="0" unit="개" />
            </Field>
          </div>
        )}
      />

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
        <strong>모바일 1열 붕괴는 보류 상태다.</strong> 지금은 모든 뷰포트에서
        지정한 열 수를 유지한다. 1열이 필요하면 <code>columns={1}</code> 로
        제어한다.
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

      <h2>커스터마이징</h2>
      <HookTable group="field" />

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

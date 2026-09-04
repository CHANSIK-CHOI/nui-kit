import Link from "next/link";
import { Field, FieldLabel, Textfield } from "@chansikchoi/next-ui";
import {
  GuideHeader,
  Case,
  CaseGrid,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { TextfieldDemo } from "./TextfieldDemo";

export const metadata = { title: "Textfield" };

export default function TextfieldPage() {
  return (
    <>
      <GuideHeader title="Textfield" named={["Textfield"]} subpath="textfield">
        한 줄 입력이다. 값은 <code>value</code> 와 <code>onChange</code> 로
        소유한다. <code>defaultValue</code> 는 타입에서 제외되어 있다.
      </GuideHeader>

      <h2>기본</h2>
      <CaseGrid
        columns={2}
        caption="Field 와 함께 쓰면 id·label 이 자동 연결된다"
        code={`<Textfield placeholder="내용" value={v} onChange={onChange} />`}
      >
        <Case label="기본" note="개인정보 필드에는 autoComplete 를 준다">
          <Field>
            <FieldLabel>이름</FieldLabel>
            <Textfield placeholder="내용을 입력해주세요" autoComplete="name" />
          </Field>
        </Case>
        <Case label="unit" note="값이 오른쪽으로 정렬된다">
          <Field>
            <FieldLabel>금액</FieldLabel>
            <Textfield placeholder="0" unit="원" />
          </Field>
        </Case>
      </CaseGrid>

      <h2>메시지</h2>
      <p>
        <code>infoMessage</code> 는 안내, <code>errorMessage</code> 는 에러다.
        에러가 있으면 안내 대신 에러가 보인다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Textfield errorMessage="8자 이상 입력해주세요" />`}
      >
        <Case label="infoMessage">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Textfield
              type="password"
              placeholder="8자 이상"
              infoMessage="영문·숫자·특수문자를 조합해주세요."
            />
          </Field>
        </Case>
        <Case label="errorMessage">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Textfield
              type="password"
              placeholder="8자 이상"
              infoMessage="영문·숫자·특수문자를 조합해주세요."
              errorMessage="8자 이상 입력해주세요."
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
            <FieldLabel>이름</FieldLabel>
            <Textfield
              placeholder="내용을 입력해주세요"
              value={p.disabled || p.readOnly ? "홍길동" : undefined}
              errorMessage={p.isError ? "이름을 입력해주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <div className="doc-note">
        <code>readOnly</code> 는 배경까지 바뀌어 못 고치는 값임을 드러낸다.{" "}
        <code>isTextInputBlocked</code> 는 타이핑만 막고 겉모습은 그대로다.
        달력이나 목록으로만 값을 고르게 할 때 쓴다.
      </div>
      <CaseGrid
        columns={2}
        code={`<Textfield value={picked} isTextInputBlocked />`}
      >
        <Case label="readOnly" note="회색 배경">
          <Field>
            <FieldLabel>읽기 전용</FieldLabel>
            <Textfield value="2026-09-02" readOnly />
          </Field>
        </Case>
        <Case label="isTextInputBlocked" note="겉모습은 활성 그대로">
          <Field>
            <FieldLabel>달력으로만 고른다</FieldLabel>
            <Textfield value="2026-09-02" isTextInputBlocked />
          </Field>
        </Case>
      </CaseGrid>

      <h2>지우기</h2>
      <p>
        <code>isClearable</code> 과 <code>onClear</code> 를 함께 준다. 값이 있고{" "}
        <code>readOnly</code> · <code>disabled</code> 가 아닐 때만 버튼이
        나타난다.
      </p>
      <TextfieldDemo />

      <h2>자동 완성</h2>
      <p>
        <code>autoComplete</code> 를 <strong>기본으로 끄지 않는다.</strong> 이름
        · 이메일 · 전화 · 주소 · 생년월일처럼 개인정보를 받는 입력에는 용도를
        지정한다 — WCAG 1.3.5 와 KRDS 체크리스트 [텍스트 입력 필드 5] 가
        요구하는 것이고, 손 떨림 · 인지 장애 · 모바일 사용자에게는 실질적인
        접근성 장치다. <code>Search</code> · <code>Password</code> ·{" "}
        <code>Datepicker</code> 도 이 필드를 그대로 쓴다.
      </p>
      <pre className="doc-code">
        <code>{`<Textfield autoComplete="email" />                 // 켠다
<Search autoComplete="off" />                     // 검색어 이력이 싫으면 끈다
<Datepicker autoComplete="bday" />                // 생년월일
<Password autoComplete="current-password" />      // 비밀번호 관리자`}</code>
      </pre>

      <h2>react-hook-form</h2>
      <p>
        <code>RHFTextfield</code> 는 <code>/rhf</code> 서브패스에 있다.{" "}
        <code>useController</code> 로 값을 소유하므로 <code>value</code> ·{" "}
        <code>onChange</code> 를 넘기지 않는다.
      </p>
      <pre className="doc-code">
        <code>{`import { useForm } from "react-hook-form";
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";

const { control } = useForm<{ email: string }>();

<RHFTextfield
  name="email"
  control={control}
  rules={{ required: "이메일을 입력해주세요." }}
  placeholder="name@example.com"
  isClearable
/>`}</code>
      </pre>
      <div className="doc-note">
        <code>react-hook-form</code> 은 optional peer 다. RHF 래퍼를 쓸 때만
        설치하면 된다. 소비자의 <code>control</code> 을 그대로 받으므로 같은
        인스턴스를 공유해야 하고, 그래서 dependency 가 아니라 peer 다.
      </div>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 <Link href="/brand-colors">브랜드 프리셋</Link>
        을 쓴다.
      </p>
      <HookTable group="textfield" />

      <h2>API</h2>
      <h3>Textfield</h3>
      <PropsTable of="Textfield" />
      <h3>Message</h3>
      <PropsTable of="Message" />
    </>
  );
}

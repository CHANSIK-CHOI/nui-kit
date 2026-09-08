import Link from "next/link";
import { Field, FieldLabel, Textfield } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  Case,
  CaseGrid,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { TextfieldDemo } from "./TextfieldDemo";
import { CounterDemo } from "./CounterDemo";

export const metadata = { title: "Textfield" };

/** 축은 코드에서 뽑는다 — `TextfieldInputType` 은 타입 별칭이라 props 표에 값이 안 보인다 */
const TYPES = [
  ["text", "홍길동", "기본"],
  ["email", "hong@example.com", "모바일에서 @ 키보드"],
  ["tel", "010-0000-0000", "숫자 키패드"],
  ["url", "https://", "URL 키보드"],
  ["number", "0", "숫자만. unit 과 함께 쓴다"],
  ["password", "8자 이상", "표시 토글이 필요하면 Password"],
] as const;

export default function TextfieldPage() {
  return (
    <>
      <GuideHeader
        title="Textfield"
        named={["Textfield"]}
        subpath="textfield"
      />

      <p>
        한 줄 텍스트 입력이다. <code>Field</code> 안에 두면 라벨 · 도움말 ·
        에러가 연결된다 — <Link href="/forms">폼 만들기</Link> 참조.
      </p>

      <h2>기본</h2>
      <CaseGrid
        columns={2}
        caption="unit 을 주면 값이 오른쪽으로 정렬된다"
        code={`<Textfield value={v} onChange={onChange} placeholder="홍길동" />`}
      >
        <Case label="기본">
          <Field>
            <FieldLabel>이름</FieldLabel>
            <Textfield placeholder="홍길동" autoComplete="name" />
          </Field>
        </Case>
        <Case label="unit" note="오른쪽 정렬">
          <Field>
            <FieldLabel>금액</FieldLabel>
            <Textfield type="number" placeholder="0" unit="원" />
          </Field>
        </Case>
      </CaseGrid>

      <h2>type</h2>
      <p>
        네이티브 <code>type</code> 그대로 넘어간다. 겉모습은 같고 모바일
        키보드와 브라우저 검증이 달라진다.
      </p>
      <CaseGrid
        columns={3}
        caption="type 6 — text(기본) · email · tel · url · number · password"
        code={`<Textfield type="tel" placeholder="010-0000-0000" autoComplete="tel" />`}
      >
        {TYPES.map(([type, placeholder, note]) => (
          <Case key={type} label={type} note={note}>
            <Field>
              <FieldLabel>{type === "text" ? "이름" : type}</FieldLabel>
              <Textfield type={type} placeholder={placeholder} />
            </Field>
          </Case>
        ))}
      </CaseGrid>
      <div className="doc-note">
        비밀번호에는 <Link href="/components/password">Password</Link> 를 쓴다.
        표시 · 숨김 토글과 지우기 뒤 숨김 복귀가 들어 있다.
      </div>

      <h2>메시지</h2>
      <p>
        <code>infoMessage</code> 는 안내, <code>errorMessage</code> 는 에러다.
        둘 다 주면 에러만 보인다. 자리 · 카운터 · 읽히는 방식은{" "}
        <Link href="/components/message">Message</Link> 에 있다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Textfield errorMessage="8자 이상 입력해 주세요" />`}
      >
        <Case label="infoMessage">
          <Field>
            <FieldLabel>별명</FieldLabel>
            <Textfield
              placeholder="2~10자"
              infoMessage="다른 사람에게 보이는 이름이에요"
            />
          </Field>
        </Case>
        <Case label="errorMessage" note="infoMessage 를 덮는다">
          <Field>
            <FieldLabel>별명</FieldLabel>
            <Textfield
              placeholder="2~10자"
              infoMessage="다른 사람에게 보이는 이름이에요"
              errorMessage="2자 이상 입력해 주세요"
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
              placeholder="홍길동"
              value={p.disabled || p.readOnly ? "홍길동" : undefined}
              errorMessage={p.isError ? "이름을 입력해 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />
      <CaseGrid
        columns={2}
        caption="readOnly 는 배경까지 바뀌고, isTextInputBlocked 는 타이핑만 막는다"
        code={`<Textfield value={picked} isTextInputBlocked />`}
      >
        <Case label="readOnly" note="못 고치는 값">
          <Field>
            <FieldLabel>가입일</FieldLabel>
            <Textfield value="2026-09-02" readOnly />
          </Field>
        </Case>
        <Case label="isTextInputBlocked" note="달력 · 목록으로만 고른다">
          <Field>
            <FieldLabel>방문일</FieldLabel>
            <Textfield value="2026-09-02" isTextInputBlocked />
          </Field>
        </Case>
      </CaseGrid>

      <DesignNote title="왜 에러여도 입력값은 빨개지지 않나">
        <p>
          에러에서 바뀌는 것은 테두리 · 캐럿 · 단위 표시 · 메시지다. 값까지
          빨개지면 「이 값이 틀렸다」가 아니라 「이 값을 지워라」로 읽힌다. 값은
          사용자가 쓴 것이고 고쳐야 할 곳은 메시지가 가리킨다.
        </p>
      </DesignNote>

      <h2>글자 수</h2>
      <p>
        <code>maxLength</code> 를 주면 메시지 줄 오른쪽에 카운터가 붙는다.
        제한이 없으면 남은 글자라는 개념이 없어서 카운터도 없다.
      </p>
      <CounterDemo />

      <h2>지우기</h2>
      <p>
        <code>isClearable</code> 과 <code>onClear</code> 를 함께 준다. 값이 있고{" "}
        <code>readOnly</code> · <code>disabled</code> 가 아닐 때만 버튼이
        나타난다. 접근 이름은 <code>clearButtonTitle</code> 로 바꾼다.
      </p>
      <TextfieldDemo />

      <DesignNote title="왜 안쪽 버튼은 24px 인가">
        <p>
          손가락으로 누르는 자리는 44px 이 기준이다. 입력 안에는 지우기와 단위 ·
          토글이 8px 간격으로 붙어 있어 44 를 채우면 서로의 누르는 범위를
          삼킨다. 그래서 하한인 24px 을 쓴다 — 버튼 하나만 있는 자리(팝업 닫기 ·
          달력 이전/다음)는 44 를 채운다.
        </p>
      </DesignNote>

      <h2>자동 완성</h2>
      <p>
        개인정보를 받는 입력에는 <code>autoComplete</code> 를 준다. 손 떨림 ·
        인지 장애 · 모바일 사용자에게 실질적인 접근성 장치다. 컴포넌트가
        기본으로 끄지 않으므로 끌 때만 명시한다.
      </p>
      <pre className="doc-code">
        <code>{`<Textfield autoComplete="email" />
<Search autoComplete="off" />                  // 검색어 이력을 안 남길 때
<Datepicker autoComplete="bday" />
<Password autoComplete="current-password" />`}</code>
      </pre>

      <h2>react-hook-form</h2>
      <p>
        <code>RHFTextfield</code> 가 <code>@nui-kit/react/rhf</code> 에 있다.{" "}
        <code>control</code> 과 <code>name</code> 만 주면 값 · 검증 · 에러
        표시가 이어진다 — <Link href="/forms">폼 만들기</Link> 에 움직이는 예가
        있다.
      </p>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열려 있지 않다. 한 곳만 바꾸려면{" "}
        <code>className</code> 을, 화면 전체를 바꾸려면{" "}
        <Link href="/brand-colors">브랜드 프리셋</Link>을 쓴다. 아래 변수는{" "}
        <code>Search</code> · <code>Password</code> 도 함께 쓴다.
      </p>
      <HookTable group="textfield" />

      <h2>API</h2>
      <PropsTable of="Textfield" />
    </>
  );
}

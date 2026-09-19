import Link from "next/link";
import { Field, FieldLabel } from "@nui-kit/react";
import { Search } from "@nui-kit/react/textfield";
import {
  GuideHeader,
  Case,
  CaseGrid,
  InputStateCases,
  PropsTable,
} from "@/components/guide";
import { SearchDemo } from "./SearchDemo";
import { RHFSearchDemo } from "./RHFSearchDemo";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <GuideHeader
        title="Search"
        named={["Search"]}
        subpath="textfield"
        css="textfield"
      />

      <p>
        검색 버튼이 붙은 <Link href="/components/textfield">Textfield</Link> 다.
        입력 · 메시지 · 지우기 · 상태는 Textfield 와 같고, <code>type</code> 만
        받지 않는다 — 검색은 언제나 <code>text</code> 다.
      </p>

      <h2>기본</h2>
      <SearchDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 <code>Textfield</code> 와 같다 —{" "}
        <code>medium</code>
        (48px · 기본)과 <code>large</code>(56px). 안쪽 검색 버튼은 두 단계가
        같다.
      </p>
      <CaseGrid
        columns={2}
        caption="size — medium(기본) · large"
        code={`<Search size="large" placeholder="검색어" />`}
      >
        <Case label="medium" note="48px · 기본">
          <Search placeholder="검색어" aria-label="검색어" />
        </Case>
        <Case label="large" note="56px">
          <Search size="large" placeholder="검색어" aria-label="검색어" />
        </Case>
      </CaseGrid>

      <h2>버튼이 하는 일</h2>
      <p>
        <code>onSearch</code> 를 주면 버튼이 그 콜백만 부른다. 주지 않으면{" "}
        <code>type=&quot;submit&quot;</code> 이 되어 폼 제출로 이어진다 — 폼
        안에서 Enter 제출을 그대로 쓰려면 주지 않는다.
      </p>
      <pre className="doc-code">
        <code>{`<Search onSearch={run} />            // 버튼 → run()
<form onSubmit={submit}>
  <Search />                           // 버튼 → 폼 제출 (Enter 도)
</form>
<Search searchButtonType="button" />   // 둘 다 아닐 때 직접 정한다`}</code>
      </pre>
      <div className="doc-note">
        버튼의 접근 이름은 <code>searchButtonTitle</code> 로 바꿀 수 있다.
        기본은 「검색」이다.
      </div>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="isError · disabled · readOnly"
        render={(p) => (
          <Field>
            <FieldLabel>검색어</FieldLabel>
            <Search
              placeholder="상품명 · 브랜드"
              value={p.disabled || p.readOnly ? "운동화" : undefined}
              errorMessage={
                p.isError ? "두 글자 이상 입력해 주세요" : undefined
              }
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />
      <CaseGrid
        caption="isTextInputBlocked — 타이핑만 막고 버튼은 동작한다"
        code={`<Search value={picked} isTextInputBlocked onSearch={run} />`}
      >
        <Case label="isTextInputBlocked" note="목록에서 고른 값으로만 검색">
          <Field>
            <FieldLabel>카테고리</FieldLabel>
            <Search value="신발" isTextInputBlocked />
          </Field>
        </Case>
      </CaseGrid>

      <RHFSearchDemo />

      <h2>API</h2>
      <PropsTable of="Search" />
    </>
  );
}

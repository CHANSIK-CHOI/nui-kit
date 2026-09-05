import { Field, FieldLabel } from "@nui-kit/react";
import { Search } from "@nui-kit/react/textfield";
import { GuideHeader, InputStateCases, PropsTable } from "@/components/guide";
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
      >
        검색 버튼이 붙은 <code>Textfield</code> 다.
      </GuideHeader>

      <h2>기본</h2>
      <SearchDemo />

      <h2>버튼 동작</h2>
      <div className="doc-note">
        <code>onSearch</code> 를 주면 버튼이{" "}
        <code>type=&quot;button&quot;</code> 으로, 주지 않으면{" "}
        <code>type=&quot;submit&quot;</code> 으로 동작한다. 폼 안에서 엔터
        제출을 그대로 쓰려면 <code>onSearch</code> 를 주지 않는다.
      </div>
      <p>
        <code>searchButtonTitle</code> 로 버튼의 접근 이름을 바꾼다.
      </p>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="isError · disabled · readOnly"
        render={(p) => (
          <Field>
            <FieldLabel>검색</FieldLabel>
            <Search
              placeholder="검색어를 입력하세요"
              value={p.disabled || p.readOnly ? "검색어" : undefined}
              errorMessage={p.isError ? "검색어를 입력해주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <RHFSearchDemo />

      <h2>API</h2>
      <PropsTable of="Search" />
    </>
  );
}

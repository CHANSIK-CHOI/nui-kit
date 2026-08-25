import { Field, FieldLabel } from "@chansikchoi/next-ui";
import { Search } from "@chansikchoi/next-ui/textfield";
import { Example } from "@/components/Example";
import { PropsTable } from "@/components/PropsTable";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <h1>Search</h1>
      <p className="doc-lead">
        검색 버튼이 붙은 <code>Textfield</code> 파생 컴포넌트다.
      </p>

      <h2>기본</h2>
      <Example row={false} caption="검색 버튼에는 접근 이름이 붙어 있다">
        <Field>
          <FieldLabel>검색</FieldLabel>
          <Search placeholder="검색어를 입력하세요" />
        </Field>
      </Example>

      <h2>버튼 동작</h2>
      <div className="doc-note">
        <code>onSearch</code> 를 주면 버튼이{" "}
        <code>type=&quot;button&quot;</code> 으로, 주지 않으면{" "}
        <code>type=&quot;submit&quot;</code> 으로 동작한다. 폼 안에서 엔터
        제출을 그대로 쓰고 싶으면 <code>onSearch</code> 를 주지 않으면 된다.
      </div>

      <h2>API</h2>
      <PropsTable of="Search" />
    </>
  );
}

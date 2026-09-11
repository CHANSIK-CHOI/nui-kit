import Link from "next/link";
import {
  Field,
  FieldLabel,
  MultiSelect,
  type SelectOption,
} from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  MultiSelectBasicDemo,
  MultiSelectSizeDemo,
  MultiSelectMenuDemo,
  MultiSelectChipDemo,
} from "./MultiSelectDemo";
import { RHFMultiSelectDemo } from "./RHFMultiSelectDemo";

export const metadata = { title: "MultiSelect" };

/** 상태 격자에 고정으로 보여줄 옵션 */
const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
];

const ACTIONS = [
  ["select-option", "목록에서 하나를 골랐다", "고른 값"],
  ["deselect-option", "목록에서 이미 고른 것을 다시 눌러 뺐다", "뺀 값"],
  ["remove-value", "칩의 × 를 눌렀다", "뺀 값"],
  ["pop-value", "입력창이 빈 채로 Backspace 를 눌러 마지막 칩을 뺐다", "뺀 값"],
  ["clear", "지우기 버튼으로 전부 비웠다", "removedValues 에 전부"],
] as const;

export default function MultiSelectPage() {
  return (
    <>
      <GuideHeader
        title="MultiSelect"
        named={["MultiSelect"]}
        subpath="select"
      />

      <p>
        목록에서 여러 개를 고르는 입력이다. 값은 옵션 <code>value</code> 의
        배열이고 고른 것은 칩으로 보인다. 검색 · 옵션 묶음 · 상태 ·{" "}
        <code>hasPortal</code> · 접근성은{" "}
        <Link href="/components/select">Select</Link> 와 같다. 이 페이지는 여러
        개에서 달라지는 것만 적는다.
      </p>

      <h2>기본</h2>
      <MultiSelectBasicDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 <code>Select</code> 와 같다 — <code>medium</code>
        (48px · 기본)과 <code>large</code>(56px). 칩이 줄을 넘으면 그만큼
        자란다.
      </p>
      <MultiSelectSizeDemo />

      <h2>연달아 고르기</h2>
      <p>
        하나를 고르면 메뉴가 닫힌다. 여럿을 이어서 고르게 하려면{" "}
        <code>closeMenuOnSelect={"{false}"}</code> 를 준다. 이미 고른 옵션은
        목록에서 빠지고, 남겨 두려면{" "}
        <code>hideSelectedOptions={"{false}"}</code> 다.
      </p>
      <MultiSelectMenuDemo />

      <h2>칩</h2>
      <p>
        칩의 × 는 버튼이라 <kbd>Tab</kbd> 으로 닿는다. 칩이 여럿이면 앞에서부터
        하나씩 잡히고 그다음이 입력창이다. <kbd>Enter</kbd> 와 <kbd>Space</kbd>{" "}
        로 지우고, 지우면 포커스가 이전 칩으로 간다. 접근 이름은 「서울 옵션
        삭제」이고 <code>removeButtonLabel</code> 로 바꾼다.{" "}
        <code>readOnly</code> 면 × 가 사라진다.
      </p>
      <MultiSelectChipDemo />

      <DesignNote title="왜 removeButtonLabel 은 문자열이 아니라 함수인가">
        <p>
          라벨을 끼워 넣는 자리가 언어마다 다르다. 한국어는 「서울 옵션 삭제」,
          영어는 「Remove 서울」이다. 문자열 하나로는 그 순서를 바꿀 수 없어
          라벨을 받아 문장을 돌려주는 함수를 받는다.
        </p>
      </DesignNote>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="readOnly 는 칩의 × 도 감춘다. disabled 는 칩도 비활성 색이다"
        code={`<MultiSelect options={OPTIONS} value={cities} onChange={setCities} errorMessage="한 곳 이상 골라 주세요" />`}
        render={(p) => (
          <Field>
            <FieldLabel>관심 지역</FieldLabel>
            <MultiSelect
              options={CITIES}
              placeholder="지역을 고르세요"
              value={p.disabled || p.readOnly ? ["seoul", "busan"] : []}
              errorMessage={p.isError ? "한 곳 이상 골라 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <h2>무엇을 해서 바뀌었나</h2>
      <p>
        <code>onChange</code> 의 세 번째 인자 <code>meta.action</code> 이 값이
        바뀐 까닭을 말한다. 「방금 뺀 것만 서버에 알린다」처럼 값 전체가 아니라
        변화만 필요할 때 쓴다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>action</th>
              <th>언제</th>
              <th>
                <code>option</code>
              </th>
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map(([action, when, option]) => (
              <tr key={action}>
                <td>
                  <code>{action}</code>
                </td>
                <td className="doc-wrap">{when}</td>
                <td className="doc-wrap">{option}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="doc-code">
        <code>{`<MultiSelect
  options={OPTIONS}
  value={cities}
  onChange={(next, selectedOptions, meta) => {
    setCities(next);
    if (meta.action === "remove-value") unsubscribe(meta.option);
  }}
/>`}</code>
      </pre>

      <RHFMultiSelectDemo />

      <h2>커스터마이징</h2>
      <p>
        아래 변수는 <code>Select</code> 와 함께 쓴다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="select" />

      <h2>API</h2>
      <p>
        <code>Select</code> 의 prop 에 <code>removeButtonLabel</code> 이
        더해진다. <code>value</code> 는 배열이고 <code>onChange</code> 의 두
        번째 인자는 고른 옵션의 배열이다.
      </p>
      <PropsTable of="MultiSelect" />
    </>
  );
}

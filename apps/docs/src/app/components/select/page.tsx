import Link from "next/link";
import { Field, FieldLabel, Select, type SelectOption } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  SelectBasicDemo,
  SelectSizeDemo,
  SelectSearchDemo,
  SelectOptionsDemo,
  SelectPortalDemo,
} from "./SelectDemo";
import { RHFSelectDemo } from "./RHFSelectDemo";

export const metadata = { title: "Select" };

/** 상태 격자에 고정으로 보여줄 옵션 */
const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
];

export default function SelectPage() {
  return (
    <>
      <GuideHeader title="Select" named={["Select"]} subpath="select" />

      <p>
        목록에서 하나를 고르는 입력이다. 값은 옵션 객체가 아니라 옵션의{" "}
        <code>value</code> 하나이고, <code>value</code> 와 <code>onChange</code>{" "}
        로 쓰는 쪽이 갖는다. 여러 개를 고르려면{" "}
        <Link href="/components/multi-select">MultiSelect</Link> 를 쓴다.
      </p>

      <h2>기본</h2>
      <SelectBasicDemo />
      <div className="doc-note">
        <code>value</code> 는 <code>options</code> 안에 있는 값이어야 한다.
        옵션을 아직 불러오지 않았을 때처럼 목록에 없는 값을 주면 선택이 보이지
        않고 placeholder 가 보인다.
      </div>

      <DesignNote title="왜 옵션 객체가 아니라 원시값인가">
        <p>
          폼 상태에 그대로 넣기 위해서다. 객체를 주고받으면 쓰는 쪽이 저장할
          때마다 <code>value</code> 를 꺼내고 읽을 때마다 옵션을 다시 찾아야
          한다. 원시값이면 그 일이 없다. 대신 목록에 없는 값은 화면에 표시할
          라벨이 없으므로 placeholder 로 남는다.
        </p>
      </DesignNote>

      <h2>크기</h2>
      <p>
        <code>size</code> 는 <code>medium</code>(48px · 기본)과{" "}
        <code>large</code>(56px) 둘이다. <code>Button</code> ·{" "}
        <code>Textfield</code> 의 같은 이름과 같은 높이라 옆에 두면{" "}
        <code>size</code> 를 안 적어도 맞는다. 메뉴와 옵션은 크기와 무관하다.
      </p>
      <SelectSizeDemo />

      <h2>검색과 지우기</h2>
      <p>
        <code>isSearchable</code> 은 타이핑으로 목록을 거르고,{" "}
        <code>isClearable</code> 은 선택을 지우는 버튼을 보인다. 둘 다 기본은
        꺼짐이다. 거른 결과가 없으면 「선택 가능한 항목이 없습니다」가 보이고{" "}
        <code>noOptionsMessage</code> 로 바꾼다.
      </p>
      <SelectSearchDemo />

      <h2>옵션</h2>
      <p>
        <code>options</code> 는 평면 목록 또는{" "}
        <code>{"{ label, options }"}</code> 묶음이다. 옵션에{" "}
        <code>isDisabled</code> 를 주면 보이되 고를 수 없다. 불러오는 동안은{" "}
        <code>isLoading</code> 을 켜면 목록 자리에 「불러오는 중...」이 보인다.
      </p>
      <SelectOptionsDemo />

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="readOnly 는 포커스는 받되 메뉴를 열지 않는다. disabled 는 포커스도 받지 않는다"
        code={`<Select options={OPTIONS} value={city} onChange={setCity} errorMessage="지역을 골라 주세요" />`}
        render={(p) => (
          <Field>
            <FieldLabel>거주 지역</FieldLabel>
            <Select
              options={CITIES}
              placeholder="지역을 고르세요"
              value={p.disabled || p.readOnly ? "seoul" : null}
              errorMessage={p.isError ? "지역을 골라 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <h2>잘리는 상자 안에서</h2>
      <p>
        메뉴는 컨트롤 바로 아래 제자리에 뜨고, 스크롤하면 컨트롤과 함께
        움직인다. 조상에 <code>overflow: hidden</code> 이 있으면 잘린다. 카드나
        팝업 안에 넣을 때 <code>hasPortal</code> 을 켜면 메뉴가{" "}
        <code>body</code> 로 나가 잘리지 않는다. <code>Datepicker</code> ·{" "}
        <code>Tooltip</code> 의 같은 이름 prop 과 한 규칙이다.
      </p>
      <p>
        아래 공간이 모자라도 페이지를 스크롤하지 않는다. <code>hasPortal</code>{" "}
        을 켜면 화면에 맞춰 위로 뒤집힌다. 메뉴를 문서 흐름 안에 두려면{" "}
        <code>menuPosition=&quot;static&quot;</code> 을 준다. 메뉴가 열리는 만큼
        아래 내용이 밀린다.
      </p>
      <SelectPortalDemo />

      <RHFSelectDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          <code>Field</code> 안에서는 라벨과 <code>id</code>, 설명 · 에러의{" "}
          <code>aria-describedby</code> 가 연결된다. 에러면{" "}
          <code>aria-invalid</code> 가 붙는다
        </li>
        <li>
          <kbd>↑</kbd> <kbd>↓</kbd> 로 옮기고 <kbd>Enter</kbd> 로 고르고{" "}
          <kbd>Esc</kbd> 로 닫는다
        </li>
        <li>
          스크린리더가 읽는 문구(「7개 중 3번째」 등)는 한국어 기본값이 있다.{" "}
          <code>ariaLiveMessages</code> · <code>screenReaderStatus</code> 로
          바꾼다
        </li>
        <li>
          <code>readOnly</code> 면 <code>aria-readonly</code> 가 붙고 값을 읽을
          수 있다
        </li>
      </ul>

      <h2>커스터마이징</h2>
      <p>
        치수와 모양을 연다. 아래 변수는 <code>MultiSelect</code> 도 함께 쓴다.
        색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="select" />
      <p>
        메뉴 최대 높이처럼 react-select 이 배치 계산에 쓰는 값은 CSS 가 아니라{" "}
        <code>maxMenuHeight</code> 같은 prop 으로 준다. <code>styles</code> 를
        넘기면 이 라이브러리의 CSS 위에 얹힌다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>components</code> 는 렌더 밖에서 한 번만 만든다. 매 렌더 새 함수를
        넘기면 react-select 이 입력을 다시 만들어 포커스와 치던 검색어가
        사라진다.
      </div>
      <pre className="doc-code">
        <code>{`// 모듈 스코프에 한 번
const SELECT_COMPONENTS = { Option: CustomOption };

<Select components={SELECT_COMPONENTS} />`}</code>
      </pre>

      <DesignNote title="왜 styles 가 CSS 위에 얹히나">
        <p>
          react-select 은 emotion 으로 스타일을 주입한다. 그 클래스는 CSS 레이어
          밖에 있어 <code>@layer nui.components</code> 안의 규칙보다 항상
          우선한다. 그래서 이 컴포넌트는 <code>unstyled</code> 로 돌리면서
          충돌하는 속성만 emotion 쪽에서 걷어내 CSS 가 그리게 한다.{" "}
          <code>styles</code> 는 그 정리된 값 위에 얹히므로 의도한 대로
          덧칠된다.
        </p>
      </DesignNote>

      <h2>API</h2>
      <p>
        아래 표는 이 라이브러리가 정의한 prop 이다. 여기에 없는 react-select 의
        prop(<code>menuPlacement</code> · <code>maxMenuHeight</code> ·{" "}
        <code>isLoading</code> 등)도 그대로 전달된다. <code>defaultValue</code>{" "}
        · <code>getOptionValue</code> · <code>theme</code> 셋은 받지 않는다.
      </p>
      <PropsTable of="Select" />

      <DesignNote title="왜 셋을 받지 않나">
        <p>
          <code>defaultValue</code> 는 항상 <code>value</code> 를 넘기므로
          react-select 이 무시한다. <code>getOptionValue</code> 는 바꿔도 값
          매칭이 <code>option.value</code> 로 고정이라 선택은 되는데 화면에서
          사라진다. <code>theme</code> 은 <code>unstyled</code> 라 효과가 없다.
          타입은 통과하는데 동작만 조용히 없는 셋이라 타입에서 뺐다.
        </p>
      </DesignNote>
    </>
  );
}

import Link from "next/link";
import { DateRangePicker, Field, FieldLabel } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  DateRangePickerBasicDemo,
  DateRangePickerConfirmDemo,
} from "./DateRangePickerDemo";
import { RHFDateRangePickerDemo } from "./RHFDateRangePickerDemo";

export const metadata = { title: "DateRangePicker" };

/** 상태 격자에 고정으로 보여줄 값 */
const PICKED = { from: new Date(2026, 8, 1), to: new Date(2026, 8, 5) };

export default function DateRangePickerPage() {
  return (
    <>
      <GuideHeader
        title="DateRangePicker"
        named={["DateRangePicker"]}
        subpath="datepicker"
      />

      <p>
        시작일과 종료일을 고르는 입력이다. 값은 <code>{"{ from, to }"}</code>{" "}
        꼴이고 <code>selected</code> 와 <code>onSelectedChange</code> 로 쓰는
        쪽이 갖는다. 열기 · 직접 입력 · 고를 수 있는 날짜 ·{" "}
        <code>hasPortal</code> 은{" "}
        <Link href="/components/datepicker">Datepicker</Link> 와 같다. 이
        페이지는 기간에서 달라지는 것만 적는다.
      </p>

      <h2>기본</h2>
      <p>
        시작일과 종료일을 차례로 고르고 <strong>확정 버튼을 누른다.</strong> 그
        전까지 고른 날짜는 달력 안에만 있고 값으로 나가지 않는다. 시작일만 고른
        미완성 기간이면 버튼이 잠긴다. 확정하지 않고 <kbd>Esc</kbd> · 바깥
        클릭으로 닫으면 고른 것을 버리고 열기 전 값으로 돌아간다.
      </p>
      <p>
        입력창에서 <kbd>Enter</kbd> 를 눌러도 확정된다. 확정 버튼을 누른 것과
        결과가 같다. 미완성 기간이면 <kbd>Enter</kbd> 도 아무 일을 하지 않는다 —
        버튼이 잠겨 있는 동안은 키도 잠겨 있다.
      </p>
      <DateRangePickerBasicDemo />
      <div className="doc-note">
        같은 날을 두 번 누르면 하루짜리 기간이 된다. 최소 일수를 두려면{" "}
        <code>dayPickerProps={"{{ min: 2 }}"}</code> 처럼 2 이상을 준다. 기간이
        완성된 뒤 다시 누르면 새 기간을 시작한다(<code>resetOnSelect</code> 기본
        켜짐).
      </div>

      <DesignNote title="왜 확정 전까지 값이 나가지 않나">
        <p>
          여러 번의 클릭이 하나의 값을 만드는 입력이다. 시작일만 고른 중간
          상태가 값으로 나가면 쓰는 쪽이 불완전한 기간을 받는다. 폼에는 완성된
          기간만 들어가야 검증이 뜻을 갖는다. 임시 선택은 달력이 열려 있는
          동안만 컴포넌트가 들고 있고, 나가는 길은 <code>onSelectedChange</code>{" "}
          하나다. 그래서 값의 주인이 둘로 갈리지 않는다.
        </p>
      </DesignNote>

      <h2>확정 버튼</h2>
      <p>
        문구는 <code>confirmLabel</code> 로 바꾼다. 쓰는 쪽의 어휘와 언어로
        적는다. <code>hasConfirmButton={"{false}"}</code> 를 주면 버튼이
        없어지고, 둘 다 정해지는 순간 값이 나가며 달력이 닫힌다.
      </p>
      <DateRangePickerConfirmDemo />

      <h2>직접 입력</h2>
      <p>
        <code>2026.09.01 - 2026.09.05</code> 처럼 앞뒤에 공백을 둔 대시로
        잇는다. 앞 날짜만 치고 입력창을 벗어나면 치기 전 값으로 되돌린다. 치는
        동안 달력은 앞 날짜의 달을 보여준다. 나머지 규칙은{" "}
        <Link href="/components/datepicker">Datepicker 의 직접 입력</Link> 과
        같다.
      </p>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="readOnly 는 값을 보여주되 달력을 열지 않는다. disabled 는 포커스도 받지 않는다"
        code={`<DateRangePicker selected={range} onSelectedChange={setRange} errorMessage="기간을 골라 주세요" />`}
        render={(p) => (
          <Field>
            <FieldLabel>숙박 기간</FieldLabel>
            <DateRangePicker
              placeholder="기간을 고르세요"
              selected={p.disabled || p.readOnly ? PICKED : undefined}
              errorMessage={p.isError ? "기간을 골라 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <RHFDateRangePickerDemo />

      <h2>커스터마이징</h2>
      <p>
        아래 변수는 <code>Datepicker</code> · <code>DateMultiplePicker</code> 와
        함께 쓴다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="datepicker" />

      <h2>API</h2>
      <p>
        <code>Datepicker</code> 의 prop 에 확정 버튼 둘(
        <code>hasConfirmButton</code> · <code>confirmLabel</code>)이 더해진다.{" "}
        <code>selected</code> 의 타입은 <code>DateRange</code> 다. 무엇이 확정
        가능한 값인지는 컴포넌트가 정한다 — 시작일과 종료일이 둘 다 있어야 한다.
      </p>
      <PropsTable of="DateRangePicker" />
    </>
  );
}

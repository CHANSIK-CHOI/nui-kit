import Link from "next/link";
import { DateMultiplePicker, Field, FieldLabel } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  DateMultiplePickerBasicDemo,
  DateMultiplePickerSizeDemo,
  DateMultiplePickerConfirmDemo,
} from "./DateMultiplePickerDemo";
import { RHFDateMultiplePickerDemo } from "./RHFDateMultiplePickerDemo";

export const metadata = { title: "DateMultiplePicker" };

/** 상태 격자에 고정으로 보여줄 값 */
const PICKED = [
  new Date(2026, 8, 1),
  new Date(2026, 8, 3),
  new Date(2026, 8, 5),
];

export default function DateMultiplePickerPage() {
  return (
    <>
      <GuideHeader
        title="DateMultiplePicker"
        named={["DateMultiplePicker"]}
        subpath="datepicker"
      />

      <p>
        날짜를 여러 개 고르는 입력이다. 값은 <code>Date[]</code> 이고{" "}
        <code>selected</code> 와 <code>onSelectedChange</code> 로 쓰는 쪽이
        갖는다. 입력창은 읽기 전용이라 달력으로만 고른다. 열기 · 고를 수 있는
        날짜 · <code>hasPortal</code> 은{" "}
        <Link href="/components/datepicker">Datepicker</Link> 와 같다.
      </p>

      <h2>기본</h2>
      <p>
        날짜를 누를 때마다 선택에 더해지고 다시 누르면 빠진다. 고르는 동안
        달력은 열려 있다. <strong>확정 버튼을 누르면</strong> 값이 나가고
        닫힌다. 하나도 고르지 않았으면 버튼이 잠긴다. 확정하지 않고{" "}
        <kbd>Esc</kbd> · 바깥 클릭으로 닫으면 고른 것을 버리고 열기 전 값으로
        돌아간다.
      </p>
      <p>
        입력창에서 <kbd>Enter</kbd> 를 눌러도 확정된다. 확정 버튼을 누른 것과
        결과가 같다. 하나도 고르지 않았으면 <kbd>Enter</kbd> 도 아무 일을 하지
        않는다.
      </p>
      <DateMultiplePickerBasicDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 <code>Textfield</code> 의 것이 그대로 흐른다 —{" "}
        <code>medium</code>(48px · 기본)과 <code>large</code>(56px). 입력창만
        바뀌고 달력 · 확정 버튼은 그대로다.
      </p>
      <DateMultiplePickerSizeDemo />

      <DesignNote title="왜 직접 입력이 없나">
        <p>
          여러 날짜를 글자로 치려면 구분자 · 순서 · 중복의 규칙이 필요하고, 읽는
          쪽도 그 규칙을 알아야 한다. 입력창은 고른 날짜를 쉼표로 이어 보여주는
          자리이고 타이핑은 열려 있지 않다. 열리지 않은 문이라 API 에도 없어{" "}
          <code>isTextInputBlocked</code> 도 받지 않는다.
        </p>
      </DesignNote>

      <h2>확정 버튼</h2>
      <p>
        문구는 <code>confirmLabel</code> 로 바꾼다.{" "}
        <code>hasConfirmButton={"{false}"}</code> 를 주면 버튼이 없어지고 누를
        때마다 값이 나간다. 달력은 그대로 열려 있다.
      </p>
      <DateMultiplePickerConfirmDemo />

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="readOnly 는 값을 보여주되 달력을 열지 않는다. disabled 는 포커스도 받지 않는다"
        code={`<DateMultiplePicker selected={dates} onSelectedChange={setDates} errorMessage="하루 이상 골라 주세요" />`}
        render={(p) => (
          <Field>
            <FieldLabel>참석 가능일</FieldLabel>
            <DateMultiplePicker
              placeholder="날짜를 고르세요"
              selected={p.disabled || p.readOnly ? PICKED : undefined}
              errorMessage={p.isError ? "하루 이상 골라 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <RHFDateMultiplePickerDemo />

      <h2>커스터마이징</h2>
      <p>
        아래 변수는 <code>Datepicker</code> · <code>DateRangePicker</code> 와
        함께 쓰인다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="datepicker" />

      <h2>API</h2>
      <p>
        <code>Datepicker</code> 의 prop 에 확정 버튼 둘(
        <code>hasConfirmButton</code> · <code>confirmLabel</code>)이 더해지고,
        직접 입력에 관한 <code>parseDisplayValue</code> ·{" "}
        <code>isTextInputBlocked</code> 가 빠진다. <code>selected</code> 의
        타입은 <code>Date[]</code> 다. 무엇이 확정 가능한 값인지는 컴포넌트가
        정한다 — 하나 이상 골라야 한다.
      </p>
      <PropsTable of="DateMultiplePicker" />
    </>
  );
}

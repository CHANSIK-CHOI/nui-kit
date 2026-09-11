import Link from "next/link";
import { Datepicker, Field, FieldLabel } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  Case,
  CaseGrid,
  InputStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  DatepickerBasicDemo,
  DatepickerSizeDemo,
  DatepickerAllowedDemo,
  DatepickerPortalDemo,
} from "./DatepickerDemo";
import { RHFDatepickerDemo } from "./RHFDatepickerDemo";

export const metadata = { title: "Datepicker" };

/** 상태 격자에 고정으로 보여줄 값. 서버와 클라이언트가 같은 글자를 만든다 */
const PICKED = new Date(2026, 8, 5);

export default function DatepickerPage() {
  return (
    <>
      <GuideHeader
        title="Datepicker"
        named={["Datepicker"]}
        subpath="datepicker"
      />

      <p>
        날짜 하나를 고르는 입력이다. 값은 <code>selected</code> 와{" "}
        <code>onSelectedChange</code> 로 쓰는 쪽이 갖는다. 기간은{" "}
        <Link href="/components/date-range-picker">DateRangePicker</Link>, 여러
        날은{" "}
        <Link href="/components/date-multiple-picker">DateMultiplePicker</Link>{" "}
        가 맡는다.
      </p>

      <h2>기본</h2>
      <p>
        입력창을 클릭하거나 달력 버튼을 누르면 달력이 열린다. 날짜를 고르면 값이
        바로 나가고 달력이 닫힌다. 열어 두려면{" "}
        <code>shouldCloseOnSelect={"{false}"}</code> 를 준다.
      </p>
      <DatepickerBasicDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 <code>Textfield</code> 의 것이 그대로 흐른다 —{" "}
        <code>medium</code>(48px · 기본)과 <code>large</code>(56px). 입력창만
        바뀌고 달력 · 날짜 셀 · 확정 버튼은 그대로다.
      </p>
      <DatepickerSizeDemo />

      <DesignNote title="왜 확정 버튼이 없나">
        <p>
          하루를 고르는 데 두 번 누르게 하지 않는다. 날짜 하나는 고른 순간
          결과가 확정되고 되돌릴 것이 없다. 잘못 골랐으면 다시 고르면 된다. 확정
          버튼이 필요한 것은 여러 번의 클릭이 하나의 값을 만드는 기간과 여러
          날짜다.
        </p>
      </DesignNote>

      <h2>직접 입력</h2>
      <p>
        입력창에 날짜를 직접 칠 수 있다. 형식은 <code>displayFormat</code> 으로
        정하고 기본값은 <code>yyyy.MM.dd</code> 다. 치는 동안 달력은 그 날짜의
        달로 따라 이동한다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이렇게 치면</th>
              <th>이렇게 된다</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>2026.9.5</code>
              </td>
              <td>
                값으로 읽고, 입력창을 벗어나면 <code>2026.09.05</code> 로
                정리한다
              </td>
            </tr>
            <tr>
              <td>읽을 수 없는 글자 · 없는 날짜(2026.02.31)</td>
              <td>
                입력창을 벗어나는 순간 치기 전 값으로 되돌린다. 에러 메시지는
                띄우지 않는다. 검증은 쓰는 쪽 몫이다
              </td>
            </tr>
            <tr>
              <td>달력이 막아 둔 날짜 · 이동할 수 없는 연도</td>
              <td>
                받지 않는다. <code>dayPickerProps</code> 의{" "}
                <code>disabled</code> · <code>startMonth</code> ·{" "}
                <code>endMonth</code> 가 타이핑에도 똑같이 적용된다
              </td>
            </tr>
            <tr>
              <td>입력창을 비움</td>
              <td>
                값이 <code>undefined</code> 가 된다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CaseGrid
        columns={2}
        caption="형식 안내는 infoMessage 로. placeholder 는 값을 치기 시작하면 사라진다"
        code={`<Datepicker selected={date} onSelectedChange={setDate} infoMessage="yyyy.MM.dd 형식으로 입력해 주세요" />`}
      >
        <Case label="기본" note="칠 수 있다">
          <Field>
            <FieldLabel>생년월일</FieldLabel>
            <Datepicker
              placeholder="날짜를 고르세요"
              infoMessage="yyyy.MM.dd 형식으로 입력해 주세요"
              autoComplete="bday"
            />
          </Field>
        </Case>
        <Case label="isTextInputBlocked" note="달력으로만 고른다">
          <Field>
            <FieldLabel>방문일</FieldLabel>
            <Datepicker
              selected={PICKED}
              placeholder="날짜를 고르세요"
              isTextInputBlocked
            />
          </Field>
        </Case>
      </CaseGrid>

      <DesignNote title="왜 입력창을 읽기 전용으로 두지 않나">
        <p>
          KRDS 가이드 675쪽이 요구한다. 날짜 선택기가 있어도 입력 필드를 읽기
          전용으로 바꾸지 않고 키보드로 직접 날짜를 칠 수 있어야 한다. 달력은
          마우스에 편한 길이고, 키보드 사용자에게는 타이핑이 더 짧은 길이다.
          그래서 타이핑이 기본이고 막는 쪽이 옵션이다.
        </p>
      </DesignNote>

      <h2>고를 수 있는 날짜</h2>
      <p>
        <code>dayPickerProps</code> 가 <code>react-day-picker</code> 의 설정을
        그대로 받는다. 막을 날짜는 <code>disabled</code>, 이동할 수 있는 달의
        범위는 <code>startMonth</code> · <code>endMonth</code> 로 정한다.
        타이핑에도 같은 제한이 걸린다.
      </p>
      <DatepickerAllowedDemo />

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="readOnly 는 값을 보여주되 달력을 열지 않는다. disabled 는 포커스도 받지 않는다"
        code={`<Datepicker selected={date} onSelectedChange={setDate} errorMessage="방문일을 골라 주세요" />`}
        render={(p) => (
          <Field>
            <FieldLabel>방문일</FieldLabel>
            <Datepicker
              placeholder="날짜를 고르세요"
              selected={p.disabled || p.readOnly ? PICKED : undefined}
              errorMessage={p.isError ? "방문일을 골라 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <h2>잘리는 상자 안에서</h2>
      <p>
        달력은 제자리에 뜬다. 조상에 <code>overflow: hidden</code> 이 있으면
        잘려서 날짜를 고를 수 없다. 카드나 팝업 안에 넣을 때{" "}
        <code>hasPortal</code> 을 켜면 달력이 <code>body</code> 로 나가 잘리지
        않는다. <code>Select</code> · <code>Tooltip</code> 의 같은 이름 prop 과
        한 규칙이다.
      </p>
      <DatepickerPortalDemo />

      <RHFDatepickerDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          입력창에 <code>aria-haspopup=&quot;dialog&quot;</code> ·{" "}
          <code>aria-expanded</code> · <code>aria-controls</code> 가 붙고,
          달력은 <code>role=&quot;dialog&quot;</code> 로 연결된다. 접근 이름은{" "}
          <code>calendarLabel</code> 로 바꾼다
        </li>
        <li>
          <kbd>Enter</kbd> <kbd>Space</kbd> <kbd>↓</kbd> 로 열고 <kbd>Esc</kbd>{" "}
          로 닫는다. 바깥을 클릭해도 닫힌다. 열어도 포커스는 입력창에 남고{" "}
          <kbd>Tab</kbd> 으로 달력 안에 들어간다
        </li>
        <li>
          달력 안에서는 방향키로 날짜를 옮기고 <kbd>Enter</kbd> 로 고른다. 이전
          · 다음 · 연도 · 월 버튼의 접근 이름은{" "}
          <code>dayPickerProps.labels</code> 로 바꾼다
        </li>
        <li>
          토요일 · 일요일은 색만으로 구분하지 않는다. 요일 머리글이 함께 있다
        </li>
        <li>
          날짜 셀과 이전 · 다음 버튼은 누르는 범위가 44px 이다. 보이는 크기는
          날짜 36px · 화살표 32px 이고 누르는 범위만 넓혔다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 달력이 움직이지 않고
          나타난다
        </li>
      </ul>

      <DesignNote title="왜 열 때 포커스를 달력으로 옮기지 않나">
        <p>
          APG 의 Date Picker Dialog 패턴은 열 때 포커스를 달력으로 옮기고
          가둔다. KRDS 달력 378쪽은 Tab 으로 달력 안을 순서대로 오가는 것만
          요구하고, 675쪽은 입력창에 직접 칠 수 있어야 한다고 요구한다. 포커스를
          달력으로 빼앗으면 뒤의 요구와 부딪힌다. 이 라이브러리는 KRDS 를
          따른다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        달력 치수와 팝업 외형을 연다. 아래 변수는 <code>DateRangePicker</code> ·{" "}
        <code>DateMultiplePicker</code> 도 함께 쓴다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="datepicker" />
      <p>
        달력 세부를 직접 손보려면 <code>nui-daypicker__day</code> 처럼 이
        라이브러리의 클래스를 대상으로 한다. <code>react-day-picker</code> 의
        CSS 는 불러오지 않는다.
      </p>

      <DesignNote title="왜 react-day-picker 의 CSS 가 필요 없나">
        <p>
          달력의 <code>classNames</code> 를 통째로 <code>nui-daypicker__*</code>{" "}
          로 갈아끼우고 이 라이브러리의 CSS 로 그린다. 그래서 쓰는 쪽 프로젝트가
          같은 라이브러리를 따로 쓰더라도 서로 간섭하지 않는다.
        </p>
      </DesignNote>

      <h2>API</h2>
      <p>
        <code>Textfield</code> 의 prop 을 그대로 받는다. <code>value</code> ·{" "}
        <code>onChange</code> · <code>type</code> 만 빠진다.
      </p>
      <PropsTable of="Datepicker" />
    </>
  );
}

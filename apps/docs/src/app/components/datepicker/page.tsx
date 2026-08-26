import { PropsTable } from "@/components/PropsTable";
import { DatepickerDemo } from "./DatepickerDemo";
import { RHFDatepickerDemo } from "./RHFDatepickerDemo";

export const metadata = { title: "Datepicker" };

export default function DatepickerPage() {
  return (
    <>
      <h1>Datepicker</h1>
      <p className="doc-lead">
        입력 필드와 캘린더를 묶은 날짜 선택 컨트롤. 내부적으로{" "}
        <code>react-day-picker</code> 를 쓰며, 값은 <code>Date</code> 객체로
        주고받는다. 하나(<code>Datepicker</code>) · 기간(
        <code>DateRangePicker</code>) · 여러 개(<code>DateMultiplePicker</code>)
        세 가지가 있다.
      </p>

      <pre className="doc-code">
        <code>{`import { Datepicker, DateRangePicker } from "@chansikchoi/next-ui";

<Datepicker selected={date} onSelectedChange={setDate} />
<DateRangePicker selected={range} onSelectedChange={setRange} />`}</code>
      </pre>

      <div className="doc-note">
        <strong>controlled 전용이다.</strong> <code>selected</code> 와{" "}
        <code>onSelectedChange</code> 를 소비자가 소유한다. 입력창은 직접
        타이핑할 수 없고(<code>isTextInputBlocked</code>) 달력으로만 값을 바꾼다
        — 잘못된 형식의 문자열이 값으로 들어오는 경로를 없앴다. react-hook-form
        을 쓴다면 <code>@chansikchoi/next-ui/rhf</code> 의{" "}
        <code>RHFDatepicker</code> 계열을 쓴다.
      </div>

      <div className="doc-note">
        <strong>기간은 최소 2일이다.</strong> 같은 날을 두 번 눌러 하루짜리 기간을
        만들 수 없다 — 두 번째 클릭은 선택 해제로 처리된다 (
        <code>dayPickerProps.min</code> 기본값 <code>1</code>). 하루도 허용하려면{" "}
        <code>dayPickerProps={"{{ min: 0 }}"}</code> 를 넘긴다.
      </div>

      <DatepickerDemo />

      <RHFDatepickerDemo />

      <h2>스타일 커스터마이징</h2>
      <p>공개 CSS 변수로 달력 치수와 팝업 외형을 조정한다.</p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>변수</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--nui-datepicker-dropdown-bg</code>
              </td>
              <td>
                <code>--nui-surface-panel-strong</code>
              </td>
              <td className="doc-wrap">캘린더 팝업 배경</td>
            </tr>
            <tr>
              <td>
                <code>--nui-datepicker-dropdown-radius</code>
              </td>
              <td>
                <code>--nui-radius-md</code>
              </td>
              <td className="doc-wrap">캘린더 팝업 모서리</td>
            </tr>
            <tr>
              <td>
                <code>--nui-datepicker-day-size</code>
              </td>
              <td>
                <code>--nui-size-control-lg</code>
              </td>
              <td className="doc-wrap">날짜 칸 크기</td>
            </tr>
            <tr>
              <td>
                <code>--nui-datepicker-day-button-size</code>
              </td>
              <td>
                <code>--nui-size-control-md</code>
              </td>
              <td className="doc-wrap">날짜 버튼 크기</td>
            </tr>
            <tr>
              <td>
                <code>--nui-datepicker-day-radius</code>
              </td>
              <td>
                <code>--nui-radius-sm</code>
              </td>
              <td className="doc-wrap">날짜 버튼 모서리</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>
          <code>react-day-picker</code> 의 기본 CSS 는 불러올 필요가 없다.
        </strong>{" "}
        이 컴포넌트는 라이브러리의 <code>classNames</code> 를 통째로{" "}
        <code>nui-daypicker__*</code> 로 갈아끼운 뒤 우리 CSS 로 그린다. 그래서
        소비자 프로젝트가 같은 라이브러리를 따로 쓰더라도 서로 간섭하지 않는다.
        달력 세부 스타일을 직접 손보려면 <code>nui-daypicker__day</code> 처럼
        우리 클래스를 대상으로 하면 된다.
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          입력창에 <code>aria-haspopup=&quot;dialog&quot;</code> ·{" "}
          <code>aria-expanded</code> · <code>aria-controls</code> 가 붙고,
          팝업은 <code>role=&quot;dialog&quot;</code> 로 연결된다
        </li>
        <li>
          키보드로 연다 — <kbd>Enter</kbd> <kbd>Space</kbd> <kbd>↓</kbd>,{" "}
          <kbd>Esc</kbd> 로 닫는다. 바깥을 클릭해도 닫힌다
        </li>
        <li>
          달력 안에서는 <code>react-day-picker</code> 의 키보드 탐색을 그대로
          쓴다 (방향키로 날짜 이동, <kbd>Enter</kbd> 로 선택)
        </li>
        <li>
          토요일·일요일은 색으로만 구분하지 않는다 — 요일 헤더가 항상 함께
          보인다
        </li>
        <li>
          <code>readOnly</code> 는 값을 보여주되 달력을 열지 않는다.{" "}
          <code>disabled</code> 는 포커스도 받지 않는다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서 팝업 애니메이션이 꺼진다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        세 컴포넌트는 <code>selected</code> 의 타입만 다르고 나머지는 같다.{" "}
        <code>dayPickerProps</code> 로 <code>react-day-picker</code> 의 설정(
        <code>disabled</code>, <code>startMonth</code>, <code>locale</code>{" "}
        등)을 그대로 전달한다.
      </p>
      <h3>Datepicker</h3>
      <PropsTable of="Datepicker" />
      <h3>DateRangePicker</h3>
      <PropsTable of="DateRangePicker" />
      <h3>DateMultiplePicker</h3>
      <PropsTable of="DateMultiplePicker" />
    </>
  );
}

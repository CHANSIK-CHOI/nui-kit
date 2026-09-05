import { GuideHeader, HookTable } from "@/components/guide";
import { PropsTable } from "@/components/guide";
import { DatepickerDemo } from "./DatepickerDemo";
import { RHFDatepickerDemo } from "./RHFDatepickerDemo";

export const metadata = { title: "Datepicker" };

export default function DatepickerPage() {
  return (
    <>
      <GuideHeader
        title="Datepicker"
        named={["Datepicker", "DateRangePicker", "DateMultiplePicker"]}
        subpath="datepicker"
      >
        달력에서 날짜를 고른다. 내부는 <code>react-day-picker</code> 이고 값은{" "}
        <code>Date</code> 객체로 주고받는다. 기간은 <code>DateRangePicker</code>
        , 여러 날짜는 <code>DateMultiplePicker</code> 다.
      </GuideHeader>

      <pre className="doc-code">
        <code>{`import { Datepicker, DateRangePicker } from "@nui-kit/react";

<Datepicker selected={date} onSelectedChange={setDate} />
<DateRangePicker selected={range} onSelectedChange={setRange} />`}</code>
      </pre>

      <div className="doc-note">
        <strong>controlled 전용이다.</strong> <code>selected</code> 와{" "}
        <code>onSelectedChange</code> 를 소비자가 소유한다. react-hook-form 을
        쓴다면 <code>@nui-kit/react/rhf</code> 의{" "}
        <code>RHFDatepicker</code> 계열을 쓴다.
      </div>

      <h2>직접 입력</h2>
      <p>
        <code>Datepicker</code> 와 <code>DateRangePicker</code> 는 입력창에
        날짜를 <strong>직접 칠 수 있다.</strong> 달력이 있어도 입력 필드를 읽기
        전용으로 만들지 않는다는 KRDS 기준(가이드 675쪽)을 따른다. 형식은{" "}
        <code>displayFormat</code> (기본 <code>yyyy.MM.dd</code>), 기간은{" "}
        <code>2026.09.01 - 2026.09.05</code> 처럼 앞뒤에 공백을 둔 대시로 잇는다.
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
              <td>읽을 수 없는 글자 · 없는 날짜(2026.02.31) · 절반만 친 기간</td>
              <td>
                입력창을 벗어나는 순간 <strong>치기 전 값으로 되돌린다.</strong>{" "}
                에러 메시지는 띄우지 않는다 — 검증은 소비자 몫이다
              </td>
            </tr>
            <tr>
              <td>달력이 막아 둔 날짜 · 이동할 수 없는 연도</td>
              <td>
                받지 않는다. <code>dayPickerProps</code> 의{" "}
                <code>disabled</code> · <code>startMonth</code> ·{" "}
                <code>endMonth</code> 를 타이핑에도 똑같이 적용한다
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
      <p>
        치는 동안 달력은 <strong>그 날짜의 달로 따라 이동한다.</strong> 예전처럼
        달력으로만 값을 받고 싶으면 <code>isTextInputBlocked</code> 를 준다.{" "}
        <code>DateMultiplePicker</code> 는 아직 읽기 전용이다 — 날짜 목록의
        구분자 규칙이 따로 필요해 다음 단계로 미뤘다.
      </p>
      <p>
        형식 안내는 <code>infoMessage</code> 로 적는다. 플레이스홀더만으로
        형식을 알리지 않는다 — 값을 치기 시작하면 사라지기 때문이다.
      </p>

      <div className="doc-note">
        <strong>기간은 최소 2일이다.</strong> 같은 날을 두 번 눌러 하루짜리
        기간을 만들 수 없다 — 두 번째 클릭은 선택 해제로 처리된다 (
        <code>dayPickerProps.min</code> 기본값 <code>1</code>). 하루도
        허용하려면 <code>dayPickerProps={"{{ min: 0 }}"}</code> 를 넘긴다.
      </div>

      <DatepickerDemo />

      <RHFDatepickerDemo />

      <h2>스타일 커스터마이징</h2>
      <p>공개 CSS 변수로 달력 치수와 팝업 외형을 조정한다.</p>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 브랜드 프리셋을 쓴다.
      </p>
      <HookTable group="datepicker" />

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
        <li>
          날짜 셀과 이전/다음 버튼은 누르는 범위가 44px 이다. 날짜 버튼은 36px,
          화살표는 32px 로 보이고 히트만 넓혔다. 셀 크기는{" "}
          <code>--nui-datepicker--day-size</code> 로 바꿀 수 있다
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

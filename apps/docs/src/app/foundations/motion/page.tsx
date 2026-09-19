import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "모션" };

const DURATIONS: [number, string, string][] = [
  [1, "50ms", "마이크로"],
  [2, "100ms", "마이크로"],
  [3, "150ms", "마이크로"],
  [4, "200ms", "경계"],
  [5, "250ms", "매크로"],
  [6, "300ms", "매크로 — 상한"],
];

/** 곡선 넷. 값은 토큰과 같은 출처(_seed.scss)다 — 그림은 이 값으로 그린다 */
const CURVES: [string, [number, number, number, number], string][] = [
  ["standard", [0.2, 0, 0, 1], "색 · 테두리 전환"],
  ["enter", [0, 0, 0.15, 1], "나타남 · 사라짐 · 눌림"],
  ["enter-emphasized", [0.16, 1, 0.3, 1], "강조가 필요한 등장 · 퇴장"],
  ["expand", [0.5, 1, 0.89, 1], "크기가 변하는 것"],
];

const EASINGS: [string, string][] = [
  ["easing-standard", "기능적 마이크로 — 색 · 테두리 전환"],
  ["easing-enter", "나타남 — 빠르게 시작해 천천히 안착"],
  [
    "easing-exit",
    "사라짐 — enter 와 같은 값이다. 퇴장이 짧은 것은 곡선이 아니라 시간이 만든다",
  ],
  ["easing-enter-emphasized", "강조가 필요한 등장"],
  [
    "easing-exit-emphasized",
    "강조가 필요한 퇴장 — enter-emphasized 와 같은 값",
  ],
  [
    "easing-expand",
    "크기가 변하는 것 — 접힘/펼침. easing-enter 를 쓰지 않는다",
  ],
  ["easing-pressed", "눌림 — enter 와 같은 값. 눌림 세 축의 하나"],
];

/** 무엇이 얼마나 — 등장 · 퇴장 (ms) */
const TIMING: [string, string, string][] = [
  ["눌림", "150", "—"],
  ["툴팁", "150", "100"],
  ["달력", "200", "150"],
  ["셀렉트 메뉴", "200", "150"],
  ["아코디언 펼침 · 접힘", "250", "200"],
  ["토스트", "250", "200"],
  ["모달", "300", "200"],
  ["바텀시트", "스프링 (bounce 0 · visualDuration 0.25)", "200"],
  ["풀팝업", "300", "200"],
  ["딤", "패널과 같다", "패널과 같다"],
  ["색 전환", "150", "—"],
];

function bezierPath([x1, y1, x2, y2]: [number, number, number, number]) {
  return `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;
}

export default function MotionPage() {
  return (
    <>
      <h1>모션</h1>
      <p className="doc-lead">
        얼마나 오래, 어떤 곡선으로 움직이는지 정한다. 무엇이 움직이는지 정하면
        시간이 따라온다.
      </p>

      <h2>시간</h2>
      <p>
        0.2초가 경계다. 버튼 눌림과 포커스, 회전 같은 마이크로 모션은{" "}
        <code>duration-4</code> 이하를 쓴다. 팝업 개폐와 시트 슬라이드, 페이지
        전환은 <code>duration-4</code> 를 넘는다.
      </p>
      <p>
        <strong>
          색 · 테두리 · 배경 전환은 <code>duration-3</code>(150ms) 하나다.
        </strong>{" "}
        hover · error · disabled 로 바뀌는 순간 전부가 여기 해당하고, 눌림(
        <code>duration-pressed</code>)과 같은 시계다.
      </p>

      <div className="doc-example">
        <div className="doc-example__preview">
          {DURATIONS.map(([n, ms, kind]) => (
            <div key={n} className="doc-ruler">
              <span className="doc-token-name doc-ruler__label">
                duration-{n}
              </span>
              <span
                className="doc-ruler__bar"
                style={{ width: `calc(${ms} * 0.7)` }}
              />
              <span className="doc-ruler__value">
                {ms} · {kind}
              </span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          막대 길이가 곧 시간이다. 4번이 경계선이다.
        </p>
      </div>

      <h2>무엇이 얼마나</h2>
      <p>
        UI 는 300ms 아래다. 퇴장이 등장보다 짧다. 지연이 있는 것은 툴팁뿐이다 —
        열기 400ms, 닫기 100ms, 하나가 열린 뒤 300ms 안의 이웃은 지연도 모션도
        없이 즉시. 키보드와 터치로 연 툴팁은 지연이 0 이다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>무엇</th>
              <th>등장</th>
              <th>퇴장</th>
            </tr>
          </thead>
          <tbody>
            {TIMING.map(([what, enter, exit]) => (
              <tr key={what}>
                <th scope="row" className="doc-wrap">
                  {what}
                </th>
                <td className="doc-wrap">{enter}</td>
                <td>{exit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        바텀시트만 스프링이다. 손으로 끌 수 있는 것이라 등장과 놓았을 때가 한
        물리여야 한다. 딤은 전용 시간이 없고 패널과 같은 시간 · 곡선으로 함께
        움직인다 — 둘이 한 면으로 읽힌다.
      </p>

      <h2>곡선</h2>
      <p>
        나타날 때도 사라질 때도 ease-out 이다. 첫 프레임에 가장 많이 움직이고
        천천히 안착한다. 퇴장이 등장보다 빨리 끝나는 것은 곡선이 아니라 시간이
        만든다 — 팝업은 등장 300ms, 퇴장 200ms 다. 크기가 변하는 것(접힘 ·
        펼침)만 <code>easing-expand</code> 다. 높이가 늘어나는 것은 매 프레임
        아래 요소를 밀어내서, 초반이 가파른 곡선을 쓰면 튄다.
      </p>

      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 24 }}
        >
          {CURVES.map(([k, bezier, note]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <svg
                width="110"
                height="110"
                viewBox="0 0 100 100"
                role="img"
                aria-label={`easing-${k} 곡선`}
                style={{
                  border: "1px solid var(--nui-border-form)",
                  borderRadius: "var(--nui-radius-1)",
                }}
              >
                <path
                  d={bezierPath(bezier)}
                  fill="none"
                  stroke="var(--nui-color-brand-9)"
                  strokeWidth="3"
                />
              </svg>
              <br />
              <span className="doc-token-name">easing-{k}</span>
              <br />
              <span className="doc-case__note">{note}</span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          왼쪽 아래가 시작, 오른쪽 위가 끝이다. 넷 다 초반이 가파르고{" "}
          <code>expand</code> 가 가장 고르다. 곡선은 토큰 값 그대로 그렸다.
        </p>
      </div>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>토큰</th>
              <th>언제</th>
            </tr>
          </thead>
          <tbody>
            {EASINGS.map(([token, when]) => (
              <tr key={token}>
                <th scope="row">
                  <span className="doc-token-name">--nui-{token}</span>
                </th>
                <td className="doc-wrap">{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>모션 줄이기</h2>
      <p>
        OS 에서 동작 줄이기를 켜면 <code>prefers-reduced-motion: reduce</code>{" "}
        가 전달되고 <code>duration</code> 토큰이 전부 1ms 가 된다. 라이브러리
        컴포넌트는 이 설정을 따른다.
      </p>
      <p>
        커스텀 애니메이션에 시간을 하드코딩하면 이 장치를 우회한다.{" "}
        <code>0.2s</code> 라고 직접 적는 대신 <code>duration</code> 토큰을
        참조한다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>framer-motion 은 CSS 토큰을 읽지 않는다.</strong>{" "}
        <code>reducedMotion</code> 기본값이 <code>&quot;never&quot;</code> 라{" "}
        <code>useReducedMotion()</code> 으로 분기해야 설정이 반영된다.
        라이브러리에서 framer 를 쓰는 여섯(<code>Popup</code> ·{" "}
        <code>Toast</code> · <code>Tooltip</code> · <code>Accordion</code> ·{" "}
        <code>Select</code> 메뉴 · <code>Datepicker</code>)은 분기해 두었다.
        움직임만 빼고 페이드는 남긴다.
      </div>

      <pre className="doc-code">
        <code>{`const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={
    shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(-8px) scale(0.98)" }
  }
  transition={{ duration: 0.2, ease: [0, 0, 0.15, 1] }}
/>`}</code>
      </pre>
      <p>
        framer 에는 <code>y</code> · <code>scale</code> 단축이 아니라{" "}
        <code>transform</code> 문자열을 준다. 단축은 메인 스레드에서 매 프레임
        계산하므로 페이지가 바쁠 때 프레임이 떨어진다.
      </p>

      <h2 id="scale">눌림</h2>
      <p>
        눌림은 배율과 시간, 곡선 세 축을 함께 쓴다. 하나만 골라 쓰면 같은 눌림이
        컴포넌트마다 다르게 느껴진다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>축</th>
              <th>토큰</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">변형량</th>
              <td className="doc-wrap">
                <span className="doc-token-name">--nui-scale-90</span> 면이 없는
                요소 · <span className="doc-token-name">-94</span> 작은 요소 ·{" "}
                <span className="doc-token-name">-96</span> 중간 ·{" "}
                <span className="doc-token-name">-98</span> 큰 요소
              </td>
            </tr>
            <tr>
              <th scope="row">시간</th>
              <td>
                <span className="doc-token-name">--nui-duration-pressed</span>
              </td>
            </tr>
            <tr>
              <th scope="row">곡선</th>
              <td>
                <span className="doc-token-name">--nui-easing-pressed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        큰 요소일수록 덜 줄여야 같은 정도로 눌린 느낌이 난다. 전면 버튼을 0.94
        로 줄이면 과하게 움츠러들고 작은 버튼을 0.98 로 줄이면 티가 안 난다.
      </p>
      <p>
        면이 없는 요소는 한 단계 더 줄인다. 보통은 면과 배율이 함께 눌림을
        말하는데, 배경 없이 그리는 것은 남는 신호가 배율뿐이다.{" "}
        <code>Checkbox</code> 의 <code>shape=&quot;ghost&quot;</code> 와
        화살표만 버튼인 <code>Accordion</code> 헤더가 그 자리다.
      </p>
      <TokenTable group="etc" only="scale-" swatch={false} />

      <h2 id="motion">전체 토큰</h2>
      <TokenTable group="motion" swatch={false} />
    </>
  );
}

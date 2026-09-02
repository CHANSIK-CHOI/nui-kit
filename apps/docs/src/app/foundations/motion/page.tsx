import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "모션" };

const DURATIONS: [number, string, string][] = [
  [1, "50ms", "마이크로"],
  [2, "100ms", "마이크로"],
  [3, "150ms", "마이크로"],
  [4, "200ms", "경계"],
  [5, "250ms", "매크로"],
  [6, "300ms", "매크로"],
];

const EASINGS: [string, string][] = [
  ["easing-standard", "기능적 마이크로 — 색 · 테두리 전환"],
  ["easing-enter", "나타남 — 빠르게 시작해 천천히 안착"],
  ["easing-exit", "사라짐 — 천천히 시작해 빠르게 빠짐"],
  ["easing-enter-emphasized", "강조가 필요한 등장"],
  ["easing-exit-emphasized", "강조가 필요한 퇴장"],
];

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
        0.2초가 경계다. 버튼 눌림과 포커스, 색 전환 같은 마이크로 모션은{" "}
        <code>duration-4</code> 이하를 쓴다. 팝업 개폐와 시트 슬라이드, 페이지
        전환은 <code>duration-4</code> 를 넘는다.
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

      <h2>곡선</h2>
      <p>
        나타날 때와 사라질 때 다른 곡선을 쓴다. 나타날 때는 천천히 끝나 결과를
        인지할 시간을 준다. 사라질 때는 빠르게 끝나 이미 끝난 일에 시간을 쓰지
        않는다. 하나의 곡선으로 양방향을 처리하면 이 차이가 사라진다.
      </p>

      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 32 }}
        >
          {["enter", "exit"].map((k) => (
            <div key={k} style={{ textAlign: "center" }}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                role="img"
                aria-label={`easing-${k} 곡선`}
                style={{
                  border: "1px solid var(--nui-border-form)",
                  borderRadius: "var(--nui-radius-1)",
                }}
              >
                <path
                  d={
                    k === "enter"
                      ? "M0 100 C 0 100, 15 0, 100 0"
                      : "M0 100 C 35 100, 100 100, 100 0"
                  }
                  fill="none"
                  stroke="var(--nui-color-brand-9)"
                  strokeWidth="3"
                />
              </svg>
              <span className="doc-token-name">easing-{k}</span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          왼쪽 아래가 시작, 오른쪽 위가 끝이다. enter 는 초반에 가파르고 exit 는
          후반에 가파르다.
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
        라이브러리의 <code>Popup</code> 과 <code>Toast</code>,{" "}
        <code>Tooltip</code> 은 분기해 두었다.
      </div>

      <pre className="doc-code">
        <code>{`const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
  transition={shouldReduceMotion ? { duration: 0 } : motionTransition.popover}
/>`}</code>
      </pre>

      <h2>눌림</h2>
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
                <span className="doc-token-name">--nui-scale-94</span> 작은 요소
                · <span className="doc-token-name">-96</span> 중간 ·{" "}
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
      <TokenTable group="etc" only="scale-" swatch={false} />

      <p>
        투명도로 상태를 표현하는 값(<code>opacity-*</code>)은{" "}
        <Link href="/foundations/state">상태</Link> 문서에 있다.
      </p>

      <h2>전체 토큰</h2>
      <TokenTable group="motion" swatch={false} />
    </>
  );
}

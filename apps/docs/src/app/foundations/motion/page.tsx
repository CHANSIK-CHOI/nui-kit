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
  ["easing-linear", "등속 — 스피너"],
];

export default function MotionPage() {
  return (
    <>
      <h1>모션</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 얼마나 오래, 어떤 곡선으로
        움직이는가. <strong>무엇이 움직이는지 정하면 시간이 따라온다</strong> —
        0.2초가 경계다.
      </p>

      <h2>시간 — 0.2초로 갈린다</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>종류</th>
              <th>시간</th>
              <th>예</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">마이크로</th>
              <td>
                <code>duration-4</code>(200ms) <strong>이하</strong>
              </td>
              <td className="doc-wrap">버튼 눌림, 포커스, 색·테두리 전환</td>
            </tr>
            <tr>
              <th scope="row">매크로</th>
              <td>
                <code>duration-4</code> <strong>초과</strong>
              </td>
              <td className="doc-wrap">
                팝업 개폐, 시트 슬라이드, 페이지 전환
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

      <h2>곡선 — 나타남과 사라짐은 대칭이 아니다</h2>
      <p>
        <strong>하나의 곡선으로 개폐 양방향을 처리하지 않는다.</strong> 나타날
        때는 결과를 인지할 시간을 주고(천천히 끝남), 사라질 때는 이미 끝난 것에
        시간을 쓰지 않는다(빠르게 끝남). 같은 곡선을 쓰면 이 차이가 사라진다.
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

      <h2>모션을 줄여달라는 요청을 지킨다</h2>
      <p>
        OS 에서 <strong>&quot;동작 줄이기&quot;</strong> 를 켠 사용자에게는{" "}
        <code>prefers-reduced-motion: reduce</code> 가 전달된다. 이때 모든{" "}
        <code>duration-*</code> 토큰이 <strong>1ms 로 무력화</strong>된다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>컴포넌트에서 시간을 하드코딩하면 이 장치를 우회한다.</strong>{" "}
        <code>transition: 0.2s</code> 라고 쓰면 설정을 켠 사용자에게도 그대로
        움직인다. 반드시 <code>--nui-duration-*</code> 을 쓴다.
        <br />
        <br />
        <strong>framer-motion 은 CSS 토큰을 읽지 않는다.</strong>{" "}
        <code>reducedMotion</code> 기본값이 <code>&quot;never&quot;</code> 라{" "}
        <code>useReducedMotion()</code> 으로 분기하지 않으면 설정이{" "}
        <strong>조용히 무시된다.</strong> Popup · Toast · Tooltip 이 실제로
        그랬다.
      </div>

      <pre className="doc-code">
        <code>{`const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
  transition={shouldReduceMotion ? { duration: 0 } : motionTransition.popover}
/>`}</code>
      </pre>

      <h2>눌림 배율</h2>
      <p>
        <strong>큰 요소일수록 덜 줄여야 같은 정도로 눌린 느낌이 난다.</strong>{" "}
        전면 버튼을 0.95 로 줄이면 과하게 움츠러들고, 작은 칩을 0.98 로 줄이면
        티가 안 난다.
      </p>
      <TokenTable group="etc" only="scale-" swatch={false} />
      <p>
        투명도로 상태를 표현하는 값(<code>opacity-*</code>)은{" "}
        <Link href="/foundations/state">상태</Link> 문서에 있다.
      </p>
      <p className="doc-note">
        ⏸️ <strong>아직 토큰만 있다.</strong> 컴포넌트는 지금{" "}
        <code>transform: translateY(1px)</code> 로 눌림을 표현한다. 바꾸면
        화면이 달라지므로 컴포넌트 반영 단계에서 일괄로 옮긴다.
      </p>

      <h2>전체 토큰</h2>
      <TokenTable group="motion" swatch={false} />
    </>
  );
}

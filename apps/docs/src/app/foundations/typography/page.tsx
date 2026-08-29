import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "타이포그래피" };

/** 크기·행간·자간이 같은 번호로 묶인다. 값은 tokens.md §3-3 과 같은 출처다. */
const SCALE: { n: number; px: number; lh: string; ls: string }[] = [
  { n: 1, px: 12, lh: "1.5", ls: "0.08em" },
  { n: 2, px: 13, lh: "1.46", ls: "—" },
  { n: 3, px: 14, lh: "1.5", ls: "-0.01em" },
  { n: 4, px: 16, lh: "1.5", ls: "-0.02em" },
  { n: 5, px: 18, lh: "1.44", ls: "—" },
  { n: 6, px: 20, lh: "1.4", ls: "-0.04em" },
  { n: 8, px: 32, lh: "1.19", ls: "-0.06em" },
];

const ROLES: [string, string, string, string][] = [
  ["입력값 · 본문", "4", "regular", "Textfield · Textarea · Select 값 · 옵션"],
  ["보조 텍스트", "3", "regular", "Popup 본문 · Accordion 본문 · Tooltip"],
  ["라벨", "3", "medium", "Field 라벨"],
  ["캡션 · 설명 · 메시지", "1", "regular", "Field 설명 · 에러 문구"],
  [
    "소제목 · 그룹 라벨",
    "1",
    "semi-bold",
    "Select 그룹 라벨 · Datepicker 요일",
  ],
  ["액션 라벨", "4", "semi-bold", "Button 기본"],
  ["액션 라벨 (small)", "3", "semi-bold", "Button small · Datepicker 날짜"],
  ["제목", "6", "bold", "Popup 제목"],
];

export default function TypographyPage() {
  return (
    <>
      <h1>타이포그래피</h1>
      <p className="doc-lead">
        크기·행간·자간에 <strong>같은 번호</strong>를 붙였다.{" "}
        <code>font-size-4</code> 를 쓰면 <code>line-height-4</code> 와{" "}
        <code>letter-spacing-4</code> 가 짝이다. 셋을 따로 고르지 않는다.
      </p>

      <h2>스케일</h2>
      <div className="doc-example">
        <div className="doc-example__preview">
          {SCALE.map((s) => (
            <div key={s.n} className="doc-typescale">
              <span className="doc-typescale__meta">
                <span className="doc-token-name">{s.n}</span>
                {s.px}px · 행간 {s.lh}
              </span>
              <span
                style={{
                  fontSize: `var(--nui-font-size-${s.n})`,
                  lineHeight: `var(--nui-line-height-${s.n})`,
                  letterSpacing: `var(--nui-letter-spacing-${s.n}, normal)`,
                }}
              >
                다람쥐 헌 쳇바퀴에 타고파 Handgloves 0123
              </span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          7 은 없다. 쓰이지 않아서 만들지 않았다 — 스케일은 기계적으로 채우는
          것이 아니라 실사용에서 나온다.
        </p>
      </div>

      <h2>배수가 일정하지 않은 것은 의도다</h2>
      <p>
        큰 글자일수록 줄 높이 <strong>배수를 줄인다</strong>(1.5 → 1.19). 단일
        배수를 전 스케일에 적용하면 큰 제목이 헐거워 보인다. 자간은 반대로 큰
        글자일수록 <strong>좁힌다</strong> — 둘 다 광학 보정이다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>크기</th>
              <th>행간(배수)</th>
              <th>자간</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map((s) => (
              <tr key={s.n}>
                <th scope="row">
                  <span className="doc-token-name">{s.n}</span>
                </th>
                <td>{s.px}px</td>
                <td>
                  {s.lh} → {Math.round(s.px * Number(s.lh))}px
                </td>
                <td>{s.ls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>행간을 배수(단위 없음)로 둔 이유</strong> — 여러분이{" "}
        <code>font-size</code> 를 덮어도 비율이 유지된다. 절대값(rem)이면 크기만
        바뀌었을 때 행간이 깨진다.
      </div>

      <h2>역할이 정해지면 스케일이 결정된다</h2>
      <p>
        &quot;이건 라벨인가 캡션인가&quot;만 물으면 크기와 굵기가 따라온다.
        컴포넌트를 만들 때 이 표를 먼저 본다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>역할</th>
              <th>크기</th>
              <th>굵기</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map(([role, size, weight, where]) => (
              <tr key={role}>
                <th scope="row" className="doc-wrap">
                  {role}
                </th>
                <td>
                  <span className="doc-token-name">font-size-{size}</span>
                </td>
                <td>{weight}</td>
                <td className="doc-wrap">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>굵기는 네 단계뿐이다</h2>
      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 24 }}
        >
          {[
            ["regular", 400],
            ["medium", 500],
            ["semi-bold", 600],
            ["bold", 700],
          ].map(([name, w]) => (
            <div key={name as string} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "var(--nui-font-size-6)",
                  fontWeight: `var(--nui-font-weight-${name})`,
                }}
              >
                Aa 가나
              </div>
              <span className="doc-token-name">
                {name} · {w}
              </span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          800(extra-bold)은 두지 않는다. 네 단계로 제한한다.
        </p>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>시맨틱 타이포 토큰을 새로 만들지 않는다.</strong>{" "}
        <code>font-size-label</code> 같은 이름으로 한 겹 더 감싸면 위{" "}
        <strong>역할 표</strong>와 토큰이 두 개의 출처가 되어 어긋난다. 역할은
        표가 정하고, 토큰은 숫자만 갖는다.
      </div>

      <h2>전체 토큰</h2>
      <TokenTable group="typography" />
    </>
  );
}

import Link from "next/link";
import { HOOK_COUNT } from "@/components/guide";

export const metadata = { title: "무엇을 토대로 만들었나" };

/** 항목마다 정본이 다르다 — 그것 자체가 이 라이브러리의 성격이다 */
const SOURCES = [
  {
    what: "컴포넌트의 구조와 옵션",
    who: "당근 SEED",
    detail:
      "무엇을 부품으로 두고 어떤 상태를 갖는지. 셋 중 가장 구체적이라 컴포넌트 설계를 여기서 가져왔다",
  },
  {
    what: "수치와 접근성",
    who: "KRDS",
    detail:
      "대비 · 터치 영역 · 글자 최소 크기 · 둥글기 계산식. 디지털 정부서비스 UI/UX 가이드라인이고 법규에 근거가 있다",
  },
  {
    what: "움직임",
    who: "Emil Kowalski · Apple",
    detail: "곡선 · 시간 · 어디서 자라나는지 · 손으로 끄는 것의 물리",
  },
  {
    what: "재질과 깊이 · 라벨 · 피드백",
    who: "Apple",
    detail: "떠 있는 것을 어떻게 그리는지, 문구를 어떤 꼴로 쓰는지",
  },
  {
    what: "색",
    who: "Radix",
    detail: "12단계 스케일과 그것을 만드는 공식 생성기",
  },
];

export default function DesignSystemPage() {
  return (
    <>
      <h1>무엇을 토대로 만들었나</h1>

      <h2>기준을 한 곳에서 빌리지 않았다</h2>
      <p>
        디자인 시스템 하나를 골라 따라가는 대신,{" "}
        <strong>항목마다 가장 나은 기준</strong>을 골랐다. 그래서 컴포넌트의
        구조와 대비 수치와 애니메이션 곡선의 출처가 서로 다르다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>무엇</th>
              <th>어디를 따랐나</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s) => (
              <tr key={s.what}>
                <th scope="row" className="doc-wrap">
                  {s.what}
                </th>
                <td className="doc-wrap">
                  <strong>{s.who}</strong>
                </td>
                <td className="doc-wrap">{s.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>KRDS 를 준수 목표로 삼는다.</strong> 정부 납품용으로 만든 것은
        아니지만, 대비 · 터치 영역 · 글자 크기 · 상태 표현은 그 기준을 지킨다.
        공공 성격의 화면에 그대로 쓸 수 있다.
      </div>

      <h2>색은 만드는 것이 아니라 고르는 것이다</h2>
      <p>
        브랜드 색을 직접 조합하는 창구는 없다.{" "}
        <Link href="/brand-colors">준비된 185색</Link> 중 하나를 고르면 화면에
        필요한 색 <strong>98개</strong>가 따라온다 — 밝기 12단계, 그와 짝이 되는
        회색 12단계, 반투명, 그리고 각 단계 위에서 읽히는 글자색까지.
      </p>
      <pre className="doc-code">
        <code>{`import "@nui-kit/react/styles/index.css";
import "@nui-kit/react/styles/presets/42.css";   // 고른 색 하나`}</code>
      </pre>
      <p>
        색을 만드는 것은 Radix 의 공식 생성기다. 따로 정한 것은 둘뿐이다 —
        회색을 브랜드의 색기가 아주 살짝 도는 무채색으로 둔 것, 그리고 밝은 색
        위에서는 검은 글자를 쓰도록 다시 계산한 것.
      </p>
      <p>
        <Link href="/design-system/color">색</Link>에서 자세히 다룬다.
      </p>

      <h2>바꿀 수 있는 것과 없는 것</h2>
      <p>
        기준은 하나다.{" "}
        <strong>
          잘못 바꿨을 때 화면에 드러나면 열고, 드러나지 않으면 막는다.
        </strong>
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>대상</th>
              <th>창구</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                치수 · 모양 · 선 두께
              </th>
              <td className="doc-wrap">컴포넌트별 CSS 변수 {HOOK_COUNT}개</td>
              <td className="doc-wrap">
                바꾸면 결과가 바로 보이고 되돌리기도 쉽다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                색
              </th>
              <td className="doc-wrap">
                <Link href="/brand-colors">브랜드 프리셋</Link> 또는{" "}
                <code>className</code>
              </td>
              <td className="doc-wrap">
                배경과 글자는 짝이라 한쪽만 바꾸면 대비가 소리 없이 깨진다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                포커스 링 두께
              </th>
              <td className="doc-wrap">없다</td>
              <td className="doc-wrap">
                얇아져도 키보드로 조작하는 사용자에게만 영향이 간다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                바깥 여백 · 배치
              </th>
              <td className="doc-wrap">감싸는 요소에서</td>
              <td className="doc-wrap">
                <code>margin</code> · <code>position</code> ·{" "}
                <code>z-index</code> 는 부모가 소유한다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>이 문서는 큰 것부터 작은 것으로 쌓여 있다</h2>
      <ul>
        <li>
          <strong>디자인 시스템</strong> — 왜 이렇게 생겼나. 지금 읽고 있는
          층이다
        </li>
        <li>
          <Link href="/foundations">Foundations</Link> — 어떤 값이 있나. 토큰{" "}
          308개
        </li>
        <li>
          <Link href="/components">Components</Link> — 하나씩 어떻게 쓰나
        </li>
      </ul>
      <p className="doc-note">
        props 표 · 토큰 표 · 변수 표는 코드에서 자동 생성한다. 문서가 코드보다
        낡을 수 없는 부분이다.
      </p>
    </>
  );
}

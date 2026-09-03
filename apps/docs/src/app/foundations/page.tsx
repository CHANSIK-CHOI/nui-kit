import Link from "next/link";
import tokens from "@/generated/tokens.json";
import { HOOK_COUNT } from "@/components/guide";

export const metadata = { title: "Foundations" };

const SECTIONS: {
  title: string;
  desc: string;
  items: { title: string; href: string; desc: string }[];
}[] = [
  {
    title: "값이 무엇인가",
    desc: "쓸 수 있는 값의 목록과 이름 규칙이다.",
    items: [
      {
        title: "디자인 토큰",
        href: "/foundations/tokens",
        desc: "전량 목록과 이름 규칙",
      },
      {
        title: "색",
        href: "/foundations/color",
        desc: "역할별 색과 12단계 팔레트",
      },
      {
        title: "타이포그래피",
        href: "/foundations/typography",
        desc: "크기 · 행간 · 자간 스케일",
      },
      {
        title: "아이콘",
        href: "/foundations/icon",
        desc: "크기 4단계와 접근 이름",
      },
      {
        title: "간격과 크기",
        href: "/foundations/spacing",
        desc: "간격 스케일과 컨트롤 높이",
      },
      {
        title: "모양과 선",
        href: "/foundations/shape",
        desc: "모서리, 선의 색과 두께",
      },
      {
        title: "깊이",
        href: "/foundations/elevation",
        desc: "면의 층, 그림자, 쌓임 순서",
      },
      {
        title: "모션",
        href: "/foundations/motion",
        desc: "시간, 곡선, 눌림 배율",
      },
    ],
  },
  {
    title: "언제 무엇을 고르나",
    desc: "상태가 겹칠 때의 우선순위와 접근성 계약이다. 컴포넌트를 직접 스타일링할 때 본다.",
    items: [
      {
        title: "상태",
        href: "/foundations/state",
        desc: "hover · disabled · error 가 겹칠 때 무엇이 이기나",
      },
      {
        title: "접근성",
        href: "/foundations/accessibility",
        desc: "대비 · 터치 영역 · 포커스 · 모션 감소",
      },
    ],
  },
  {
    title: "어떻게 바꾸나",
    desc: `공개 변수 ${HOOK_COUNT}개의 전체 목록과 막아둔 자리다.`,
    items: [
      {
        title: "커스터마이징",
        href: "/foundations/customizing",
        desc: `공개 변수 ${HOOK_COUNT}개와 막아둔 자리`,
      },
    ],
  },
];

const DATA = tokens as unknown as Record<string, unknown[]>;
const total = Object.values(DATA).reduce((n, list) => n + list.length, 0);

export default function FoundationsPage() {
  return (
    <>
      <h1>Foundations</h1>
      <p className="doc-lead">
        컴포넌트가 공유하는 값과 규칙이다. 기본값만으로 동작하므로
        커스터마이징을 시작할 때 읽으면 된다.
      </p>

      <h2>바꿀 수 있는 것과 없는 것</h2>
      <p>
        기준은 하나다. 잘못 바꿨을 때 화면에 드러나면 열고 드러나지 않으면
        막는다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>대상</th>
              <th>창구</th>
              <th>이유</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                치수 · 모양 · 선 두께
              </th>
              <td className="doc-wrap">컴포넌트별 CSS 변수 {HOOK_COUNT}개</td>
              <td className="doc-wrap">
                값을 바꾸면 결과가 바로 보이고 되돌리기도 쉽다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                색
              </th>
              <td className="doc-wrap">
                <Link href="/brand-colors">브랜드 프리셋 185색</Link> 또는{" "}
                <code>className</code>
              </td>
              <td className="doc-wrap">
                배경만 바꾸면 짝인 글자색은 라이브러리 값이 남아 대비가 소리
                없이 깨진다
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
          </tbody>
        </table>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>컴포넌트별 색 변수는 제공하지 않는다.</strong> 깨진 대비는
        저시력 사용자에게만 나타난다. semantic 변수를 <code>:root</code> 에서
        덮어쓰는 방법도 같은 이유로 안내하지 않는다 —{" "}
        <code>action-primary</code> 를 바꿔도 <code>action-primary-fg</code> 는
        그대로 남는다.
      </div>

      <h2>문서 구성</h2>
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <h3>
            {s.title}
            {s.title === "값이 무엇인가" && (
              <span className="doc-token-name"> {total}개</span>
            )}
          </h3>
          <p>{s.desc}</p>
          <ul>
            {s.items.map((it) => (
              <li key={it.href}>
                <Link href={it.href}>{it.title}</Link> — {it.desc}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="doc-note">토큰 표와 변수 표는 SCSS 에서 자동 생성한다.</p>
    </>
  );
}

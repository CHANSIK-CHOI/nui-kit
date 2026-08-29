import Link from "next/link";
import tokens from "@/generated/tokens.json";
import { HOOK_COUNT } from "@/components/HookTable";

export const metadata = { title: "Foundations" };

const SECTIONS: {
  title: string;
  desc: string;
  items: { title: string; href: string; desc: string }[];
}[] = [
  {
    title: "값이 무엇인가",
    desc: "쓸 수 있는 값의 목록과 그 값이 왜 그 이름인지.",
    items: [
      {
        title: "디자인 토큰",
        href: "/foundations/tokens",
        desc: "토큰이 무엇이고 이름을 어떻게 지었나 · 전량 목록",
      },
      {
        title: "색",
        href: "/foundations/color",
        desc: "12단계 팔레트와 역할 이름",
      },
      {
        title: "타이포그래피",
        href: "/foundations/typography",
        desc: "크기·행간·자간이 한 벌로 묶인다",
      },
      {
        title: "아이콘",
        href: "/foundations/icon",
        desc: "5단계 크기와 접근 이름",
      },
      {
        title: "간격과 크기",
        href: "/foundations/spacing",
        desc: "4px 리듬, 컨트롤 높이, 크기 옵션",
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
        desc: "시간과 곡선",
      },
    ],
  },
  {
    title: "언제 무엇을 고르나",
    desc: "값이 아니라 규칙이다. 컴포넌트를 만들거나 고칠 때 본다.",
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
    desc: "여러분 프로젝트에 맞추는 방법.",
    items: [
      {
        title: "커스터마이징",
        href: "/foundations/customizing",
        desc: `무엇을 덮어쓸 수 있고 무엇은 막았나 — 공개 변수 ${HOOK_COUNT}개`,
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
        컴포넌트들이 공유하는 값과 규칙이다. 컴포넌트를 <em>쓰기만</em> 한다면
        읽지 않아도 된다 — <strong>기본값만으로 동작한다.</strong> 여러분
        디자인에 맞추기 시작할 때 여기로 온다.
      </p>

      <h2>먼저 세 가지만</h2>

      <h3>1. 우리 스타일은 여러분 스타일을 이기지 않는다</h3>
      <p>
        모든 CSS 가 <code>@layer nui.*</code> 안에 있다. 브라우저는 어느 규칙이
        이길지 정할 때 <strong>상세도보다 레이어를 먼저</strong> 보고, 레이어에
        넣지 않은 CSS(= 여러분이 그냥 쓴 것)가 항상 이긴다.
      </p>
      <pre className="doc-code">
        <code>{`/* 여러분 — 이것으로 충분하다. !important 가 필요 없다 */
.my-button { border-radius: 0; }`}</code>
      </pre>
      <p>
        클래스 이름도 전부 <code>nui-</code> 로 시작하므로 여러분의{" "}
        <code>.button</code> · <code>.field</code> 와 부딪히지 않는다. reset 도
        기본 배포에 <strong>들어 있지 않다</strong> — 원하면 따로 불러온다.
      </p>

      <h3>2. 눈에 보이는 값은 전부 CSS 변수다</h3>
      <p>
        색 · 글자 크기 · 간격 · 모서리 · 그림자 · 시간까지{" "}
        <strong>{total}개</strong>가 모두 <code>--nui-</code> 로 시작하는
        변수다. SCSS 를 컴파일하거나 빌드 설정을 건드릴 필요 없이, CSS 한 줄로
        바꾼다.
      </p>
      <pre className="doc-code">
        <code>{`:root {
  --nui-action-primary: #7c3aed;   /* 주요 버튼 · 체크박스 · 포커스 링이 함께 따라온다 */
  --nui-radius-2: 0;               /* 입력창·셀렉트의 모서리 */
}`}</code>
      </pre>

      <h3>3. 열어둔 것과 막아둔 것이 있다</h3>
      <p>
        아무거나 다 열어두지 않았다. 기준은 하나다 —{" "}
        <strong>
          잘못 바꿨을 때 여러분이 눈으로 알아챌 수 있으면 열고, 알아챌 수 없으면
          막는다.
        </strong>
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th />
              <th>어떻게 바꾸나</th>
              <th>왜 그렇게 했나</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                색
              </th>
              <td className="doc-wrap">
                <strong>역할 단위로</strong> 바꾼다.{" "}
                <code>--nui-button-bg</code> 같은 컴포넌트별 색 변수는 없다
              </td>
              <td className="doc-wrap">
                배경만 바꾸면 글자색이 안 따라와 대비가 깨지는데,{" "}
                <strong>그게 화면에 드러나지 않는다</strong>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                치수 · 모양
              </th>
              <td className="doc-wrap">
                <strong>컴포넌트별로</strong> 바꾼다 —{" "}
                <code>--nui-button-radius</code> 처럼 {HOOK_COUNT}개
              </td>
              <td className="doc-wrap">
                바꾸면 결과가 바로 보인다. 마음에 안 들면 되돌리면 된다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>값이 어디서 오는가</h2>
      <p>
        컴포넌트는 <strong>역할 이름</strong>만 참조한다. 팔레트 번호를 직접
        쓰지 않는다 — 그러면 테마를 바꿔도 그 컴포넌트만 옛 색으로 남는다.
      </p>
      <pre className="doc-code">
        <code>{`색      color-brand-9  ─→  action-primary  ─→  .nui-button--primary
        (팔레트)          (역할)              (컴포넌트)

치수    radius-2       ─────────────────→  .nui-textfield
        (스케일)                            역할 계층이 없다 — 이름이 이미 역할이다`}</code>
      </pre>
      <p>
        색만 한 겹을 더 두는 이유는 <strong>색이 테마 교체의 대상</strong>이기
        때문이다. 간격이나 모서리에는 &quot;브랜드 간격&quot; 같은 게 없다.
      </p>

      <h2>어디를 보면 되나</h2>
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <h3>{s.title}</h3>
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

      <p className="doc-note">
        이 문서의 표는 전부 <strong>코드에서 생성한다.</strong> 값이 바뀌면
        문서가 따라오므로, 여기 적힌 것과 실제 동작이 다를 일이 없다.
      </p>
    </>
  );
}

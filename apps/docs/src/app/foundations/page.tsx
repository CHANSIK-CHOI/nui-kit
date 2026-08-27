import Link from "next/link";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "Foundations" };

const GROUPS: { key: string; title: string; href: string; desc: string }[] = [
  {
    key: "color",
    title: "색상",
    href: "/foundations/color",
    desc: "브랜드·중립·상태 색과 의미 별칭",
  },
  {
    key: "typography",
    title: "타이포그래피",
    href: "/foundations/typography",
    desc: "5단계 스케일과 굵기·행간",
  },
  {
    key: "space",
    title: "간격과 크기",
    href: "/foundations/spacing",
    desc: "4px 리듬의 간격, 컨트롤 높이",
  },
  {
    key: "radius",
    title: "모양과 깊이",
    href: "/foundations/shape",
    desc: "모서리 반경과 그림자",
  },
  {
    key: "motion",
    title: "모션",
    href: "/foundations/motion",
    desc: "지속시간과 이징",
  },
];

const DATA = tokens as unknown as Record<string, unknown[]>;
const total = Object.values(DATA).reduce((n, list) => n + list.length, 0);

export default function FoundationsPage() {
  return (
    <>
      <h1>Foundations</h1>
      <p className="doc-lead">
        컴포넌트가 공유하는 디자인 토큰. 전부 CSS 변수라 소비자 프로젝트에서
        덮어쓸 수 있다. 현재 <strong>{total}개</strong> 토큰을 정의한다.
      </p>

      <h2>토큰 계층</h2>
      <p>
        토큰은 두 계층이다. <strong>seed 토큰</strong>은 전체 테마를 결정하고,{" "}
        <strong>컴포넌트 토큰</strong>은 개별 컴포넌트만 조정한다.
      </p>
      <ul>
        <li>
          <code>--nui-color-brand-9</code> 같은 seed 토큰을 바꾸면 이를 참조하는
          모든 컴포넌트가 함께 바뀐다
        </li>
        <li>
          <code>--nui-button-radius</code> 같은 컴포넌트 토큰은 해당
          컴포넌트에만 적용된다
        </li>
        <li>
          <code>--nui-_</code> 로 시작하는 것은 <strong>내부 배선</strong>이다.
          덮어쓰면 variant 가 깨진다
        </li>
      </ul>

      <h2>영역</h2>
      <ul>
        {GROUPS.map((g) => (
          <li key={g.key}>
            <Link href={g.href}>{g.title}</Link> — {g.desc} (
            {DATA[g.key]?.length ?? 0}개)
          </li>
        ))}
      </ul>

      <p className="doc-note">
        이 페이지의 모든 토큰 표는{" "}
        <code>packages/ui/src/styles/tokens/_seed.scss</code> 에서 자동
        생성된다. 토큰을 추가하면 문서가 따라온다.
      </p>
    </>
  );
}

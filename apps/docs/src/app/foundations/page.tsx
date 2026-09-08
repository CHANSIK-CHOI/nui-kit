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
        title: "라벨 쓰기",
        href: "/foundations/label",
        desc: "자리 일곱의 문구 꼴",
      },
      {
        title: "피드백 고르기",
        href: "/foundations/feedback",
        desc: "상태 · 완료 · 경고 · 에러를 무엇으로 알리나",
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

      <div className="doc-note">
        <strong>무엇을 바꿀 수 있고 무엇을 막았는지</strong>는{" "}
        <Link href="/design-system">디자인 시스템</Link> 에 있다. 여기서는 값이
        무엇인지만 다룬다.
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

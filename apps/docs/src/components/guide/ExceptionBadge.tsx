import Link from "next/link";

/**
 * 공통 규칙에서 **벗어난 것**만 표시한다.
 *
 * 규칙 본문은 한 곳에만 두고 컴포넌트 페이지는 가리키기만 한다 —
 * 같은 문장이 페이지마다 복사되면 한 곳만 고쳤을 때 갈린다
 * (docs-voice 규칙 §4).
 *
 * ⚠️ `href` 를 여기 한 곳에 모아 둔다. ① 디자인 시스템 층이 생기면
 *    이 파일만 고치면 전 페이지의 배지가 따라온다.

 */
const KIND = {
  ownSize: {
    label: "자기 치수",
    href: "/design-system/size",
    hint: "부모 폭을 채우지 않는다",
  },
  cappedWidth: {
    label: "상한이 있는 폭",
    href: "/design-system/size",
    hint: "좁으면 화면을 채우고 넓으면 읽기 좋은 폭에서 멈춘다",
  },
  contentWidth: {
    label: "내용 폭",
    href: "/design-system/size",
    hint: "내용만큼만 넓어진다",
  },
  rsc: {
    label: "RSC 주의",
    href: "/design-system/isolation",
    hint: "Server Component 에서는 dot notation 이 깨진다",
  },
  noSize: {
    label: "크기 옵션 없음",
    href: "/design-system/size",
    hint: "size · shape 를 받지 않는다",
  },
} as const;

export type ExceptionKind = keyof typeof KIND;

export function ExceptionBadges({
  items,
}: {
  /** 배지와 그것이 걸리는 대상. 대상이 여럿이면 쉼표로 잇지 말고 항목을 나눈다 */
  items: readonly { kind: ExceptionKind; target: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <ul className="doc-badges" aria-label="공통 규칙에서 벗어난 것">
      {items.map(({ kind, target }) => {
        const { label, href, hint } = KIND[kind];
        return (
          <li key={`${kind}-${target}`} className="doc-badge">
            <Link href={href} className="doc-badge__label">
              {label}
            </Link>
            <span className="doc-badge__target">
              <code>{target}</code>
            </span>
            <span className="doc-badge__hint">{hint}</span>
          </li>
        );
      })}
    </ul>
  );
}

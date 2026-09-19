import type { ReactNode } from "react";

/**
 * 설계 근거를 접는다 — 문장 층 ③ (docs-voice 규칙 §1).
 *
 * 지우지 않는다. 이 라이브러리가 남과 다른 점이 거기 있다. 다만 페이지를
 * 열자마자 보이면 쓰는 법을 찾는 사람이 건너뛸 수 없다. 궁금한 사람만 편다.
 *
 * ⚠️ 여기 들어갈 것과 본문에 남을 것을 가른다 — 읽는 사람에게 "그래서 뭘 하면
 *    되나" 가 남으면 본문(①②), "아 그래서 그랬구나" 만 남으면 여기다.
 */
export function DesignNote({
  title,
  children,
}: {
  /** 질문 꼴로 쓴다 — 펴기 전에 무엇이 들었는지 알 수 있어야 한다 */
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="doc-why">
      <summary className="doc-why__summary">{title}</summary>
      <div className="doc-why__body">{children}</div>
    </details>
  );
}

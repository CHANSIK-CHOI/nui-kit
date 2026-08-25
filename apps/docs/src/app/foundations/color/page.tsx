import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "색상" };

export default function ColorPage() {
  return (
    <>
      <h1>색상</h1>
      <p className="doc-lead">
        원시 색상(palette) → 의미 별칭(semantic) → 컨트롤 배선(control)의 3단
        구조다. 테마를 바꿀 때는 보통 원시 색상만 건드리면 된다.
      </p>

      <h2>브랜드 · 중립 · 상태</h2>
      <p>
        실제 색을 지정하는 원시 토큰이다. 컴포넌트가 이 값을 직접 쓰는 경우는
        드물고, 대부분 아래 의미 별칭을 거친다.
      </p>
      <TokenTable group="color" />

      <h2>의미 별칭</h2>
      <p>
        &quot;본문 텍스트&quot;, &quot;위험&quot; 처럼 <em>역할</em>로 색을
        가리킨다. 컴포넌트는 이 층을 참조한다.
      </p>
      <TokenTable group="semantic" />

      <h2>컨트롤 배선</h2>
      <p>
        입력 컨트롤(Textfield, Select, Checkbox …)이 공유하는 상태별 색이다. 폼
        전체의 톤을 한 번에 바꾸고 싶을 때 여기를 덮는다.
      </p>
      <TokenTable group="control" />

      <h2>커스터마이징 예</h2>
      <pre className="doc-code">
        <code>{`/* 브랜드 색만 교체 — 버튼·포커스링·선택 상태가 함께 따라온다 */
:root {
  --nui-color-primary: #ff6b00;
  --nui-color-primary-dark: #7c2d12;
  --nui-color-primary-bright: #ffedd5;
}

/* 입력 컨트롤 테두리만 진하게 */
:root {
  --nui-control-border: #94a3b8;
}`}</code>
      </pre>
    </>
  );
}

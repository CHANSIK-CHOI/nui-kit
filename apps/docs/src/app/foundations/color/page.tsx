import { TokenTable } from "@/components/TokenTable";
import { ColorScale, ScaleLegend } from "@/components/ColorScale";

export const metadata = { title: "색상" };

const SCALES: [string, string, string][] = [
  ["brand", "brand", "브랜드 색 — #01796f 를 9단계에 놓고 생성했다"],
  ["gray", "gray", "무채색 — 브랜드 색상에 맞춰 살짝 초록빛이다"],
  ["danger", "danger", "되돌릴 수 없는 액션 · 오류"],
  ["warning", "warning", "주의가 필요한 액션"],
  ["success", "success", "완료 · 확인"],
  ["info", "info", "정보 전달 · 도움말"],
];

export default function ColorPage() {
  return (
    <>
      <h1>색상</h1>
      <p className="doc-lead">
        색에는 이름을 세 번 붙인다. <strong>색 자체</strong>(
        <code>color-brand-9</code>) → <strong>그 색이 맡은 역할</strong>(
        <code>action-primary</code>) → <strong>컴포넌트의 특정 자리</strong>(
        <code>--nui-button-primary-bg</code>). 컴포넌트는 가운데 층만 참조하고,
        라이브러리를 쓰는 사람은 마지막 층만 덮어쓴다.
      </p>

      <h2>12단계 스케일</h2>
      <p>
        모든 색은 12단계를 갖는다. <strong>단계 번호가 곧 역할</strong>이라, 어느
        색을 쓰든 &quot;테두리는 7번, 배경은 9번&quot;처럼 같은 자리에서 꺼내
        쓰면 된다. 무슨 색을 쓸지 고민할 필요가 없는 이유다.
      </p>
      <ScaleLegend />

      {SCALES.map(([scale, label, description]) => (
        <ColorScale
          key={scale}
          scale={scale}
          label={label}
          description={description}
        />
      ))}

      <div className="doc-note">
        <strong>다크 테마는 이름이 아니라 값만 바뀐다.</strong> 위 12단계가{" "}
        <code>[data-theme=&quot;dark&quot;]</code> 에서 다른 값으로 다시
        선언된다. <code>action-primary</code> 같은 역할 이름은 그대로이므로
        컴포넌트 CSS 는 한 줄도 고칠 필요가 없다.
      </div>

      <h2>글자</h2>
      <p>
        12단계 중 글자로 쓸 수 있는 것은 11(보조)과 12(본문) 둘뿐이다. 9·10 은
        solid 배경 자리라 글자로 쓰면 명도 대비가 3점대로 떨어진다.
        <code>text-disabled</code> 만 예외로 9단계를 쓰는데, 비활성 요소는 WCAG
        대비 요구에서 제외되기 때문이다.
      </p>
      <TokenTable group="text" />

      <h2>표면 · 깊이</h2>
      <p>
        콘텐츠를 담는 컨테이너의 배경이다. 텍스트나 아이콘 같은 개별 요소가 아니라
        화면의 <em>층</em>을 만드는 데만 쓴다. 다크 테마에서는{" "}
        <code>layer-basement</code> 와 <code>layer-default</code> 가 자리를
        바꾼다 — 고도가 높을수록 밝아져야 하는데, 그건 색을 반전시켜서는 만들어지지
        않기 때문이다.
      </p>
      <TokenTable group="layer" />

      <h2>액션</h2>
      <p>
        버튼 계열이다. <strong>색이 아니라 역할이 이름</strong>이므로
        &quot;이 버튼은 삭제인가&quot;만 물으면 쓸 색이 정해진다. 각 역할의{" "}
        <code>-fg</code> 는 그 배경 위에서 명도 대비 4.5:1 을 넘는 글자색이다 —{" "}
        <code>warning</code> 만 검정인 것은 노랑을 어둡게 하면 갈색이 되어
        &quot;주의&quot;의 의미를 잃기 때문이다.
      </p>
      <TokenTable group="action" />

      <h2>입력 컨트롤</h2>
      <p>
        Textfield · Select · Checkbox 처럼 값을 받는 컨트롤이 공유하는 상태별
        색이다. 폼 전체의 톤을 한 번에 바꾸고 싶을 때 여기를 덮는다.
      </p>
      <TokenTable group="control" />

      <h2>테두리</h2>
      <p>
        포커스 링의 <strong>굵기와 크기</strong>는 색이 아니라 치수라 모양과 깊이
        문서에 있다. 여기 있는 것은 색뿐이다.
      </p>
      <TokenTable group="border" />

      <h2>상태 표시</h2>
      <p>알림 · 배지처럼 은은한 면으로 상태를 알릴 때 쓴다.</p>
      <TokenTable group="status" />

      <h2>커스터마이징</h2>
      <p>
        브랜드 색을 통째로 바꾸려면 <strong>9단계 하나만</strong> 덮으면 되는 게
        아니라 12단계를 함께 줘야 한다. 단계 사이의 명도 관계가 대비를
        보장하기 때문이다. 특정 컴포넌트만 바꿀 때는 그 컴포넌트의 공개 훅을 쓴다.
      </p>
      <pre className="doc-code">
        <code>{`/* 1) 브랜드 색 전체 교체 — 버튼 · 포커스 링 · 선택 상태가 함께 따라온다 */
:root {
  --nui-color-brand-1: #fdf4ff;
  /* … 2 ~ 11 … */
  --nui-color-brand-9: #a21caf;
  --nui-color-brand-12: #3b0764;
  --nui-color-brand-contrast: #fff;  /* 9단계 위 글자색 */
}

/* 2) 역할 하나만 조정 — 위험 버튼만 더 진하게 */
:root {
  --nui-action-danger: #991b1b;
}

/* 3) 특정 컴포넌트만 — primary 버튼 배경만 바꾼다 */
:root {
  --nui-button-primary-bg: #7c3aed;
}`}</code>
      </pre>

      <h2>원시 색상</h2>
      <p>
        위 스케일의 실제 값이다. <strong>컴포넌트는 이 이름을 직접 쓰지 않는다</strong>{" "}
        — 테마를 바꿔도 그 컴포넌트만 옛 색으로 남기 때문이다.
      </p>
      <TokenTable group="color" />
    </>
  );
}

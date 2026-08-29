import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "디자인 토큰" };

const DATA = tokens as unknown as Record<string, unknown[]>;
const total = Object.values(DATA).reduce((n, list) => n + list.length, 0);

/** flat 목록의 표시 순서와 이름. 카테고리 문서의 순서와 맞춘다. */
const GROUPS: [string, string][] = [
  ["color", "팔레트"],
  ["text", "글자색"],
  ["layer", "면"],
  ["border", "선"],
  ["control", "입력 컨트롤"],
  ["action", "액션"],
  ["status", "상태 표시"],
  ["typography", "타이포그래피"],
  ["space", "간격"],
  ["size", "크기"],
  ["radius", "모서리"],
  ["shadow", "그림자"],
  ["focus", "포커스"],
  ["motion", "모션"],
  ["etc", "투명도 · 배율"],
  ["z-index", "쌓임 순서"],
];

export default function TokensPage() {
  return (
    <>
      <h1>디자인 토큰</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 값에 이름을 어떻게 붙였고, 그
        이름을 어디까지 믿어도 되는가. 값 자체는 각 카테고리 문서에 있고,
        여기에는 <strong>{total}개 전량</strong>이 한 곳에 있다.
      </p>

      <h2>토큰은 &quot;정한 값&quot;에 붙인 이름이다</h2>
      <p>
        <code>#1c201d</code> 는 값이고 <code>--nui-text-primary</code> 는
        토큰이다. 값을 그대로 쓰면 어디에 쓰라는 것인지 알 수 없지만, 이름이
        붙으면 <strong>쓸 자리가 정해진다.</strong>
      </p>
      <p>
        쓸 수 있는 값을 유한하게 만드는 것이 목적이다. 회색이 필요할 때마다 골라
        쓰면 화면마다 다른 회색이 생긴다.
      </p>

      <h2>이름을 두 가지 방식으로 짓는다</h2>
      <p>
        하나로 통일하지 않았다. <strong>값의 성격이 다르기 때문</strong>이다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>방식</th>
              <th>예</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">숫자</th>
              <td>
                <span className="doc-token-name">space-4</span>{" "}
                <span className="doc-token-name">radius-2</span>{" "}
                <span className="doc-token-name">font-size-3</span>
              </td>
              <td className="doc-wrap">
                등간격 스케일 — 간격 · 모서리 · 글자 크기 · 시간
              </td>
            </tr>
            <tr>
              <th scope="row">역할</th>
              <td>
                <span className="doc-token-name">control-bg</span>{" "}
                <span className="doc-token-name">size-control-md</span>
              </td>
              <td className="doc-wrap">
                의미가 있는 값(색), 불규칙한 실측값(크기)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>숫자를 쓰면 두 가지가 따라온다.</strong> 값이 이름에서 계산되고(
        <code>space-4</code> = 4 × 4px), 중간값을 넣어도 기존 이름이 안 바뀐다(
        <code>space-1</code> 과 <code>space-2</code> 사이는{" "}
        <code>space-1_5</code>).
      </p>
      <p>
        아이콘 크기는 10 · 14 · 16 · 20 · 24px 로 <strong>불규칙</strong>하다.
        여기에 숫자를 붙이면 두 이점이 <strong>둘 다 없다</strong> — 그래서
        거기엔 숫자를 쓰지 않는다.
      </p>

      <div className="doc-note">
        <strong>
          t-shirt 사이즈(<code>md</code> · <code>lg</code>)를 스케일에 쓰지 않는
          이유
        </strong>{" "}
        — <code>md</code> 와 <code>lg</code> 사이에 무엇을 넣을지에는 답이 없다.
        중간값이 필요할 때마다 이름 논쟁이 벌어진다. 크기 <em>옵션</em>에는 쓴다
        — 거기는 단계가 셋으로 고정이다.
      </div>

      <h2>색만 한 겹을 더 둔다</h2>
      <pre className="doc-code">
        <code>{`색      color-brand-9  ─→  action-primary  ─→  .nui-button--primary
        팔레트            역할               컴포넌트가 참조하는 것

그 외    radius-2       ─────────────────→  .nui-textfield
        스케일                              역할 계층 없음`}</code>
      </pre>
      <p>
        <strong>컴포넌트는 팔레트를 직접 참조하지 않는다.</strong> 참조하면
        테마를 바꿔도 그 컴포넌트만 옛 색으로 남는다. 기계 검사가 이걸 막는다 —{" "}
        <code>npm run verify:tokens</code>.
      </p>
      <p>
        간격 · 모서리 · 크기 · 시간 · 선 두께에는 역할 계층이 없다.{" "}
        <strong>이름이 이미 역할</strong>이고, &quot;브랜드 간격&quot; 같은 건
        존재하지 않기 때문이다. 컴포넌트가 <code>--nui-space-4</code> 를 직접
        써도 된다.
      </p>

      <h2>정해진 게 없을 때 쓸 값도 이름을 갖는다</h2>
      <p>
        모든 조합에 간격을 정의하려다 실패하는 대신,{" "}
        <strong>
          &quot;규칙이 없을 때 이것&quot;을 정식 토큰으로 만들었다.
        </strong>{" "}
        그러면 임의의 숫자가 코드에 들어가는 경로가 막힌다.
      </p>
      <TokenTable group="space" only="space-component" swatch={false} />

      <h2>전량 {total}개</h2>
      <p>
        카테고리별 설명은 각 문서에 있다. 여기는{" "}
        <strong>찾아보기 위한 목록</strong>이다 —{" "}
        <code>packages/ui/src/styles/tokens/_seed.scss</code> 에서 자동
        생성한다.
      </p>

      {GROUPS.map(([key, label]) => (
        <div key={key}>
          <h3>
            {label}{" "}
            <span className="doc-token-name">{DATA[key]?.length ?? 0}개</span>
          </h3>
          <TokenTable group={key} />
        </div>
      ))}

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-_</code> 로 시작하는 변수는 이 목록에 없다.
        </strong>{" "}
        컴포넌트 내부 배선이라 공개 API 가 아니고, 덮어쓰면 variant 가 깨진다.
      </div>
    </>
  );
}

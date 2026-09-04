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
  ["etc", "배율"],
  ["z-index", "쌓임 순서"],
];

export default function TokensPage() {
  return (
    <>
      <h1>디자인 토큰</h1>
      <p className="doc-lead">
        쓸 수 있는 값 <strong>{total}개</strong>의 전체 목록이다. 카테고리별
        설명은 각 문서에 있고 여기에는 전량이 모여 있다.
      </p>

      <h2>이름을 읽는 법</h2>
      <p>이름 방식이 두 가지다. 값의 성격이 다르기 때문이다.</p>

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
        숫자를 쓰면 값이 이름에서 계산되고(<code>space-4</code> = 4 × 4px)
        중간값을 넣어도 기존 이름이 바뀌지 않는다(<code>space-1</code> 과{" "}
        <code>space-2</code> 사이는 <code>space-1_5</code>).
      </p>
      <p>
        아이콘 크기는 14, 16, 20, 24px 로 불규칙해서 숫자의 두 이점이 모두 없다.
      </p>

      <h2>색만 한 겹을 더 둔다</h2>
      <pre className="doc-code">
        <code>{`색      color-brand-9  ─→  action-primary  ─→  .nui-button--primary
        팔레트            역할               컴포넌트가 참조하는 것

그 외    radius-2       ─────────────────→  .nui-textfield
        스케일                              역할 층 없음`}</code>
      </pre>
      <p>
        컴포넌트는 <code>action-primary</code> 를 참조한다. 브랜드 색을 바꿔도
        컴포넌트가 따라오게 하기 위해서다.
      </p>
      <p>
        간격과 모서리, 크기, 시간, 선 두께에는 역할 층이 없다. 이름이 이미
        역할이다.
      </p>

      <h2>전량 {total}개</h2>
      <p>
        이 목록은 <code>packages/ui/src/styles/tokens/_seed.scss</code> 에서
        자동 생성한다.
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
        공개 API 가 아니고 덮어쓰면 variant 가 깨진다.
      </div>
    </>
  );
}

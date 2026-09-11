import Link from "next/link";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "디자인 토큰" };

const DATA = tokens as unknown as Record<string, unknown[]>;
const total = Object.values(DATA).reduce((n, list) => n + list.length, 0);

/** 그룹마다 표가 있는 카테고리 문서. 표는 그 문서에만 있다 */
const GROUPS: [string, string, string, string][] = [
  ["color", "팔레트", "/foundations/color#color", "12단계 팔레트 전량"],
  ["text", "글자색", "/foundations/color#text", "역할별 색 · 글자"],
  ["layer", "면", "/foundations/color#layer", "역할별 색 · 면"],
  ["border", "선", "/foundations/shape#border", "선 색과 두께"],
  [
    "control",
    "입력 컨트롤",
    "/foundations/color#control",
    "역할별 색 · 입력 컨트롤",
  ],
  ["action", "액션", "/foundations/color#action", "역할별 색 · 액션"],
  ["status", "상태 표시", "/foundations/color#status", "역할별 색 · 상태 표시"],
  [
    "typography",
    "타이포그래피",
    "/foundations/typography#typography",
    "크기 · 행간 · 자간 · 두께",
  ],
  ["space", "간격", "/foundations/spacing#space", "4px 스케일과 의미 간격"],
  ["size", "크기", "/foundations/spacing#size", "컨트롤 · 아이콘 · 점"],
  ["radius", "모서리", "/foundations/shape#radius", "높이 × ⅛"],
  ["shadow", "그림자", "/foundations/elevation#shadow", "떠 있는 것의 두 겹"],
  ["focus", "포커스", "/foundations/accessibility#focus", "링 셋과 색"],
  ["motion", "모션", "/foundations/motion#motion", "시간과 곡선"],
  ["etc", "배율", "/foundations/motion#scale", "눌림 배율 셋"],
  ["z-index", "쌓임 순서", "/foundations/elevation#z-index", "층의 계약"],
];

export default function TokensPage() {
  return (
    <>
      <h1>디자인 토큰</h1>
      <p className="doc-lead">
        쓸 수 있는 값은 <strong>{total}개</strong>다. 이 문서는 이름을 읽는 법과
        어느 문서에 어떤 값이 있는지를 보여주는 지도다. 표는 카테고리 문서마다
        하나씩 있다.
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
                <span className="doc-token-name">radius-3</span>{" "}
                <span className="doc-token-name">font-size-2</span>
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
        숫자를 쓰면 값이 이름에서 계산된다(<code>space-4</code> = 4 × 4px).
        번호는 1부터 순서대로이고 새 값은 끝 번호로만 더한다. 중간에 끼워 넣으면
        뒤 번호가 밀린다.
      </p>
      <p>
        아이콘 크기는 14, 16, 20, 24px 로 불규칙해서 숫자의 두 이점이 모두 없다.
      </p>

      <h2>색만 한 겹을 더 둔다</h2>
      <pre className="doc-code">
        <code>{`색      color-brand-9  ─→  action-primary  ─→  .nui-button--primary
        팔레트            역할               컴포넌트가 참조하는 것

그 외    radius-3       ─────────────────→  .nui-textfield
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

      <h2>어디에 무엇이 있나</h2>
      <p>
        전부 <code>packages/ui/src/styles/tokens/_seed.scss</code> 에서 자동
        생성된다. 내부 배선(<code>--nui-_</code>)은 목록에 없다. 그 이유는{" "}
        <Link href="/foundations/customizing">커스터마이징</Link> 에 있다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>그룹</th>
              <th>개수</th>
              <th>어느 문서</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map(([key, label, href, where]) => (
              <tr key={key}>
                <th scope="row" className="doc-wrap">
                  {label}
                </th>
                <td>
                  <span className="doc-token-name">
                    {DATA[key]?.length ?? 0}개
                  </span>
                </td>
                <td className="doc-wrap">
                  <Link href={href}>{where}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

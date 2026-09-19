import Link from "next/link";
import presets from "@/generated/presets.json";
import { DesignNote } from "@/components/guide";

export const metadata = { title: "색은 고르는 것이다" };

/** 테마 파일 하나에 든 변수 수 — 12단계 셋 + 반투명 + 채움 위 글자색 둘. 라이트·다크 각각 */
const PER_THEME =
  presets.steps.length * 3 +
  presets.alpha.brand.length +
  presets.alpha.secondary.length +
  presets.alpha.gray.length +
  2;

/** 자리마다 요구하는 대비가 다르다 — packages/ui/scripts/color/contrast.mjs 가 검사한다 */
const CONTRAST = [
  ["채워진 면 위의 글자", "9번 위", "3 : 1", "버튼 라벨처럼 짧고 굵은 글자"],
  ["연한 본문", "11번", "4 : 1", "보조 설명 · 테두리만 있는 버튼의 글자"],
  ["진한 본문", "12번", "4.5 : 1", "긴 글. 여기가 AA 다"],
] as const;

export default function ColorPage() {
  return (
    <>
      <h1>색은 고르는 것이다</h1>

      <p>
        브랜드 색을 직접 조합하는 자리는 없다. 고르는 것은 색 하나다. 준비된{" "}
        <strong>{presets.count}색</strong> 중 하나를 고르거나 목록에 없는 색을{" "}
        <code>npx nui-theme --accent</code> 로 넘기면 화면에 필요한 색이 전부
        따라온다.
      </p>

      <h2>한 색에서 {PER_THEME}개가 나온다</h2>
      <p>고른 색 하나가 아래를 만든다.</p>
      <ul>
        <li>
          <strong>브랜드 12단계</strong> — 가장 연한 배경부터 가장 진한 글자까지
        </li>
        <li>
          <strong>보조 12단계</strong> — 브랜드와 같은 색조에 채도를 낮춘 것
        </li>
        <li>
          <strong>회색 12단계</strong> — 브랜드의 색기가 아주 살짝 도는 무채색
        </li>
        <li>
          <strong>반투명</strong> — 어떤 배경 위에 놓여도 같은 진하기가 되는 색
        </li>
        <li>
          <strong>각 단계 위에서 읽히는 글자색</strong>
        </li>
      </ul>
      <p>
        라이트와 다크가 각각 만들어지므로 파일 하나에 {PER_THEME * 2}개가 든다.
      </p>

      <pre className="doc-code">
        <code>{`import "@nui-kit/react/styles/index.css";
import "@nui-kit/react/styles/themes/preset-42.css";   // 고른 색 하나`}</code>
      </pre>
      <p>
        어떤 색이 있는지는 <Link href="/brand-colors">브랜드 색 고르기</Link>{" "}
        에서 눈으로 고른다. 목록에 없는 색은 같은 페이지의 명령으로 만든다.
      </p>

      <h2>185색은 어떻게 추려졌나</h2>
      <p>
        공개 팔레트 <strong>400색</strong>에서 시작해, 같은 색을 지우고{" "}
        <strong>선명함이 부족한 색</strong>을 뺐다. 회색에 가까운 색을 브랜드로
        삼으면 강조가 강조로 보이지 않고, 12단계로 펼쳤을 때 단계끼리 구분되지
        않는다.
      </p>

      <h2>대비는 자리마다 다른 기준으로 잰다</h2>
      <p>185색 전부가 이 검사를 통과한다. 통과하지 못하는 색은 목록에 없다.</p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>자리</th>
              <th>단계</th>
              <th>기준</th>
              <th>어디에 쓰나</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map(([where, step, ratio, use]) => (
              <tr key={where}>
                <th scope="row" className="doc-wrap">
                  {where}
                </th>
                <td>
                  <code>{step}</code>
                </td>
                <td>
                  <strong>{ratio}</strong>
                </td>
                <td className="doc-wrap">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DesignNote title="왜 자리마다 기준이 다른가">
        <p>
          채워진 면 위의 라벨은 짧고 굵다. 여기에 본문과 같은 4.5:1 을 요구하면
          쓸 수 있는 브랜드 색이 거의 남지 않는다 — Radix 가 공식으로 내놓은
          23색 중에서도 다섯뿐이다. 글자 크기와 굵기를 고려한 기준이 WCAG 의 큰
          글자 규정(3:1)이고, 버튼 라벨이 정확히 그 자리다.
        </p>
        <p>
          긴 글은 다르다. 읽는 데 시간이 걸리므로 AA(4.5:1)를 지킨다. 연한
          본문은 그 사이에 두어, 노랑처럼 밝은 색도 쓸 수 있게 하면서 너무
          흐려지지 않게 했다.
        </p>
      </DesignNote>

      <h2>상태색은 브랜드를 따라가지 않는다</h2>
      <p>
        빨강 · 노랑 · 초록 · 파랑은 브랜드가 아니라 <strong>관습</strong>이다.
        브랜드 색을 바꿔도 에러는 빨갛고 성공은 초록이다. 브랜드가 빨강이어도
        마찬가지다.
      </p>

      <h2>바꾸는 길은 둘이다</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>범위</th>
              <th>방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                화면 전체
              </th>
              <td className="doc-wrap">
                <Link href="/brand-colors">프리셋 {presets.count}색</Link> 중
                하나를 고른다. 목록에 없으면{" "}
                <code>npx nui-theme --accent &quot;#b1002a&quot;</code> 로
                만든다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                컴포넌트 하나
              </th>
              <td className="doc-wrap">
                <code>className</code> 으로 배경과 글자를 함께 지정한다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre className="doc-code">
        <code>{`/* 배경과 글자를 같은 자리에 쓴다 — 짝을 놓치지 않는다 */
.my-tooltip {
  background: #1f2937;
  color: #f9fafb;
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>:root</code> 에서 색 변수를 덮어쓰는 것은 창구가 아니다.
        </strong>{" "}
        <code>--nui-action-primary</code> 를 바꿔도 짝인{" "}
        <code>--nui-action-primary-fg</code> 는 그대로 남아 대비가 조용히
        깨진다. 동작하기는 하지만 안내하지 않는 이유다.
      </div>

      <p>
        어떤 색 변수가 있고 각각 무슨 역할인지는{" "}
        <Link href="/foundations/color">Foundations · 색</Link> 에 있다.
      </p>
    </>
  );
}

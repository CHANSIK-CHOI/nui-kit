import Link from "next/link";
import { GuideHeader, PropsTable } from "@/components/guide";
import { FullPopupDemo } from "./FullPopupDemo";

export const metadata = { title: "FullPopup" };

export default function FullPopupPage() {
  return (
    <>
      <GuideHeader
        title="FullPopup"
        named={["FullPopup", "useFullPopup"]}
        subpath="popup"
      >
        화면 전체를 덮는 팝업이다. 오른쪽에서 슬라이드해 들어오고, 모바일에서 한
        화면짜리 흐름(상세 보기 · 긴 양식)을 띄울 때 쓴다. 폭이 화면이므로{" "}
        <code>size</code> 를 받지 않는다. 그 외의 props 와 여는 법은 LayerPopup
        과 같다.
      </GuideHeader>

      <FullPopupDemo />

      <h2>LayerPopup 과 다른 점</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th></th>
              <th>LayerPopup</th>
              <th>FullPopup</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">덮는 범위</th>
              <td>가운데 패널, 주변은 dim</td>
              <td>화면 전체. dim 이 보이지 않는다</td>
            </tr>
            <tr>
              <th scope="row">등장</th>
              <td>페이드 + 살짝 확대</td>
              <td>오른쪽에서 슬라이드</td>
            </tr>
            <tr>
              <th scope="row">
                <code>size</code>
              </th>
              <td>small · regular · large</td>
              <td>받지 않는다</td>
            </tr>
            <tr>
              <th scope="row">safe-area</th>
              <td>—</td>
              <td>노치·홈 인디케이터를 피해 여백을 잡는다</td>
            </tr>
            <tr>
              <th scope="row">기본 접근 이름</th>
              <td>&quot;레이어 팝업&quot;</td>
              <td>&quot;전체 팝업&quot;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 없으면 <code>aria-label=&quot;전체 팝업&quot;</code> 이 붙는다.{" "}
          <code>dialogLabel</code> 로 바꾼다
        </li>
        <li>
          dim 이 안 보여도 ESC 와 닫기 버튼으로 닫힌다. 화면을 다 덮으므로 닫기
          버튼(<code>hasCloseButton</code>)을 끄지 않는 편이 안전하다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 슬라이드 없이 페이드만
          남는다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 쌓임 등 공통 계약은{" "}
          <Link href="/components/popup">Popup 개요</Link>
        </li>
      </ul>

      <h2>API</h2>
      <h3>FullPopup</h3>
      <PropsTable of="FullPopup" />
    </>
  );
}

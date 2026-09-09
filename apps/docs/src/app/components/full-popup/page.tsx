import Link from "next/link";
import { GuideHeader, DesignNote, PropsTable } from "@/components/guide";
import {
  FullPopupDeclarativeDemo,
  FullPopupImperativeDemo,
  FullPopupOptionsDemo,
} from "./FullPopupDemo";

export const metadata = { title: "FullPopup" };

export default function FullPopupPage() {
  return (
    <>
      <GuideHeader
        title="FullPopup"
        named={["FullPopup", "useFullPopup"]}
        subpath="popup"
      />

      <p>
        화면 전체를 덮는 팝업이다. 상세 화면 · 긴 폼처럼 한 페이지만큼의 내용을
        담을 때 맞다. 여는 법 · 닫힘 · 접근성은{" "}
        <Link href="/components/layer-popup">LayerPopup</Link> 과 같다. 이
        페이지는 전체 화면에서 달라지는 것만 적는다.
      </p>

      <h2>선언형</h2>
      <FullPopupDeclarativeDemo />

      <h2>명령형</h2>
      <p>
        <code>useFullPopup().open({"{ component }"})</code>.
      </p>
      <FullPopupImperativeDemo />

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
              <td>가운데 패널. 주변은 dim</td>
              <td>화면 전체. dim 이 보이지 않는다</td>
            </tr>
            <tr>
              <th scope="row">등장</th>
              <td>페이드 + 살짝 확대</td>
              <td>오른쪽에서 들어온다</td>
            </tr>
            <tr>
              <th scope="row">
                <code>size</code>
              </th>
              <td>small · medium · large</td>
              <td>받지 않는다</td>
            </tr>
            <tr>
              <th scope="row">모서리</th>
              <td>둥글다</td>
              <td>없다</td>
            </tr>
            <tr>
              <th scope="row">safe-area</th>
              <td>—</td>
              <td>노치 · 홈 인디케이터를 피해 여백을 잡는다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>본문 정렬 · 닫기 버튼</h2>
      <p>
        <code>contentAlign</code> 의 기본은 <code>left</code> 다. 화면을 다
        덮으므로 <code>hasCloseButton</code> 은 켜 두는 편이 안전하다. dim 이 안
        보여서 누를 곳이 없고 <kbd>Esc</kbd> 는 키보드에만 있다. 푸터는{" "}
        <code>confirmLabel</code> · <code>cancelLabel</code> 로 그리고, 둘로 안
        되는 자리만 <code>footer</code> 다.
      </p>
      <FullPopupOptionsDemo />

      <DesignNote title="왜 스프링이 아닌가">
        <p>
          전체 화면은 손으로 끌 수 없다. 스프링은 손으로 만질 수 있는 것의
          도구라 시트에만 쓰고, 전체 팝업은 300ms 곡선으로 들어온다.
        </p>
      </DesignNote>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 <code>aria-labelledby</code> 로 붙는다. 제목이 없으면{" "}
          <code>dialogLabel</code> 을 준다. 둘 다 없으면 타입이 막는다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 들어오지 않고 페이드만
          남는다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 쌓임은{" "}
          <Link href="/components/popup">Popup</Link> 과 같다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        <code>LayerPopup</code> 의 prop 에서 <code>size</code> 가 빠진다.
      </p>
      <PropsTable of="FullPopup" />
    </>
  );
}

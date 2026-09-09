import Link from "next/link";
import { GuideHeader, DesignNote, PropsTable } from "@/components/guide";
import {
  BottomSheetDeclarativeDemo,
  BottomSheetImperativeDemo,
  BottomSheetOptionsDemo,
} from "./BottomSheetDemo";

export const metadata = { title: "BottomSheet" };

export default function BottomSheetPage() {
  return (
    <>
      <GuideHeader
        title="BottomSheet"
        named={["BottomSheet", "useBottomSheet"]}
        subpath="popup"
      />

      <p>
        화면 아래에서 올라오는 시트다. 공유하기 · 정렬 방식처럼 선택지 몇 개를
        고르는 자리에 맞다. 여는 법 · 닫힘 · 접근성은{" "}
        <Link href="/components/layer-popup">LayerPopup</Link> 과 같다. 이
        페이지는 시트에서 달라지는 것만 적는다.
      </p>

      <h2>선언형</h2>
      <BottomSheetDeclarativeDemo />

      <h2>명령형</h2>
      <p>
        <code>useBottomSheet().open({"{ component }"})</code>. 시트 안의
        선택지가 <code>onRequestClose</code> 를 부르면 닫힌다.
      </p>
      <BottomSheetImperativeDemo />

      <h2>LayerPopup 과 다른 점</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th></th>
              <th>LayerPopup</th>
              <th>BottomSheet</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">위치</th>
              <td>가운데</td>
              <td>아래에 붙는다. 위 두 모서리만 둥글다</td>
            </tr>
            <tr>
              <th scope="row">등장</th>
              <td>페이드 + 살짝 확대</td>
              <td>아래에서 올라온다. 스프링</td>
            </tr>
            <tr>
              <th scope="row">
                <code>size</code>
              </th>
              <td>small · medium · large</td>
              <td>받지 않는다. 화면 폭을 채운다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>본문 정렬 · 닫기 버튼</h2>
      <p>
        <code>contentAlign</code> 의 기본은 <code>left</code> 다.{" "}
        <code>hasCloseButton={"{false}"}</code> 면 헤더의 × 가 없어지고 dim 과{" "}
        <kbd>Esc</kbd> 로만 닫힌다.
      </p>
      <BottomSheetOptionsDemo />

      <DesignNote title="왜 시트만 스프링인가">
        <p>
          시트는 손으로 끌 수 있다. 끌어서 닫는 제스처가 붙으면 열릴 때와 놓았을
          때가 한 물리로 움직여야 한다. 그래서 다섯 중 시트만 스프링이고 튐은
          없다. 버튼으로 여는 등장이 튀면 어색하다. 끌 수 없는 FullPopup 은
          곡선으로 움직인다.
        </p>
      </DesignNote>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 <code>aria-labelledby</code> 로 붙는다. 제목이 없으면{" "}
          <code>dialogLabel</code> 을 준다. 둘 다 없으면 타입이 막는다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 올라오지 않고 페이드만
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
      <PropsTable of="BottomSheet" />
    </>
  );
}

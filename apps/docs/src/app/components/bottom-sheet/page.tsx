import Link from "next/link";
import { GuideHeader, PropsTable } from "@/components/guide";
import { BottomSheetDemo } from "./BottomSheetDemo";

export const metadata = { title: "BottomSheet" };

export default function BottomSheetPage() {
  return (
    <>
      <GuideHeader
        title="BottomSheet"
        named={["BottomSheet", "useBottomSheet"]}
        subpath="popup"
      >
        화면 아래에서 올라오는 시트다. 모바일에서 선택지 몇 개를 고르게 할 때
        쓴다. 폭은 화면에 맞춰 자기가 정하므로 <code>size</code> 를 받지 않는다.
        그 외의 props 와 여는 법은 LayerPopup 과 같다.
      </GuideHeader>

      <BottomSheetDemo />

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
              <td>아래에 붙는다</td>
            </tr>
            <tr>
              <th scope="row">등장</th>
              <td>페이드 + 살짝 확대</td>
              <td>아래에서 슬라이드</td>
            </tr>
            <tr>
              <th scope="row">
                <code>size</code>
              </th>
              <td>small · regular · large</td>
              <td>받지 않는다</td>
            </tr>
            <tr>
              <th scope="row">기본 접근 이름</th>
              <td>&quot;레이어 팝업&quot;</td>
              <td>&quot;바텀시트 팝업&quot;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 없으면 <code>aria-label=&quot;바텀시트 팝업&quot;</code> 이
          붙는다. <code>dialogLabel</code> 로 바꾼다
        </li>
        <li>
          dim 클릭과 ESC 로 닫힌다. 닫기 버튼도 있다(
          <code>hasCloseButton</code>)
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
      <h3>BottomSheet</h3>
      <PropsTable of="BottomSheet" />
    </>
  );
}

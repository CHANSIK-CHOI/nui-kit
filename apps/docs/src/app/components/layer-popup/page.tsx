import Link from "next/link";
import { GuideHeader, PropsTable } from "@/components/guide";
import { LayerPopupDemo } from "./LayerPopupDemo";
import { PopupSizeDemo } from "./PopupSizeDemo";

export const metadata = { title: "LayerPopup" };

export default function LayerPopupPage() {
  return (
    <>
      <GuideHeader
        title="LayerPopup"
        named={["LayerPopup", "useLayerPopup"]}
        subpath="popup"
      >
        화면 가운데에 뜨는 대화상자다. 제목 · 본문 · 푸터를 갖고 닫기 버튼이
        있으며, dim 클릭과 ESC 로 닫힌다. 선언형으로 열림 상태를 직접
        소유하거나, 명령형으로 내용 컴포넌트를 등록해 연다.
      </GuideHeader>

      <LayerPopupDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 폭만 바꾼다. 다섯 종류 중 LayerPopup 만 크기를
        받는다. BottomSheet 와 FullPopup 은 화면에 맞춰 자기 폭을 갖는다.
      </p>
      <PopupSizeDemo />

      <h2>닫힘</h2>
      <p>
        컴포넌트는 닫아 달라고 <strong>요청</strong>만 한다.{" "}
        <code>onRequestClose</code> 가 dim 클릭 · ESC · 닫기 버튼에서 불리고,
        실제로 <code>open</code> 을 내리는 것은 소비자다. 닫기 버튼만 따로 잡고
        싶으면 <code>onClickClose</code> 를 쓴다. 둘 다 있으면{" "}
        <code>onClickClose</code> 가 먼저, 그다음 <code>onRequestClose</code> 가
        호출된다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>prop</th>
              <th>기본값</th>
              <th>효과</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>shouldCloseOnBackdrop</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">dim 클릭으로 닫힘 요청</td>
            </tr>
            <tr>
              <td>
                <code>shouldCloseOnEscape</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">ESC 로 닫힘 요청. 최상단일 때만</td>
            </tr>
            <tr>
              <td>
                <code>hasCloseButton</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">
                헤더의 × 버튼. 제목이 없어도 버튼이 있으면 헤더가 렌더된다
              </td>
            </tr>
            <tr>
              <td>
                <code>onExited</code>
              </td>
              <td>—</td>
              <td className="doc-wrap">
                닫힘 애니메이션까지 끝난 뒤. 언마운트 타이밍을 잡을 때
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 없으면 <code>aria-label=&quot;레이어 팝업&quot;</code> 이
          붙는다. <code>dialogLabel</code> 로 바꾼다
        </li>
        <li>
          닫기 버튼의 접근 이름은 <code>closeButtonLabel</code>
          (기본 &quot;팝업 닫기&quot;)이고, 40px 로 보이지만 44px 을 누른다
        </li>
        <li>
          본문 정렬 <code>contentAlign</code> 의 기본은 <code>left</code> 다. 긴
          글은 왼쪽 정렬이 읽기 쉽다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 쌓임 · 모션 감소 등 공통 계약은{" "}
          <Link href="/components/popup">Popup 개요</Link>
        </li>
      </ul>

      <h2>API</h2>
      <h3>LayerPopup</h3>
      <PropsTable of="LayerPopup" />
    </>
  );
}

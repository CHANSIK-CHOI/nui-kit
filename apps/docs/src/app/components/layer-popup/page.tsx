import Link from "next/link";
import { GuideHeader, ExceptionBadges, DesignNote, PropsTable } from "@/components/guide";
import {
  LayerPopupDeclarativeDemo,
  LayerPopupImperativeDemo,
  LayerPopupOptionsDemo,
  LayerPopupFooterDemo,
  LayerPopupCloseDemo,
  LayerPopupStackDemo,
} from "./LayerPopupDemo";
import { PopupSizeDemo } from "./PopupSizeDemo";

export const metadata = { title: "LayerPopup" };

export default function LayerPopupPage() {
  return (
    <>
      <GuideHeader
        title="LayerPopup"
        named={["LayerPopup", "useLayerPopup"]}
        subpath="popup"
      />

      <ExceptionBadges items={[{ kind: "cappedWidth", target: "LayerPopup" }]} />

      <p>
        가운데 뜨는 대화상자다. 제목 · 본문 · 푸터를 갖고 dim 과 <kbd>Esc</kbd>{" "}
        · 닫기 버튼으로 닫힌다. 선언형으로 직접 그리거나{" "}
        <code>useLayerPopup()</code> 으로 연다. 두 길의 차이는{" "}
        <Link href="/components/popup">Popup</Link> 에 있다.
      </p>

      <h2>선언형</h2>
      <p>
        <code>open</code> 을 쓰는 쪽이 갖는다. 컴포넌트는 닫아 달라고{" "}
        <code>onRequestClose</code> 로 요청만 하고, 실제로 <code>open</code> 을
        내리는 것은 쓰는 쪽이다.
      </p>
      <LayerPopupDeclarativeDemo />

      <h2>명령형</h2>
      <p>
        <code>useLayerPopup().open({"{ component }"})</code> 에 내용 컴포넌트를
        넘긴다. <code>PopupHost</code> 가 <code>open</code> ·{" "}
        <code>onRequestClose</code> · <code>onCloseComplete</code> ·{" "}
        <code>isTopmost</code> 를 넣어 렌더하므로 그 넷을 셸에 그대로 넘긴다.
      </p>
      <LayerPopupImperativeDemo />

      <h2>크기</h2>
      <p>
        <code>size</code> 는 폭만 바꾼다. 다섯 중 LayerPopup 만 크기를 받는다.
        BottomSheet 와 FullPopup 은 화면에 맞춰 자기 폭을 갖는다.
      </p>
      <PopupSizeDemo />

      <h2>푸터</h2>
      <p>
        <code>confirmLabel</code> 과 <code>cancelLabel</code> 을 주면 취소(line)
        · 확인(solid) 묶음이 그려진다. 하나만 줘도 된다. <code>onCancel</code>{" "}
        을 생략하면 닫아 달라는 요청으로 처리된다. 확인 · 취소가 아닌 행동을
        놓을 때는 <code>footer</code> 에 <code>ButtonGroup</code> 으로 직접
        그린다. 그때는 5 : 5 다. 둘을 같이 주면 타입이 막는다.
      </p>
      <LayerPopupFooterDemo />

      <h2>본문 정렬 · 아이콘 · 닫기 버튼</h2>
      <p>
        <code>contentAlign</code> 의 기본은 <code>left</code> 다. 짧은 안내 한
        줄이면 <code>center</code> 가 어울린다. <code>icon</code> 을 주면 제목
        위에 놓이고 <code>hasCloseButton={"{false}"}</code> 면 헤더의 × 가
        없어진다.
      </p>
      <LayerPopupOptionsDemo />

      <h2>닫힘</h2>
      <p>
        <code>onRequestClose</code> 는 dim 클릭 · <kbd>Esc</kbd> · 닫기 버튼
        셋에서 불린다. 닫기 버튼만 따로 잡으려면 <code>onClickClose</code> 를
        쓴다. 둘 다 있으면 <code>onClickClose</code> 가 먼저다. 닫힘 모션까지
        끝난 순간은 <code>onCloseComplete</code> 다.
      </p>
      <LayerPopupCloseDemo />

      <h2>겹쳐 열기</h2>
      <p>
        선언형으로 둘을 겹칠 때는 아래쪽에 <code>isTopmost={"{false}"}</code> 를
        준다. 맨 위 팝업만 <kbd>Esc</kbd> 와 포커스 트랩을 처리한다. 명령형은{" "}
        <code>PopupHost</code> 가 계산한다.
      </p>
      <LayerPopupStackDemo />

      <DesignNote title="왜 isTopmost 의 기본이 true 인가">
        <p>
          <code>false</code> 를 기본으로 두면 첫 포커스 이동 · 포커스 트랩 ·{" "}
          <kbd>Esc</kbd> 셋이 조용히 죽는다. 화면도 마우스도 멀쩡해서 키보드
          사용자만 겪는다. 선언형에서 팝업을 하나만 띄우는 대부분의 자리에서
          답은 <code>true</code> 이고, 겹칠 때만 아래쪽이 <code>false</code> 다.
        </p>
      </DesignNote>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 <code>aria-labelledby</code> 로 붙는다. 제목이 없으면{" "}
          <code>dialogLabel</code> 을 준다. 둘 다 없으면 타입이 막는다
        </li>
        <li>
          닫기 버튼의 접근 이름은 <code>closeLabel</code>(기본 「팝업 닫기」)
          이다. 마크업의 마지막이라 첫 포커스는 본문 · 푸터로 간다
        </li>
        <li>본문이 넘치면 위아래에 선이 생겨 더 있음을 알린다</li>
        <li>
          포커스 트랩 · 배경 inert · 쌓임 · 모션 감소는{" "}
          <Link href="/components/popup">Popup</Link> 과 같다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        <code>title</code> 과 <code>dialogLabel</code> 중 하나는 필요하다.
      </p>
      <PropsTable of="LayerPopup" />
    </>
  );
}

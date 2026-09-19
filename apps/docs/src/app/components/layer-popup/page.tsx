import Link from "next/link";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  PropsTable,
} from "@/components/guide";
import {
  LayerPopupOpenDemo,
  LayerPopupFormDemo,
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

      <ExceptionBadges
        items={[{ kind: "cappedWidth", target: "LayerPopup" }]}
      />

      <p>
        가운데 뜨는 대화상자다. 제목 · 본문 · 푸터를 갖고 dim 과 <kbd>Esc</kbd>{" "}
        · 닫기 버튼으로 닫힌다. 팝업을 컴포넌트로 만들고{" "}
        <code>useLayerPopup()</code> 으로 연다. 앱 루트의 <code>PopupHost</code>{" "}
        가 그린다. 설치는 <Link href="/components/popup">Popup</Link> 에 있다.
      </p>

      <h2>컴포넌트를 만들고 훅으로 연다</h2>
      <p>
        팝업 하나가 컴포넌트 하나다. <code>PopupHost</code> 가 <code>id</code> ·{" "}
        <code>open</code> · <code>isTopmost</code> · <code>onRequestClose</code>{" "}
        · <code>onCloseComplete</code> 다섯을 넣어 렌더하므로 그것을{" "}
        <code>LayerPopup</code> 에 그대로 펼친다. 닫기는{" "}
        <code>runtime.onRequestClose</code> 를 부르면 된다. 열림 상태를 쓰는
        쪽이 들고 있을 자리는 없다.
      </p>
      <LayerPopupOpenDemo />
      <LayerPopupFormDemo />

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
        줄이면 <code>center</code> 가 어울린다.{" "}
        <code>hasCloseButton={"{false}"}</code> 면 헤더의 × 가 없어진다.
      </p>
      <p>
        아이콘은 <code>children</code> 에 직접 넣는다. 크기와 색도 넣는 쪽이
        정한다. 본문 순서가 설명 다음이라 아이콘은 설명 아래에 선다 — 제목 바로
        아래에 놓고 싶으면 <Link href="/components/alert">Alert</Link> 이나{" "}
        <Link href="/components/confirm">Confirm</Link> 이 그 자리다.
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
        팝업 안에서 훅을 다시 불러 하나를 더 연다. 나중에 연 것이 위에 오고, 맨
        위 팝업만 <kbd>Esc</kbd> 와 포커스 트랩을 처리한다. 어느 것이 위인지는{" "}
        <code>PopupHost</code> 가 스택 순서로 계산해 <code>isTopmost</code> 에
        넣는다.
      </p>
      <LayerPopupStackDemo />

      <DesignNote title="왜 runtime 다섯을 전부 펼쳐야 하나">
        <p>
          <code>isTopmost</code> 가 빠지면 겹친 팝업 둘이 <kbd>Esc</kbd> 를 함께
          받고, <code>onRequestClose</code> 가 빠지면 dim 과 <kbd>Esc</kbd> 로
          닫히지 않는다. 화면도 마우스도 멀쩡해서 키보드 사용자만 겪는 종류다.
          그래서 다섯이 전부 required 다. 하나라도 빠뜨리면 타입이 잡는다.
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
        <code>title</code> 과 <code>dialogLabel</code> 중 하나는 있어야 한다.
      </p>
      <PropsTable of="LayerPopup" />
    </>
  );
}

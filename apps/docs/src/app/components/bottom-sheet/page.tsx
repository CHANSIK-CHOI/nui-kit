import Link from "next/link";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  BottomSheetOpenDemo,
  BottomSheetDragDemo,
  BottomSheetShareDemo,
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

      <ExceptionBadges
        items={[{ kind: "cappedWidth", target: "BottomSheet" }]}
      />

      <p>
        화면 아래에서 올라오는 시트다. 공유하기 · 정렬 방식처럼 선택지 몇 개를
        고르는 자리에 맞다. 여는 법 · 닫힘 · 접근성은{" "}
        <Link href="/components/layer-popup">LayerPopup</Link> 과 같다. 이
        페이지는 시트에서 달라지는 것만 적는다.
      </p>

      <h2>컴포넌트를 만들고 훅으로 연다</h2>
      <p>
        <code>useBottomSheet().open({"{ component }"})</code>. 시트 안의
        선택지가 <code>runtime.onRequestClose</code> 를 부르면 닫힌다.
      </p>
      <BottomSheetOpenDemo />
      <BottomSheetShareDemo />

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
            <tr>
              <th scope="row">끌어서 닫기</th>
              <td>없다</td>
              <td>
                <code>shouldCloseOnDrag</code> 로 켠다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>본문 정렬 · 닫기 버튼</h2>
      <p>
        <code>contentAlign</code> 의 기본은 <code>left</code> 다.{" "}
        <code>hasCloseButton={"{false}"}</code> 면 헤더의 × 가 없어지고 dim 과{" "}
        <kbd>Esc</kbd>, 그리고 푸터의 취소 버튼으로 닫힌다. 푸터는{" "}
        <code>confirmLabel</code> · <code>cancelLabel</code> 로 그리고, 둘로 안
        되는 자리만 <code>footer</code> 다.
      </p>
      <BottomSheetOptionsDemo />

      <h2>끌어서 닫기</h2>
      <p>
        <code>shouldCloseOnDrag</code> 를 주면 시트 위에 손잡이가 생긴다. 끄는
        면은 <strong>위쪽 44px 띠</strong> 하나다. 그 띠를 아래로 끌면 시트가
        손가락을 따라오고, 놓았을 때 시트 높이의 40% 를 넘게 내려왔거나 빠르게
        튕겼으면 닫힌다. 아니면 제자리로 돌아온다. 기본은 꺼져 있다.
      </p>
      <p>
        제목과 본문은 끄는 면이 아니다. 제목은 긁을 수 있고 본문은 스크롤한다.
        끌어서 닫는 것도 <code>onRequestClose</code> 를 부른다. 그 prop 이
        없으면 끌려도 제자리로 돌아온다. dim 과 <kbd>Esc</kbd> 가 그렇듯 닫는
        주체는 쓰는 쪽이다.
      </p>
      <p>
        <strong>켜면 × 가 기본으로 사라진다.</strong> 손잡이가 닫는 자리라 × 는
        중복이다. 둘을 함께 두려면 <code>hasCloseButton</code> 을 적는다. 막대만
        감추는 <code>hasDragHandle={"{false}"}</code> 도 있는데, 띠는 남아
        끌리지만 끌 수 있다는 것을 알릴 길이 없어져 권하지 않는다.
      </p>
      <BottomSheetDragDemo />

      <DesignNote title="왜 시트만 스프링인가">
        <p>
          시트는 손으로 끌 수 있다. 열릴 때, 끌다 놓았을 때, 끌어서 닫힐 때가 한
          물리로 움직여야 한다. 그래서 다섯 중 시트만 스프링이고 튐은 없다.
          버튼으로 여는 등장이 튀면 어색하고, 끌어서 닫힐 때는 목표가 화면
          밖이라 튐이 되돌아온 것처럼 읽힌다. 끌 수 없는 FullPopup 은 곡선으로
          움직인다.
        </p>
      </DesignNote>

      <DesignNote title="왜 끌어서 닫기가 기본이 아닌가">
        <p>
          이미 배포된 시트에 손잡이가 생기고, dim 과 Esc 를 막아 둔 시트가 끌면
          닫힌다. 켜는 쪽이 고르는 것이 안전하다.
        </p>
      </DesignNote>

      <DesignNote title="왜 끄는 면이 헤더가 아니라 띠인가">
        <p>
          헤더 전체가 끌리면 끄는 면의 크기가 제목 길이에 따라 달라진다. 제목이
          두 줄인 시트는 끄는 면이 두 배다. 끄는 면에는 손가락 조작을 가로채는
          설정이 걸려 있어 제목 글자도 긁히지 않고, 헤더에 버튼을 넣으면
          그때마다 예외 목록에 기대게 된다. 그래서 끄는 면은 위쪽 44px 로 고정돼
          있다. 보이는 막대는 36×4 이고 누르는 범위만 44 다. 닫기 버튼이 40 으로
          보이면서 44 를 누르는 것과 같다.
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
          남는다. 끌기는 그대로 되고, 놓으면 즉시 제자리이거나 즉시 닫힌다
        </li>
        <li>
          끄는 띠는 컨트롤이 아니다. 탭 순서에 없고 스크린리더도 읽지 않는다.
          끌어서 닫기를 켠 시트에서 닫기 버튼 · dim · <kbd>Esc</kbd> 를 전부
          막지 않는다. 드래그를 못 하는 사용자에게 다른 길이 하나는 있어야 한다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 쌓임은{" "}
          <Link href="/components/popup">Popup</Link> 과 같다
        </li>
      </ul>

      <h2>공개 훅</h2>
      <p>
        손잡이 막대의 크기다. 나머지 치수는{" "}
        <Link href="/components/popup">Popup</Link> 의 훅을 따른다.
      </p>
      <HookTable group="bottom-sheet" />

      <h2>API</h2>
      <p>
        <code>LayerPopup</code> 의 prop 에서 <code>size</code> 가 빠지고{" "}
        <code>shouldCloseOnDrag</code> 가 더해진다.
      </p>
      <PropsTable of="BottomSheet" />
    </>
  );
}

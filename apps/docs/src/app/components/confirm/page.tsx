import Link from "next/link";
import { GuideHeader, DesignNote, PropsTable } from "@/components/guide";
import { ConfirmBasicDemo, ConfirmAsyncDemo } from "./ConfirmDemo";

export const metadata = { title: "Confirm" };

export default function ConfirmPage() {
  return (
    <>
      <GuideHeader
        title="Confirm"
        named={["useConfirm", "Confirm"]}
        subpath="popup"
      />

      <p>
        결정을 묻는 팝업이다. 취소와 확인 두 버튼이 출구이고 dim 과{" "}
        <kbd>Esc</kbd> 로는 닫히지 않는다. <code>useConfirm()</code> 으로 열고
        앱 루트의 <code>PopupHost</code> 가 그린다. 설치는{" "}
        <Link href="/components/popup">Popup</Link> 에 있다.
      </p>

      <h2>기본</h2>
      <p>
        <code>confirmLabel</code> 은 그 자리의 행동으로 적는다. 되돌릴 수 없는
        일이면 「삭제」 「탈퇴」처럼 결과가 보이는 동사가 맞다. 「확인」은
        무엇을 확인하는지 말하지 않는다.
      </p>
      <ConfirmBasicDemo />

      <h2>답을 Promise 로 받기</h2>
      <p>
        <code>openAsync</code> 는 선택을 <code>Promise&lt;boolean&gt;</code>{" "}
        으로 준다. 확인이면 <code>true</code>, 취소면 <code>false</code> 다.{" "}
        <code>close()</code> · <code>closeAll()</code> 로 닫혀도{" "}
        <code>false</code> 로 끝나므로 기다리는 쪽이 멈추지 않는다.{" "}
        <code>onConfirm</code> · <code>onCancel</code> 을 함께 주면 그것도
        불린다.
      </p>
      <ConfirmAsyncDemo />

      <h2>옵션</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>옵션</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>icon</code>
              </td>
              <td>주의 아이콘</td>
              <td className="doc-wrap">
                <code>null</code> 이면 아이콘 자리가 없어진다
              </td>
            </tr>
            <tr>
              <td>
                <code>shouldCloseOnConfirm</code> ·{" "}
                <code>shouldCloseOnCancel</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">
                <code>false</code> 면 그 버튼을 눌러도 열려 있다. 처리가 끝난 뒤{" "}
                <code>close()</code> 로 닫는다
              </td>
            </tr>
            <tr>
              <td>
                <code>id</code>
              </td>
              <td>자동 생성</td>
              <td className="doc-wrap">
                <code>close(id)</code> 로 특정 팝업을 닫을 때. 열려 있는 동안
                같은 id 로 다시 열 수 없다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DesignNote title="왜 취소가 왼쪽이고 테두리만 있나">
        <p>
          취소는 <code>line</code>, 확인은 <code>solid</code> 다. 채워진 면이
          「여기를 눌러라」를 말하므로 한 화면에 하나만 두고, 색이 안 보여도
          둘이 구분된다. 순서는 취소가 앞이다. 되돌릴 수 없는 행동에서 손이 먼저
          닿는 자리가 안전한 쪽이어야 한다.
        </p>
      </DesignNote>

      <DesignNote title="왜 dim 과 Esc 로 닫히지 않나">
        <p>
          실수로 닫히면 어느 쪽을 골랐는지 모호해진다. 답을 요구하는 팝업은
          답으로만 닫힌다. Alert 과 같은 이유로 닫기 버튼 · dim · <kbd>Esc</kbd>{" "}
          셋을 함께 막았다.
        </p>
      </DesignNote>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 <code>aria-labelledby</code> 로 붙는다. 제목이 없으면{" "}
          <code>dialogLabel</code> 을 준다. 둘 다 없으면 타입이 막는다
        </li>
        <li>
          열리면 취소 버튼에 포커스가 간다. 닫히면 열기 전 자리로 돌아간다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 모션 감소는{" "}
          <Link href="/components/popup">Popup</Link> 과 같다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        <code>PopupHost</code> 가 렌더하는 컴포넌트다. 훅의 옵션이 곧 이 props
        다. <code>open</code> · <code>id</code> · <code>isTopmost</code> ·{" "}
        <code>onCloseComplete</code> 는 <code>PopupHost</code> 가 넣는다.
      </p>
      <PropsTable of="Confirm" />
    </>
  );
}

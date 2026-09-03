import Link from "next/link";
import { GuideHeader, PropsTable } from "@/components/guide";
import { ConfirmDemo } from "./ConfirmDemo";

export const metadata = { title: "Confirm" };

export default function ConfirmPage() {
  return (
    <>
      <GuideHeader
        title="Confirm"
        named={["useConfirm", "Confirm"]}
        subpath="popup"
      >
        확인과 취소 두 버튼으로 결정을 받는 팝업이다. Alert 과 같이 dim 클릭과
        ESC 로는 닫히지 않는다. 명령형으로만 쓰고, 결과는 콜백 또는 Promise 로
        받는다.
      </GuideHeader>

      <div className="doc-note">
        <code>useConfirm()</code> 은 앱 루트의 <code>PopupHost</code> 가 있어야
        동작한다. 설치는 <Link href="/components/popup">Popup 개요</Link> 에
        있다.
      </div>

      <h2>열기</h2>
      <ConfirmDemo />

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
                <code>title</code> · <code>description</code> ·{" "}
                <code>icon</code>
              </td>
              <td>—</td>
              <td className="doc-wrap">Alert 과 같다</td>
            </tr>
            <tr>
              <td>
                <code>confirmText</code> · <code>cancelText</code>
              </td>
              <td>&quot;확인&quot; · &quot;취소&quot;</td>
              <td className="doc-wrap">
                두 버튼 문구. 되돌릴 수 없는 일이면 &quot;삭제&quot; 처럼 행동을
                그대로 쓴다
              </td>
            </tr>
            <tr>
              <td>
                <code>onConfirm</code> · <code>onCancel</code>
              </td>
              <td>—</td>
              <td className="doc-wrap">
                각 버튼을 눌렀을 때. <code>openAsync</code> 와 함께 써도 둘 다
                호출된다
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
                <code>false</code> 면 그 버튼을 눌러도 열려 있다.{" "}
                <code>close()</code> 로 직접 닫는다
              </td>
            </tr>
            <tr>
              <td>
                <code>id</code>
              </td>
              <td>자동 생성</td>
              <td className="doc-wrap">
                <code>close(id)</code> 로 특정 팝업을 닫을 때
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>closeAll()</code> 과 <code>close()</code> 는{" "}
          <code>openAsync</code> 의 Promise 를 <code>false</code> 로 끝낸다.
        </strong>{" "}
        기다리는 쪽이 영원히 멈추지 않도록 취소로 정리한다.
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 없으면 <code>aria-label=&quot;Confirm 팝업&quot;</code> 이
          붙는다
        </li>
        <li>
          dim 클릭 · ESC 로 닫히지 않는다. 실수로 닫히면 어느 쪽을 골랐는지
          모호해진다
        </li>
        <li>취소는 line, 확인은 solid 버튼이라 색 없이도 구분된다</li>
        <li>
          포커스 트랩 · 배경 inert · 모션 감소 등 공통 계약은{" "}
          <Link href="/components/popup">Popup 개요</Link>
        </li>
      </ul>

      <h2>API</h2>
      <h3>Confirm</h3>
      <p>
        <code>PopupHost</code> 가 렌더하는 컴포넌트다. 훅의 옵션이 곧 이 props
        다.
      </p>
      <PropsTable of="Confirm" />
    </>
  );
}

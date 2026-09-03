import Link from "next/link";
import { GuideHeader, PropsTable } from "@/components/guide";
import { AlertDemo } from "./AlertDemo";

export const metadata = { title: "Alert" };

export default function AlertPage() {
  return (
    <>
      <GuideHeader title="Alert" named={["useAlert", "Alert"]} subpath="popup">
        확인 버튼 하나짜리 알림이다. 사용자에게 선택지가 없으므로 dim 클릭과 ESC
        로는 닫히지 않고, 반드시 확인을 눌러야 한다. 명령형으로만 쓴다.
      </GuideHeader>

      <div className="doc-note">
        <code>useAlert()</code> 는 앱 루트의 <code>PopupHost</code> 가 있어야
        동작한다. 설치는 <Link href="/components/popup">Popup 개요</Link> 에
        있다.
      </div>

      <h2>열기</h2>
      <AlertDemo />

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
                <code>title</code> · <code>description</code>
              </td>
              <td>—</td>
              <td className="doc-wrap">제목과 본문. 둘 다 ReactNode</td>
            </tr>
            <tr>
              <td>
                <code>icon</code>
              </td>
              <td>주의 아이콘</td>
              <td className="doc-wrap">
                <code>null</code> 이면 아이콘 자리를 없앤다
              </td>
            </tr>
            <tr>
              <td>
                <code>confirmText</code>
              </td>
              <td>&quot;확인&quot;</td>
              <td className="doc-wrap">버튼 문구</td>
            </tr>
            <tr>
              <td>
                <code>onConfirm</code>
              </td>
              <td>—</td>
              <td className="doc-wrap">확인을 눌렀을 때</td>
            </tr>
            <tr>
              <td>
                <code>shouldCloseOnConfirm</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">
                <code>false</code> 면 확인을 눌러도 열려 있다.{" "}
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

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 없으면 <code>aria-label=&quot;Alert 팝업&quot;</code> 이 붙는다
        </li>
        <li>
          dim 클릭 · ESC 로 닫히지 않는다. 선택을 요구하는 팝업이 실수로 닫히면
          사용자가 내용을 봤는지 알 수 없기 때문이다
        </li>
        <li>닫기 버튼이 없다. 확인 버튼이 유일한 출구다</li>
        <li>
          포커스 트랩 · 배경 inert · 모션 감소 등 공통 계약은{" "}
          <Link href="/components/popup">Popup 개요</Link>
        </li>
      </ul>

      <h2>API</h2>
      <h3>Alert</h3>
      <p>
        <code>PopupHost</code> 가 렌더하는 컴포넌트다. 직접 그리는 일은 드물고,
        훅의 옵션이 곧 이 props 다.
      </p>
      <PropsTable of="Alert" />
    </>
  );
}

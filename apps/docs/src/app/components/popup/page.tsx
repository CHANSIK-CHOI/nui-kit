import { GuideHeader, HookTable, PropsTable } from "@/components/guide";
import { PopupDemo } from "./PopupDemo";
import { PopupSizeDemo } from "./PopupSizeDemo";

export const metadata = { title: "Popup" };

export default function PopupPage() {
  return (
    <>
      <GuideHeader
        title="Popup"
        named={["Alert", "Confirm", "LayerPopup", "PopupHost"]}
        subpath="popup"
      >
        화면을 덮는 대화상자다. 다섯 종류가 하나의 <code>PopupBase</code> 위에
        올라가며 dim 과 포커스 트랩, Escape, 스크롤 잠금, 배경 inert 를
        공유한다.
      </GuideHeader>

      <h2>두 가지 사용 방식</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>방식</th>
              <th>쓰는 법</th>
              <th>적합한 경우</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>명령형</td>
              <td>
                <code>useAlert()</code> · <code>useConfirm()</code> 등
              </td>
              <td className="doc-wrap">
                코드 흐름 중간에 띄우고 결과를 받아야 할 때
              </td>
            </tr>
            <tr>
              <td>선언형</td>
              <td>
                <code>&lt;LayerPopup open={"{state}"} /&gt;</code>
              </td>
              <td className="doc-wrap">
                열림 상태를 컴포넌트가 직접 소유할 때
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        명령형을 쓰려면 앱 루트를 <code>PopupHost</code> 로 감싸야 한다.
        <pre className="doc-code" style={{ marginTop: 10, marginBottom: 0 }}>
          <code>{`// app/layout.tsx — PopupHost 는 클라이언트 컴포넌트다
"use client";
import { PopupHost } from "@chansikchoi/next-ui/popup";

export function Providers({ children }) {
  return <PopupHost>{children}</PopupHost>;
}`}</code>
        </pre>
      </div>

      <PopupDemo />

      <h2>크기</h2>
      <PopupSizeDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          패널은 <code>role=&quot;dialog&quot;</code> +{" "}
          <code>aria-modal=&quot;true&quot;</code>. 제목이 있으면{" "}
          <code>aria-labelledby</code>, 없으면 <code>dialogLabel</code> 이{" "}
          <code>aria-label</code> 로 붙는다
        </li>
        <li>
          열리면 패널 안 첫 포커스 요소로 이동하고, 닫히면 원래 위치로 복원한다
        </li>
        <li>Tab 이 패널 밖으로 나가지 않는다 (포커스 트랩)</li>
        <li>
          팝업이 겹치면 <strong>최상단 팝업만</strong> ESC·포커스 트랩을
          처리한다
        </li>
        <li>
          열려 있는 동안 배경은 <code>inert</code> + <code>aria-hidden</code> 이
          되고 스크롤이 잠긴다
        </li>
      </ul>

      <div className="doc-note doc-note--warn">
        <strong>Alert · Confirm 은 dim 클릭과 ESC 로 닫히지 않는다.</strong>{" "}
        선택을 요구하는 팝업이 실수로 닫히면 어느 쪽을 골랐는지 모호해지기
        때문이다. 닫으려면 버튼을 눌러야 한다.
      </div>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 브랜드 프리셋을 쓴다.
      </p>
      <HookTable group="popup" />

      <h2>API</h2>
      <h3>PopupBase</h3>
      <p>
        직접 쓰기보다 아래 셸 컴포넌트를 쓴다. 모든 셸이 이 props 를 그대로
        받는다.
      </p>
      <PropsTable of="PopupBase" />
      <h3>Alert</h3>
      <PropsTable of="Alert" />
      <h3>Confirm</h3>
      <PropsTable of="Confirm" />
      <h3>LayerPopup</h3>
      <PropsTable of="LayerPopup" />
    </>
  );
}

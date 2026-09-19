import Link from "next/link";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  PropsTable,
} from "@/components/guide";
import { AlertBasicDemo, AlertOptionsDemo, AlertToneDemo } from "./AlertDemo";

export const metadata = { title: "Alert" };

export default function AlertPage() {
  return (
    <>
      <GuideHeader title="Alert" named={["useAlert"]} subpath="popup" />

      <ExceptionBadges items={[{ kind: "cappedWidth", target: "Alert" }]} />

      <p>
        알리는 팝업이다. 확인 버튼 하나가 유일한 출구라 dim 을 눌러도{" "}
        <kbd>Esc</kbd> 를 눌러도 닫히지 않는다. <code>useAlert()</code> 로 열고
        앱 루트의 <code>PopupHost</code> 가 그린다. 설치는{" "}
        <Link href="/components/popup">Popup</Link> 에 있다.
      </p>

      <h2>기본</h2>
      <AlertBasicDemo />

      <h2>성격 — tone</h2>
      <p>
        무엇을 알리는 팝업인지에 따라 아이콘이 바뀐다. 넷 중 하나를 고르면
        글리프와 선 색이 함께 정해진다. 넷 밖의 임의 아이콘은 넘길 수 없다.
      </p>
      <AlertToneDemo />
      <div className="doc-note">
        아이콘은 <code>aria-hidden</code> 이라 스크린리더가 읽지 않는다. 뜻은
        제목과 설명이 전한다. 넷의 글리프 모양이 서로 달라 색을 구분하지 못해도
        구별된다.
      </div>

      <h2>옵션</h2>
      <p>
        <code>title</code> 이나 <code>dialogLabel</code> 중 하나는 있어야 한다.{" "}
        <code>hasIcon</code> 을 <code>false</code> 로 주면 아이콘 자리가
        없어진다. <code>confirmLabel</code> 은 「확인」 대신 그 자리의 행동으로
        적는다.
      </p>
      <AlertOptionsDemo />
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
                <code>shouldCloseOnConfirm</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td className="doc-wrap">
                <code>false</code> 면 확인을 눌러도 열려 있다. 처리가 끝난 뒤{" "}
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

      <DesignNote title="왜 dim 과 Esc 로 닫히지 않나">
        <p>
          KRDS 가이드 398쪽이 알림 팝업의 닫기 수단을 나눈다. 사용자가 내용을
          봤다는 확인이 필요한 팝업은 실수로 닫히면 봤는지 알 수 없다. 그래서
          닫기 버튼 · dim · <kbd>Esc</kbd> 셋을 함께 막고 확인 버튼만 남긴다. 셋
          중 하나만 열면 「Esc 로만 닫히는 팝업」 같은 어긋난 조합이 생기므로
          따로 열리지 않는다.
        </p>
      </DesignNote>

      <h2>접근성</h2>
      <ul>
        <li>
          제목이 <code>aria-labelledby</code> 로 붙는다. 제목이 없으면{" "}
          <code>dialogLabel</code> 을 준다. 둘 다 없으면 타입이 막는다
        </li>
        <li>
          열리면 확인 버튼에 포커스가 간다. 닫히면 열기 전 자리로 돌아간다
        </li>
        <li>
          포커스 트랩 · 배경 inert · 모션 감소는{" "}
          <Link href="/components/popup">Popup</Link> 과 같다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        <code>useAlert().open()</code> 에 넘기는 옵션이다. 컴포넌트로는 쓰지
        않는다. <code>id</code> 를 주지 않으면 만들어 준다.
      </p>
      <PropsTable of="Alert" />
    </>
  );
}

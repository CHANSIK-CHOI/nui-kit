import Link from "next/link";
import { GuideHeader, HookTable, PropsTable } from "@/components/guide";

export const metadata = { title: "Popup" };

const KINDS = [
  {
    name: "Alert",
    href: "/components/alert",
    desc: "알림. 확인 버튼 하나. dim·ESC 로 닫히지 않는다",
    how: "명령형 useAlert()",
  },
  {
    name: "Confirm",
    href: "/components/confirm",
    desc: "확인·취소. openAsync 로 결과를 Promise 로 받는다",
    how: "명령형 useConfirm()",
  },
  {
    name: "LayerPopup",
    href: "/components/layer-popup",
    desc: "가운데 대화상자. 크기 셋",
    how: "선언형 · 명령형 useLayerPopup()",
  },
  {
    name: "BottomSheet",
    href: "/components/bottom-sheet",
    desc: "아래에서 올라오는 시트",
    how: "선언형 · 명령형 useBottomSheet()",
  },
  {
    name: "FullPopup",
    href: "/components/full-popup",
    desc: "화면 전체를 덮고 오른쪽에서 들어온다",
    how: "선언형 · 명령형 useFullPopup()",
  },
];

export default function PopupPage() {
  return (
    <>
      <GuideHeader
        title="Popup"
        named={["PopupHost", "PopupBase"]}
        subpath="popup"
      >
        화면을 덮는 대화상자 계열이다. 다섯 종류가 하나의 <code>PopupBase</code>{" "}
        위에 올라가며 dim 과 포커스 트랩, Escape, 스크롤 잠금, 배경 inert 를
        공유한다. 이 페이지는 공통 계약만 다루고, 각 종류는 자기 페이지에 있다.
      </GuideHeader>

      <h2>다섯 종류</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>컴포넌트</th>
              <th>무엇</th>
              <th>여는 법</th>
            </tr>
          </thead>
          <tbody>
            {KINDS.map((kind) => (
              <tr key={kind.name}>
                <td>
                  <Link href={kind.href}>
                    <code>{kind.name}</code>
                  </Link>
                </td>
                <td className="doc-wrap">{kind.desc}</td>
                <td className="doc-wrap">{kind.how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                <code>useAlert()</code> · <code>useConfirm()</code> ·{" "}
                <code>useLayerPopup()</code> 등
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
                열림 상태를 컴포넌트가 직접 소유할 때. Alert · Confirm 은
                선언형이 없다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>PopupHost — 명령형의 전제</h2>
      <p>
        명령형 훅은 <code>PopupHost</code> 가 렌더하는 자리에 팝업을 띄운다. 앱
        루트에 한 번만 둔다. 선언형만 쓴다면 필요 없다.
      </p>
      <pre className="doc-code">
        <code>{`// app/providers.tsx — PopupHost 는 클라이언트 컴포넌트다
"use client";
import { PopupHost } from "@chansikchoi/next-ui/popup";

export function Providers({ children }) {
  return <PopupHost>{children}</PopupHost>;
}`}</code>
      </pre>
      <p>
        명령형 훅은 모두 같은 모양이다. <code>open()</code> 으로 열고,{" "}
        <code>close(id?)</code> 는 id 를 주지 않으면 가장 최근에 연 것을 닫고,{" "}
        <code>closeAll()</code> 은 그 종류를 전부 닫는다. 열려 있는 목록도
        돌려준다(<code>alerts</code> · <code>confirms</code> ·{" "}
        <code>layerPopups</code> · <code>bottomSheets</code> ·{" "}
        <code>fullPopups</code>).
      </p>

      <h2>쌓임</h2>
      <p>
        팝업은 나중에 연 것이 위에 온다. 열린 BottomSheet 위에 Alert 을 띄우면
        Alert 이 위다. 겹친 상태에서는 <strong>최상단 팝업만</strong> ESC 와
        포커스 트랩을 처리한다. 명령형은 <code>PopupHost</code> 가{" "}
        <code>isTopmost</code> 를 넣어 주고, 선언형은 소비자가 넘긴다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>
          선언형으로 쓸 때 <code>isTopmost</code> 를 빠뜨리면 ESC 도 포커스
          트랩도 동작하지 않는다.
        </strong>{" "}
        기본값이 <code>false</code> 라 팝업이 자기가 맨 위가 아니라고 여긴다.
        팝업을 하나만 띄운다면 <code>isTopmost</code> 를 그대로 넘긴다.
      </div>

      <h2>접근성 — 다섯 종류가 공유한다</h2>
      <ul>
        <li>
          패널은 <code>role=&quot;dialog&quot;</code> +{" "}
          <code>aria-modal=&quot;true&quot;</code>. 제목이 있으면{" "}
          <code>aria-labelledby</code>, 없으면 <code>dialogLabel</code> 이{" "}
          <code>aria-label</code> 로 붙는다. 종류마다 기본 라벨이 있다
        </li>
        <li>
          열리면 패널 안 첫 포커스 요소로 이동하고, 닫히면 원래 위치로 복원한다
        </li>
        <li>
          닫기 버튼은 마크업의 <strong>가장 마지막</strong>에 있다. 그래서 첫
          포커스가 본문·푸터로 가고, 닫기는 Tab 을 끝까지 눌렀을 때 잡힌다.
          보이는 자리는 그대로 오른쪽 위다
        </li>
        <li>Tab 이 패널 밖으로 나가지 않는다 (포커스 트랩)</li>
        <li>
          열려 있는 동안 배경은 <code>inert</code> + <code>aria-hidden</code> 이
          되고 스크롤이 잠긴다
        </li>
        <li>
          닫기 버튼은 40px 로 보이지만 누르는 범위는 44px 이다. 모양은 그대로
          두고 히트만 넓혔다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 이동·확대 없이 페이드만
          남는다
        </li>
      </ul>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 브랜드 프리셋을 쓴다. 아래 훅은 다섯 종류가
        함께 쓴다.
      </p>
      <HookTable group="popup" />

      <h2>API</h2>
      <h3>PopupBase</h3>
      <p>
        직접 쓰기보다 다섯 셸 컴포넌트를 쓴다. LayerPopup · BottomSheet ·
        FullPopup 은 이 props 를 그대로 받고(<code>variant</code> 는 셸이
        정한다), Alert · Confirm 은 내용에 필요한 것만 받는다.
      </p>
      <PropsTable of="PopupBase" />
    </>
  );
}

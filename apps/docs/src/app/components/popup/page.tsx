import Link from "next/link";
import {
  GuideHeader,
  PropsTable,
  DesignNote,
  HookTable,
} from "@/components/guide";

export const metadata = { title: "Popup" };

const KINDS = [
  {
    name: "Alert",
    href: "/components/alert",
    desc: "알린다. 확인 버튼 하나. 확인을 눌러야만 닫힌다",
    how: "useAlert().open(options)",
  },
  {
    name: "Confirm",
    href: "/components/confirm",
    desc: "결정을 묻는다. 취소 · 확인. 답을 Promise 로 받을 수 있다",
    how: "useConfirm().open(options)",
  },
  {
    name: "LayerPopup",
    href: "/components/layer-popup",
    desc: "가운데 대화상자. 크기 셋",
    how: "컴포넌트 + useLayerPopup().open({ component })",
  },
  {
    name: "BottomSheet",
    href: "/components/bottom-sheet",
    desc: "아래에서 올라오는 시트. 선택지 목록에 맞다",
    how: "컴포넌트 + useBottomSheet().open({ component })",
  },
  {
    name: "FullPopup",
    href: "/components/full-popup",
    desc: "화면 전체를 덮는다. 긴 상세 화면에 맞다",
    how: "컴포넌트 + useFullPopup().open({ component })",
  },
];

export default function PopupPage() {
  return (
    <>
      <GuideHeader
        title="Popup"
        named={["PopupHost", "usePopupStack", "usePopupStore"]}
        subpath="popup"
      />

      <p>
        팝업은 다섯이다. 전부 같은 골격 위에 있어 dim · 포커스 · <kbd>Esc</kbd>{" "}
        · 쌓임을 같은 방식으로 다룬다. 이 페이지는 그 공통 부분과{" "}
        <code>PopupHost</code> 를 적고, 각자의 prop 은 자기 페이지에 있다.
      </p>

      <h2>어느 것을 쓰나</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>컴포넌트</th>
              <th>이럴 때</th>
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

      <h2>여는 법은 하나다</h2>
      <p>
        팝업은 훅으로 연다. <code>Alert</code> 과 <code>Confirm</code> 은 훅에
        넘기는 옵션이 곧 내용이라 컴포넌트가 없다. 나머지 셋은 팝업을 컴포넌트로
        만들고 훅에 등록한다. 열림 상태를 화면 컴포넌트가 들고 있을 자리는 없다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th></th>
              <th>Alert · Confirm</th>
              <th>LayerPopup · BottomSheet · FullPopup</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">쓰는 법</th>
              <td className="doc-wrap">
                <code>useAlert().open({"{ title, description }"})</code>
              </td>
              <td className="doc-wrap">
                <code>useLayerPopup().open({"{ component }"})</code>
              </td>
            </tr>
            <tr>
              <th scope="row">내용은 어디에</th>
              <td className="doc-wrap">훅 옵션</td>
              <td className="doc-wrap">
                등록한 컴포넌트. <code>PopupHost</code> 가 넣는 runtime 다섯을
                셸에 펼친다
              </td>
            </tr>
            <tr>
              <th scope="row">렌더 위치</th>
              <td className="doc-wrap" colSpan={2}>
                <code>body</code> 직계의 portal. <code>PopupHost</code> 가
                만든다
              </td>
            </tr>
            <tr>
              <th scope="row">배경 inert · 스크롤 잠금</th>
              <td className="doc-wrap" colSpan={2}>
                언제나 걸린다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="doc-note">
        <code>PopupHost</code> 밖에서 셸을 직접 렌더하면 그려지지 않는다. 개발
        모드에서는 콘솔에 한 줄이 난다.
      </div>

      <h2>PopupHost</h2>
      <p>
        훅이 쌓은 팝업을 <code>PopupHost</code> 가 그린다. 앱 루트에 한 번만
        둔다. 없으면 팝업이 그려지지 않고 개발 모드에서 콘솔에 한 줄이 난다.
      </p>
      <pre className="doc-code">
        <code>{`// app/providers.tsx — PopupHost 는 클라이언트 컴포넌트다
"use client";
import { PopupHost } from "@nui-kit/react/popup";

export function Providers({ children }) {
  return <PopupHost>{children}</PopupHost>;
}`}</code>
      </pre>

      <h2>훅의 모양</h2>
      <p>
        다섯 훅이 같은 모양이다. <code>open()</code> 은 id 를 돌려주고,{" "}
        <code>close(id?)</code> 는 id 가 없으면 그 종류에서 가장 최근에 연 것을
        닫고, <code>closeAll()</code> 은 그 종류를 전부 닫는다. 열려 있는 목록도
        준다(<code>alerts</code> · <code>confirms</code> ·{" "}
        <code>layerPopups</code> · <code>bottomSheets</code> ·{" "}
        <code>fullPopups</code>).
      </p>
      <pre className="doc-code">
        <code>{`const layerPopup = useLayerPopup();

const id = layerPopup.open({ component: ProfilePopup });
layerPopup.close(id);      // 이것만
layerPopup.close();        // 가장 최근 것
layerPopup.closeAll();     // LayerPopup 전부`}</code>
      </pre>
      <div className="doc-note doc-note--warn">
        <code>id</code> 를 직접 주면 같은 id 로 두 번 열 수 없다. 열려 있는 동안
        다시 열면 에러가 난다. 같은 팝업을 다시 띄우려면 먼저 닫는다.
      </div>

      <h3>스택을 직접 읽기</h3>
      <p>
        <code>usePopupStack()</code> 은 종류를 가리지 않고 열린 팝업 전부를{" "}
        <code>{"{ id, type, status }"}</code> 배열로 준다. 「팝업이 하나라도 떠
        있나」를 알 때 쓴다. <code>usePopupStore</code> 는 그 아래의 zustand
        스토어라 <code>closeAll()</code> 처럼 종류를 가리지 않는 조작이 필요할
        때만 쓴다.
      </p>
      <pre className="doc-code">
        <code>{`const stack = usePopupStack();
const hasPopup = stack.length > 0;

const closeEverything = usePopupStore((s) => s.closeAll);`}</code>
      </pre>

      <h2>쌓임</h2>
      <p>
        나중에 연 것이 위에 온다. 열린 BottomSheet 위에 Alert 을 띄우면 Alert 이
        위다. 겹친 상태에서는 맨 위 팝업만 <kbd>Esc</kbd> 와 포커스 트랩을
        처리한다. 어느 것이 위인지는 <code>PopupHost</code> 가 스택 순서로
        계산해 <code>isTopmost</code> 에 넣는다.
      </p>

      <h2>접근성</h2>
      <ul>
        <li>
          패널은 <code>role=&quot;dialog&quot;</code> +{" "}
          <code>aria-modal=&quot;true&quot;</code>. 이름은 <code>title</code> 이{" "}
          <code>aria-labelledby</code> 로, 제목이 없으면{" "}
          <code>dialogLabel</code> 이 <code>aria-label</code> 로 붙는다. 둘 중
          하나는 타입이 요구한다
        </li>
        <li>
          열리면 패널 안 첫 포커스 요소로 가고, 닫히면 열기 전 자리로 돌아간다.{" "}
          <kbd>Tab</kbd> 은 패널 밖으로 나가지 않는다
        </li>
        <li>
          닫기 버튼은 마크업의 마지막에 있다. 첫 포커스가 본문 · 푸터로 가고,
          닫기는 <kbd>Tab</kbd> 을 끝까지 눌렀을 때 잡힌다. 보이는 자리는 오른쪽
          위다. 40px 로 보이지만 44px 을 누른다
        </li>
        <li>
          열려 있는 동안 배경은 <code>inert</code> + <code>aria-hidden</code> 이
          되고 스크롤이 잠긴다. 토스트 · 툴팁 · 로딩 알림은 격리에서 빠진다.
          팝업 안에서 띄운 것도 눌리고 읽혀야 한다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 이동 · 확대 없이 페이드만
          남는다
        </li>
      </ul>

      <DesignNote title="왜 기본 접근 이름을 두지 않나">
        <p>
          예전에는 셸마다 「레이어 팝업」 같은 기본 이름이 있었다. 타입이
          통과하니 이름을 붙일 이유가 없었고, 스크린리더는 서로 다른 팝업 다섯을
          같은 이름으로 읽었다. 그 사실은 화면에 드러나지 않는다. 그래서{" "}
          <code>title</code> 이나 <code>dialogLabel</code> 중 하나를 타입이
          요구한다.
        </p>
      </DesignNote>

      <DesignNote title="왜 닫기 버튼이 마크업의 마지막인가">
        <p>
          KRDS 가이드 397쪽이 정한다. 팝업을 열자마자 첫 포커스가 닫기 버튼에
          가면 스크린리더 사용자는 내용을 듣기 전에 「닫기」부터 듣는다. 본문과
          행동 버튼을 먼저 지나고 닫기가 마지막에 오게 순서를 두고, 보이는
          자리만 CSS 로 오른쪽 위에 고정한다.
        </p>
      </DesignNote>

      <DesignNote title="왜 dim 이 패널보다 먼저 앉나">
        <p>
          dim 은 전환이 아니라 「뒤는 이제 못 만진다」는 상태 선언이라 100ms 로
          먼저 깔린다. 패널과 같은 속도로 움직이면 둘이 동시에 움직여 눈이
          갈린다. 닫힐 때는 패널과 같이 걷힌다. dim 이 먼저 걷히면 패널이 밝은
          배경 위에 잠깐 뜬다.
        </p>
      </DesignNote>

      <DesignNote title="왜 본문 스크롤 경계가 선인가">
        <p>
          본문이 넘치면 위아래에 1px 선이 생긴다. 위는 「위로 더 있다」, 아래는
          「아래로 더 있다」다. 그라디언트로 흐리게 하는 대신 선을 쓴 것은 이
          라이브러리가 깊이를 표면색 · 그림자 · 선 셋으로만 표현하기 때문이다.
          선은 <code>border</code> 가 아니라 안쪽 그림자라 생겨도 글이 밀리지
          않는다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        아래 변수는 다섯이 함께 쓴다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="popup" />

      <h2>API</h2>
      <h3>PopupHost</h3>
      <PropsTable of="PopupHost" />
    </>
  );
}

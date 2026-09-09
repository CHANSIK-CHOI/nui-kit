import Link from "next/link";
import {
  GuideHeader,
  DesignNote,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  ToastBasicDemo,
  ToastActionDemo,
  ToastDurationDemo,
  ToastQueueDemo,
  ToastDeclarativeDemo,
} from "./ToastDemo";

export const metadata = { title: "Toast" };

export default function ToastPage() {
  return (
    <>
      <GuideHeader
        title="Toast"
        named={["useToast", "ToastHost", "Toast", "useToastStack"]}
        subpath="toast"
      />

      <p>
        화면 아래에 잠깐 떴다 사라지는 알림이다. <code>useToast()</code> 로 열고
        앱 루트의 <code>ToastHost</code> 가 그린다. 한 번에 하나만 보이고
        나머지는 차례를 기다린다.
      </p>
      <pre className="doc-code">
        <code>{`// app/providers.tsx — ToastHost 는 클라이언트 컴포넌트다
"use client";
import { ToastHost } from "@nui-kit/react/toast";

export function Providers({ children }) {
  return <ToastHost>{children}</ToastHost>;
}

// 어디서든
const toast = useToast();
toast.open({ message: "저장했어요" });`}</code>
      </pre>
      <div className="doc-note doc-note--warn">
        <code>ToastHost</code> 가 없으면 <code>open()</code> 이 쌓기만 하고
        아무것도 그려지지 않는다. 에러도 나지 않는다.
      </div>

      <h2>기본</h2>
      <p>
        <code>tone</code> 은 셋이다. <code>default</code> 는 「무슨 일이
        있었다」, <code>success</code> 는 「됐다」, <code>error</code> 는
        「잘못됐다」다. 성공과 에러에는 아이콘이 함께 붙는다.
      </p>
      <ToastBasicDemo />
      <div className="doc-note">
        문구는 명사 + 동사의 긍정문으로 적는다. 「업로드를 완료했어요」가 맞고
        「실패하지 않았어요」는 읽는 사람이 한 번 뒤집어야 한다. 한 문장이면
        마침표를 찍지 않는다.
      </div>

      <DesignNote title="왜 tone 이 배경을 바꾸지 않나">
        <p>
          tone 은 접두 아이콘의 색만 바꾼다. 표면까지 갈아끼우면 그 표면에 맞는
          글자색을 따로 관리해야 하고 테마가 둘이면 네 조합이 된다. 실제로 에러
          토스트가 배경을 통째로 바꾸던 때 다크에서 어두운 배경 위 어두운 글자로
          대비가 1.14:1 이었다. 반전 표면 위의 색은 두 테마 모두 AA 를 넘는
          7단계에서 고른다.
        </p>
      </DesignNote>

      <h2>액션과 닫기 버튼</h2>
      <p>
        <code>action</code> 은 하나다. 라벨은 「되돌리기」 「목록 보기」처럼
        행동 동사이고, 누르면 실행되고 토스트가 닫힌다. 닫기 버튼은{" "}
        <code>closable</code> 로 켜고 접근 이름은 <code>closeLabel</code>(기본
        「닫기」)로 바꾼다.
      </p>
      <ToastActionDemo />

      <h2>시간</h2>
      <p>
        <code>duration</code> 의 기본은 4000ms 다. 0 이하면 저절로 닫히지
        않는다. 마우스가 올라가 있거나 포커스가 안에 있거나 탭이 숨어 있으면
        시간이 멈추고, 돌아오면 남은 시간부터 다시 간다.
      </p>
      <ToastDurationDemo />
      <div className="doc-note">
        저절로 닫히지 않는 토스트에는 <code>closable</code> 을 켜거나{" "}
        <code>action</code> 을 둔다. 출구가 없으면 뒤에 줄 선 토스트가 영영
        기다린다.
      </div>

      <h2>한 번에 하나</h2>
      <p>
        여러 개를 열면 앞의 것이 사라진 뒤 다음 것이 올라온다.{" "}
        <code>close(id?)</code> 는 id 가 없으면 지금 보이는 것을 닫고,{" "}
        <code>closeAll()</code> 은 기다리는 것까지 전부 비운다. 열려 있는 목록은{" "}
        <code>toasts</code> 로 준다.
      </p>
      <ToastQueueDemo />

      <DesignNote title="왜 한 번에 하나만 그리나">
        <p>
          토스트는 라이브 리전이라 여럿이 동시에 있으면 스크린리더 낭독이
          겹친다. 쌓이면 화면 아래가 덮이기도 한다. 그래서 차례를 기다리는 것은
          DOM 에 없고 맨 앞 하나만 그린다. SEED 의 Snackbar 도 같은 방식이다.
        </p>
      </DesignNote>

      <h2>선언형</h2>
      <p>
        <code>Toast</code> 를 직접 그릴 수도 있다. <code>open</code> 을 쓰는
        쪽이 갖고 <code>onRequestClose</code> 로 닫아 달라는 요청을 받는다.
        제자리에 그려지므로 화면 구석에 띄우는 일은 <code>ToastHost</code> 가
        맡는다. 열림 · 닫힘 모션이 끝난 순간은 <code>onOpenComplete</code> ·{" "}
        <code>onCloseComplete</code> 다.
      </p>
      <ToastDeclarativeDemo />

      <h3>스택을 직접 읽기</h3>
      <p>
        <code>useToastStack()</code> 은 열린 토스트 전부를{" "}
        <code>{"{ id, status, tone }"}</code> 배열로 준다. <code>status</code>{" "}
        는 <code>queued</code> · <code>open</code> · <code>closing</code>{" "}
        셋이다.
      </p>
      <pre className="doc-code">
        <code>{`const toasts = useToastStack();
const isShowing = toasts.some((t) => t.status === "open");`}</code>
      </pre>

      <h2>접근성</h2>
      <ul>
        <li>
          <code>default</code> · <code>success</code> 는{" "}
          <code>role=&quot;status&quot;</code> +{" "}
          <code>aria-live=&quot;polite&quot;</code> 라 읽던 것을 끊지 않는다.{" "}
          <code>error</code> 는 <code>role=&quot;alert&quot;</code> +{" "}
          <code>assertive</code> 라 즉시 읽힌다
        </li>
        <li>
          포커스를 가져가지 않는다. 꼭 읽혀야 하는 내용을 띄우려면{" "}
          <Link href="/components/alert">Alert</Link> 을 쓴다. 사라지면 놓친다
        </li>
        <li>
          토스트 레이어는 뒤 화면 조작을 막지 않는다. 카드만 클릭을 받는다
        </li>
        <li>
          시간이 멈추는 것은 마우스 hover 에서다. 터치는 hover 가 끝나는 순간을
          알 수 없어 멈추지 않는다. 터치 사용자에게는 액션과 닫기 버튼이 있다
        </li>
        <li>메시지는 두 줄까지 보이고 넘치면 말줄임이 된다</li>
      </ul>

      <DesignNote title="왜 표면에 테두리가 없나">
        <p>
          토스트는 반전 표면이다. 라이트에서는 검정, 다크에서는 밝은 회색이라 떠
          있는 것의 반투명 링이 양쪽에서 자기 배경에 녹는다. 그래서 그림자만
          쓰고 다크에서는 위쪽 1px 을 밝게 해 모서리가 빛을 받게 한다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        폭과 모서리는 열려 있다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
        테두리가 없는 컴포넌트라 두께 변수도 없다.
      </p>
      <HookTable group="toast" />

      <h2>API</h2>
      <p>
        <code>toast.open()</code> 의 옵션은 아래 표에서 <code>open</code> ·{" "}
        <code>onRequestClose</code> 를 뺀 것에 <code>id</code> 를 더한 것이다.
        그 둘은 <code>ToastHost</code> 가 넣는다.
      </p>
      <PropsTable of="Toast" />
    </>
  );
}

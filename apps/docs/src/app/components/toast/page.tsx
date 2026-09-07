import {
  GuideHeader,
  Case,
  CaseGrid,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { ToastDemo } from "./ToastDemo";

export const metadata = { title: "Toast" };

export default function ToastPage() {
  return (
    <>
      <GuideHeader
        title="Toast"
        named={["Toast", "ToastHost", "useToast"]}
        subpath="toast"
      >
        잠깐 떴다 사라지는 알림이다. 사용자의 행동을 요구하지 않는다. 결정을
        요구한다면 <code>Confirm</code> 을 쓴다.
      </GuideHeader>

      <pre className="doc-code">
        <code>{`// app/layout.tsx 를 ToastHost 로 감싼 뒤
const toast = useToast();
toast.open({ message: "저장되었습니다." });`}</code>
      </pre>

      <ToastDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          <code>tone=&quot;default&quot;</code> →{" "}
          <code>role=&quot;status&quot;</code> +{" "}
          <code>aria-live=&quot;polite&quot;</code> — 읽던 것을 끊지 않는다
        </li>
        <li>
          <code>tone=&quot;success&quot;</code> 는 <code>default</code> 와 같은{" "}
          <code>polite</code> 다 — 좋은 소식이 읽던 것을 끊을 이유가 없다
        </li>
        <li>
          <code>tone=&quot;error&quot;</code> →{" "}
          <code>role=&quot;alert&quot;</code> +{" "}
          <code>aria-live=&quot;assertive&quot;</code> — 즉시 읽힌다
        </li>
        <li>
          <strong>읽는 동안은 시간이 멈춘다</strong> — 마우스가 올라가 있거나,
          포커스가 안에 있거나, 탭이 숨어 있으면 자동으로 닫히지 않는다 (WCAG
          2.2.1). <code>closable</code> 과 무관하게 항상 동작한다
        </li>
        <li>
          토스트 레이어는 <code>pointer-events: none</code> 이라 뒤 화면 조작을
          막지 않는다. 카드 자체만 클릭을 받는다
        </li>
      </ul>

      <div className="doc-note doc-note--warn">
        토스트는 <strong>포커스를 가져가지 않는다.</strong> 반드시 읽혀야 하는
        내용이라면 토스트 대신 <code>Alert</code> 을 쓴다 — 사라져 버리면
        놓친다.
      </div>

      <h2>문구와 액션</h2>
      <ul>
        <li>
          <strong>명사 + 동사, 긍정문</strong>으로 쓴다 — &ldquo;업로드를
          완료했어요&rdquo;. &ldquo;실패하지 않았어요&rdquo;는 읽는 사람이 한 번
          뒤집어야 한다
        </li>
        <li>한 문장이면 마침표를 찍지 않고, 두 문장 이상이면 전부 찍는다</li>
        <li>
          <strong>액션은 하나뿐</strong>이다. 사라지는 것에 두 개를 담지 않는다.
          라벨은 행동 동사로 — &ldquo;되돌리기&rdquo; · &ldquo;목록보기&rdquo;
        </li>
        <li>액션을 누르면 실행하고 토스트가 닫힌다</li>
      </ul>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 배경만 바꾸면 글자가 따라오지 않아 대비가
        깨진다. <code>className</code> 으로 배경과 글자를 함께 지정한다.
      </p>
      <p>
        Toast 는 <code>border</code> 를 쓰지 않으므로 두께 변수도 없다 — 안 쓰는
        변수는 죽은 토큰이 된다.
      </p>
      <HookTable group="toast" />

      <h2>API</h2>
      <PropsTable of="Toast" />
    </>
  );
}

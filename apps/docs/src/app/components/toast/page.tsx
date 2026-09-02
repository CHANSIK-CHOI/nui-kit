import { HookTable } from "@/components/guide";
import { PropsTable } from "@/components/guide";
import { ToastDemo } from "./ToastDemo";

export const metadata = { title: "Toast" };

export default function ToastPage() {
  return (
    <>
      <h1>Toast</h1>
      <p className="doc-lead">
        작업 결과를 잠깐 알린다. 사용자의 행동을 요구하지 않고 시간이 지나면
        스스로 사라진다. <strong>결정을 요구한다면 Confirm</strong> 을 쓴다.
      </p>

      <pre className="doc-code">
        <code>{`// app/layout.tsx 를 ToastHost 로 감싼 뒤
import { useToast } from "@chansikchoi/next-ui/toast";

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
          <code>tone=&quot;error&quot;</code> →{" "}
          <code>role=&quot;alert&quot;</code> +{" "}
          <code>aria-live=&quot;assertive&quot;</code> — 즉시 읽힌다
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

      <h2>커스터마이징</h2>
      <p>
        <strong>색은 컴포넌트별로 열지 않는다.</strong> 배경만 바꾸면 글자가
        따라오지 않아 대비가 깨진다. 톤을 바꾸려면{" "}
        <code>--nui-layer-inverse</code> 를 덮거나 <code>className</code> 으로
        배경과 글자를 함께 지정한다.
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

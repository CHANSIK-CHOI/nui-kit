import { HookTable } from "@/components/guide";
import { PropsTable } from "@/components/guide";
import { TooltipDemo } from "./TooltipDemo";

export const metadata = { title: "Tooltip" };

export default function TooltipPage() {
  return (
    <>
      <h1>Tooltip</h1>
      <p className="doc-lead">
        트리거에 hover 하거나 포커스하면 짧은 설명을 띄운다. 트리거 옆에
        붙으므로 <strong>portal 을 쓰지 않는다</strong>.
      </p>

      <pre className="doc-code">
        <code>{`import { Tooltip } from "@chansikchoi/next-ui";

<Tooltip content="삭제한 항목은 되돌릴 수 없습니다">
  <IconButton aria-label="삭제"><DelIcon /></IconButton>
</Tooltip>`}</code>
      </pre>

      <TooltipDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          열려 있는 동안 트리거에 <code>aria-describedby</code> 가 연결된다 —
          마우스를 쓰지 않는 사용자도 내용을 들을 수 있다
        </li>
        <li>
          hover 뿐 아니라 <strong>포커스로도 열린다</strong> (키보드 사용자)
        </li>
        <li>ESC 로 닫힌다</li>
        <li>
          버블은 <code>role=&quot;tooltip&quot;</code> 이다
        </li>
      </ul>

      <div className="doc-note doc-note--warn">
        <strong>툴팁에 중요한 정보를 담지 않는다.</strong> 터치 기기에서는 hover
        가 없어 열기 어렵고, 사라지면 다시 볼 방법이 마땅치 않다. 꼭 필요한
        설명은 <code>Field.Description</code> 으로 화면에 남긴다.
      </div>

      <div className="doc-note">
        portal 이 아니라 트리거 옆에 <code>absolute</code> 로 붙는다. 조상에{" "}
        <code>overflow: hidden</code> 이 있으면 잘릴 수 있다.
      </div>

      <h2>커스터마이징</h2>
      <p>
        <strong>색은 컴포넌트별로 열지 않는다.</strong> 버블과 화살표는{" "}
        <code>--nui-layer-inverse</code> 를 함께 쓴다. 하나만 바꾸면 화살표가
        따로 논다.
      </p>
      <HookTable group="tooltip" />

      <h2>API</h2>
      <PropsTable of="Tooltip" />
    </>
  );
}

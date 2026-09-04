import { GuideHeader, HookTable, PropsTable } from "@/components/guide";
import { TooltipDemo } from "./TooltipDemo";

export const metadata = { title: "Tooltip" };

export default function TooltipPage() {
  return (
    <>
      <GuideHeader title="Tooltip" named={["Tooltip"]} subpath="tooltip">
        요소에 붙는 짧은 설명이다. 기본은 트리거 옆에 붙고,{" "}
        <code>hasPortal</code> 로 <code>body</code> 로 내보낼 수 있다.
      </GuideHeader>

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
          <strong>터치에서는 탭으로 열고 닫는다</strong> (KRDS 가이드 659 ·
          662쪽). 바깥을 탭해도 닫힌다. 탭은 트리거의 원래 동작을 막지 않으므로
          아이콘 버튼이면 버튼도 함께 눌린다
        </li>
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
        기본은 트리거 옆 <code>absolute</code> 라 조상에{" "}
        <code>overflow: hidden</code> 이 있으면 잘린다. <code>hasPortal</code> 을
        켜면 <code>body</code> 로 나가 잘리지 않고, 스크롤·리사이즈를 따라간다.{" "}
        <strong>
          잘림만 없앤다 — 뷰포트 밖으로 밀리는 것은 그대로다.
        </strong>{" "}
        화면 가장자리에서는 <code>placement</code> 를 골라야 한다.
      </div>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 한 곳만 바꾸려면 <code>className</code>{" "}
        을, 화면 전체를 바꾸려면 브랜드 프리셋을 쓴다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>className</code> 으로 배경을 바꿀 때는{" "}
        <strong>버블과 화살표를 함께</strong> 바꾼다. 둘이 같은 색을 쓰므로
        하나만 바꾸면 화살표가 따로 논다.
      </div>
      <HookTable group="tooltip" />

      <h2>API</h2>
      <PropsTable of="Tooltip" />
    </>
  );
}

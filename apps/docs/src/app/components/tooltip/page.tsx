import Link from "next/link";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  TooltipBasicDemo,
  TooltipPlacementDemo,
  TooltipDelayDemo,
  TooltipControlDemo,
  TooltipPortalDemo,
  TooltipDisabledDemo,
} from "./TooltipDemo";

export const metadata = { title: "Tooltip" };

export default function TooltipPage() {
  return (
    <>
      <GuideHeader title="Tooltip" named={["Tooltip"]} subpath="tooltip" />

      <ExceptionBadges items={[{ kind: "contentWidth", target: "Tooltip" }]} />

      <p>
        요소 위에 잠깐 뜨는 짧은 설명이다. 감싼 요소에 마우스를 올리거나
        포커스하면 열리고, 떠나면 닫힌다. 아이콘만 있는 버튼의 이름을 눈으로
        보여줄 때 맞다.
      </p>

      <h2>기본</h2>
      <TooltipBasicDemo />
      <div className="doc-note doc-note--warn">
        툴팁은 중요한 정보를 담기에 알맞지 않다. 터치 기기에서는 hover 가 없어
        열기 어렵고 사라지면 다시 볼 방법이 마땅치 않다. 꼭 필요한 설명은{" "}
        <code>Field.Description</code> 으로 화면에 남긴다.
      </div>

      <h2>위치</h2>
      <p>
        <code>placement</code> 여섯. 위 · 아래 × 왼쪽 · 가운데 · 오른쪽이고
        기본은 <code>topCenter</code> 다. 화면 가장자리에서는 반대쪽을 고른다.
        뷰포트 밖으로 밀리는 것을 스스로 피하지는 않는다.
      </p>
      <TooltipPlacementDemo />

      <h2>지연</h2>
      <p>
        마우스로 열 때는 <code>openDelay</code>(기본 400ms) 뒤에 열리고 떠난 뒤{" "}
        <code>closeDelay</code>(기본 100ms) 뒤에 닫힌다. 포커스와 터치 탭은
        즉시다. 열린 툴팁을 떠나 300ms 안에 이웃에 닿으면 지연 없이 바로 뜬다.
        툴바를 쓸며 지나갈 때 하나만 기다리고 나머지는 따라온다.
      </p>
      <TooltipDelayDemo />

      <DesignNote title="왜 400 과 100 인가">
        <p>
          포인터가 스치는 순간 열리면 툴바를 가로지를 때 툴팁이 줄줄이 뜬다.
          실측으로 버튼 하나를 지나는 데 11ms 였다. 400ms 는 「멈춰서 보고
          있다」를 가르는 시간이다. 닫힘의 100ms 는 툴팁 위로 마우스를 옮길
          시간이고 WCAG 1.4.13 이 요구한다. 이웃이 즉시 뜨는 것은 이미 툴팁을
          보고 있는 사람에게 다시 기다리게 하지 않기 위해서다. 그때는 모션도
          없다. 지연 없이 뜨는데 모션이 남으면 그 모션이 지연처럼 느껴진다.
        </p>
      </DesignNote>

      <h2>제어</h2>
      <p>
        <code>open</code> 을 주면 열림을 쓰는 쪽이 갖는다. 온보딩 안내처럼 hover
        와 무관하게 띄울 때 쓴다. 처음만 열어 두려면 <code>defaultOpen</code>,
        열림이 바뀌는 것을 알려면 <code>onOpenChange</code> 다.
      </p>
      <TooltipControlDemo />

      <h2>잘리는 부모에서</h2>
      <p>
        말풍선은 감싼 요소 옆에 제자리로 뜬다. 조상에{" "}
        <code>overflow: hidden</code> 이 있으면 잘린다. <code>hasPortal</code>{" "}
        을 켜면 <code>body</code> 로 나가 잘리지 않고 스크롤과 창 크기를
        따라간다. <code>Select</code> · <code>Datepicker</code> 의 같은 이름
        prop 과 한 규칙이다.
      </p>
      <TooltipPortalDemo />

      <h2>비활성</h2>
      <p>
        <code>disabled</code> 면 열리지 않고 열려 있던 것도 닫힌다. 감싼 요소는
        그대로 동작한다.
      </p>
      <TooltipDisabledDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          열려 있는 동안 감싼 요소에 <code>aria-describedby</code> 가 연결되고
          말풍선은 <code>role=&quot;tooltip&quot;</code> 이다
        </li>
        <li>
          hover 뿐 아니라 포커스로도 열린다. 감싼 요소가 포커스를 받지 못하면{" "}
          <code>tabIndex={"{0}"}</code> 을 준다
        </li>
        <li>
          <kbd>Esc</kbd> 로 닫힌다
        </li>
        <li>
          터치에서는 탭으로 열고 닫는다. 바깥을 탭해도 닫힌다. 탭은 감싼 요소의
          원래 동작을 막지 않으므로 아이콘 버튼이면 버튼도 함께 눌린다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 자라지 않고 페이드만 남는다
        </li>
      </ul>

      <DesignNote title="왜 감싼 요소에서 자라나나">
        <p>
          팝오버 · 드롭다운 · 툴팁은 자기를 연 것에서 커진다. 원점이 없으면
          중앙에서 커져 어디서 나왔는지가 사라진다. 세로는 감싼 요소 쪽 모서리,
          가로는 화살표가 가리키는 점이다. 그 점이 나타나는 시작점이어야 눈이
          화살표와 말풍선을 한 덩어리로 읽는다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        폭 상한과 모서리가 열려 있다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>className</code> 으로 배경을 바꿀 때는 말풍선과 화살표를 함께
        바꾼다. 둘이 같은 색을 쓰므로 하나만 바꾸면 화살표가 따로 논다.
      </div>
      <HookTable group="tooltip" />

      <h2>API</h2>
      <PropsTable of="Tooltip" />
    </>
  );
}

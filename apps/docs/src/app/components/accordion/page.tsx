import Link from "next/link";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  HookTable,
  PropsTable,
} from "@/components/guide";
import {
  AccordionAxesDemo,
  AccordionToggleDemo,
  AccordionIndexDemo,
  AccordionHeadingDemo,
  AccordionStateDemo,
  AccordionControlDemo,
  AccordionKeepMountedDemo,
} from "./AccordionDemo";

export const metadata = { title: "Accordion" };

export default function AccordionPage() {
  return (
    <>
      <GuideHeader
        title="Accordion"
        named={[
          "Accordion",
          "AccordionItem",
          "AccordionHead",
          "AccordionButton",
          "AccordionPanel",
        ]}
        subpath="accordion"
      />

      <ExceptionBadges items={[{ kind: "rsc", target: "Accordion" }]} />

      <p>
        항목을 접고 펴는 목록이다. 루트 아래에 <code>Item</code> 을 두고 그 안에
        헤더와 <code>Panel</code> 을 넣는다. 자리 번호는 <code>Item</code> 의{" "}
        <code>index</code> 하나다.
      </p>
      <pre className="doc-code">
        <code>{`<Accordion type="single">
  <Accordion.Item index={0}>
    <Accordion.Button>
      <Accordion.Head>배송은 얼마나 걸리나요?</Accordion.Head>
    </Accordion.Button>
    <Accordion.Panel>영업일 2~3일이 걸립니다.</Accordion.Panel>
  </Accordion.Item>
</Accordion>`}</code>
      </pre>

      <h2>기본</h2>
      <p>
        <code>type</code> 은 <code>multiple</code>(기본)이면 여러 개가 함께
        열리고 <code>single</code> 이면 하나를 열면 다른 것이 닫힌다.{" "}
        <code>variant</code> 는 <code>box</code>(기본)가 목록 전체를 카드
        하나로, <code>line</code> 이 구분선만으로, <code>separated</code> 가
        항목마다 카드로 그린다. 항목마다 독립돼 보여야 하거나 항목의 중요도가
        같으면 <code>separated</code> 를 쓴다.
      </p>
      <AccordionAxesDemo />
      <div className="doc-note">
        <code>single</code> 에 <code>defaultActiveIndices</code> 를 여럿 주면 첫
        것만 열린다.
      </div>

      <h2>토글 자리</h2>
      <p>
        헤더 전체를 버튼으로 만드는 모드와 화살표만 버튼으로 만드는 모드가 있다.
        헤더 안에 체크박스처럼 다른 조작 요소를 두려면 화살표만 버튼인 모드를
        쓴다.
      </p>
      <AccordionToggleDemo />
      <div className="doc-note doc-note--warn">
        <code>Head</code> 에 <code>buttonIndex</code> 를 줬으면{" "}
        <code>Button</code> 으로 감싸지 않는다. 둘 중 하나다.
      </div>

      <DesignNote title="왜 둘을 겹치면 안 되나">
        <p>
          <code>buttonIndex</code> 를 받은 <code>Head</code> 는 스스로 버튼을
          그린다. 그것을 <code>Button</code> 으로 다시 감싸면 버튼 안에 버튼이
          되어 HTML 이 허용하지 않는 구조가 되고, 서버가 만든 마크업과
          브라우저가 고친 마크업이 달라 하이드레이션이 깨진다. 헤더에 다른 조작
          요소를 두는 것도 같은 이유로 화살표만 버튼일 때만 된다.
        </p>
      </DesignNote>

      <h2>자리 번호</h2>
      <p>
        <code>Button</code> 과 <code>Panel</code> 은 감싼 <code>Item</code> 에서{" "}
        <code>index</code> 를 받아 간다. 직접 줄 수도 있고, 그때는 준 값이
        이긴다. <code>Item</code> 밖에 두면서 <code>index</code> 도 빼면 콘솔에
        메시지가 뜬다.
      </p>
      <AccordionIndexDemo />
      <div className="doc-note">
        <code>Head</code> 의 <code>buttonIndex</code> 는 자리 번호가 아니라 모드
        스위치다. 주면 화살표만 버튼이 되고, 안 주면 화살표는 장식이다.
      </div>

      <h2>제목의 heading 수준</h2>
      <p>
        <code>headingLevel</code> 을 주면 제목이 그 수준의 heading 안에
        들어간다. 헤더 전체가 버튼이면 <code>h2</code>~<code>h6</code> 가 버튼을
        감싸고, 화살표만 버튼이면 제목 상자가 그 태그가 된다. 안 주면 heading 을
        만들지 않는다. 페이지의 제목 계층은 쓰는 쪽이 안다.
      </p>
      <AccordionHeadingDemo />
      <div className="doc-note">
        받는 값은 <code>2</code>~<code>6</code> 이다. 페이지의 <code>h1</code>{" "}
        은 아코디언 바깥에 있다.
      </div>
      <div className="doc-note doc-note--warn">
        앱이 <code>h2</code>~<code>h6</code> 에 여백을 주고 있으면 그 여백이
        여기에도 온다. 라이브러리 스타일은 레이어 안이라 앱의 태그 규칙에 진다.
        항목 사이가 벌어지면 그 규칙에서 <code>.nui-accordion__heading</code> 과{" "}
        <code>.nui-accordion__title-box</code> 를 뺀다.
      </div>

      <h2>상태</h2>
      <p>
        <code>disabled</code> 는 헤더 전체가 버튼인 모드의 <code>Button</code>{" "}
        에 준다. 화살표만 버튼인 모드에서 제목이 없으면 <code>toggleLabel</code>{" "}
        로 접근 이름을 준다. 제목이 있으면 그것이 이름이다.
      </p>
      <AccordionStateDemo />

      <DesignNote title="왜 disabled 가 글자와 화살표 색만 바꾸나">
        <p>
          헤더는 배경이 없는 버튼이라 바꿀 면이 없다. 투명도로 흐리게 하는 대신
          색으로만 표현한다. 투명도를 곱하면 그 조합에서 맞춰 둔 대비 계산이
          무효가 된다.
        </p>
      </DesignNote>

      <h2>제어</h2>
      <p>
        <code>activeIndices</code> 를 주면 열림을 쓰는 쪽이 갖고{" "}
        <code>onChange</code> 로 다음 값을 받는다. 항목 하나가 눌린 것만 알려면{" "}
        <code>Button</code> 의 <code>onClick(index, event)</code> 다.
      </p>
      <AccordionControlDemo />

      <h2>내용을 DOM 에 남기기</h2>
      <p>
        닫힌 패널은 DOM 에서 빠진다. <code>shouldKeepMounted</code> 를 주면
        닫혀도 남아, 폼 입력값을 잃지 않아야 하거나 브라우저 검색에 걸려야 할 때
        쓴다. 남아 있어도 닫힌 동안은 <kbd>Tab</kbd> 에 잡히지 않는다.
      </p>
      <AccordionKeepMountedDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          토글 버튼에 <code>aria-expanded</code> 와 <code>aria-controls</code>{" "}
          가 붙는다. 패널이 DOM 에 없을 때는 <code>aria-controls</code> 도 없다
        </li>
        <li>
          패널은 <code>role=&quot;region&quot;</code> 이고{" "}
          <code>aria-labelledby</code> 로 자기 버튼과 이어진다
        </li>
        <li>
          화살표만 버튼일 때 그 버튼은 36px 로 보이고 44px 을 누른다. 헤더
          전체가 버튼일 때는 헤더가 곧 누르는 범위다
        </li>
        <li>
          <code>headingLevel</code> 을 주면 제목이 heading 으로 나가
          스크린리더의 제목 목록에 잡힌다. 한 항목에 heading 은 하나다
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서는 펼침이 움직이지 않고 바로
          나타난다
        </li>
      </ul>

      <DesignNote title="왜 펼침만 다른 곡선을 쓰나">
        <p>
          다른 모션은 <code>transform</code> 과 <code>opacity</code> 만
          움직이는데 펼침은 <code>height</code> 가 변한다. 높이가 늘면 매 프레임
          아래 요소를 밀어내므로 초반이 가파른 곡선을 쓰면 튄다. 62px 패널을
          250ms 로 열 때 프레임당 최대 증분이 등장 곡선은 15px, 여기 쓰는 곡선은
          8px 이다. 그래서 이 라이브러리에서 유일하게 크기를 움직이는 자리이고
          시간도 250ms 로 짧다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        간격 · 모서리 · 선 두께는 열려 있다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="accordion" />

      <h2>API</h2>
      <h3>Accordion</h3>
      <PropsTable of="Accordion" />
      <h3>Accordion.Item</h3>
      <PropsTable of="Accordion.Item" />
      <h3>Accordion.Head</h3>
      <PropsTable of="Accordion.Head" />
      <h3>Accordion.Button</h3>
      <PropsTable of="Accordion.Button" />
      <h3>Accordion.Panel</h3>
      <PropsTable of="Accordion.Panel" />
    </>
  );
}

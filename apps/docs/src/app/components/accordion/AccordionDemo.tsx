"use client";

import { useState } from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Field,
  Textfield,
  type AccordionType,
  type AccordionVariant,
} from "@nui-kit/react";
import { Case, CaseGrid, Example } from "@/components/guide";

const FAQ = [
  {
    title: "배송은 얼마나 걸리나요?",
    body: "주문일 기준 영업일 2~3일이 걸립니다. 도서 · 산간 지역은 하루가 더 걸릴 수 있습니다.",
  },
  {
    title: "교환 · 반품이 되나요?",
    body: "수령 후 7일 안에 신청할 수 있습니다. 사용 흔적이 있으면 제한될 수 있습니다.",
  },
  {
    title: "영수증은 어디서 보나요?",
    body: "마이페이지의 주문 내역에서 건별로 내려받을 수 있습니다.",
  },
];

/** 헤더 전체가 버튼 */
function WholeHeaderItems({ count = FAQ.length }: { count?: number }) {
  return FAQ.slice(0, count).map((item, index) => (
    <Accordion.Item key={item.title} index={index}>
      <Accordion.Button index={index}>
        <Accordion.Head>{item.title}</Accordion.Head>
      </Accordion.Button>
      <Accordion.Panel index={index}>{item.body}</Accordion.Panel>
    </Accordion.Item>
  ));
}

/** 헤더 전체가 버튼 · index 는 Item 에만 */
function CompactItems({ count = FAQ.length }: { count?: number }) {
  return FAQ.slice(0, count).map((item, index) => (
    <Accordion.Item key={item.title} index={index}>
      <Accordion.Button>
        <Accordion.Head>{item.title}</Accordion.Head>
      </Accordion.Button>
      <Accordion.Panel>{item.body}</Accordion.Panel>
    </Accordion.Item>
  ));
}

/** 화살표만 버튼 · index 는 Item 에만 */
function ArrowOnlyItems({ count = FAQ.length }: { count?: number }) {
  return FAQ.slice(0, count).map((item, index) => (
    <Accordion.Item key={item.title} index={index}>
      <Accordion.Head buttonIndex={index}>{item.title}</Accordion.Head>
      <Accordion.Panel>{item.body}</Accordion.Panel>
    </Accordion.Item>
  ));
}

const AXES: [AccordionType, AccordionVariant][] = [
  ["multiple", "box"],
  ["single", "box"],
  ["multiple", "line"],
  ["single", "line"],
  ["multiple", "separated"],
  ["single", "separated"],
];

export function AccordionAxesDemo() {
  return (
    <CaseGrid
      columns={2}
      caption="type × variant. 전부 처음 두 항목을 열어 두었다"
      code={`<Accordion type="single" variant="line" defaultActiveIndices={[0]}>…</Accordion>`}
    >
      {AXES.map(([type, variant]) => (
        <Case
          key={`${type}-${variant}`}
          label={`${type} · ${variant}`}
          note={type === "single" ? "첫 것만 열린다" : undefined}
        >
          <Accordion
            type={type}
            variant={variant}
            defaultActiveIndices={[0, 1]}
          >
            <WholeHeaderItems />
          </Accordion>
        </Case>
      ))}
    </CaseGrid>
  );
}

export function AccordionToggleDemo() {
  return (
    <CaseGrid
      columns={2}
      code={`// 헤더 전체
<Accordion.Button index={0}>
  <Accordion.Head>제목</Accordion.Head>
</Accordion.Button>

// 화살표만
<Accordion.Head buttonIndex={0}>
  <Checkbox /> 제목
</Accordion.Head>`}
    >
      <Case label="Button 으로 감싼다" note="헤더 전체가 눌린다">
        <Accordion type="single" defaultActiveIndices={[0]}>
          <WholeHeaderItems count={2} />
        </Accordion>
      </Case>
      <Case label="Head buttonIndex" note="화살표만 눌린다">
        <Accordion type="single">
          {FAQ.slice(0, 2).map((item, index) => (
            <Accordion.Item key={item.title} index={index}>
              <Accordion.Head buttonIndex={index}>
                <label
                  className="doc-demo-label"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Checkbox />
                  {item.title}
                </label>
              </Accordion.Head>
              <Accordion.Panel index={index}>{item.body}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Case>
    </CaseGrid>
  );
}

export function AccordionIndexDemo() {
  return (
    <CaseGrid
      columns={2}
      caption="둘의 화면과 동작이 같다"
      code={`// Item 에만
<Accordion.Item index={0}>
  <Accordion.Button>
    <Accordion.Head>제목</Accordion.Head>
  </Accordion.Button>
  <Accordion.Panel>본문</Accordion.Panel>
</Accordion.Item>

// 세 곳 모두 — 명시한 값이 이긴다
<Accordion.Item index={0}>
  <Accordion.Button index={0}>…</Accordion.Button>
  <Accordion.Panel index={0}>본문</Accordion.Panel>
</Accordion.Item>`}
    >
      <Case label="Item 에만" note="Button · Panel 은 비운다">
        <Accordion type="single" defaultActiveIndices={[0]}>
          <CompactItems count={2} />
        </Accordion>
      </Case>
      <Case label="세 곳 모두" note="명시한 값이 이긴다">
        <Accordion type="single" defaultActiveIndices={[0]}>
          <WholeHeaderItems count={2} />
        </Accordion>
      </Case>
    </CaseGrid>
  );
}

export function AccordionHeadingDemo() {
  return (
    <CaseGrid
      columns={2}
      caption="첫 칸과 둘째 칸의 높이 · 제목 크기가 같다"
      code={`<Accordion headingLevel={3}>…</Accordion>`}
    >
      <Case label="주지 않는다 (기본)" note="heading 요소가 없다">
        <Accordion type="single" defaultActiveIndices={[0]}>
          <CompactItems count={2} />
        </Accordion>
      </Case>
      <Case label="headingLevel={3} · 헤더 전체" note="h3 가 버튼을 감싼다">
        <Accordion type="single" defaultActiveIndices={[0]} headingLevel={3}>
          <CompactItems count={2} />
        </Accordion>
      </Case>
      <Case label="headingLevel={3} · 화살표만" note="제목 상자가 h3 다">
        <Accordion type="single" defaultActiveIndices={[0]} headingLevel={3}>
          <ArrowOnlyItems count={2} />
        </Accordion>
      </Case>
      <Case
        label="headingLevel={3} · separated"
        note="hover 면이 항목 모서리를 따른다"
      >
        <Accordion
          type="single"
          variant="separated"
          defaultActiveIndices={[0]}
          headingLevel={3}
        >
          <CompactItems count={2} />
        </Accordion>
      </Case>
      <Case label="제목이 없으면" note="heading 을 만들지 않는다">
        <Accordion type="single" headingLevel={3}>
          <Accordion.Item index={0}>
            <Accordion.Head buttonIndex={0} toggleLabel="배송 안내 펼치기" />
            <Accordion.Panel>{FAQ[0]?.body}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Case>
    </CaseGrid>
  );
}

export function AccordionStateDemo() {
  return (
    <CaseGrid
      columns={2}
      code={`<Accordion.Button index={1} disabled>…</Accordion.Button>
<Accordion.Head buttonIndex={0} toggleLabel="배송 안내 펼치기" />`}
    >
      <Case label="disabled" note="글자와 화살표 색만 바뀐다">
        <Accordion type="single">
          <Accordion.Item index={0}>
            <Accordion.Button index={0}>
              <Accordion.Head>열 수 있는 항목</Accordion.Head>
            </Accordion.Button>
            <Accordion.Panel index={0}>펼쳐진 내용입니다.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item index={1}>
            <Accordion.Button index={1} disabled>
              <Accordion.Head>비활성 항목</Accordion.Head>
            </Accordion.Button>
            <Accordion.Panel index={1}>열리지 않습니다.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Case>
      <Case label="toggleLabel" note="제목이 없을 때의 접근 이름">
        <Accordion type="single">
          <Accordion.Item index={0}>
            <Accordion.Head buttonIndex={0} toggleLabel="배송 안내 펼치기" />
            <Accordion.Panel index={0}>{FAQ[0]?.body}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Case>
    </CaseGrid>
  );
}

export function AccordionControlDemo() {
  const [activeIndices, setActiveIndices] = useState<number[]>([0]);
  const [lastClicked, setLastClicked] = useState<number | null>(null);

  return (
    <Example
      row={false}
      caption="activeIndices · onChange · Button 의 onClick"
      code={`<Accordion activeIndices={indices} onChange={setIndices}>
  <Accordion.Button index={0} onClick={(index) => track(index)}>…</Accordion.Button>
</Accordion>`}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="line"
          onClick={() => setActiveIndices([0, 1, 2])}
        >
          전부 열기
        </Button>
        <Button
          size="small"
          variant="line"
          onClick={() => setActiveIndices([])}
        >
          전부 닫기
        </Button>
        {lastClicked !== null ? (
          <span style={{ fontSize: "var(--nui-font-size-2)" }}>
            마지막으로 누른 항목 {lastClicked}
          </span>
        ) : null}
      </div>
      <Accordion activeIndices={activeIndices} onChange={setActiveIndices}>
        {FAQ.map((item, index) => (
          <Accordion.Item key={item.title} index={index}>
            <Accordion.Button
              index={index}
              onClick={(clicked) => setLastClicked(clicked)}
            >
              <Accordion.Head>{item.title}</Accordion.Head>
            </Accordion.Button>
            <Accordion.Panel index={index}>{item.body}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Example>
  );
}

export function AccordionKeepMountedDemo() {
  return (
    <Example
      row={false}
      caption="접었다 펴도 입력값이 남는다"
      code={`<Accordion shouldKeepMounted type="single">…</Accordion>`}
    >
      <Accordion shouldKeepMounted type="single" defaultActiveIndices={[0]}>
        <Accordion.Item index={0}>
          <Accordion.Head buttonIndex={0}>배송지</Accordion.Head>
          <Accordion.Panel index={0}>
            <Field>
              <Field.Label>받는 분</Field.Label>
              <Textfield placeholder="홍길동" autoComplete="name" />
            </Field>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item index={1}>
          <Accordion.Head buttonIndex={1}>결제 수단</Accordion.Head>
          <Accordion.Panel index={1}>
            <Field>
              <Field.Label>카드 번호</Field.Label>
              <Textfield placeholder="0000-0000-0000-0000" />
            </Field>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Example>
  );
}

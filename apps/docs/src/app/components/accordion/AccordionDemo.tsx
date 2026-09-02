"use client";

import { useState } from "react";
import { Accordion, Button, Field, Textfield } from "@chansikchoi/next-ui";
import { Example } from "@/components/guide";

const FAQ = [
  {
    title: "배송은 얼마나 걸리나요?",
    body: "주문일 기준 영업일 2~3일이 소요됩니다. 도서·산간 지역은 하루가 더 걸릴 수 있습니다.",
  },
  {
    title: "교환·반품이 가능한가요?",
    body: "수령 후 7일 이내에 신청할 수 있습니다. 사용 흔적이 있는 경우 제한될 수 있습니다.",
  },
  {
    title: "영수증은 어디서 확인하나요?",
    body: "마이페이지 > 주문 내역에서 건별로 내려받을 수 있습니다.",
  },
];

/** 모드 A — 헤더 전체가 토글 버튼. Head 에 buttonIndex 를 주지 않는다. */
function WholeHeaderItems() {
  return FAQ.map((item, index) => (
    <Accordion.Item key={item.title} index={index}>
      <Accordion.Button index={index}>
        <Accordion.Head>{item.title}</Accordion.Head>
      </Accordion.Button>
      <Accordion.Panel index={index}>{item.body}</Accordion.Panel>
    </Accordion.Item>
  ));
}

export function AccordionDemo() {
  const [activeIndices, setActiveIndices] = useState<number[]>([0]);

  return (
    <>
      <h2>단일 · 다중</h2>
      <p>
        <code>type=&quot;single&quot;</code> 은 하나만 열리고, 기본값{" "}
        <code>&quot;multiple&quot;</code> 은 여러 개를 동시에 열 수 있다.
      </p>
      <Example
        row={false}
        caption='type="single" — 하나를 열면 다른 하나가 닫힌다'
      >
        <Accordion type="single" defaultActiveIndices={[0]}>
          <WholeHeaderItems />
        </Accordion>
      </Example>

      <Example row={false} caption='type="multiple" (기본) — 여러 개 동시에'>
        <Accordion defaultActiveIndices={[0, 1]}>
          <WholeHeaderItems />
        </Accordion>
      </Example>

      <h2>토글 영역 — 두 가지 모드</h2>
      <p>
        헤더 전체를 버튼으로 만들지, 화살표 아이콘만 버튼으로 만들지 고른다.
        헤더 안에 체크박스처럼 다른 조작 요소를 둔다면 반드시 아이콘만 버튼으로
        해야 한다 — <strong>버튼 안에 버튼을 넣을 수 없기 때문</strong>이다.
      </p>
      <Example row={false} caption="모드 A — 헤더 전체가 버튼">
        <Accordion type="single" defaultActiveIndices={[0]}>
          <WholeHeaderItems />
        </Accordion>
      </Example>
      <Example
        row={false}
        caption="모드 B — 화살표 아이콘만 버튼 (Head 에 buttonIndex)"
      >
        <Accordion type="single">
          {FAQ.slice(0, 2).map((item, index) => (
            <Accordion.Item key={item.title} index={index}>
              <Accordion.Head buttonIndex={index}>{item.title}</Accordion.Head>
              <Accordion.Panel index={index}>{item.body}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Example>

      <h2>변형</h2>
      <Example row={false} caption='variant="line" — 카드 대신 구분선'>
        <Accordion variant="line" type="single">
          <WholeHeaderItems />
        </Accordion>
      </Example>

      <h2>제어 모드</h2>
      <p>
        <code>activeIndices</code> 를 주면 열림 상태를 소비자가 소유한다.
      </p>
      <Example row={false} caption="activeIndices + onChange">
        <div
          style={{ display: "flex", gap: 8, marginBottom: 12, maxWidth: 320 }}
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
        </div>
        <Accordion activeIndices={activeIndices} onChange={setActiveIndices}>
          <WholeHeaderItems />
        </Accordion>
      </Example>

      <h2>내용을 DOM 에 남기기</h2>
      <p>
        <code>shouldKeepMounted</code> 를 주면 닫혀도 패널이 DOM 에 남는다. 폼
        입력값을 잃지 않아야 하거나, 브라우저 검색(Ctrl+F)에 걸려야 할 때 쓴다.
      </p>
      <Example
        row={false}
        caption="shouldKeepMounted — 접었다 펴도 입력값이 유지된다"
      >
        <Accordion shouldKeepMounted type="single" defaultActiveIndices={[0]}>
          <Accordion.Item index={0}>
            <Accordion.Head buttonIndex={0}>배송지 정보</Accordion.Head>
            <Accordion.Panel index={0}>
              <Field>
                <Field.Label>받는 분</Field.Label>
                <Textfield placeholder="입력 후 접었다 펴보세요" />
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
    </>
  );
}

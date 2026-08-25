import { PropsTable } from "@/components/PropsTable";
import { AccordionDemo } from "./AccordionDemo";

export const metadata = { title: "Accordion" };

export default function AccordionPage() {
  return (
    <>
      <h1>Accordion</h1>
      <p className="doc-lead">
        긴 내용을 접어 목록을 훑기 쉽게 만든다. 항목은 <code>index</code> 로
        식별하며, <code>Head</code> · <code>Panel</code> 이 같은 index 를 공유해
        서로 연결된다.
      </p>

      <pre className="doc-code">
        <code>{`import { Accordion } from "@chansikchoi/next-ui";

<Accordion type="single">
  <Accordion.Item index={0}>
    <Accordion.Head buttonIndex={0}>제목</Accordion.Head>
    <Accordion.Panel index={0}>내용</Accordion.Panel>
  </Accordion.Item>
</Accordion>`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>토글 영역은 둘 중 하나만 고른다.</strong>{" "}
        <code>Accordion.Head</code> 에 <code>buttonIndex</code> 를 주면 Head 가{" "}
        <em>스스로 버튼을 렌더</em>한다. 그 Head 를 다시{" "}
        <code>Accordion.Button</code> 으로 감싸면{" "}
        <strong>버튼 안에 버튼</strong> 이 되어 하이드레이션이 깨진다.
        <pre className="doc-code" style={{ marginTop: 10, marginBottom: 0 }}>
          <code>{`// ✅ 모드 A — 헤더 전체가 버튼
<Accordion.Button index={0}>
  <Accordion.Head>제목</Accordion.Head>
</Accordion.Button>

// ✅ 모드 B — 화살표 아이콘만 버튼
//    헤더에 체크박스 등 다른 조작 요소가 있을 때
<Accordion.Head buttonIndex={0}>제목</Accordion.Head>

// ❌ 둘을 겹치면 button 안에 button
<Accordion.Button index={0}>
  <Accordion.Head buttonIndex={0}>제목</Accordion.Head>
</Accordion.Button>`}</code>
        </pre>
      </div>

      <div className="doc-note">
        이 페이지의 예제는 Client Component 라 <code>Accordion.Item</code>{" "}
        표기를 쓴다. Server Component 에서는 <code>AccordionItem</code> 같은
        named export 를 쓴다.
      </div>

      <AccordionDemo />

      <h2>접근성</h2>
      <ul>
        <li>
          토글 버튼에 <code>aria-expanded</code> 와 <code>aria-controls</code>{" "}
          가 붙는다
        </li>
        <li>
          패널은 <code>role=&quot;region&quot;</code> +{" "}
          <code>aria-labelledby</code> 로 자기 버튼과 연결된다
        </li>
        <li>
          <code>Head</code> 에 제목이 있으면 그것이 버튼의 접근 이름이 된다 (
          <code>aria-labelledby</code>). 없으면 대체 텍스트를 붙인다
        </li>
        <li>
          패널이 DOM 에 없을 때는 <code>aria-controls</code> 를 생략한다 —
          존재하지 않는 id 를 가리키지 않도록
        </li>
        <li>
          <code>prefers-reduced-motion</code> 에서 펼침 애니메이션이 꺼진다
        </li>
      </ul>

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

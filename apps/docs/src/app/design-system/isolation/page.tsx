import Link from "next/link";
import { DesignNote } from "@/components/guide";

export const metadata = { title: "프로젝트를 오염시키지 않는다" };

const DOT_NOTATION = [
  ["Field.Item", "FieldItem"],
  ["Field.Grid", "FieldGrid"],
  ["Field.Label", "FieldLabel"],
  ["Field.Description", "FieldDescription"],
  ["Field.Message", "FieldMessage"],
  ["Accordion.Item", "AccordionItem"],
  ["Accordion.Head", "AccordionHead"],
  ["Accordion.Button", "AccordionButton"],
  ["Accordion.Panel", "AccordionPanel"],
  ["ButtonGroup.Item", "ButtonGroupItem"],
] as const;

export default function IsolationPage() {
  return (
    <>
      <h1>프로젝트를 오염시키지 않는다</h1>

      <p>
        이 라이브러리의 1원칙이다.{" "}
        <strong>설치해도 기존 화면이 달라지지 않는다.</strong> 아래 넷이 그
        하나를 위해 있다.
      </p>

      <h2>1. 프로젝트 CSS 가 라이브러리 CSS 를 이긴다</h2>
      <p>
        라이브러리 CSS 는 전부 <code>@layer nui.*</code> 안에 있다. Cascade 는
        상세도보다 레이어를 먼저 보므로, 레이어 밖에 있는 프로젝트의 선언이 항상
        우선한다. <code>!important</code> 를 쓸 일이 없다.
      </p>
      <pre className="doc-code">
        <code>{`/* 클래스 하나로 덮인다 — 상세도를 올리지 않아도 된다 */
.my-button { border-radius: 0; }`}</code>
      </pre>
      <div className="doc-note">
        프로젝트도 <code>@layer</code> 를 쓴다면 순서를 직접 정한다. 선언한
        레이어끼리는 먼저 나온 쪽이 약하다.
      </div>

      <h2>2. 클래스 이름이 부딪히지 않는다</h2>
      <p>
        컴포넌트가 붙이는 class 는 전부 <code>nui-</code> 로 시작하고, CSS
        변수는 <code>--nui-</code> 로 시작한다. 프로젝트에 같은 이름이 있을 수
        없다.
      </p>
      <pre className="doc-code">
        <code>{`<button class="nui-button nui-button--primary">`}</code>
      </pre>

      <h2>3. reset 을 깔지 않는다</h2>
      <p>
        전역 reset 은 배포에 들어 있지 않다. 깔면 우리가 건드리지 않은 요소의
        모양까지 바뀐다. 대신{" "}
        <strong>컴포넌트가 자기 안에서만 정규화한다</strong> — 브라우저가{" "}
        <code>input</code> 이나 <code>button</code> 에 주는 기본 글꼴 · 여백 ·
        테두리를 자기 셀렉터 안에서 끈다.
      </p>
      <p>reset 이 필요하면 따로 불러온다. 넣을지는 프로젝트가 정한다.</p>
      <pre className="doc-code">
        <code>{`import "@nui-kit/react/styles/preflight.css";   // 원할 때만`}</code>
      </pre>

      <h2>4. 전부 클라이언트 컴포넌트다</h2>
      <p>
        모든 컴포넌트가 <code>&quot;use client&quot;</code> 로 배포된다. Server
        Component 안에서 쓸 수는 있지만,{" "}
        <strong>
          <code>Field.Label</code> 같은 dot notation 대신 named export 를 쓴다.
        </strong>
      </p>
      <pre className="doc-code">
        <code>{`// ❌ Server Component — 렌더할 때 Element type is invalid
<Field.Label>이름</Field.Label>

// ✅ named export
import { FieldLabel } from "@nui-kit/react";
<FieldLabel>이름</FieldLabel>`}</code>
      </pre>
      <div className="doc-note doc-note--warn">
        <strong>타입 검사와 빌드는 통과한다.</strong> 렌더할 때만 터지므로
        Server Component 에서는 처음부터 named export 를 쓰는 편이 안전하다.
        Client Component 안에서는 dot notation 이 그대로 동작한다.
      </div>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>dot notation</th>
              <th>named export</th>
            </tr>
          </thead>
          <tbody>
            {DOT_NOTATION.map(([dot, named]) => (
              <tr key={dot}>
                <th scope="row">
                  <code>{dot}</code>
                </th>
                <td>
                  <code>{named}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DesignNote title="왜 dot notation 이 서버에서 깨지나">
        <p>
          Server Component 가 클라이언트 모듈을 import 하면 React 는 실제 함수
          대신 <strong>client reference 프록시</strong>를 넘긴다. 그 프록시에서
          정적 프로퍼티는 <code>undefined</code> 로 읽힌다 — <code>Field</code>{" "}
          는 프록시로 살아 있는데 <code>Field.Label</code> 만 사라지는 이유다.
        </p>
        <p>
          타입 시스템은 원본 모듈의 타입을 보므로 통과하고, 번들러도 모듈을
          찾았으니 통과한다. 실제로 값을 읽는 렌더 시점에만 드러난다.
        </p>
      </DesignNote>

      <h2>검사로 지킨다</h2>
      <p>
        위 넷은 빌드된 CSS 를 기계가 훑어 확인한다. 프리픽스가 빠진 클래스,
        레이어 밖으로 새어 나간 선언, 태그 셀렉터가 하나라도 있으면 빌드가
        멈춘다.
      </p>
      <p>
        무엇을 바꿀 수 있는지는{" "}
        <Link href="/foundations/customizing">커스터마이징</Link> 에 있다.
      </p>
    </>
  );
}

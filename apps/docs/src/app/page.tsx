import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>nui-kit</h1>
      <p className="doc-lead">
        Next.js App Router 용 React 컴포넌트 라이브러리. 폼, 팝업, 달력, 선택
        컨트롤을 제공한다.
      </p>

      <h2>설치</h2>
      <pre className="doc-code">
        <code>npm install @nui-kit/react</code>
      </pre>
      <p>
        peer dependency 는 <code>react</code> 와 <code>react-dom</code>{" "}
        둘뿐이다. <code>next</code> 는 <code>ButtonLink</code>,{" "}
        <code>react-hook-form</code> 은 RHF 래퍼에서만 쓰이며 둘 다{" "}
        <code>optional</code> 로 선언되어 있다.
      </p>
      <pre className="doc-code">
        <code>{`import "@nui-kit/react/styles/index.css";
import { Button } from "@nui-kit/react";

export default function Page() {
  return <Button color="primary">저장</Button>;
}`}</code>
      </pre>

      <h2>쓰기 전에 알아둘 세 가지</h2>

      <h3>1. 프로젝트 CSS 가 라이브러리 CSS 를 이긴다</h3>
      <p>
        라이브러리 CSS 는 전부 <code>@layer nui.*</code> 안에 있다. Cascade 는
        상세도보다 레이어를 먼저 보므로 레이어 밖 선언이 항상 우선한다.{" "}
        <code>!important</code> 없이 덮어쓴다.
      </p>
      <pre className="doc-code">
        <code>{`.my-button { border-radius: 0; }`}</code>
      </pre>

      <h3>2. 클래스 충돌이 없다</h3>
      <p>
        컴포넌트의 class 는 전부 <code>nui-</code> 로 구성되어 충돌을 피한다.
        reset 도 기본 배포에 넣지 않았다.
      </p>

      <h3>3. 전부 클라이언트 컴포넌트다</h3>
      <p>
        모든 컴포넌트가 <code>&quot;use client&quot;</code> 로 배포된다. Server
        Component 에서 dot notation 은 <code>undefined</code> 가 되므로 named
        export 를 쓴다. <Link href="/get-started">설치와 사용</Link> 참조.
      </p>

      <h2>어디로 가면 되나</h2>
      <ul>
        <li>
          <Link href="/get-started">설치와 사용</Link> — 스타일 불러오기,
          서브패스, Server Component 주의점
        </li>
        <li>
          <Link href="/brand-colors">브랜드 색 고르기</Link> — 준비된 185색 중
          하나를 고르면 화면 전체 색이 바뀐다
        </li>
        <li>
          <Link href="/foundations">Foundations</Link> — 쓸 수 있는 값과 바꿀 수
          있는 자리
        </li>
        <li>
          <Link href="/components">Components</Link> — 컴포넌트별 예제와 props
          표
        </li>
      </ul>

      <p className="doc-note">props 표와 토큰 표는 코드에서 자동 생성한다.</p>
    </>
  );
}

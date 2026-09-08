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
        peer dependency 는 <code>react</code> · <code>react-dom</code> ·{" "}
        <code>next</code> 셋이다. <code>next</code> 는{" "}
        <code>ButtonLink</code> 가 <code>next/link</code> 를 쓰고 그것이 배럴로
        나가므로 필수다. <code>react-hook-form</code> 만{" "}
        <code>optional</code> 이고 RHF 래퍼를 쓸 때 설치한다.
      </p>
      <pre className="doc-code">
        <code>{`import "@nui-kit/react/styles/index.css";
import { Button } from "@nui-kit/react";

export default function Page() {
  return <Button color="primary">저장</Button>;
}`}</code>
      </pre>

      <h2>설치해도 기존 화면이 달라지지 않는다</h2>
      <p>
        라이브러리 CSS 는 전부 <code>@layer nui.*</code> 안에 있어 프로젝트
        CSS 가 항상 이기고, 클래스는 <code>nui-</code> 로 시작해 부딪히지
        않으며, 전역 reset 을 깔지 않는다.{" "}
        <Link href="/design-system/isolation">오염시키지 않는다</Link> 참조.
      </p>
      <pre className="doc-code">
        <code>{`.my-button { border-radius: 0; }   /* !important 없이 덮인다 */`}</code>
      </pre>

      <h2>어디로 가면 되나</h2>
      <ul>
        <li>
          <Link href="/get-started">설치와 사용</Link> — 스타일 불러오기와
          서브패스
        </li>
        <li>
          <Link href="/design-system">디자인 시스템</Link> — 무엇을 토대로
          만들었나, 무엇을 바꿀 수 있나
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

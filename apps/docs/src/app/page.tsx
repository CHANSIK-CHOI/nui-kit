import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>Next UI System</h1>
      <p className="doc-lead">
        Next.js App Router 전용 React UI 컴포넌트 시스템. 소비자 프로젝트의
        스타일을 오염시키지 않으면서, CSS 변수로 자유롭게 커스터마이징할 수 있게
        설계했다.
      </p>

      <h2>설계 원칙</h2>
      <ul>
        <li>
          <strong>격리</strong> — 모든 클래스에 <code>nui-</code> 프리픽스, 모든
          CSS 를 <code>@layer nui.*</code> 안에 배치. reset 은 배포하지 않는다
        </li>
        <li>
          <strong>덮어쓰기 보장</strong> — Cascade Layers 덕분에 여러분의 CSS 가
          항상 우선한다. <code>!important</code> 가 필요 없다
        </li>
        <li>
          <strong>2계층 토큰</strong> — seed 토큰으로 전체 테마를, 컴포넌트
          토큰으로 개별 조정을
        </li>
        <li>
          <strong>App Router 전용</strong> — 모든 컴포넌트가 클라이언트
          컴포넌트로 배포된다
        </li>
      </ul>

      <h2>어디서 시작할까</h2>
      <ul>
        <li>
          <Link href="/get-started">설치와 사용</Link> — 설치, 스타일 불러오기,
          커스터마이징
        </li>
        <li>
          <Link href="/foundations">Foundations</Link> — 색·타이포·간격·모션
          토큰
        </li>
        <li>
          <Link href="/components">Components</Link> — 컴포넌트별 예제와 API
        </li>
      </ul>

      <p className="doc-note">
        이 문서의 props 표와 토큰 표는 <strong>코드에서 자동 생성</strong>된다.
        컴포넌트 타입과 SCSS 토큰 파일이 단일 출처이므로 문서가 코드와 어긋나지
        않는다.
      </p>
    </>
  );
}

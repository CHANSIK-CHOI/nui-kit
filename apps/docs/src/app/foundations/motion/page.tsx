import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "모션" };

export default function MotionPage() {
  return (
    <>
      <h1>모션</h1>
      <p className="doc-lead">
        지속시간과 이징. 컴포넌트는 이 토큰만 쓰고 시간을 직접 적지 않는다.
      </p>

      <h2>지속시간 · 이징</h2>
      <TokenTable group="motion" />

      <h2>접근성 — 모션 최소화</h2>
      <p>
        사용자가 OS 에서 &quot;동작 줄이기&quot;를 켜면
        <code>prefers-reduced-motion: reduce</code> 가 되고, 모든 지속시간
        토큰이 <code>1ms</code> 로 무력화된다. 컴포넌트가 토큰을 쓰는 한 별도
        대응이 필요 없다.
      </p>
      <pre className="doc-code">
        <code>{`@media (prefers-reduced-motion: reduce) {
  :root {
    --nui-duration-3: 1ms;
    --nui-duration-base: 1ms;
    /* … */
  }
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        컴포넌트에서 <code>transition: all 0.2s</code> 처럼 시간을 하드코딩하면
        이 장치를 우회하게 된다. 반드시 <code>--nui-duration-*</code> 토큰을
        쓴다.
      </div>
    </>
  );
}

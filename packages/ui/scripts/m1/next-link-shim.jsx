// 하네스 전용 next/link 대역 — Next 라우터 없이 ButtonLink 를 그린다. ButtonLink 는 className · 속성을 Link 에 넘기기만 하므로
// DOM 표식 비교(C5)에는 영향이 없다. Next 실제 Link 가 덧붙이는 속성은 이 하네스가 보지 않는다(미확인으로 적는다).
export default function Link({ href, children, prefetch, replace, scroll, shallow, passHref, legacyBehavior, ...rest }) {
  return <a href={typeof href === "string" ? href : String(href?.pathname ?? "")} {...rest}>{children}</a>;
}

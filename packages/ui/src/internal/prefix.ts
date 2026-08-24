/**
 * 네임스페이스 프리픽스 단일 출처 (JS 측).
 * SCSS 측 단일 출처는 `src/styles/abstracts/_prefix.scss` 이며 두 값은 항상 일치해야 한다.
 */
export const PREFIX = "nui";

/** 프리픽스가 붙은 클래스명을 만든다. `px("button")` -> `"nui-button"` */
export function px(name: string): string {
  return `${PREFIX}-${name}`;
}

/** 프리픽스가 붙은 CSS 변수명을 만든다. `pv("color-primary-500")` -> `"--nui-color-primary-500"` */
export function pv(name: string): string {
  return `--${PREFIX}-${name}`;
}

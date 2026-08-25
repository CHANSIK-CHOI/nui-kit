# 스타일 규칙

이 라이브러리의 **1원칙: 소비자 프로젝트 스타일을 오염시키지 않는다.**
아래 기계 검사로 강제된다 — `npm run verify:css -w @chansikchoi/next-ui`
(`packages/ui/scripts/check-css-isolation.mjs`)

| 검사 항목 | 실패 조건 |
| --- | --- |
| 클래스 프리픽스 | `.nui-` 로 시작하지 않는 클래스 셀렉터 |
| 변수 프리픽스 | `--nui-` 로 시작하지 않는 CSS 변수 |
| 전역 셀렉터 | `preflight.css` 외 파일의 태그/`*` 셀렉터 |
| 레이어 | `@layer nui.*` 선언 누락 |
| tokens 순수성 | `tokens.css` 에 클래스 셀렉터 존재 |

---

## 1. 프리픽스는 SCSS 헬퍼로만 만든다

```scss
@use "../abstracts" as *;

#{cls("button")}  { }   // .nui-button
#{state("error")} { }   // .nui-is-error
var(#{v("space-md")})   // var(--nui-space-md)
```

`.nui-button` 을 문자열로 직접 쓰지 않는다. 프리픽스는 `_prefix.scss` 단일 출처다.

## 2. 모든 CSS 는 `@layer nui.*` 안에 넣는다

```
@layer nui.tokens, nui.base, nui.components, nui.utilities;
```

Cascade 순서는 `origin → importance → layer → specificity` 다. 레이어 안에 있으면
소비자의 레이어 없는(unlayered) CSS 가 **상세도와 무관하게 항상 우선**한다.
덕분에 `!important` 없이 커스터마이징이 되고, "라이브러리 스타일이 안 덮인다" 문제가 없다.

## 3. 공개 훅 `--nui-*` 과 내부 배선 `--nui-_*` 을 분리한다 ★

같은 이유(unlayered 우선)로 **소비자가 내부 변수를 건드리면 variant 가 무력화된다.**

```scss
// ❌ 훅이 하나뿐이면, 소비자가 :root 에 --nui-button-bg 를 설정한 순간
//    primary/secondary/point 가 전부 같은 색이 된다. 우리 레이어에서는 막을 수 없다.

// ✅ variant 마다 자기 훅 + 내부 배선 분리
#{cls("button")} {
  #{iv("button-main")}: #{hook("button-bg", var(#{v("text-primary")}))};
  background: var(#{iv("button-main")});
}
#{cls("button")}--primary {
  #{iv("button-main")}: #{hook("button-primary-bg", var(#{v("color-primary")}))};
}
```

- `v()` / `hook()` → **공개**. 소비자가 덮어써도 안전. README 에 문서화한다.
- `iv()` → **내부**. variant 가 갈아끼우는 배선. 문서화하지 않는다.

## 4. 전역 reset 에 의존하지 않는다 — 컴포넌트가 스스로 정규화한다 ★

reset 은 배포하지 않는다(`preflight.css` opt-in). 따라서 `box-sizing` 이나
`input`/`button` 의 UA 기본 스타일이 **소비자 환경에서 그대로 남는다.**

```scss
#{cls("textfield")}__input {
  appearance: none;        // UA 기본 무력화 — 이 셀렉터 안에서만
  margin: 0;
  background-color: transparent;
  border: 0;
  font-family: var(#{v("font-family-base")});
}
```

`box-sizing` 은 `base/_normalize.scss` 가 `[class^="nui-"]` 에만 적용한다.
**폼 요소(`input` `button` `select` `textarea`)를 새로 쓸 때마다 자체 정규화를 확인한다.**

## 5. 치수는 16px 루트 기준 `rem`

원본 프로젝트는 `html { font-size: 10px }` 를 깔고 `1.6rem = 16px` 로 썼다.
우리는 reset 을 배포하지 않으므로 그 전제가 없다 — **원본 값을 그대로 쓰면 1.6배로 깨진다.**

`1rem = 16px`. 원본 값 환산은 `× 0.625` (예: `2.4rem` → `1.5rem`).
`px` 하드코딩은 사용자 글꼴 확대 접근성을 깨므로 피한다 (`border-width` 등 1px 은 예외).

## 6. 토큰은 CSS 변수로 만든다

SCSS map/변수로 두면 소비자가 덮어쓸 수 없다. 색·간격·치수·반경·그림자·모션·타이포·
z-index 는 전부 `tokens/_seed.scss` 의 CSS 변수다.

**유일한 예외는 브레이크포인트** — media query 가 `var()` 를 읽지 못하므로
`abstracts/_breakpoints.scss` 에 컴파일 타임 값으로 남는다.

> ⏸️ 현재 브레이크포인트 대응은 **보류 상태**다. `respond-to` 인프라는 있지만
> 사용처가 없다. 반응형은 별도 단계에서 일괄 적용한다 — 개별 컴포넌트에서
> 임의로 미디어쿼리를 넣지 않는다.

## 7. 서드파티 스타일은 우리 스코프 안에서만 덮는다

```scss
#{cls("datepicker")} .rdp-day { }   // ✅
.rdp-day { }                        // ❌ 소비자의 같은 라이브러리까지 깨뜨린다
```

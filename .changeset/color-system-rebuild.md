---
"@nui-kit/react": minor
---

색 체계 전면 교체 — Radix 12단계 스케일, 다크 테마, 역할 기반 액션 이름

**BREAKING** (0.x 이므로 minor 로 올리되 아래는 전부 깨지는 변경이다)

### 1. 버튼 색이 역할 이름이 된다

`color` prop 이 "무슨 색인가"가 아니라 "언제 쓰는 버튼인가"를 가리킨다.
`secondary` 는 `--nui-color-error` 와 거의 같은 빨강이라 버튼만 보고는
"보조 액션"인지 "위험한 액션"인지 구분할 수 없었다.

| 지금까지 | 바뀐 이름 | 언제 쓰나 |
| --- | --- | --- |
| `color="black"` | `color="neutral"` | 특별한 의미가 없는 기본 버튼 |
| `color="primary"` | `color="primary"` | 화면에서 가장 중요한 액션 |
| `color="secondary"` | `color="danger"` | 되돌릴 수 없는 액션 — 삭제 · 탈퇴 |
| `color="point"` | `color="warning"` | 확인이 필요한 액션 |

클래스명도 함께 바뀐다 — `.nui-button--secondary` → `.nui-button--danger`,
`.nui-button--point` → `.nui-button--warning`.
공개 훅도 `--nui-button-secondary-bg` → `--nui-button-danger-bg`,
`--nui-button-point-bg` → `--nui-button-warning-bg`.

### 2. 색 토큰이 12단계 스케일이 된다

브랜드·무채색·상태색 모두 **단계 번호가 곧 역할**인 12단계를 갖는다.
어느 색을 쓰든 "테두리는 7번, solid 배경은 9번"처럼 같은 자리에서 꺼내 쓴다.

```
1~2   배경          3~5   컴포넌트 배경 (기본 · hover · 눌림)
6~8   테두리 (구분선 · 컨트롤 · 강조와 포커스)
9~10  solid 배경    11~12 글자 (보조 · 본문)
```

| 제거된 토큰 | 대신 쓸 것 |
| --- | --- |
| `--nui-color-gray-50` ~ `-900` | `--nui-color-gray-1` ~ `-12` |
| `--nui-color-primary` `-bright` `-dark` | `--nui-color-brand-1` ~ `-12` |
| `--nui-color-secondary` `-bright` | `--nui-color-danger-*` |
| `--nui-color-point` `-bright` | `--nui-color-warning-*` |
| `--nui-color-error` `-soft` | `--nui-color-danger-9` `-3` |
| `--nui-color-success` `-soft` | `--nui-color-success-9` `-3` |
| `--nui-color-warning` `-soft` | `--nui-color-warning-9` `-3` |
| `--nui-color-info` `-soft` | `--nui-color-info-9` `-3` |
| `--nui-text-tertiary` | `--nui-text-secondary` (값·역할이 겹쳤다) |
| `--nui-text-quaternary` | `--nui-text-disabled` (실제 용도가 비활성이었다) |
| `--nui-border-brand-active` `-line` | `--nui-border-brand` |
| `--nui-border-brand-divider` | `--nui-border-brand-subtle` |
| `--nui-action-bg` `-fg` | `--nui-action-neutral` `-neutral-fg` |
| `--nui-action-secondary` `-point` `-fg-on-point` | `--nui-action-danger` `-warning` `-warning-fg` |

`--nui-action-success` · `--nui-action-info` 와 각 역할의 `-fg`(그 배경 위에서
대비를 통과하는 글자색)가 새로 생겼다.

### 3. 이전 릴리스에서 예고한 alias 를 제거했다

숫자 스케일 전환 때 남겨둔 구 이름 **115개**를 전부 없앴다.
`--nui-space-md` `--nui-radius-sm` `--nui-shadow-soft` `--nui-duration-fast`
`--nui-font-size-body` `--nui-surface-panel-strong` 등이 해당한다.
대응표는 이전 changeset(`token-system-rework`)에 있다.

### 4. 다크 테마

`<html data-theme="dark">` 로 켠다. 지정하지 않으면 OS 설정
(`prefers-color-scheme`)을 따르고, `data-theme="light"` 로 고정할 수도 있다.

**같은 토큰 이름이 다른 값을 가리키는 방식**이라 컴포넌트 CSS 는 바뀌지 않았다.
`layer-*` 만 테마별로 참조가 달라지는데, "고도가 높을수록 밝아진다"는 규칙은
색을 반전시켜서는 만들어지지 않기 때문이다.

### 명도 대비

모든 역할색이 라이트·다크 양쪽에서 **WCAG AA(4.5:1) 를 통과**한다.

| 역할 | 9단계 배경 | 글자 | 대비 |
| --- | --- | --- | --- |
| `action-primary` | `#01796f` | 흰 | 5.30 |
| `action-danger` | `#ce2c31` | 흰 | 5.21 |
| `action-warning` | `#ffca2f` | 검정 | 10.46 |
| `action-success` | `#218358` | 흰 | 4.72 |
| `action-info` | `#0d74ce` | 흰 | 4.77 |

`warning` 만 글자가 검정인 것은 노랑에 흰 글자를 얹으면 대비가 1.9 밖에 안 되고,
노랑을 어둡게 하면 갈색이 되어 "주의"의 의미를 잃기 때문이다.

### 고쳐진 결함

- **포커스 링이 강조색과 같은 단계를 쓰고 있었다** — `--nui-focus-color` 가
  `control-accent`(9단계)를 참조하도록 중복 선언되어 있었다. 8단계로 교정했다.
- **`preflight.css` 가 존재한 적 없는 토큰 3개를 참조했다** —
  `--nui-color-text` · `--nui-font-size-md` · `--nui-line-height-base`.
  opt-in reset 을 쓰는 소비자에게만 드러나던 문제다.

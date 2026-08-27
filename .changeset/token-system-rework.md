---
"@chansikchoi/next-ui": minor
---

디자인 토큰 체계 재편 — 숫자 스케일, focus/elevation 분리, layer 축 신설

**BREAKING** (구 이름은 alias 로 살아 있으나 0.1.0 배포 시 제거된다)

소비자가 공개 훅으로 덮어쓰던 토큰 이름이 바뀐다. 대응표는 아래와 같다.

| 구 이름 | 새 이름 |
| --- | --- |
| `--nui-space-2xs` `-xs` `-sm` `-md` `-lg` | `--nui-space-1` `-2` `-3` `-4` `-6` |
| `--nui-radius-xs` `-sm` `-md` `-lg` `-xl` | `--nui-radius-1` `-2` `-3` `-4` `-6` |
| `--nui-radius-pill` `-pill-fluid` | `--nui-radius-full` |
| `--nui-radius-round` | `--nui-radius-circle` |
| `--nui-shadow-focus*` | `--nui-focus-ring*` |
| `--nui-shadow-soft` `-base` `-overlay` 외 | `--nui-shadow-1` `-2` `-3` |
| `--nui-surface-panel-strong` `-overlay-dim` | `--nui-layer-floating` `--nui-layer-overlay` |
| `--nui-duration-quick`~`-deliberate` | `--nui-duration-1`~`-6` |
| `--nui-focus-ring-width` `--nui-border-width-focus` | `--nui-focus-width` |

**바뀐 것**

- **스케일 이름이 숫자가 된다** — 등간격 스케일(space·radius·font-size·duration·shadow)은
  `space-4` 처럼 값이 이름에서 계산된다. 중간값을 넣어도 기존 이름이 바뀌지 않는다.
  값이 불규칙한 `size-*` 는 역할 이름을 유지한다.
- **포커스 링이 그림자에서 분리된다** — 포커스 표시는 고도(elevation)가 아니므로
  `--nui-shadow-focus` 가 아니라 `--nui-focus-ring` 이다.
- **`layer-*` 축 신설** — 컨테이너 표면색(`layer-basement` `-default` `-floating` `-overlay`).
  다크 테마를 넣을 때 필요한 뼈대다.
- **easing 이 enter/exit 로 나뉜다** — `--nui-easing-enter`(나타남) / `--nui-easing-exit`(사라짐).
  하나의 곡선으로 개폐 양방향을 처리하지 않는다.
- **duration 이 50ms 등간격 6단계**가 되고 `duration-4`(200ms)가 마이크로/매크로 경계다.

**고쳐진 결함**

- **포커스 링이 옛 브랜드 색을 쓰고 있었다.** `--nui-shadow-focus` 계열이 `rgb(28 166 115)`
  (변경 전 primary `#1ca673`)를 참조해, primary 가 `#16815a` 로 바뀐 뒤에도 링만 옛 색이었다.
  `--nui-border-brand-*` 3종도 같은 문제였다. 전부 현재 primary 로 맞췄다.

**제거된 토큰** — 참조가 없던 것들: `--nui-color-black` `--nui-text-brand` `--nui-text-inverse`
`--nui-surface-neutral-softest` `--nui-space-xl` `-2xl` `--nui-space-panel-section`
`--nui-size-icon-xl` `--nui-shadow-strong` `--nui-z-sticky` `-dimmed` `-layer`
`-overlay-dimmed` `-loader`

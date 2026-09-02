---
"@chansikchoi/next-ui": minor
---

디자인 시스템을 SEED 와 다시 대조해 다크 테마 결함과 규칙 이탈을 고칩니다.

**BREAKING — 토큰 이름이 바뀌거나 사라집니다** (0.x 라 minor 로 둡니다).

| 전 | 후 |
| --- | --- |
| `--nui-text-inverse-strong` | `--nui-text-on-inverse`(토스트·툴팁 위) · `--nui-text-on-accent`(accent 채움 위) |
| `--nui-size-icon-sm` | `--nui-size-dot-md` — 10px 는 아이콘이 아니라 점이었습니다 |
| `--nui-layer-floating-muted` | `--nui-surface-neutral-soft` |
| `--nui-gradient-panel-soft` | 삭제 — Accordion 카드는 `layer-default`, Popup 아이콘은 `surface-neutral-soft` |
| `--nui-action-success/-info`(+`-fg`) · `--nui-font-size-2/8`(+행간·자간) · `--nui-space-5/8` · `--nui-easing-linear` | 삭제 — 참조 0건 |

**다크 테마에서 Toast · Tooltip 글자가 보이지 않던 것을 고칩니다.** 반전 표면
(`layer-inverse`)이 다크에서 밝아지는데 글자는 흰색으로 남아 대비가 1.16:1 이었습니다.
글자를 `text-on-inverse` 로 나누어 16.24:1 이 됩니다. OS 가 다크인 사용자는 아무 설정
없이 이 상태를 보고 있었습니다.

**접근성**

- 안내·에러 `Message` 가 비어 있어도 `aria-live="polite"` 영역을 남깁니다. RHF 검증
  실패처럼 포커스 이동 없이 메시지가 생겨도 스크린리더가 읽습니다
- `Textfield` · `Textarea` 에 `clearButtonTitle`, `Accordion.Head` 에 `toggleLabel` prop 을
  엽니다. 기본값은 그대로이고, 소비자의 언어와 어휘로 바꿀 수 있습니다
- `Select` · `MultiSelect` 의 기본 안내 문구에서 마침표를 뺍니다

**시각이 바뀌는 자리**

- 표면 hover · active 가 알파 한 벌로 통일됩니다 — `control-bg-hover`(gray-a4) ·
  `control-bg-active`(gray-a5, 신설). Button line 의 hover 도 같은 값입니다. 날짜 · 옵션 ·
  아코디언 헤더 · 닫기 버튼에 눌린 순간의 색이 생깁니다
- hover 는 hover 가 있는 기기에서만 그립니다(`@media (hover: hover)`). 터치 기기에서
  탭 뒤에 hover 색이 남지 않습니다
- Select 메뉴 · Datepicker 팝업이 `layer-floating` + `border-form` 을 씁니다. 라이트는
  같고 다크에서 한 단계 밝아집니다. Accordion 헤더/본문 경계는 `border-section` 입니다
- 색 · 테두리 전환 시간이 150ms(`duration-3`) 하나로 맞춰집니다. Button · 선택 컨트롤 ·
  Accordion 이 200ms 에서 50ms 빨라집니다
- Button 의 포커스 표시가 outline 하나가 됩니다(링 중첩 제거). Popup 닫기 · Accordion
  헤더의 outline offset 이 토큰을 따릅니다
- text 버튼이 semi-bold 가 되고, Select 의 선택된 옵션이 regular 가 됩니다 — 타이포
  매트릭스 아홉 줄 밖의 두 조합을 없앴습니다
- Datepicker 년/월 셀렉트 hover 에서 배경이 바뀌지 않습니다(입력 컨트롤은 테두리만)

**검사** — `verify:a11y` 가 라이트 · 다크 두 테마의 대비, 비활성 하한 2.0:1, 터치 영역
(24px 미만 실패 · 44px 미만 경고)을 잽니다. `verify:tokens` 의 hover 검사가 두 번째
선언부터 못 보던 버그를 고쳤습니다.

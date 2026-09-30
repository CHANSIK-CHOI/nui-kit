---
"@nui-kit/react": minor
---

**preflight.css 를 import 한 프로젝트만** 해당합니다. `import "@nui-kit/react/styles/preflight.css"` 를 쓰지 않는 프로젝트는 달라지는 것이 없습니다(`index.css` 에는 preflight 가 들어 있지 않습니다).

`preflight.css` 가 앱 UI 의 기본 리셋을 더 넓게 맡습니다. 규칙은 모두 `@layer nui.base` 안에 있어서, 레이어 없는 소비자 CSS 가 항상 이깁니다.

**BREAKING — 보이는 기본값이 바뀝니다**

- **제목 크기 · 굵기** — `h1`~`h6` 가 부모의 `font-size` · `font-weight` 를 물려받습니다. 브라우저 기본값(h1 32px · 굵게)이 사라지므로 제목 크기는 직접 정해야 합니다
- **링크 밑줄** — `a` 의 밑줄이 사라지고 글자색은 부모를 따릅니다. 본문 문단 안의 링크처럼 밑줄이 필요한 자리는 되돌려 주세요: `.prose a { text-decoration: underline }`
- **목록 불릿** — `ul` · `ol` 의 불릿과 들여쓰기가 사라집니다. Safari VoiceOver 는 `list-style: none` 인 목록을 목록으로 읽지 않으므로, 목록으로 읽혀야 하는 자리에는 `role="list"` 를 붙여 주세요
- **이미지 block** — `img` · `picture` · `video` · `canvas` · `svg` 가 `display: block` 입니다. 글자 사이에 둔 이미지는 줄을 끊습니다
- **이미지 · 비디오 크기** — `img` · `video` 에 `max-width: 100%` · `height: auto` 가 붙습니다. 컨테이너보다 넓은 그림은 비율을 유지한 채 줄어듭니다
- **기본 여백** — `h1`~`h6` · `p` · `figure` · `blockquote` · `dl` · `dd` · `pre` · `ul` · `ol` · 폼 요소의 margin 과 `fieldset` · `legend` 의 여백 · 테두리가 0 이 됩니다. 간격은 직접 줘야 합니다

**그 밖에 더해진 것**

- `body` 가 `word-break: keep-all` 과 `overflow-wrap: break-word` 를 갖습니다. 한국어가 어절 단위로 줄바꿈되고, 긴 영문 URL 은 컨테이너 안에서 끊깁니다. `textarea` 입력값에도 상속됩니다
- `b` · `strong` 이 `--nui-font-weight-bold`(700)를 씁니다. `tokens.css` 가 함께 로드돼 있어야 합니다
- `table` 이 `border-collapse: collapse` 입니다
- `button:not(:disabled)` 과 `[role="button"]:not([aria-disabled="true"])` 이 손가락 커서를 씁니다
- `optgroup` 도 글꼴을 물려받습니다. `html` 에 `text-size-adjust: 100%` 를 줘서 iOS 가로 모드에서 글자가 커지지 않습니다

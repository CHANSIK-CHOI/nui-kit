---
"@nui-kit/react": minor
---

**BREAKING** — Checkbox · Radio · Switch 가 나눠 쓰던 CSS 변수를 컴포넌트별로 쪼갰습니다.

`Selector` 라는 컴포넌트는 없습니다. 체크박스만 키우려 해도 라디오가 따라 움직이고,
스위치 테두리만 두껍게 하려 해도 셋이 다 바뀌던 자리입니다.

| 없어짐 | 대신 |
| --- | --- |
| `--nui-selector--size` | `--nui-checkbox--size` · `--nui-radio--size` |
| `--nui-selector--border-width` | `--nui-checkbox--border-width` · `--nui-radio--border-width` · `--nui-switch--border-width` |

```css
/* 전 */
:root {
  --nui-selector--size: 20px;
  --nui-selector--border-width: 2px;
}

/* 후 — 같은 값을 주면 결과가 같습니다 */
:root {
  --nui-checkbox--size: 20px;
  --nui-radio--size: 20px;
  --nui-checkbox--border-width: 2px;
  --nui-radio--border-width: 2px;
  --nui-switch--border-width: 2px;
}
```

⚠️ **조용히 깨집니다.** CSS 변수라 옛 이름을 그대로 두면 에러 없이 기본값으로 되돌아갑니다.
컴파일도 타입 검사도 잡지 못하니 위 표로 찾아 바꿔 주세요.

`--nui-switch--border-width` 에는 상한이 있습니다. 썸과 트랙 사이 여백이 2px 뿐이라 3px
이상을 주면 썸이 한쪽으로 밀립니다. 더 두꺼운 테두리가 필요하면 `--nui-switch--height` 를
함께 키우세요.

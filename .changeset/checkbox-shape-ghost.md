---
"@nui-kit/react": minor
---

Checkbox 에 `shape` 을 더했습니다. 상자를 그릴지, 체크만 둘지 고릅니다.

```tsx
<Checkbox checked={agreed} onChange={toggle} />                // square — 기본
<Checkbox shape="ghost" checked={agreed} onChange={toggle} />  // 체크만
```

`ghost` 는 필수 선택이 아니고 항목이 셋 이하인 자리에 씁니다. 미선택에도 연한 체크가
보이고, 선택하면 획이 굵어지며 커집니다 — 선택 여부를 색만으로 말하지 않기 위해서입니다.

⚠️ **`ghost` 에는 외곽선이 없어 KRDS 의 체크박스 외곽선 대비 요건(3:1)을 만족하지
못합니다.** 공공 서비스처럼 KRDS 준수가 요구되는 화면에서는 `square` 를 쓰세요.
상자가 없으니 「일부」를 그릴 자리도 없어 `ghost` 에는 `indeterminate` 를 줄 수 없습니다.

둥글기도 열었습니다. `square` 의 상자에 걸리고, 24×24 정사각이라 `50%` 를 주면 **원**이 됩니다.

```css
:root { --nui-checkbox--square-radius: 50%; }
```

---

**BREAKING** — `CheckboxProps` 가 `shape` 으로 갈리는 유니온이 됐습니다.
`Omit<CheckboxProps, …>` 으로 감싸던 래퍼가 있다면 `DistributiveOmit` 으로 바꿔야 합니다.

```tsx
import type { CheckboxProps, DistributiveOmit } from "@nui-kit/react";

type MyProps = DistributiveOmit<CheckboxProps, "className">;   // ✅
// type MyProps = Omit<CheckboxProps, "className">;            // ❌ 갈래가 접힌다
```

평범한 `Omit` 은 유니온을 하나로 접습니다. 접히면 감싼 타입을 다시 `<Checkbox>` 에
넘길 수 없고, 막아 둔 `ghost` + `indeterminate` 조합이 통과합니다. `DistributiveOmit` 은
이번에 함께 공개한 타입이고, 갈래가 없는 다른 컴포넌트의 props 에는 `Omit` 과 결과가
같으므로 아무 데나 써도 됩니다.

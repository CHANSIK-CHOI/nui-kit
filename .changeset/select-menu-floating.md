---
"@nui-kit/react": minor
---

`Select` 와 `MultiSelect` 의 메뉴가 **떠서 열립니다.** 지금까지는 메뉴가 문서 흐름 안에
들어가 열릴 때마다 아래 내용을 밀어냈습니다 — 컨트롤 높이 48px 짜리 Select 가 열리면
자리를 314px 차지했습니다. 이제 `body` 로 나가서 뜹니다.

```tsx
<Select options={OPTIONS} value={city} onChange={setCity} />
```

바뀐 것은 넷입니다.

- **아래 내용이 밀리지 않습니다.** 메뉴가 열려도 컨트롤이 차지하는 자리는 그대로입니다
- **`overflow: hidden` 인 조상 안에서 잘리지 않습니다.** 카드·팝업 안에서 아무 prop 없이
  그대로 씁니다. 팝업(z 1030) 위에도 제대로 뜹니다
- **아래 공간이 모자라면 위로 뒤집히거나 높이를 줄여** 화면에 맞춥니다
- 메뉴를 여는 것만으로 **페이지가 저절로 스크롤되지 않습니다**

## 옛 동작이 필요하면 `menuPosition="static"`

```tsx
<Select options={OPTIONS} menuPosition="static" />   // 흐름 안. 아래 내용을 밀어낸다
<Select options={OPTIONS} menuPosition="absolute" /> // 뒤집는 대신 페이지를 스크롤해 펼친다
<Select options={OPTIONS} menuPortalTarget={null} /> // 뜨되 body 로 내보내지 않는다
```

`menuPosition` 은 `react-select` 의 prop 이름 그대로이고 값 `"static"` 만 이 라이브러리가
더한 것입니다. **감싼 라이브러리에만 있는 prop 은 이름을 바꾸지 않습니다** —
`menuPlacement` · `maxMenuHeight` · `menuPortalTarget` · `filterOption` 모두 `react-select`
문서의 이름 그대로 넘깁니다. 반대로 `disabled` · `readOnly` · `size` 처럼 여러 컴포넌트에
걸치는 개념은 이 라이브러리의 이름을 씁니다.

## BREAKING — 셋

**`hasPortal` 이 없어집니다.** portal 이 기본이 되면서 켤 것이 없어졌습니다. 끄는 길은
`react-select` 의 원래 prop 입니다.

| 옛 | 새 |
| --- | --- |
| `<Select hasPortal />` | `<Select />` |
| `<Select />` (제자리 · 아래를 밀었다) | `<Select menuPosition="static" />` |

타입 에러로 드러나므로 조용히 무시되지 않습니다.

**`menuPlacement` 의 기본값이 `"bottom"` 에서 `"auto"` 로 바뀝니다.** 화면 아래쪽 Select 의
메뉴가 위로 뒤집힙니다. 언제나 아래로 펼치려면 `menuPlacement="bottom"` 을 줍니다.

**`maxMenuHeight` 의 기본값이 `240` 에서 `480` 으로 바뀝니다.** 한 번에 보이는 항목이
늘어나고, `menuPlacement="auto"` 의 뒤집기 판정도 이 높이로 돕니다.

## 그 밖에

- `menuPortalTarget` 을 주지 않으면 `body` 아래 컨테이너가 기본값이 됩니다. 메뉴 DOM 을
  조상 셀렉터(`.my-wrap .nui-select__menu`)로 잡던 테스트가 있으면 찾지 못합니다
- `menuPosition` 의 타입이 `"absolute" | "fixed"` 에서 `"static"` 이 더해진 셋이 됩니다.
  넓히는 쪽이라 기존 코드는 그대로 통과합니다. 타입이 필요하면 `SelectMenuPosition` 을
  가져다 씁니다
- 위로 뒤집힌 메뉴는 아래 모서리에서 자랍니다. 등장은 `scale` 과 `opacity` 로만 그립니다

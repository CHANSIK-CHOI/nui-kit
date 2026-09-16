---
"@nui-kit/react": minor
---

`Select` · `MultiSelect` 의 메뉴 배치가 `Datepicker` · `Tooltip` 과 같은 규칙이 됩니다. 기본은 지금처럼
컨트롤 아래 제자리이고, `overflow: hidden` 인 조상(카드 · 팝업) 안에서는 `hasPortal` 을 켭니다.

```tsx
<Select options={OPTIONS} />                        // 제자리 — 기본
<Select options={OPTIONS} hasPortal />              // body 로 나가 잘리지 않는다. 화면에 맞춰 위로 뒤집힌다
<Select options={OPTIONS} menuPosition="static" /> // 문서 흐름 안. 아래 내용을 밀어낸다 — 새 값
```

## 새로 생긴 것

- **`menuPosition="static"`** — 메뉴를 문서 흐름 안에 둡니다. 열리는 만큼 아래 내용이 밀립니다.
  `menuPosition` 은 `react-select` 의 prop 이름 그대로이고 값 `"static"` 만 이 라이브러리가 더한 것입니다.
  타입은 `"absolute" | "fixed" | "static"` 이고 `SelectMenuPosition` 으로 가져다 씁니다

특정 요소로 내보내려면 `react-select` 의 `menuPortalTarget` 을 그대로 줍니다 — 주면 `hasPortal` 보다
우선합니다. **감싼 라이브러리에만 있는 prop 은 이름을 바꾸지 않습니다** — `menuPlacement` ·
`maxMenuHeight` · `menuPortalTarget` · `filterOption` 모두 `react-select` 문서의 이름 그대로입니다.

## BREAKING — 넷

**`hasPortal` 을 켜면 메뉴가 화면 기준으로 자리를 잡습니다.** 예전에는 `document.body` 에 문서 기준으로
붙었고, 이제는 `body` 아래 전용 컨테이너(`#nui-select-root`)에 **화면 기준**(`menuPosition="fixed"`)으로
붙습니다. 화면 아래쪽에서 열면 **위로 뒤집히거나 높이가 줄어듭니다.** 예전 배치가 필요하면
`<Select hasPortal menuPosition="absolute" />` 를 줍니다.

**`hasPortal` 과 `menuPortalTarget={null}` 을 같이 주면 메뉴가 제자리에 남습니다.** 예전에는 `null` 이
무시되어 `body` 로 나갔습니다. 이제는 `menuPortalTarget` 에 준 값이 `null` 이어도 `hasPortal` 보다
우선합니다. 잘리지 않게 하려면 `menuPortalTarget` 을 빼고 `hasPortal` 만 줍니다.

**메뉴를 열 때 페이지를 스크롤하지 않습니다.** `menuShouldScrollIntoView` 의 기본값이 `true` 에서 `false`
로 바뀝니다. 아래 공간이 모자라면 예전에는 페이지가 움직여 메뉴를 보여 줬고, 이제는 메뉴가 넘칩니다.
예전 동작이 필요하면 `menuShouldScrollIntoView` 를 줍니다. 타입 에러가 나지 않으므로 화면으로 확인합니다.

**`maxMenuHeight` 의 기본값이 `240` 에서 `480` 으로 바뀝니다.** 한 번에 보이는 항목이 늘어납니다.

## 그 밖에

- `hasPortal` 로 나간 메뉴의 DOM 을 조상 셀렉터(`.my-wrap .nui-select__menu`)로 잡던 테스트가 있으면
  찾지 못합니다
- `menuPlacement` 의 기본값은 그대로 `"bottom"` 입니다

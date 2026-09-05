---
"@chansikchoi/next-ui": minor
---

`Datepicker` 계열과 `Select` 계열에 **`hasPortal`** 이 생겼습니다. 켜면 달력·메뉴가
`body` 로 나가 **잘리는 조상을 벗어납니다.**

```tsx
<div style={{ overflow: "hidden" }}>
  <Datepicker hasPortal />   {/* 달력이 상자 밖으로 나간다 */}
  <Select hasPortal />       {/* 메뉴도 마찬가지 */}
</div>
```

카드나 팝업처럼 `overflow: hidden` 이 걸린 상자 안에 넣으면 지금까지는 달력이 잘려
**날짜를 하나도 고를 수 없었습니다.** 메뉴도 같았습니다.

- **기본값은 `false`** 입니다. 켜지 않으면 지금과 똑같이 제자리에 뜹니다
- 켜면 z 층이 `--nui-z-portal-menu`(1031)로 올라가 팝업(1030) 위에 뜹니다
- `Tooltip` 이 이미 쓰던 이름이라 **세 컴포넌트가 한 규칙**이 됐습니다
- `Select` 에 `menuPortalTarget` 을 직접 주면 그쪽이 이깁니다

잘림만 해결합니다. 뷰포트 밖으로 밀리는 것은 그대로이고 자동 뒤집기는 없습니다.

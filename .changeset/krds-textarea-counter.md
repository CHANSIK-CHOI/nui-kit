---
"@chansikchoi/next-ui": minor
---

`Textarea` 에 `maxLength` 를 주면 **글자 수 카운터가 영역 아래 오른쪽에 붙습니다.**
KRDS 가이드 683쪽 · 체크리스트 [텍스트 영역 4] — 입력 제한이 있으면 최대 글자 수와
현재 글자 수를 영역 다음 요소로 제공하고 입력에 따라 갱신하라는 기준입니다.

```tsx
<Textarea maxLength={100} value={text} onChange={handleChange} />   // 12 / 100
<Textarea value={text} onChange={handleChange} />                   // 카운터 없음
```

- 제한이 곧 조건입니다. 카운터를 켜고 끄는 별도 prop 은 없습니다
- 세는 단위는 브라우저의 `maxlength` 와 같은 UTF-16 코드 단위입니다. 이모지는 2로
  세지고, 그래서 카운터가 100 인데 더 쳐지는 일이 없습니다
- 에러·안내 메시지와 **한 줄에** 놓입니다. 메시지가 왼쪽, 카운터가 오른쪽입니다
- 스크린리더에는 `aria-describedby` 로 이어져 포커스가 들어올 때 "글자 수 12 / 100"
  으로 읽힙니다. `aria-live` 는 붙이지 않았습니다 — 글자마다 갱신되므로 live 로 두면
  타이핑 한 글자마다 숫자를 읽습니다. 앞말은 `counterLabel` 로 바꿉니다
- 프로그램으로 넣은 값이 제한을 넘으면 카운터가 빨갛게 표시됩니다

**⚠️ 마크업이 한 겹 깊어집니다.** 메시지가 `.nui-textarea__foot` 안으로 들어갑니다.
`.nui-textarea > .nui-message` 처럼 직계 자식으로 잡아 스타일을 얹었다면 확인이
필요합니다. 클래스 이름은 그대로입니다.

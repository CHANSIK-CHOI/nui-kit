---
"@chansikchoi/next-ui": minor
---

**⚠️ `IconButton` 에 접근 이름이 필수가 됐습니다.** `aria-label` 이나 `aria-labelledby`
둘 중 하나가 없으면 컴파일이 막힙니다.

```tsx
<IconButton><DelIcon /></IconButton>                    // ❌ 타입 에러
<IconButton aria-label="삭제"><DelIcon /></IconButton>   // ✅
<IconButton aria-labelledby="x"><DelIcon /></IconButton> // ✅
<IconButton aria-label="a" aria-labelledby="x" />        // ❌ 둘 다는 막습니다
```

`IconButton` 은 `children` 이 아이콘이라 **글자에서 이름이 생길 길이 없습니다.** 빠지면
스크린리더가 "버튼" 이라고만 읽는데, 지금까지는 그 누락이 조용히 통과했습니다.

**왜 유니온인가** — `aria-label` 만 필수로 두면 `aria-labelledby` 로 이름을 주는 정상
사용이 막힙니다. 두 경로를 다 열면서 **누락과 중복만** 잡습니다.

**고치는 법** — 이름 없이 쓰던 자리에 `aria-label` 을 넣습니다. 아이콘이 뜻하는 동작을
그대로 적으면 됩니다("삭제" · "닫기" · "이전 달").

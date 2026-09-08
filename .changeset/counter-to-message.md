---
"@nui-kit/react": minor
---

글자 수 카운터가 `Textarea` 안에서 **메시지와 같은 줄**로 옮겨졌다. `Message` 가 카운터를 갖게 되어 다른 폼 컨트롤도 같은 자리를 쓸 수 있다.

```tsx
<Textarea value={text} onChange={onChange} maxLength={100} errorMessage="100자를 넘었어요" />
// 에러는 왼쪽, 3 / 100 은 오른쪽 — 한 줄이다
```

- 현재 수는 진하게, 최대 수는 연하게 표시된다. 넘치면 둘 다 빨개진다
- 카운터는 `aria-live` **밖**이다. 안에 있으면 타이핑 한 글자마다 스크린리더가 숫자를 읽는다
- `counterLabel` 로 화면 낭독 전용 문구를 바꿀 수 있다

클래스 이름이 바뀌었다 — `.nui-textarea__counter` 가 `.nui-message__counter` 다. 그 클래스로 스타일을 덮고 있었다면 고쳐야 한다.

---
"@nui-kit/react": patch
---

placeholder 를 읽히게 한다.

placeholder 도 글자다. 회색이 한 단계 연해서 라이트 3.77 : 1 · 다크 4.22 : 1 로
WCAG AA(4.5)에 미달이었다 — 저시력 사용자에게는 "무엇을 넣는 자리인지" 가
안내되지 않던 셈이다. 두 테마에서 4.5 를 넘는 첫 단계로 올렸다(5.87 · 8.53).

`Textfield` · `Textarea` · `Search` · `Datepicker` · `Select` 다섯 자리가 함께
바뀐다. 입력한 값(가장 진한 회색)보다는 여전히 연해서 "아직 안 쓴 자리"로 읽힌다.

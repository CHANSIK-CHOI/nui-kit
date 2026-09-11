---
"@nui-kit/react": patch
---

사용하지 않던 모션 시간 토큰 둘을 뺐다 — `--nui-duration-7`(350ms) · `--nui-duration-8`(400ms), 그리고 같은 값의 `motionDuration.d7` · `d8`.

라이브러리 안에서 참조하는 곳이 없었다. 시트는 스프링으로, 풀팝업은 `--nui-duration-6`(300ms)으로 열리고, UI 모션은 300ms 를 넘지 않는다.

직접 `--nui-duration-7` 이나 `--nui-duration-8` 을 참조해 쓰고 있었다면 `--nui-duration-6` 으로 옮긴다. 컴포넌트의 보이는 동작은 바뀌지 않는다.

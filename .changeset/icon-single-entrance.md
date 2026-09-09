---
"@nui-kit/react": minor
---

아이콘이 지나는 문을 `Icon` 하나로 모으고 `lucide-react` 를 peer 로 올렸다.

⚠️ **설치할 것이 하나 늘었다** — `npm i @nui-kit/react lucide-react`. `lucide-react` 가 dependency 에서 **required peerDependency** 로 바뀌었다. npm 7 이상은 자동으로 설치하지만 `--legacy-peer-deps` 나 pnpm 의 엄격한 모드에서는 직접 설치해야 한다.

`Icon` 이 `icon` prop 을 받는다. lucide 아이콘을 넘기면 라이브러리가 쓰는 아홉과 같은 크기 규칙 · 색 상속 · 스크린리더 처리를 받는다.

```tsx
import { Icon } from "@nui-kit/react";
import { Star } from "lucide-react";

<Icon icon={<Star />} size={20} />
<Button icon={<Icon icon={<Star />} />}>즐겨찾기</Button>
```

⚠️ **엘리먼트를 넘긴다.** `icon={Star}` 처럼 컴포넌트를 넘기면 서버 컴포넌트에서 렌더가 실패한다. 타입이 그것을 막는다.

`viewBox` 와 도형을 직접 넣던 길은 그대로다. `DelIcon` 을 비롯한 아홉 이름도 이름 · 가져오는 경로 · 동작이 그대로다.

`lucide-react` 를 한 벌로 나눠 쓰게 되면서 소비자 앱의 `LucideProvider` 로 정한 선 굵기가 라이브러리 안 아이콘에도 닿는다. 색은 닿지 않는다 — 배경과 짝을 이룬 색이 한쪽만 바뀌면 대비가 조용히 깨지기 때문이다.

`.nui-icon` 의 크기 규칙이 `:where()` 안으로 들어가 상세도가 0 이 됐다. 이 클래스를 `className` 으로 덮어쓰기가 쉬워졌다.

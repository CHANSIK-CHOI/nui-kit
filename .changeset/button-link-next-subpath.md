---
"@nui-kit/react": minor
---

**BREAKING** `ButtonLink` 가 배럴과 `/button` 서브패스에서 빠지고 **`@nui-kit/react/next`** 로만
나갑니다. `next/link` 를 쓰는 유일한 컴포넌트라 Next.js 전용 서브패스로 분리했습니다 —
배럴은 이제 `next` 없이 설치 · 타입체크 · 번들됩니다.

| 옛 | 새 |
| --- | --- |
| `import { ButtonLink } from "@nui-kit/react"` | `import { ButtonLink } from "@nui-kit/react/next"` |
| `import { ButtonLink } from "@nui-kit/react/button"` | `import { ButtonLink } from "@nui-kit/react/next"` |
| `import type { ButtonLinkProps } from "@nui-kit/react"` | `import type { ButtonLinkProps } from "@nui-kit/react/next"` |

- `next` 가 **optional peer** 가 됐습니다. `/next` 를 가져오는 프로젝트만 설치합니다. Next 프로젝트는
  달라지는 것이 없습니다.
- 「App Router 전용」 선언을 걷어냈습니다. Next.js App Router 에서 검증했고, Pages Router 와 순수
  React(Vite 등)를 막지 않습니다. Next 가 아닌 환경에서 버튼 모양의 링크는 `getButtonClassName` 으로
  자기 라우터의 Link 에 같은 클래스를 붙입니다.
- `ButtonLink` 의 prop · 클래스 · 훅 · 렌더 결과는 그대로입니다.

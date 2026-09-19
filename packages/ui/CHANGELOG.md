# @nui-kit/react

## 0.2.0

### Minor Changes

- 5eedc86: **BREAKING** `Accordion` 의 `variant="box"` 가 항목마다 카드가 아니라 **목록 전체를 카드
  하나**로 그립니다. 열림은 테두리 대신 **제목**이 말합니다.
  
  - **BREAKING** `--nui-accordion--gap` 을 없앴습니다. `box` 의 항목이 구분선으로 이어지고
    사이 간격이 없어서 이 변수는 할 일이 없습니다. 항목마다 카드인 모양이 필요하면 새
    `variant="separated"` 를 씁니다 — 그쪽 간격은 `--nui-accordion--separated-gap`(12px)입니다.
  - **BREAKING** `--nui-accordion--radius` 가 **`--nui-accordion--box-radius`** 로 바뀝니다
    (카드 루트 · 12px). 옛 이름은 아무 자리도 움직이지 않으니 덮어쓰던 코드는 이름을 바꿉니다.
    `separated` 항목의 모서리는 `--nui-accordion--separated-radius`(10px)입니다.
  - `variant="separated"` 가 생겼습니다 — 항목마다 카드(`--nui-layer-default` 면 ·
    `--nui-border-form` 외곽 · 10px 모서리 · 항목 사이 12px). 열림은 `box` 와 같이 제목이 말합니다.
  - **BREAKING** `--nui-border-brand` · `--nui-border-brand-subtle` 을 없앴습니다. 열린
    항목의 테두리가 유일한 자리였고 그 자리가 사라졌습니다. 이 변수를 `var()` 로 참조하던
    코드는 값이 비게 되니 다른 선 토큰으로 바꿉니다.
  - `box` 의 면 · 외곽선 · 둥글기가 항목(`.nui-accordion__item`)에서 **루트**로 올라갔습니다.
    항목에는 아래쪽 `--nui-border-divider` 만 남고 마지막 항목은 선이 없습니다. `className` 으로
    항목의 테두리나 배경을 덮던 코드는 루트를 덮어야 합니다.
  - 열린 항목의 헤더와 본문 사이에 있던 선이 사라졌습니다(`box` · `line` 둘 다).
    `--nui-accordion--border-width` 가 먹이는 자리는 넷입니다 — `box` 루트 외곽 · `line` 루트
    위쪽 선 · 항목 구분선 · `separated` 항목 외곽.
  - 열린 항목은 테두리 색이 아니라 **제목이 `--nui-text-brand` 색 · 굵게(700)** 바뀝니다.
    화살표만 버튼인 `buttonIndex` 헤더는 제목이 바뀌지 않고 화살표만 돕니다. 제목의 기본
    굵기가 700 → **400** 이 되어 닫힌 항목이 가벼워집니다.
  - 화살표 뒤의 회색 원이 사라졌고 화살표가 16px → **20px** 로 커졌습니다. `buttonIndex` 버튼은
    hover · 포커스 · 눌림 어디서도 면을 그리지 않고, 눌림은 `--nui-scale-90` 으로 화살표가 줄어드는
    것만으로 말합니다.
  - 새 토큰 `--nui-text-brand`(brand-11) — 브랜드로 강조하는 글자.
- 0d3afe0: `Accordion` 의 자리 번호를 `Item` 한 곳에만 적을 수 있습니다. `Accordion.Button` 과
  `Accordion.Panel` 의 `index` 가 선택으로 바뀌어, 생략하면 감싼 `Accordion.Item` 에서 받아 갑니다.
  
  ```tsx
  <Accordion.Item index={0}>
    <Accordion.Button>
      <Accordion.Head>배송은 얼마나 걸리나요?</Accordion.Head>
    </Accordion.Button>
    <Accordion.Panel>영업일 2~3일이 걸립니다.</Accordion.Panel>
  </Accordion.Item>
  ```
  
  세 곳에 적던 코드는 그대로 돕니다 — **직접 준 값이 이깁니다.** 셋 중 하나만 어긋났을 때
  타입은 통과하고 엉뚱한 패널이 열리던 자리가 닫힙니다. `Item` 밖에 두면서 `index` 도 빼면
  무엇을 해야 하는지 알려 주는 메시지와 함께 멈춥니다.
  
  `Accordion.Head` 의 `buttonIndex` 는 그대로 직접 줍니다. 그 prop 은 자리 번호가 아니라
  「화살표만 버튼으로 만든다」는 모드 스위치라, 생략은 「헤더 전체가 버튼」이라는 뜻입니다.
  
  **제목을 heading 으로 만들 수 있습니다.** 루트에 `headingLevel` 을 주면 그 수준의
  `h2`~`h6` 안에 제목이 들어갑니다. 헤더 전체가 버튼인 모드는 heading 이 버튼을 감싸고,
  화살표만 버튼인 모드는 제목 상자가 그 태그가 됩니다.
  
  ```tsx
  <Accordion headingLevel={3}>…</Accordion>
  ```
  
  받는 값은 `2`~`6` 입니다. **기본값이 없어** 주지 않으면 heading 을 만들지 않습니다 — 페이지의
  제목 계층은 쓰는 쪽이 압니다. 타입이 필요하면 `AccordionHeadingLevel` 을 가져다 씁니다.
  
  앱이 `h2`~`h6` 에 여백을 주고 있으면 그 여백이 아코디언 안에도 옵니다. 라이브러리 스타일은
  `@layer` 안이라 앱의 태그 규칙에 집니다. 항목 사이가 벌어지면 그 규칙에서
  `.nui-accordion__heading` 과 `.nui-accordion__title-box` 를 빼면 됩니다.
  
  **모션 감소 설정에서 패널이 계속 움직이던 것을 고쳤습니다.** `prefers-reduced-motion: reduce`
  인데도 높이 전환이 그대로 돌고 있었습니다(120ms 사이 74 → 7px). 이제 즉시 정착합니다.
  
  닫힌 패널을 감추는 수단이 `inert` 하나로 정리됐습니다. 겹쳐 걸려 있던 `pointer-events: none`
  을 뺐습니다 — `inert` 가 클릭·포커스·텍스트 선택을 모두 막습니다. 보이는 동작은 같습니다.
  
  `Accordion.Button` 과 `Accordion.Panel` 의 `index` 타입이 `number` 에서 `number | undefined`
  가 됩니다. 그 prop 타입을 읽어 쓰던 래퍼 코드가 있다면 타입만 맞춰 주면 됩니다.
- 68fc5d9: `BottomSheet` 에 **끌어서 닫기**가 생기고, **팝업 계열 전체의 열림·닫힘 모션이 달라집니다.**
  
  ### 끌어서 닫기 — `shouldCloseOnDrag`
  
  ```tsx
  <BottomSheet open={isOpen} onRequestClose={close} shouldCloseOnDrag title="정렬">
    …
  </BottomSheet>
  ```
  
  켜면 시트 위에 손잡이가 생기고, **위쪽 44px 띠**를 아래로 끌면 시트가 손가락을 따라옵니다.
  놓았을 때 시트 높이의 40% 를 넘게 내려왔거나 빠르게 튕겼으면 닫히고, 아니면 제자리로 돌아옵니다.
  
  - **기본은 꺼져 있습니다.** 이 prop 을 쓰지 않으면 시트의 동작은 그대로입니다.
  - 제목과 본문은 끄는 면이 아닙니다. 제목은 긁을 수 있고 본문은 스크롤합니다.
  - 끌어서 닫는 것도 `onRequestClose` 를 부릅니다. 그 prop 이 없으면 끌려도 제자리로 돌아옵니다.
  - **켜면 닫기 버튼이 기본으로 사라집니다.** 손잡이가 닫는 자리라 × 가 중복이기 때문입니다.
    둘을 함께 두려면 `hasCloseButton` 을 적습니다. 딤과 `Esc` 는 그대로라 드래그를 못 하는
    사용자의 출구는 남습니다.
  - `hasDragHandle={false}` 로 손잡이 막대만 감출 수 있습니다. 띠는 남아 끌리지만 **24px 로 줄고**
    끌 수 있다는 것을 알릴 길도 없어져 권하지 않습니다.
  - 모션 감소 설정에서도 끌립니다. 놓으면 즉시 제자리이거나 즉시 닫힙니다.
  - `shouldCloseOnDrag` · `hasDragHandle` 은 `BottomSheet` 에만 있습니다. `FullPopup` · `LayerPopup` ·
    `Alert` · `Confirm` 의 타입에는 나타나지 않습니다.
  
  새 공개 훅 둘 — `--nui-bottom-sheet--handle-width`(36px) · `--nui-bottom-sheet--handle-height`(4px).
  
  ### 모션 — 팝업 다섯 모두에 걸립니다
  
  `shouldCloseOnDrag` 를 쓰지 않아도 보이는 변화입니다. 화면만 달라지고 API 는 그대로입니다.
  
  | | 전 | 후 |
  | --- | --- | --- |
  | 딤 | 팝업 종류와 무관하게 100ms | **패널과 같은 시간·곡선** — 딤과 패널이 한 면으로 움직입니다 |
  | `BottomSheet` 열림 | 스프링 0.3 | 스프링 **0.25** |
  | `BottomSheet` 닫힘 | 250ms | **200ms** · 끌어서 닫으면 놓은 속도를 이어받습니다 |
  | `FullPopup` 열림 | 300ms · 첫 프레임에 화면 폭의 31% | 300ms · **더 고른 곡선**으로 첫 프레임 14% |
  | `Alert` · `Confirm` · `LayerPopup` | — | 그대로입니다 |
  
  ### 스크롤
  
  팝업 본문이 끝에 닿아도 **뒤 페이지가 따라 스크롤되지 않습니다**(`overscroll-behavior: contain`).
  팝업 계열 전부에 걸립니다. 지금까지 본문 끝에서 배경이 밀리던 동작에 기대고 있었다면 달라집니다.
- be037b8: 브랜드 색 프리셋 185색이 CSS 파일로 패키지에 들어갑니다. 번호를 골라 한 줄 불러오면 화면 전체가 그 색이 됩니다.
  
  ```tsx
  // app/layout.tsx
  import "@nui-kit/react/styles/index.css";
  import "@nui-kit/react/styles/themes/preset-42.css";
  ```
  
  설치할 것도 실행할 것도 없습니다. 예전에는 저장소 안에서만 도는 명령을 안내하고 있어서 실제로는 고를 길이 없었습니다.
  
  문서 사이트의 미리보기와 같은 빌드에서 나온 파일이라 **보이는 색과 받는 색이 같습니다.** 파일 머리에 패키지 버전이 적혀 있고, 라이브러리를 올리면 그 버전의 색을 받습니다.
  
  패키지 용량이 늘어납니다. 압축 243 kB → 326 kB, 풀면 1.1 MB → 2.0 MB. 번들에는 불러온 파일 하나만 들어갑니다.
  
  목록에 없는 색은 아직 지원하지 않습니다.
- 1a92246: 목록에 없는 브랜드 색을 명령 하나로 만들 수 있습니다.
  
  ```bash
  npx nui-theme --accent "#b1002a"   # 목록에 없는 색
  npx nui-theme --preset 42          # 프리셋도 같은 명령. 패키지에 든 파일을 복사합니다
  ```
  
  설치돼 있으면 바로 됩니다. 의존성이 더 깔리지 않습니다. 생성기가 패키지 안에 들어 있어서 tarball 이 약 180 kB 늡니다.
  
  성공하면 `./nui-theme.css` 가 생기고 루트 `layout` 에 import 한 줄(`app/layout.tsx` 기준 `import "../nui-theme.css"`)이 들어갑니다. 이미 있으면 그대로 두고, 다시 실행하면 파일을 덮어씁니다. `--no-apply` 를 주면 파일만 만듭니다.
  
  고른 색은 색조의 원천이고 9단계는 그 색조로 만든 채움입니다. 페이지 배경과 구분되는 한 고른 색이 9단계에 그대로 앉고, 배경에 녹는 색이면 같은 색조의 가장 가까운 채움이 대신 앉습니다. 명령이 전후 값을 찍습니다. 문서 사이트의 프리셋 카드도 같은 내용을 라이트 · 다크 배지로 보여줍니다.
  
  프리셋을 고를 때 쓴 기준을 그대로 지납니다. 회색에 가까운 색, 채움 위 글자나 본문 글자 대비가 기준에 못 미치는 색은 받지 않습니다. 그때는 이유와 수치를 찍고 파일도 layout 도 바꾸지 않습니다. 이전에 만든 것이 있으면 그대로 남습니다.
- e6369d7: 취소 버튼을 주 행동보다 좁게 놓을 수 있다
  
  `ButtonGroup` 에 `ratio` 를 더했다. 첫 항목이 취소 · 닫기 · 초기화처럼
  **되돌리는 행동**일 때 `"3:7"` 을 주면 폭으로도 위계가 드러난다.
  
  ```tsx
  <ButtonGroup ratio="3:7">
    <ButtonGroupItem>
      <Button variant="line">취소</Button>
    </ButtonGroupItem>
    <ButtonGroupItem>
      <Button color="primary">저장</Button>
    </ButtonGroupItem>
  </ButtonGroup>
  ```
  
  기본값은 `"equal"`(균등 분할)이라 지금 쓰던 코드는 그대로 동작한다.
  임의 비율은 받지 않는다 — 권장되는 값이 3:7 하나뿐이라서다.
- 54b2030: Button 계열의 CSS 변수 이름을 컴포넌트·옵션·속성 셋으로 나누고, `variant="text"` 를 글자 폭으로 바꿨습니다.
  
  **BREAKING — 변수 이름 열 개가 바뀝니다.** `:root` 나 `className` 으로 아래를 덮어쓰고 있었다면 새 이름으로 옮겨야 합니다. 옮기지 않으면 값이 조용히 무시됩니다.
  
  | 이전 | 지금 |
  | --- | --- |
  | `--nui-button--lg-height` | `--nui-button--large-height` |
  | `--nui-button--md-height` | `--nui-button--medium-height` |
  | `--nui-button--sm-height` | `--nui-button--small-height` |
  | `--nui-button--lg-padding-x` | `--nui-button--large-padding-x` |
  | `--nui-button--md-padding-x` | `--nui-button--medium-padding-x` |
  | `--nui-button--sm-padding-x` | `--nui-button--small-padding-x` |
  | `--nui-button--radius` | `--nui-button--medium-radius` · `--large-radius` · `--small-radius` (둥글기가 크기를 따릅니다) |
  | `--nui-button--radius` (아이콘 버튼) | `--nui-icon-button--medium-radius` · `--large-radius` · `--small-radius` |
  | `--nui-button--round-radius` (아이콘 버튼) | `--nui-icon-button--round-radius` |
  | `--nui-button--border-width` (아이콘 버튼) | `--nui-icon-button--border-width` |
  
  아래 셋은 `IconButton` 이 자기 변수를 갖기 전에 `Button` 것을 **상속해서 읽던** 자리입니다. `Button` 쪽 이름은 그대로 남아 있으니 버튼에 준 값은 계속 듣습니다. 아이콘 버튼만 새 이름으로 옮기면 됩니다.
  
  옵션 이름이 prop 값과 같아졌습니다. `size="large"` 를 쓰면 변수도 `--large-` 입니다. 예전에는 코드에서는 `large`, CSS 에서는 `lg` 라 같은 개념을 두 낱말로 찾아야 했습니다.
  
  **IconButton 과 ButtonGroup 이 자기 변수를 갖습니다.** 예전에는 `IconButton` 의 크기를 열어 두지 않아 바꿀 수 없었고, 모양과 선 두께는 `Button` 과 같은 이름을 써서 하나를 바꾸면 둘이 함께 움직였습니다.
  
  - `--nui-icon-button--large-size` · `-medium-size` · `-small-size` — 하나가 가로와 세로를 함께 먹여 정사각을 지킵니다
  - `--nui-icon-button--medium-radius` · `-large-radius` · `-small-radius` · `-round-radius` · `-border-width`
  - `--nui-button-group--gap` — 항목 사이 간격. 항목의 기준 폭도 같이 따라갑니다
  
  **Button 에 변수 셋이 늘었습니다.** `--nui-button--gap`(아이콘과 라벨 사이) · `--nui-button--text-padding-x` · `-text-padding-y`.
  
  **`variant="text"` 가 부모 폭을 채우지 않고 글자 폭이 되고 **좌우 여백이 12px 에서 8px 로 줄어듭니다.**** 면도 테두리도 없어서 폭을 채우면 눌리는 범위만 넓어지고 보이는 것은 글자 하나였습니다. 최소 폭 120px 도 걸려서 「닫기」 같은 짧은 라벨이 그만큼 자리를 차지했습니다. 이제 문장 안이나 목록 행 안에 그대로 넣을 수 있습니다. 위아래 여백은 4px 그대로입니다. `ButtonGroup` 안에서도 글자 폭을 지킵니다.
  
  문서 사이트의 props 표가 타입 별칭 대신 **값을 보여줍니다.** `ButtonShape` 라고만 적혀 있던 자리에 `"round" | "square"` 가 들어갑니다.
- 3e3eff2: `size="large"` 버튼의 글자와 아이콘이 한 단계 커진다.
  
  `Button` · `ButtonLink` · `IconButton` 의 `large` 에서 글자가 16px 에서 **18px**, 아이콘이
  20px 에서 **24px** 로 오른다. 네 variant(`solid` · `soft` · `line` · `text`) 전부에 걸린다.
  높이 56px · 좌우 여백 24px · 둥글기 8px 은 그대로다.
  
  | | 전 | 후 |
  | --- | --- | --- |
  | large 글자 | 16px | **18px** |
  | large 아이콘 | 20px | **24px** |
  | medium · small | 16 / 20 · 14 / 16 | 그대로 |
  
  `variant="text"` 는 높이를 선언하지 않고 글자가 높이를 만드므로, 보이는 높이가 32px 에서
  **35px** 로 바뀐다. 그전까지 `large` 와 `medium` 이 같은 모양이었던 것이 여기서 갈린다.
  `IconButton` 의 `large` 도 56px 정사각 안의 아이콘이 24px 이 된다.
  
  **글자·아이콘 크기에는 공개 훅이 없다.** 되돌리려면 `className` 으로 덮어야 한다.
  `--nui-button--large-height` 로 높이만 줄여 둔 곳은 상자가 줄어도 글자가 18px 로 남으므로
  함께 확인한다.
  
  입력 컨트롤(`Textfield` · `Select` · Datepicker 계열)의 글자는 두 size 에서 16px 그대로다.
  액션 라벨과 입력값은 다른 역할이라 같은 `size="large"` 라도 고르는 크기가 다르다.
- bee3b3a: **BREAKING** `ButtonLink` 가 배럴과 `/button` 서브패스에서 빠지고 **`@nui-kit/react/next`** 로만
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
- 16762d3: `Button` · `IconButton` · `ButtonLink` 에 셋이 더해지고 하나가 고쳐집니다.
  
  - **`color="quiet"`** — neutral 보다 한 단계 조용한 색입니다. 취소 · 닫기 · 목록 행의 부차 액션처럼 눈에 덜 띄어야 하는 자리에 씁니다. 네 variant 전부에서 씁니다(solid 는 회색 채움에 흰 글자, line · text · soft 는 회색 글자)
  - **`variant="text"` 가 `size` 를 받습니다.** 바뀌는 것은 글자와 아이콘뿐이고 높이는 잡지 않습니다. `small` 은 14px · 아이콘 16, `medium` 과 `large` 는 16px · 아이콘 20 으로 같은 모양입니다. 문장 안에 둘 때 주변 글자 크기에 맞추는 용도입니다. `shape` 는 여전히 받지 않습니다
  - **둥글기가 크기를 따릅니다.** `large`(56px)가 8px 이 되고 `medium` · `small` 은 6px 그대로입니다. `IconButton` 도 같습니다
  - **`ButtonLink` 의 밑줄이 없어집니다.** 브라우저 기본 `<a>` 밑줄이 네 variant 전부에 남아 있던 결함입니다. 밑줄이 필요하면 `className` 으로 다시 줍니다
  
  **BREAKING — 둥글기 변수 이름이 갈라집니다.** 크기마다 값이 달라 한 이름으로 둘 수 없습니다. 옛 이름은 아무것도 바꾸지 않습니다.
  
  | 이전 (0.1.2) | 지금 |
  | --- | --- |
  | `--nui-button--radius` | `--nui-button--medium-radius` (6px) · `--nui-button--large-radius` (8px) · `--nui-button--small-radius` (6px) |
  | `--nui-button--radius` (아이콘 버튼이 상속해 읽던 것) | `--nui-icon-button--medium-radius` · `--nui-icon-button--large-radius` · `--nui-icon-button--small-radius` |
  
  `--nui-button--round-radius` · `--nui-icon-button--round-radius` 는 그대로입니다.
  
  새 토큰 한 벌 — `--nui-action-quiet` · `-hover` · `-active` · `-fg` · `-fg-line` · `-fg-line-strong` · `-soft` · `-soft-hover` · `-soft-active`.
- d3aac41: Button 에 `soft` 를 더하고, `line` 의 테두리를 중립으로 바꾼다
  
  **`variant="soft"` 가 늘었다.** 채워져 있지만 조용한 한 단계라, 눌러야 할 것이 둘일 때
  두 번째를 맡는다. 위계가 넷이 된다 — `solid`(High) · `soft`(Medium) · `line`(Low) ·
  `text`(Lowest). 채워진 버튼을 한 화면에 둘 놓지 않고도 두 번째 행동을 면으로 보여줄 수
  있다.
  
  ```tsx
  <Button color="primary">저장하기</Button>
  <Button color="primary" variant="soft">복제하기</Button>
  ```
  
  **`line` 의 테두리가 역할색에서 중립 회색으로 바뀐다.** 색은 글자와 아이콘에만 남는다.
  목록 행마다 반복되는 자리라 색 테두리가 여러 번 겹치면 화면이 줄무늬처럼 보였다.
  삭제 버튼은 여전히 빨간 글자이며, 되돌릴 수 없는 확인에는 `variant="solid"` 나
  `Confirm` 을 쓴다.
  
  시각만 바뀌고 기존 prop 은 그대로다. `soft` 는 새로 여는 값이라 쓰던 코드는 영향이 없다.
  
  새 CSS 변수 — `--nui-action-{역할}-soft` 와 그 hover·active, `--nui-action-border` 와
  그 hover·active·disabled. 색 변수는 공개 커스터마이징 창구가 아니다(브랜드 색 프리셋을
  쓴다).
- d016ed1: `Checkbox` 의 `shape="ghost"` 가 마우스를 올리거나 누를 때도 면을 그리지 않습니다.
  
  이전에는 hover 와 눌림에 옅은 회색 면이 잠깐 떴습니다. ghost 는 「배경 없이 체크만」인
  모양이라 그 면을 뺐습니다. 눌림은 체크가 작아지는 것으로만 말합니다.
  
  면이 없어 배율이 유일한 눌림 신호라, ghost 만 한 단계 더 줄입니다. 새 토큰
  `--nui-scale-90`(0.90) 이 생겼고 ghost 의 눌림이 이것을 씁니다. 24px 의 10% 입니다.
  `square` 와 다른 24px 요소(Textfield 지우기 · Select 화살표 · Toast 닫기)는 눌림 면이
  있어 `--nui-scale-94` 그대로입니다.
  
  공개 API · 클래스 · 기존 CSS 변수 이름은 바뀌지 않았습니다.
- 043c42f: Checkbox 에 `shape` 을 더했습니다. 상자를 그릴지, 체크만 둘지 고릅니다.
  
  ```tsx
  <Checkbox checked={agreed} onChange={toggle} />                // square — 기본
  <Checkbox shape="ghost" checked={agreed} onChange={toggle} />  // 체크만
  ```
  
  `ghost` 는 필수 선택이 아니고 항목이 셋 이하인 자리에 씁니다. 미선택에도 연한 체크가
  보이고, 선택하면 획이 굵어지며 커집니다 — 선택 여부를 색만으로 말하지 않기 위해서입니다.
  
  ⚠️ **`ghost` 에는 외곽선이 없어 KRDS 의 체크박스 외곽선 대비 요건(3:1)을 만족하지
  못합니다.** 공공 서비스처럼 KRDS 준수가 요구되는 화면에서는 `square` 를 쓰세요.
  상자가 없으니 「일부」를 그릴 자리도 없어 `ghost` 에는 `indeterminate` 를 줄 수 없습니다.
  
  둥글기도 열었습니다. `square` 의 상자에 걸리고, 24×24 정사각이라 `50%` 를 주면 **원**이 됩니다.
  
  ```css
  :root { --nui-checkbox--square-radius: 50%; }
  ```
  
  ---
  
  **BREAKING** — `CheckboxProps` 가 `shape` 으로 갈리는 유니온이 됐습니다.
  `Omit<CheckboxProps, …>` 으로 감싸던 래퍼가 있다면 `DistributiveOmit` 으로 바꿔야 합니다.
  
  ```tsx
  import type { CheckboxProps, DistributiveOmit } from "@nui-kit/react";
  
  type MyProps = DistributiveOmit<CheckboxProps, "className">;   // ✅
  // type MyProps = Omit<CheckboxProps, "className">;            // ❌ 갈래가 접힌다
  ```
  
  평범한 `Omit` 은 유니온을 하나로 접습니다. 접히면 감싼 타입을 다시 `<Checkbox>` 에
  넘길 수 없고, 막아 둔 `ghost` + `indeterminate` 조합이 통과합니다. `DistributiveOmit` 은
  이번에 함께 공개한 타입이고, 갈래가 없는 다른 컴포넌트의 props 에는 `Omit` 과 결과가
  같으므로 아무 데나 써도 됩니다.
- b5240b1: **BREAKING** 닫힘 모션이 끝났을 때의 콜백과 닫기 버튼 접근 이름의 prop 이름을 다른 컴포넌트와 맞췄다.
  
  | 전 | 후 | 어디 |
  | --- | --- | --- |
  | `onExited` | `onCloseComplete` | `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` · `Toast` |
  | `closeButtonLabel` | `closeLabel` | `LayerPopup` · `BottomSheet` · `FullPopup` |
  
  `Toast` 는 명령형 `toast.open({ onCloseComplete })` 과 선언형 `<Toast onExited />` 가 같은 순간을 다른 이름으로 부르고 있었다. 열림 쪽은 이미 둘 다 `onOpenComplete` 였다. 닫기 버튼 이름도 `Toast` 는 `closeLabel`, 팝업은 `closeButtonLabel` 이었다.
  
  `PopupHost` 가 등록한 컴포넌트에 넣어 주는 prop 도 함께 바뀐다. `LayerPopupComponentProps` 를 받는 컴포넌트는 `onExited` 대신 `onCloseComplete` 를 받아 셸에 넘긴다.
  
  ```tsx
  // 전
  function ProfilePopup({ open, onRequestClose, onExited, isTopmost }: LayerPopupComponentProps) {
    return <LayerPopup open={open} onRequestClose={onRequestClose} onExited={onExited} isTopmost={isTopmost} closeButtonLabel="닫기" title="프로필" />;
  }
  
  // 후
  function ProfilePopup({ open, onRequestClose, onCloseComplete, isTopmost }: LayerPopupComponentProps) {
    return <LayerPopup open={open} onRequestClose={onRequestClose} onCloseComplete={onCloseComplete} isTopmost={isTopmost} closeLabel="닫기" title="프로필" />;
  }
  ```
- 10befbe: 글자 수 카운터가 `Textarea` 안에서 **메시지와 같은 줄**로 옮겨졌다. `Message` 가 카운터를 갖게 되어 다른 폼 컨트롤도 같은 자리를 쓸 수 있다.
  
  ```tsx
  <Textarea value={text} onChange={onChange} maxLength={100} errorMessage="100자를 넘었어요" />
  // 에러는 왼쪽, 3 / 100 은 오른쪽 — 한 줄이다
  ```
  
  - 현재 수는 진하게, 최대 수는 연하게 표시된다. 넘치면 둘 다 빨개진다
  - 카운터는 `aria-live` **밖**이다. 안에 있으면 타이핑 한 글자마다 스크린리더가 숫자를 읽는다
  - `counterLabel` 로 화면 낭독 전용 문구를 바꿀 수 있다
  
  클래스 이름이 바뀌었다 — `.nui-textarea__counter` 가 `.nui-message__counter` 다. 그 클래스로 스타일을 덮고 있었다면 고쳐야 한다.
- ccdadf1: **BREAKING** `DateRangePicker` · `DateMultiplePicker` 에 확정 버튼이 생겼다. 날짜를 골라도 **확정을 누를 때까지 값이 나가지 않는다.**
  
  ```tsx
  // 전 — 둘 다 고르는 순간 값이 나가고 닫혔다
  // 후 — 고른 것은 달력 안에만 있고, 확정을 누를 때 한 번 나간다
  <DateRangePicker selected={range} onSelectedChange={setRange} />
  ```
  
  | | |
  | --- | --- |
  | `hasConfirmButton` | 기본 `true`. `false` 면 예전처럼 즉시 반영된다 |
  | `confirmLabel` | 기본 `"선택 완료"` |
  
  **미완성이면 버튼이 잠긴다** — 기간은 종료일이 없을 때, 다중은 아무것도 안 골랐을 때다. 확정하지 않고 `Escape` · 바깥 클릭으로 닫으면 고른 것을 버리고 열기 전 값으로 돌아간다.
  
  **함께 고쳐진 것** — 기간 선택 중 시작일만 고르면 `onSelectedChange(undefined)` 가 불려 **소비자가 갖고 있던 기간이 지워졌다.** 이제 확정 전까지 값을 건드리지 않는다.
  
  `Datepicker`(하루)에는 확정 버튼이 없다. 고른 순간 결과가 확정되므로 두 번 누르게 하지 않는다.
- f4fe390: 날짜 범위·다중 선택에서 입력창 `Enter` 가 확정 버튼과 같은 일을 합니다. 확정 판정은 컴포넌트가 갖습니다.
  
  **달력을 열어 두고 `Enter` 를 쳐도 고른 날짜가 사라지지 않습니다.** 예전에는 달력이 그냥 닫히고 방금 고른 것이 버려졌습니다. 「친 값은 이미 반영돼 있다」는 전제가 타이핑에만 맞았고, 달력을 클릭해 고른 것은 확정 전까지 나가지 않기 때문입니다.
  
  | 그때 상태 | `Enter` |
  | --- | --- |
  | 확정할 수 있다 | 확정합니다. 확정 버튼을 누른 것과 결과가 같습니다 |
  | 확정할 수 없다 (미완성 기간 · 빈 선택) | 아무 일도 하지 않습니다. 닫지도 값을 내보내지도 않습니다 |
  | 확정 버튼이 없다 (`Datepicker` · `hasConfirmButton={false}`) | 예전 동작 그대로입니다 |
  
  버튼이 잠겨 있으면 키도 잠겨 있습니다. 키보드만 쓰는 사람이 달력 안으로 이동하지 않고 입력창에서 바로 확정할 수 있습니다.
  
  `Enter` 로 닫히던 것에 기대던 코드가 있으면 이제 값이 한 번 더 나갑니다. 확정 버튼이 있는 모드에만 걸립니다.
  
  **BREAKING — `getIsConfirmable` 을 더 받지 않습니다.** 넘기고 있었다면 타입 에러가 나므로 그 줄을 지우면 됩니다.
  
  함께 고친 것 둘이 있습니다. 달력을 연 채 날짜를 고르고 **지우기 버튼**을 누르면 값이 비었는데도 확정 버튼이 열려 있어 누르면 지운 값이 되살아났습니다. 달력에서 시작일만 골라 둔 채 **입력창에 완전한 기간을 치면** 값은 나갔는데 확정 버튼과 `Enter` 가 잠긴 채로 남았습니다. 둘 다 임시 선택이 안 비워져 생긴 것이고 이제 비웁니다.
  
  **동작은 바뀌지 않습니다.** 넘긴 값은 예전에도 컴포넌트의 고정 판정에 덮여 무시되고 있었습니다. 타입만 그 사실을 말하지 않고 있었습니다.
  
  무엇이 확정 가능한 값인지는 컴포넌트가 정합니다. 범위는 시작일과 종료일이 둘 다 있어야 하고, 다중은 하나 이상 골라야 합니다. 미완성 기간에서 확정을 잠그는 것은 이 컴포넌트가 하는 약속이라 느슨하게 만들 수 있으면 「확정 전까지 값을 내보내지 않는다」가 뜻을 잃습니다.
- d851e4f: 달력에서 **앞뒤 달 날짜가 사라진다.** 이번 달이 시작되기 전과 끝난 뒤의 자리는 이제 비어 있다.
  
  예전에는 흐린 회색으로 그려졌는데, **색은 「못 누른다」고 말하면서 실제로는 눌렸다.** 그 글자의 대비도 3.30 이라 누를 수 있는 글자의 기준(4.5)에 못 미쳤다.
  
  격자는 그대로 7칸이고 빈 자리만 생긴다. 예전처럼 보고 싶으면 `dayPickerProps={{ showOutsideDays: true }}` 를 준다.
- 4fc4c9e: `Field` 가 Header · Input · Footer 세 영역이 됐습니다. 라벨 오른쪽에 보조 자리(`Field.Header suffix`)가 열리고, 도움말 · 에러 · 글자 수가 Footer 한 줄에 모입니다. 공개 변수 셋이 생겼고 `required` 가 안쪽 항목까지 내려갑니다.
  
  **BREAKING — `Field.Description` 이 없어집니다.** 도움말은 `infoMessage` 로 줍니다. 자기 컨트롤을 만들며 `FieldContextValue.registerDescription` 을 읽었다면 그 값도 없습니다.
  
  | 이전 | 지금 |
  | --- | --- |
  | `<Field.Description>본인 확인에만 사용해요</Field.Description>` | `<Field infoMessage="본인 확인에만 사용해요">` |
  | `FieldDescription` (named export) | `FieldHeader` 가 대신 들어왔습니다. 도움말은 위와 같이 prop 으로 |
  | `FieldContextValue.registerDescription` | 없음. 도움말 id 는 Footer 가 `describedByIds` 에 넣습니다 |
  
  **BREAKING — Field 안 컨트롤의 메시지 줄이 Field 의 Footer 로 옮겨 갑니다.** `Textfield` · `Search` · `Password` · `Textarea` · `Select` · `MultiSelect` · Datepicker 계열이 `Field`(또는 `Field.Item`) 안에 있으면 자기 `.nui-message` 를 그리지 않고 `Field` 가 `.nui-field__footer > .nui-message` 하나로 그립니다. `.nui-textfield .nui-message` 처럼 컨트롤 안의 메시지를 직접 가리키던 CSS 는 Field 안에서 더는 맞지 않습니다. Field 밖에서는 지금과 같습니다.
  
  - 빈 `Field` · `Field.Item` 에도 `div.nui-field__footer > div.nui-message` 가 항상 렌더됩니다(자리를 차지하지 않습니다). `.nui-field > :last-child` 같은 CSS 나 DOM 스냅샷 테스트가 이것을 봅니다
  - Field 안 `Textarea` 의 `.nui-textarea__foot` 이 사라집니다 — 카운터도 Footer 로 갑니다
  - 컨트롤에 준 `errorMessage` 로 `Field` 라벨도 빨개집니다. 예전에는 라벨이 그대로였습니다
  - 컨트롤에 준 정적 `errorMessage` · `infoMessage` · 글자 수는 hydration 뒤에 그려집니다. `Field` 에 준 것은 서버 HTML 에 바로 들어갑니다. 손으로 검증하는 메시지는 `Field` 에 주고, 컨트롤에는 RHF 래퍼가 넘기게 두는 것이 맞습니다
  
  **BREAKING — `direction="row"` 가 flex 에서 grid 로 바뀝니다.** `.nui-field--row` 에 flex 속성을 덮어쓰던 CSS 는 무효가 됩니다. 라벨 열은 `--nui-field--row-label-width`(기본 120px)로 고정되고 Footer 는 입력 열 아래에 섭니다.
  
  **BREAKING — `.nui-message` 의 왼쪽 여백 8px 가 없어지고 폭이 부모를 채웁니다.** Field 밖의 컨트롤 메시지에도 적용됩니다. 글자 수 카운터가 오른쪽 끝에 서기 위해서입니다.
  
  **새로 열린 것**
  
  - `Field.Header` · `FieldHeader` — 좌 `Field.Label`, 우 `suffix`(툴팁 아이콘 · `Button variant="text"` · 글자). suffix 에 버튼이 들어와도 Header 높이는 라벨 한 줄로 고정되어 `Field.Grid` 이웃과 입력 라인이 맞습니다. `suffix` 는 `<label>` 밖이라 눌러도 입력으로 포커스가 가지 않습니다
  - 공개 변수 — `--nui-field--gap`(라벨↔컨트롤 · 12px) · `--nui-field--grid-gap`(필드 사이 · 16px) · `--nui-field--row-label-width`(row 라벨 열 · 120px)
  - `Field.Grid` · `Field.Message` 가 `id` · `style` · `data-*` · `aria-*` 를 DOM 에 넘깁니다. 여섯 컴포넌트 전부 `ref` 를 받습니다
  - `<Field required>` 안의 `Field.Item` 컨트롤에도 `aria-required` 가 갑니다. 점은 부모 라벨 하나입니다 — `Item` 에 `required` 를 다시 주지 않습니다
  - `FieldContextValue.footerId` · `registerFooter` · `FieldFooterEntry` — 자기 컨트롤을 Field 의 Footer 에 물릴 때 씁니다
  - `CheckboxGroup` · `RadioGroup` 의 `direction="row"` 안에서 `Field.Item` 도 가로로 섭니다. 예전에는 세로로 쌓였습니다
- aaeaf8a: `Field` 에 필수 · 선택 표시가 생겼다. 그리고 선택 컨트롤 셋이 `children` 을 받으면 런타임에 죽던 것을 막았다.
  
  **필수 · 선택 표시** — `required` 를 주면 라벨 오른쪽에 점이 붙고 컨트롤에 `aria-required` 가 간다.
  
  ```tsx
  <Field required>
    <FieldLabel>휴대폰 번호</FieldLabel>
    <Textfield value={phone} onChange={onChange} />
  </Field>
  
  <Field optionalLabel="선택">
    <FieldLabel>회사</FieldLabel>
    <Textfield value={company} onChange={onChange} />
  </Field>
  ```
  
  | prop | 기본값 | 무엇 |
  | --- | --- | --- |
  | `required` | `false` | 6px 점 + 화면 낭독 전용 문구 + `aria-required` |
  | `requiredLabel` | `"필수"` | 그 문구 |
  | `optionalLabel` | **없음** | 주면 선택 문구를 그린다 |
  
  `optionalLabel` 에 기본값이 없는 이유 — 한 화면에서 필드의 3분의 2 이상이 필수면 「선택」만 표시하고, 그렇지 않으면 필수 표시만 쓴다. 한 폼에서 둘을 섞지 않는다. 기본값이 있으면 그 판단이 소비자 손을 떠난다.
  
  **`Checkbox` · `Radio` · `Switch` 가 `children` 을 받지 않는다.** 예전에는 타입이 통과하고 화면이 죽었다 — `<input>` 에 자식을 넣을 수 없기 때문이다. 라벨은 `FieldLabel` 로 붙인다.
  
  ```tsx
  // 전 — 컴파일은 되고 렌더에서 터졌다
  <Checkbox>이용약관에 동의합니다</Checkbox>
  
  // 후
  <FieldItem>
    <Checkbox />
    <FieldLabel>이용약관에 동의합니다</FieldLabel>
  </FieldItem>
  ```
- b9e15c8: 아이콘이 지나는 문을 `Icon` 하나로 모으고 `lucide-react` 를 peer 로 올렸다.
  
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
- 9c9d0ac: 입력 컨트롤에 `size` 가 생겼습니다. `Textfield` · `Search` · `Password` · `Select` · `MultiSelect` · `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 가 `size="medium" | "large"` 를 받습니다. `Button` 의 같은 이름과 같은 높이(medium 48px · large 56px)라 폼 한 줄에 나란히 놓을 때 `size` 를 안 적어도 높이가 맞습니다.
  
  **BREAKING — 기본 높이가 56px 에서 48px 로 바뀝니다.** `size` 를 안 준 모든 입력이 8px 낮아집니다. 예전 높이를 유지하려면 `size="large"` 를 줍니다.
  
  **BREAKING — 공개 변수 이름이 갈라집니다.** 한 이름으로 두 단계를 덮으면 소비자가 값을 넣는 순간 두 단계가 같아지기 때문입니다. 옛 이름은 아무것도 바꾸지 않습니다.
  
  | 이전 | 지금 |
  | --- | --- |
  | `--nui-textfield--height` | `--nui-textfield--medium-height` (48px) · `--nui-textfield--large-height` (56px) |
  | `--nui-textfield--radius` | `--nui-textfield--medium-radius` (6px) · `--nui-textfield--large-radius` (8px) |
  | `--nui-select--height` | `--nui-select--medium-height` · `--nui-select--large-height` |
  | `--nui-select--radius` | `--nui-select--medium-radius` · `--nui-select--large-radius` |
  
  - `large` 의 둥글기는 8px 입니다(KRDS 산식 높이 × ⅛). `medium` 은 6px 그대로입니다
  - `Textfield` 의 `size` 는 HTML 의 글자 폭(`size={20}`)이 아니라 높이 단계입니다. 숫자를 넘기던 코드는 타입 에러가 납니다. 폭은 원래 `100%` 라 화면 효과는 없던 자리입니다
  - `MultiSelect` 의 값 영역 세로 여백이 8px 에서 4px 로 줄어 칩이 48px 안에 섭니다. `large` 에서는 8px 입니다
  - 새 타입 `TextfieldSize` · `SelectSize` 를 내보냅니다
  - 글자 크기 · 안쪽 버튼 · 좌우 여백 · 메뉴 · 옵션은 두 단계가 같습니다
- cb1e794: 테두리만 있는 버튼(`variant="line"`)과 글자만 있는 버튼(`variant="text"`)의 **글자와
  테두리 색이 바뀐다.** 채워진 버튼(`solid`)은 그대로다.
  
  **왜.** 두 variant 가 채워진 버튼의 **배경색**을 그대로 글자에 쓰고 있었다. 배경 위에
  놓일 때 맞춰 고른 색이라 배경이 없는 자리에서는 대비가 모자란다. 여덟 조합이 WCAG AA
  미달이었다 — 라이트에서 `warning`(1.50 : 1), 다크에서 `primary` · `secondary` ·
  `danger`(3.3~3.9 : 1).
  
  **무엇이 바뀌나.**
  
  | | 전 | 후 |
  | --- | --- | --- |
  | 기본 | 채움색 | 글자 전용 색 — 라이트에서 조금 진해지고 다크에서 밝아진다 |
  | hover · active | 글자색이 한 단계 이동 | **글자와 테두리가 함께 진해진다** + 회색 면 |
  | 테두리 | 채움색 | **글자와 같은 색** (원래 그랬다) |
  
  `line` 의 hover 는 예전에도 회색 면이었고, `text` 는 글자색만 바뀌었다. 이제 둘 다
  같은 방식으로 반응한다.
  
  가장 크게 달라지는 것은 **다크의 `line` · `text`** 다. 안 보이던 수준에서 또렷해진다.
  라이트의 `warning` 은 노랑이 글자로 성립하지 않아 어두운 색이 된다 — 노랑이 필요하면
  `solid` 를 쓴다.
  
  CSS 변수를 직접 덮어쓰던 프로젝트는 영향이 없다. 색 변수는 원래 공개 대상이 아니다.
- 6011788: Alert · Confirm 의 제목을 본문으로 내리고 아이콘을 tone 넷으로 좁힌다
  
  알림창을 열면 위에서부터 아이콘 · 제목 · 설명 순으로 읽힙니다. 예전에는 제목이 닫기 버튼이
  앉는 헤더 줄에 있었는데, 이 둘은 닫기 버튼이 없어 그 줄이 빈 껍데기였습니다. SEED
  `alert-dialog` 와 KRDS 모달 모두 제목과 설명을 한 덩어리로 둡니다.
  
  아이콘은 임의로 넘기는 대신 `tone` 넷 중 하나를 고릅니다. 고르면 그림과 색이 함께 정해집니다.
  
  | tone | 그림 | 언제 |
  | --- | --- | --- |
  | `info` (기본) | 동그라미 i | 알림 일반 |
  | `success` | 체크 | 접수 · 결제 완료 |
  | `warning` | 세모 느낌표 | 되돌릴 수 없는 행동 앞 |
  | `danger` | 동그라미 느낌표 | 삭제 · 실패 |
  
  `Confirm` 에 `tone="danger"` 를 주면 확인 버튼도 빨개집니다. 취소 버튼은 언제나 중립입니다.
  
  아이콘 모양은 넷이 서로 달라 색을 구분하지 못해도 알아볼 수 있습니다. 회색 원 배경은 없앴고
  글리프가 56px 자리를 그대로 차지합니다.
  
  ## BREAKING — 고쳐야 할 것
  
  | 옛 것 | 새 것 |
  | --- | --- |
  | `<Alert icon={<MyIcon />} />` · `<Confirm icon={…} />` | `<Alert tone="warning" />` |
  | `useAlert().open({ icon })` · `useConfirm().open({ icon })` · `openAsync({ icon })` | `open({ tone })` |
  | `icon={null}` · `icon: null` (아이콘 끄기) | `hasIcon={false}` · `hasIcon: false` |
  | `<LayerPopup icon={…} />` · `<BottomSheet icon={…} />` · `<FullPopup icon={…} />` | `children` 에 직접 넣습니다. 크기와 여백도 쓰는 쪽이 정합니다 |
  
  여기까지는 타입 에러로 드러납니다.
  
  **타입이 잡지 못하는 것이 셋입니다.**
  
  기본 아이콘의 그림과 크기가 바뀝니다. 예전에는 24px 동그라미 느낌표였고 지금은 56px 동그라미
  i 입니다. 예전 그림으로 두려면 `tone="danger"` 인데 색까지 빨개집니다.
  
  `Alert` · `Confirm` 의 제목이 `.nui-popup__head` 안에서 `.nui-popup__body` 안으로 옮겨갔습니다.
  `className` 으로 헤더를 겨냥해 CSS 를 쓰고 있었다면 셀렉터가 끊깁니다.
  
  `.nui-popup--no-header` 의 뜻이 「헤더 노드가 없다」로 좁아졌습니다. `Alert` · `Confirm` 에서는
  **항상** 붙습니다. 제목 유무는 새 클래스 `.nui-popup--no-title` 이 말합니다.
  
  ## 더해진 것
  
  `PopupTone` 타입과 아이콘 프리셋 둘(`InfoIcon` · `WarningIcon`)이 배럴로 나갑니다.
  상태 글자색 토큰 둘(`--nui-text-success` · `--nui-text-warning`)이 생겨 네 색이 한 세트가
  됐습니다.
- 4a3d06f: **BREAKING** 팝업에 이름을 붙이지 않으면 타입이 막는다. 그리고 크기·문구 prop 이름을 다른 컴포넌트와 맞췄다.
  
  **이름 붙이기** — `LayerPopup` · `BottomSheet` · `FullPopup` · `Alert` · `Confirm` 은 이제 `title` 이나 `dialogLabel` 중 하나를 반드시 받는다. 둘 다 없으면 컴파일이 실패한다.
  
  예전에는 셸마다 「레이어 팝업」 · 「바텀시트 팝업」 · 「전체 팝업」 같은 기본 이름이 들어 있었다. 타입이 통과하니 이름을 붙일 이유가 없었고, 스크린리더는 서로 다른 팝업 다섯을 같은 이름으로 읽었다. 그 기본값을 없앴다.
  
  ```tsx
  // 전 — 통과했지만 스크린리더는 "레이어 팝업" 이라고만 읽었다
  <LayerPopup open onRequestClose={close} />
  
  // 후 — 둘 중 하나를 준다
  <LayerPopup open title="배송지 변경" onRequestClose={close} />
  <LayerPopup open dialogLabel="배송지 변경" onRequestClose={close} />
  ```
  
  **이름 바꾸기**
  
  | 전 | 후 |
  | --- | --- |
  | `size="regular"` | `size="medium"` |
  | `confirmText` | `confirmLabel` |
  | `cancelText` | `cancelLabel` |
  
  크기 값은 `Button` 계열 네 곳이 이미 `medium` 을 쓰고 있었고 `Popup` 만 `regular` 였다. 문구 prop 은 다른 자리가 전부 `*Label` 이다.
- 2f0969f: **BREAKING** — 팝업은 **훅으로만** 엽니다. 여는 길이 하나가 되면서, 팝업이 떠 있는 동안에는 **언제나** 배경 스크롤이 잠기고 배경이 `inert` 가 됩니다.
  
  ### `Alert` · `Confirm` — 컴포넌트가 없어집니다
  
  훅에 넘기는 옵션이 곧 내용입니다.
  
  | 옛 | 새 |
  | --- | --- |
  | `import { Alert, Confirm } from "@nui-kit/react"` (`/popup` 도 같다) | `useAlert().open(options)` · `useConfirm().open(options)` / `openAsync(options)` |
  | `AlertProps` · `ConfirmProps` 타입 | `AlertPopupOptions` · `ConfirmPopupOptions` |
  
  ```tsx
  const alert = useAlert();
  alert.open({ title: "저장했습니다", confirmLabel: "닫기" });
  
  const confirm = useConfirm();
  if (await confirm.openAsync({ title: "이 글을 삭제할까요?", confirmLabel: "삭제", tone: "danger" })) remove();
  ```
  
  ### `LayerPopup` · `BottomSheet` · `FullPopup` — 컴포넌트를 만들고 훅으로 엽니다
  
  `<LayerPopup open={isOpen} onRequestClose={…}>` 처럼 앱 안에서 직접 렌더하던 길이 없어집니다. `PopupHost` 밖에서 렌더한 셸은 **그려지지 않습니다**(개발 모드에서 콘솔에 한 줄). 타입은 통과하므로 화면에서 드러납니다.
  
  | 옛 | 새 |
  | --- | --- |
  | `<BottomSheet open={isOpen} onRequestClose={close} title="정렬">…</BottomSheet>` | 아래처럼 컴포넌트로 만들어 `useBottomSheet().open({ component })` |
  | 겹칠 때 아래쪽에 `isTopmost={false}` | 없음 — `PopupHost` 가 스택 순서로 계산 |
  
  ```tsx
  function SortSheet(runtime: BottomSheetComponentProps) {
    return (
      <BottomSheet {...runtime} title="정렬">
        <Button variant="line" onClick={runtime.onRequestClose}>최신순</Button>
      </BottomSheet>
    );
  }
  
  useBottomSheet().open({ component: SortSheet });
  ```
  
  - `LayerPopupProps` · `BottomSheetProps` · `FullPopupProps` 의 `id` · `open` · `isTopmost` · `onRequestClose` · `onCloseComplete` 가 **required** 가 됩니다. `PopupHost` 가 넣어 주는 값을 `{...runtime}` 으로 그대로 펼치면 되고, 하나라도 빠뜨리면 타입 에러가 납니다
  - 새 타입 `LayerPopupContentProps` · `BottomSheetContentProps` · `FullPopupContentProps` — runtime 다섯을 뺀, 쓰는 쪽이 적는 props 입니다
  - 같은 팝업을 다른 값으로 열 때는 컴포넌트를 만드는 함수(팩토리)나 클로저를 씁니다. `open()` 에 props 를 실어 보내는 필드는 없습니다
  
  ### `PopupHost` 는 이제 필수입니다
  
  앱 루트에서 한 번 감쌉니다. 없으면 팝업이 그려지지 않고, 개발 모드에서 `open()` 을 부를 때 콘솔에 한 줄이 납니다.
  
  ### 함께 좋아지는 것
  
  - 어떤 팝업이든 떠 있는 동안 배경 스크롤 잠금 · 배경 `inert` · 닫힌 뒤 포커스 복원이 따라옵니다. 예전에 앱 안에서 직접 렌더한 팝업에는 셋 다 없었습니다
- 34fc838: `LayerPopup` · `BottomSheet` · `FullPopup` 에 표준 푸터를 열었다. 그리고 `Confirm` 의 두 버튼을 3:7 로 놓는다.
  
  `confirmLabel` · `cancelLabel` · `onConfirm` · `onCancel` 을 주면 취소(line) · 확인(solid) 버튼 묶음을 그린다. 하나만 줘도 된다. 둘 다 있으면 취소 : 확인 = 3 : 7 이다. `onCancel` 을 생략하면 `onRequestClose` 가 불린다. 그동안은 버튼 하나를 두려 해도 `footer` 에 직접 그려야 했다.
  
  `footer` 는 그대로 있다. 확인 · 취소 둘로 안 되는 자리(진행 버튼 · 셋째 액션 · 링크)에 쓴다. 라벨 넷과 `footer` 를 같이 주면 타입이 막는다.
  
  ```tsx
  // 전
  <LayerPopup open title="약관 동의" footer={<Button onClick={agree}>동의합니다</Button>} />
  
  // 후
  <LayerPopup open title="약관 동의" confirmLabel="동의합니다" onConfirm={agree} />
  <BottomSheet open title="필터" cancelLabel="닫기" confirmLabel="적용" onConfirm={apply} />
  ```
  
  `Confirm` 은 취소와 확인이 균등 폭이었는데 같은 규칙(첫 항목이 취소면 3:7)으로 맞췄다. 보이는 폭이 바뀐다.
- 642fe1d: **BREAKING** — `Button` · `IconButton` · `ButtonLink` 에서 `color="warning"` 을 없앤다.
  
  **왜.** 노랑은 **면이 있어야 하는 색**이다. 채워진 버튼에서는 노란 배경 + 어두운 글자로
  성립하지만, `line` 과 `text` 는 면이 없어서 노랑이 그대로 글자와 테두리가 된다 —
  흰 바탕에서 1.5 : 1 로 사실상 안 보였다. 대비를 맞추려고 어둡게 하면 갈색이 되어
  "주의"라는 의미 자체를 잃는다. **세 variant 중 둘에서 색을 못 지키는 색은 축을 채우지
  못한다.**
  
  경고는 원래 버튼 색이 아니라 흐름이 맡는다.
  
  | 하려던 것 | 이제 |
  | --- | --- |
  | 되돌릴 수 없는 행동 | `color="danger"` |
  | 진행 전에 확인을 받아야 하는 행동 | `Confirm` 으로 묻는다 |
  | 계속 보여야 하는 주의 문구 | `Message` · `Toast` |
  
  **옮기는 법** — `color="warning"` 을 `color="danger"` 로 바꾸거나, 확인이 필요한
  행동이면 `Confirm` 으로 감싼다. 타입에서 빠지므로 컴파일 시점에 전부 드러난다.
  
  역할은 넷이다 — `neutral` · `primary` · `secondary` · `danger`.
  색 자체(`--nui-color-warning-*`)와 은은한 면색(`--nui-status-warning-soft`)은 남는다.
- db4b6ea: **BREAKING** — 숫자 스케일 토큰의 번호를 1 부터 빈 곳 없이 다시 매겼다. **값은 하나도 바뀌지 않았다.** 이름만 옮겼다.
  
  | 스케일 | 옛 이름 → 새 이름 | 값 |
  | --- | --- | --- |
  | `--nui-space-*` | `6 → 5` | 24px |
  | `--nui-radius-*` | `1_5 → 2` · `2 → 3` · `2_5 → 4` · `3 → 5` | 6 · 8 · 10 · 12px |
  | `--nui-font-size-*` | `3 → 2` · `4 → 3` · `5 → 4` · `6 → 5` | 14 · 16 · 18 · 20px |
  | `--nui-line-height-*` | 위와 같은 이동 | 1.5 |
  | `--nui-letter-spacing-*` | 위와 같은 이동 | 0 |
  
  `radius-1` · `space-1~4` · `font-size-1` · `radius-full` · `radius-circle` 은 그대로다.
  
  이 변수들을 직접 참조하거나 `:root` 에서 덮어쓰고 있었다면 표대로 이름을 바꾼다. 컴포넌트 훅(`--nui-button--medium-radius` 등)의 기본값은 새 이름을 가리키므로 훅으로 바꾸던 값은 그대로 동작한다.
  
  빌드된 CSS 에서 변수 이름을 새 이름으로 치환하면 변경 전과 바이트 단위로 같다 — 보이는 결과는 바뀌지 않는다.
  
  앞으로 스케일에 값을 더할 때는 끝 번호로만 더한다. 중간에 끼워 넣지 않는다.
- 8a3ef34: `Select` · `MultiSelect` 의 메뉴와 `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 의 달력이
  **아래 공간이 모자라면 위로 뒤집힙니다.** 둘이 같은 규칙으로 열립니다.
  
  - 화면 가장자리와 8px 를 띄웁니다
  - 위아래 모두 모자라면 넓은 쪽으로 열리고, 높이는 줄지 않습니다
  - 페이지는 스크롤하지 않습니다
  - `hasPortal` 을 켜도 같습니다. 뒤집히면 메뉴 · 달력이 트리거 쪽에서 자랍니다
  
  ```tsx
  <Select options={OPTIONS} />                        // 아래가 모자라면 위로 뒤집힌다 — 기본
  <Select options={OPTIONS} menuPlacement="bottom" /> // 언제나 아래
  <Select options={OPTIONS} menuPlacement="top" />    // 언제나 위
  <Datepicker selected={date} onSelectedChange={setDate} /> // 달력도 같은 규칙
  ```
  
  ## BREAKING — 넷
  
  **`Select` 의 `menuPlacement` 기본값이 `"bottom"` 에서 `"auto"` 로 바뀝니다.** 화면 아래쪽에 놓인 Select 를
  열면 메뉴가 컨트롤 위에 뜹니다. 언제나 아래에 두려면 `menuPlacement="bottom"` 을 줍니다. `Datepicker` 계열은
  방향을 고정하는 prop 이 없고 언제나 이 규칙을 따릅니다.
  
  **`menuPlacement` 의 값은 `react-select` 문서와 뜻이 다릅니다.** `"auto"` 는 위치 모드(`absolute` · `fixed`)와
  상관없이 화면 기준으로 뒤집고, `"bottom"` · `"top"` 은 그 방향에 고정합니다. `react-select` 에서는 `"bottom"`
  이어도 `menuPosition="fixed"` 면 뒤집혔고, `"auto"` 여도 문서 중간에서는 뒤집히지 않았습니다.
  
  **메뉴 목록의 높이가 줄어들지 않습니다.** 공간이 모자라면 예전에는 목록 높이를 남은 공간까지 줄였고, 이제는
  뒤집거나 넓은 쪽으로 열린 채 `maxMenuHeight` 높이를 유지합니다. `styles.menuList` 의 `maxHeight` 와
  `styles.menuPortal` 의 `height` · `pointerEvents` 는 이 라이브러리의 기본값이 갖습니다. 덮으면 방향
  판정과 보이는 높이가 어긋납니다.
  
  **portal 로 나간 메뉴의 래퍼를 이 라이브러리가 그립니다.** `components.MenuPortal` 의 기본값이 바뀌어 래퍼가
  컨트롤을 직접 따라갑니다. `styles.menuPortal` 함수는 여전히 불리지만 결과가 **인라인 `style`** 로 들어가므로
  `"&:hover"` · `"@media …"` 같은 키는 무시됩니다. 함수가 받는 `offset` 은 언제나 컨트롤의 윗변입니다 — 예전에는
  메뉴가 열린 쪽의 변이었습니다. `components.MenuPortal` 을 자기 것으로 갈아끼우면 위로 뒤집힌 메뉴의 자리가 맞지
  않습니다.
  
  ## 고친 것
  
  - `hasPortal` 을 켠 `Datepicker` 계열의 달력이 열리고 닫힐 때 모션 없이 나타나고 사라지던 것을 고쳤습니다.
    이제 제자리 달력과 같은 등장 · 퇴장 모션이 재생됩니다
- 1bd104b: `Select` · `MultiSelect` 의 메뉴 배치가 `Datepicker` · `Tooltip` 과 같은 규칙이 됩니다. 기본은 지금처럼
  컨트롤 아래 제자리이고, `overflow: hidden` 인 조상(카드 · 팝업) 안에서는 `hasPortal` 을 켭니다.
  
  ```tsx
  <Select options={OPTIONS} />                        // 제자리 — 기본
  <Select options={OPTIONS} hasPortal />              // body 로 나가 잘리지 않는다
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
  붙습니다. 화면 아래쪽에서 열면 제자리 메뉴와 같이 위로 뒤집힙니다. 예전 배치가 필요하면
  `<Select hasPortal menuPosition="absolute" />` 를 줍니다.
  
  **`hasPortal` 과 `menuPortalTarget={null}` 을 같이 주면 메뉴가 제자리에 남습니다.** 예전에는 `null` 이
  무시되어 `body` 로 나갔습니다. 이제는 `menuPortalTarget` 에 준 값이 `null` 이어도 `hasPortal` 보다
  우선합니다. 잘리지 않게 하려면 `menuPortalTarget` 을 빼고 `hasPortal` 만 줍니다.
  
  **메뉴를 열 때 페이지를 스크롤하지 않습니다.** `menuShouldScrollIntoView` 의 기본값이 `true` 에서 `false`
  로 바뀝니다. 아래 공간이 모자라면 예전에는 페이지가 움직여 메뉴를 보여 줬고, 이제는 메뉴가 위로 뒤집힙니다.
  예전 동작이 필요하면 `menuShouldScrollIntoView` 를 줍니다. 타입 에러가 나지 않으므로 화면으로 확인합니다.
  
  **`maxMenuHeight` 의 기본값이 `240` 에서 `480` 으로 바뀝니다.** 한 번에 보이는 항목이 늘어납니다.
  
  ## 그 밖에
  
  - `hasPortal` 로 나간 메뉴의 DOM 을 조상 셀렉터(`.my-wrap .nui-select__menu`)로 잡던 테스트가 있으면
    찾지 못합니다
- 043c42f: **BREAKING** — Checkbox · Radio · Switch 가 나눠 쓰던 CSS 변수를 컴포넌트별로 쪼갰습니다.
  
  `Selector` 라는 컴포넌트는 없습니다. 체크박스만 키우려 해도 라디오가 따라 움직이고,
  스위치 테두리만 두껍게 하려 해도 셋이 다 바뀌던 자리입니다.
  
  | 없어짐 | 대신 |
  | --- | --- |
  | `--nui-selector--size` | `--nui-checkbox--size` · `--nui-radio--size` |
  | `--nui-selector--border-width` | `--nui-checkbox--border-width` · `--nui-radio--border-width` · `--nui-switch--border-width` |
  
  ```css
  /* 전 */
  :root {
    --nui-selector--size: 20px;
    --nui-selector--border-width: 2px;
  }
  
  /* 후 — 같은 값을 주면 결과가 같습니다 */
  :root {
    --nui-checkbox--size: 20px;
    --nui-radio--size: 20px;
    --nui-checkbox--border-width: 2px;
    --nui-radio--border-width: 2px;
    --nui-switch--border-width: 2px;
  }
  ```
  
  ⚠️ **조용히 깨집니다.** CSS 변수라 옛 이름을 그대로 두면 에러 없이 기본값으로 되돌아갑니다.
  컴파일도 타입 검사도 잡지 못하니 위 표로 찾아 바꿔 주세요.
  
  `--nui-switch--border-width` 에는 상한이 있습니다. 썸과 트랙 사이 여백이 2px 뿐이라 3px
  이상을 주면 썸이 한쪽으로 밀립니다. 더 두꺼운 테두리가 필요하면 `--nui-switch--height` 를
  함께 키우세요.
- 7281a8a: 선택 컨트롤의 채움을 중립으로 바꾸고 `tone` 을 연다
  
  체크박스 · 라디오 · 스위치가 선택되면 **브랜드 초록 대신 먹색으로 채워진다.** 이 셋은
  한 화면에 여럿 반복되는 자리라 전부 브랜드색이면 목록이 얼룩덜룩해지고, 강조가 흔해져
  강조가 아니게 된다.
  
  **강조가 필요한 자리는 `tone="brand"` 로 연다.** 약관 동의나 추천 항목처럼 하나만
  도드라져야 하는 곳이다.
  
  ```tsx
  <Checkbox checked={agreed} onChange={…} />                 {/* 조용하다 */}
  <Checkbox tone="brand" checked={agreed} onChange={…} />    {/* 강조 */}
  ```
  
  **라디오도 면을 채운다.** 체크박스·스위치는 채워지는데 라디오만 테두리로 남으면 한
  가족 안에서 선택의 뜻이 갈렸다. 선택된 라디오는 채워진 원 안에 흰 점이 된다.
  
  **스위치 썸이 20px 이 되고, 켜질 때 커진다.** 꺼짐일 때는 지금과 같은 크기로 보이고
  켜지면 가득 찬다 — 이동과 크기가 함께 "켜졌다"를 말한다.
  
  새 타입 `SelectionTone` 을 배럴과 `checkbox` · `radio` · `switch` 서브패스에서 내보낸다.
  쓰던 코드는 그대로 동작한다. 바뀌는 것은 색과 라디오·스위치의 모양이다.
- fee30b3: 입력 안쪽 여백이 대칭이 되고, 보조 버튼 간격을 한 자리가 갖습니다. `unit` 은 `Textfield` 전용이 됩니다.
  
  **보조 버튼도 단위도 없는 입력의 오른쪽 여백이 4px 에서 16px 로 바뀝니다.** 왼쪽과 같아집니다. 예전에는 값의 오른쪽 여백을 입력이 4, 그 옆 버튼 묶음이 16 으로 나눠 갖고 있어서, 버튼이 없으면 오른쪽만 4px 로 좁았습니다. 두 값을 맞바꿔 입력이 좌우 16 을 갖고 버튼 묶음이 4 를 갖습니다. 버튼이 있을 때 보이는 간격은 그대로입니다(값에서 첫 버튼까지 20, 마지막 버튼에서 테두리까지 16).
  
  **담을 것이 없으면 버튼 묶음(`.nui-textfield__actions`)을 만들지 않습니다.** 지우기 슬롯도 `children` 도 `unit` 도 없을 때입니다. `isClearable` 을 켜 두었다면 값이 비어 있어도 자리를 지킵니다 — 글자를 칠 때마다 값이 좌우로 움직이지 않게 하기 위해서입니다. 그 셀렉터로 스타일을 걸고 있었다면 조건이 달라집니다.
  
  **항목 사이 간격을 `gap` 하나가 갖습니다.** `.nui-textfield__btn` 과 `.nui-textfield__unit` 의 `margin-left` 가 사라집니다. 값은 그대로 8px 입니다. 다만 **버튼 없이 단위만 있는 입력은 값과 단위 사이가 28px 에서 20px 로 줄어듭니다** — 예전에는 단위만 예외적으로 여백을 하나 더 갖고 있었습니다. 이 두 클래스에 `margin-left` 를 직접 주고 있었다면 이제 `gap` 위에 더해집니다.
  
  **`gap` 은 클래스를 가리지 않습니다.** `children` 으로 직접 넣은 요소들 사이도 8px 이 됩니다. 예전에는 우리 버튼에만 여백이 있어 커스텀 요소끼리는 붙어 있었습니다. 둘 이상을 넣고 간격을 직접 잡고 있었다면 그만큼 넓어집니다.
  
  **BREAKING — `unit` 이 `Textfield` 와 `RHFTextfield` 에서만 동작합니다.** 검색창의 「원」, 비밀번호의 단위, 날짜의 단위는 조합 자체가 성립하지 않아 타입에서 막습니다. 아래 **열**에 `unit` 을 주고 있었다면 지우거나 `Textfield` 로 바꿉니다.
  
  | 막히는 것 | 대신 |
  | --- | --- |
  | `Search` · `RHFSearch` | `Textfield` · `RHFTextfield` |
  | `Password` · `RHFPassword` | 〃 |
  | `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 와 그 RHF 래퍼 셋 | 〃 |
- c5a7ae5: **BREAKING** `TextfieldBtn` 을 더 이상 내보내지 않는다.
  
  입력 안의 보조 버튼(지우기 · 검색 · 비밀번호 보기/숨기기 · 달력)은 `Textfield` · `Search` · `Password` · `Datepicker` 가 자기 슬롯에 그리는 내부 부품이다. 아이콘 다섯이 이름으로 고정돼 있어 소비자가 다른 자리에 쓸 방법이 없었고, 공개된 채로 두면 아이콘을 하나 더하는 것도 공개 API 변경이 됐다. 공개하지 않는 골격 셋(`PopupBase` · `SelectBase` · `DatepickerBase`)과 같은 규칙으로 내린다. `TextfieldBtnProps` · `TextfieldBtnIcon` 타입도 함께 빠진다.
  
  입력 안에 버튼이 필요하면 `Search`(검색) · `Password`(토글) · `isClearable`(지우기) · `Datepicker`(달력)가 그 자리다. 입력 밖의 아이콘 버튼은 `IconButton` 이다.
- 2c301d7: `Textfield` 에도 글자 수 카운터가 생겼다. `maxLength` 를 주면 메시지 줄 오른쪽에 붙는다.
  
  ```tsx
  <Textfield
    value={nickname}
    onChange={onChange}
    maxLength={10}
    infoMessage="다른 사람에게 보이는 이름이에요."
  />
  // 왼쪽 안내, 오른쪽 6 / 10 — 한 줄이다
  ```
  
  `Textarea` 와 규칙이 같다 — 제한이 있을 때만 나오고, 현재 수는 진하게 최대 수는 연하게, 넘치면 둘 다 빨개진다. 문구는 `counterLabel` 로 바꾼다.
- 69d6a2a: `Toast` 닫기 버튼의 hover 와 누르는 순간의 면이 두 테마 모두에서 보입니다. 예전에는 반전 표면(라이트는
  검정, 다크는 밝은 회색) 위에 같은 방향의 알파를 얹어 사라졌습니다 — 라이트에서 검정 위 검정, 다크에서
  밝은 면 위 흰색이었습니다.
  
  토큰 둘이 새로 생깁니다 — `--nui-control-bg-hover-on-inverse` · `--nui-control-bg-active-on-inverse`.
  라이트는 흰 알파(7.8% · 11%), 다크는 검정 알파(6.3% · 9.4%)로, `--nui-text-on-inverse` 와 같은 반전
  짝입니다. 반전 표면 위에 hover 면을 두는 자리는 지금 Toast 닫기 하나이고, 같은 자리를 직접 만든다면
  이 토큰을 씁니다. 공개 prop · 클래스 · 훅은 바뀌지 않았습니다.
- d4b95ee: `Toast` — 읽는 동안 사라지지 않게 하고, 완료를 알릴 수 있게 하고, 액션과 닫기 버튼을 더한다.
  
  **읽는 동안은 멈춘다.** 마우스가 올라가 있거나, 포커스가 안에 있거나, 다른 탭에 가 있으면
  타이머가 멈추고 돌아오면 **남은 시간부터** 다시 간다(WCAG 2.2.1). `closable` 과 무관하게
  항상 동작한다. 터치에서는 `pointerleave` 가 오지 않을 수 있어 마우스에서만 hover 로 멈춘다.
  
  **새 prop 셋.**
  
  | prop | 기본값 | |
  | --- | --- | --- |
  | `closable` | `false` | 닫기 버튼. 항상 X 가 붙으면 알림이 대화상자처럼 무거워진다 |
  | `closeLabel` | `"닫기"` | 닫기 버튼의 접근 이름 |
  | `action` | — | `{ label, onClick }` **하나뿐.** 누르면 실행하고 닫는다 |
  
  **`tone="success"` 를 더한다.** `default` 는 "무슨 일이 있었다", `success` 는 "됐다",
  `error` 는 "잘못됐다"를 말한다. `success` 의 낭독 강도는 `default` 와 같은 `polite` 다 —
  좋은 소식이 읽던 것을 끊을 이유가 없다.
  
  **바뀌는 것 셋.**
  
  - **기본 지속시간이 2400ms → 4000ms.** 두 줄을 읽기에 2.4초는 짧았다
  - **표시점(초록 점)이 사라지고 아이콘이 대신 온다.** `default` 는 아이콘이 없고,
    `success` 와 `error` 에만 붙는다 — 색만으로 구분하지 않기 위해서다
  - **`tone="error"` 가 배경을 바꾸지 않는다.** 다크 테마에서 어두운 배경 위에 어두운
    글자가 되어 **대비 1.14 : 1** 이었다. 읽을 수 없는 상태였고, 표시점도 배경과 같은
    색이었다. 이제 아이콘 색만 바뀌고 배경은 언제나 같다
  
  `--nui-surface-toast-error` 변수가 없어진다. 그 값을 직접 참조하던 프로젝트는 영향을 받는다.
- a4ac87e: **BREAKING** — `Toast` 가 **한 번에 하나만** 보인다.
  
  지금까지는 여러 개가 세로로 쌓였다. 이제 새 토스트는 차례를 기다렸다가 앞의 것이
  사라진 뒤에 올라온다.
  
  **왜.** 라이브 리전이 여럿이면 스크린리더 낭독이 겹친다. 쌓인 카드가 화면 아래를
  덮기도 한다. 업무용 화면에서 토스트가 여러 개 쌓이는 상황 자체가 드물다.
  
  **같이 바뀌는 것**
  
  | | 전 | 후 |
  | --- | --- | --- |
  | `close()` (id 없이) | 배열의 **마지막** | **지금 보이는 것**. 닫으면 다음이 올라온다 |
  | `closeAll()` | 전부 닫는 모션 | 보이는 것만 닫고 **기다리던 것은 버린다** |
  | `ToastStatus` | `"open" \| "closing"` | `"queued"` 가 는다 |
  
  `useToast().toasts` 에는 기다리는 것도 들어 있다. `status` 로 가른다.
  
  ⚠️ **`duration: 0` 인 토스트는 큐를 막는다.** 스스로 사라지지 않으므로 뒤의 것이
  계속 기다린다. 그렇게 쓸 때는 `closable` 을 함께 켜거나 직접 닫아 준다.
  
  ⚠️ 버려진 대기 항목은 화면에 오른 적이 없어 `onOpenComplete` · `onCloseComplete` 가
  발생하지 않는다.
- d820c69: 툴팁이 **트리거에서 자라고, 스치는 마우스에 열리지 않는다.**
  
  ```tsx
  <Tooltip content="설명" openDelay={400} closeDelay={100}>
    <IconButton aria-label="도움말" />
  </Tooltip>
  ```
  
  | | |
  | --- | --- |
  | `openDelay` | 기본 `400`. **hover 로 열 때만** — 키보드 · 터치는 즉시다 |
  | `closeDelay` | 기본 `100`. 툴팁 위로 마우스를 옮길 시간을 준다 |
  
  **툴바를 가로지를 때 툴팁이 줄줄이 뜨던 것이 멈춘다.** 예전에는 pointer 가 스치는 순간(11ms) 열렸다.
  
  **하나 열린 뒤 이웃은 즉시 열린다** — 지연도 모션도 없다. 툴바 전체가 빨라 보인다.
  
  **원점이 화살표 자리로 간다** — 예전에는 중앙에서 커져서 어디서 나왔는지 알 수 없었다. 툴팁 시간도 150ms(퇴장 100ms)로 갈렸다. 드롭다운·달력과 같은 시계를 쓰고 있었다.
  
  달력은 입력창 위 왼쪽 모서리에서 자란다.

### Patch Changes

- efd8ecb: 아코디언에서 화살표만 버튼인 모드의 누르는 범위를 44px 로 넓혔다.
  
  `Accordion.Head` 에 `buttonIndex` 를 주면 화살표 아이콘만 버튼이 되는데, 그 버튼은 36px 로 보이고 36px 만 눌렸다. 다른 아이콘 버튼처럼 보이는 크기는 그대로 두고 누르는 범위만 44px 로 넓혔다. 헤더 전체가 버튼인 모드는 원래 넓어서 그대로다.
- d886977: `Accordion` 의 `shouldKeepMounted` 로 닫아 둔 패널이 `inert` 하나로 감춰집니다.
  
  전에는 `aria-hidden` 을 겹쳐 걸었습니다. `inert` 가 이미 하는 일(접근성 트리에서 제거 ·
  포커스 차단 · 포인터 차단)을 반쪽만 되풀이하던 속성이고, 패널 안 입력에 포커스를 둔 채
  접으면 브라우저가 그 속성을 거부하며 콘솔에 경고를 냈습니다. 그 경고가 날 자리가
  없어집니다.
  
  **열린 패널에는 `inert` 속성이 붙지 않습니다.** 전에는 `inert="false"` 가 들어갔는데,
  React 18 에서는 브라우저가 값과 무관하게 속성의 존재만 보고 참으로 읽어 **열린 패널이 통째로
  비활성화**됐습니다. React 19 에서만 제대로 동작하던 자리입니다.
  
  공개 API · 클래스 이름 · CSS 변수는 바뀌지 않았습니다.
- 976bb19: `Accordion` 의 헤더와 화살표 버튼을 누르면 눌린 것이 보입니다.
  
  눌림이 자리마다 다른 범위로 걸립니다 — *줄어들 여백이 있으면 누르는 것이 줄고, 없으면
  내용만 줄어듭니다.* 헤더 전체가 버튼인 항목은 제목과 화살표만 `--nui-scale-98` 로 줄고
  hover 면은 카드 테두리에 붙은 채 제자리입니다. `buttonIndex` 로 화살표만 버튼으로 둔
  항목은 화살표 버튼 전체가 줄어듭니다. 시간과 곡선은 다른 컴포넌트의 눌림과 같은
  `--nui-duration-pressed` · `--nui-easing-pressed` 입니다.
  
  hover · 눌림 면을 칠하는 요소가 `.nui-accordion__head` 에서 `.nui-accordion__button` 으로
  옮겨 갔습니다. `className` 으로 `__head` 의 배경을 덮어 hover 를 바꾸거나 지우고 있었다면
  `__button` 을 덮어야 합니다.
  
  공개 API · 클래스 이름은 바뀌지 않았습니다.
- 2f0969f: `BottomSheet` 를 **끌어서 닫을 때** 손에 더 붙습니다.
  
  - 끄는 띠를 누르는 동안 커서가 `grabbing` 입니다 (놓기 전엔 `grab`)
  - 시트가 화면 밖으로 나간 뒤 **보이지 않게 남아 있던 시간**(약 150ms)이 사라집니다. 명령형(`useBottomSheet().open`)으로 열었을 때 배경 스크롤 잠금이 그만큼 빨리 풀립니다
  - 놓은 속도를 스프링이 이어받습니다 — 빠르게 튕기면 그 속도로 나갑니다. 예전에는 시간으로 정의한 스프링이라 framer-motion 이 속도를 버렸습니다
  
  공개 API 는 그대로입니다.
- 2fec57c: 폼 요소가 글꼴만 물려받고 크기·두께·행간은 브라우저 기본값(13.33px / 400 / normal)으로 남아 있었다. 열한 자리에 `font: inherit` 을 더했다.
  
  보이는 결과는 대개 맞았다. 글자를 자식이 그리거나 뒤에서 타이포 믹스인이 덮었기 때문이다. 다만 `em` 단위 자식이나 라벨 없는 자식이 들어오면 어긋난다.
  
  **하나는 실제로 어긋나 있었다** — `Select` 에 타이핑하는 글자가 13.33px 이라 고른 값(16px)보다 작았다. 지금은 둘이 같다.
- e6369d7: 버튼 묶음 안의 아이콘 버튼이 정사각으로 남는다
  
  `ButtonGroup` 안에 `IconButton` 을 넣으면 가로가 눌려 22×48 로 그려졌다.
  묶음이 자식 버튼을 전부 칸 너비로 늘리면서 아이콘 버튼의 정사각 치수까지
  덮었기 때문이다. 액션이 셋일 때 하나를 아이콘 버튼으로 접는 것은 권장하는
  사용법이라 실제로 부딪히는 자리였다.
  
  ```tsx
  <ButtonGroup>
    <ButtonGroup.Item shouldAutoWidth>
      <IconButton aria-label="삭제"><DelIcon /></IconButton>
    </ButtonGroup.Item>
    …
  </ButtonGroup>
  ```
  
  일반 버튼이 칸을 채우는 동작은 그대로다.
- 4906eae: `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 의 달력이 **닫히는 동안 날짜가 눌리지 않는다.**
  
  예전에는 달력이 사라지는 0.15초 동안에도 클릭이 그대로 들어가서, 닫은 직후 같은 자리를 누르면 의도하지 않은 날짜가 선택됐다. 빠르게 두 번 누를 때 실제로 일어난다.
  
  `Select` 메뉴와 같은 규칙이 됐다 — 드롭다운은 열리고 닫히는 동안 하나의 역할로 움직인다.
- 1685f35: 달력 안에서 누르는 것이 눌린 것처럼 보입니다. 지금까지는 배경만 바뀌었습니다.
  
  - 날짜 버튼을 누르면 **`--nui-scale-96`** 으로, 이전/다음 달 버튼을 누르면
    **`--nui-scale-94`** 로 줄어듭니다. 배경은 그대로입니다.
  - **선택된 날짜도 줄어듭니다.** 선택된 날짜는 면이 이미 깔려 있어 눌림을 말하는 것이
    배율뿐입니다. 면 색은 바뀌지 않습니다.
  - **막힌 날짜와 월 경계의 이전/다음은 아무것도 하지 않습니다** — 면도 배율도 없습니다.
  - 누르는 범위는 그대로입니다. 날짜는 셀 전체(44px), 이전/다음은 `hit-area` 로 44px 이고
    배율은 손가락이 닿은 **뒤**의 피드백이라 여기에 닿지 않습니다.
  
  `Accordion` · `Select` 에 이어 달력까지 같은 규칙을 씁니다 — 누르는 것에는 눌림이 있고,
  줄어들 여백이 있으면 누르는 것 전체가 줄어듭니다.
- 0021bee: 비활성 · 읽기 전용 요소의 선을 보이게 한다.
  
  비활성은 WCAG 대비 요구에서 빠지지만 하한을 둔다. 회색이 배경에 녹으면
  "비활성"이 아니라 **"없음"** 으로 읽히기 때문이다. 세 자리가 그 하한(2 : 1) 아래였다.
  
  | 자리 | 전 | 후 |
  | --- | --- | --- |
  | 비활성 `line` 버튼 테두리 | 라이트 1.38 · 다크 1.57 | **3.30 · 3.48** |
  | 비활성 · 읽기 전용 입력 테두리 | 라이트 1.69 | **2.96** |
  | 비활성 상태로 선택된 체크박스 · 라디오 · 스위치 채움 | 라이트 1.88 | **3.30** |
  
  회색 스케일이 이 구간에서 크게 뛰기 때문에 한 단계 위로는 모자랐다 — 2 : 1 을
  넘는 첫 단계까지 올렸다. 비활성인지 아닌지는 여전히 배경과 글자색이 말한다.
- a91705e: 닫는 동작이 누른 순간부터 움직인다. 팝업 · 시트 · 툴팁 · 달력 · 토스트가 모두 해당한다.
  
  퇴장 곡선이 ease-in 이라 **닫기를 누른 뒤 100ms 동안 27% 만** 사라졌다. 끝은 빠른 대신 시작이 느려서 「안 닫힌다」로 읽혔다. 사용자가 보는 것은 시작이다.
  
  곡선을 등장과 같게 맞췄다(실측 96ms 에 0.178). **비대칭은 시간이 만든다** — 팝업은 등장 300ms · 퇴장 200ms 로 그대로다.
  
  `--nui-easing-exit` · `--nui-easing-exit-emphasized` 를 직접 참조하고 있었다면 값이 바뀐다. 이름은 그대로다.
- eccc8c7: `Field.Grid` 안에서 칸끼리 라벨과 입력이 어긋나던 것을 고친다
  
  설명(`description`)이 있는 칸과 없는 칸을 나란히 두면 라벨이 7px, 입력이 22px 어긋났다.
  grid 가 자식을 행 높이로 늘리는데 `Field.Item` 이 줄바꿈 컨테이너라 남는 높이만큼 줄
  사이가 벌어지고 있었다.
  
  ```tsx
  <Field.Grid>
    <Field.Item>
      <Field.Label>이름</Field.Label>
      <Textfield … />
    </Field.Item>
    <Field.Item>
      <Field.Label>휴대폰</Field.Label>
      <Textfield … />
      <Field.Description>10-11자리</Field.Description>   {/* 이쪽만 설명이 있다 */}
    </Field.Item>
  </Field.Grid>
  ```
  
  이제 두 칸의 라벨과 입력이 같은 줄에 선다. 마크업은 그대로다.
- 1ecd921: 떠 있는 것이 떠 보이게 — 팝업 · 메뉴 · 달력의 층 표현
  
  팝업 · Select 메뉴 · Datepicker 팝업이 **진한 실선 테두리 + 거의 안 보이는 그림자**로
  그려져 있었다. 실선이 그림자를 이겨서 "떠 있는 것"이 아니라 "테두리 친 상자"로
  읽혔고, 툴팁 · 토스트는 그림자만 써서 한 라이브러리 안에 두 방식이 섞여 있었다.
  
  - 가장자리를 반투명 링(`--nui-border-floating`)으로 바꿨다
  - 그림자를 **두 겹**으로 나눴다 — 가까운 짧은 것이 가장자리를 붙들고, 먼 부드러운
    것이 거리를 만든다 (`--nui-shadow-2` · `--nui-shadow-3`)
  - **다크는 값을 따로 갖는다.** 기존 그림자는 남색이 섞인 색이라 검정 바닥에서
    사라지고 있었다. 순수 검정을 진하게 쓰고 위쪽에 밝은 1px 을 얹는다
  - Accordion box 항목의 그림자를 뗐다. 카드는 테두리만으로 그린다
  
  소비자가 쓰는 prop · 클래스 · 공개 훅은 그대로다. 시각만 바뀐다.
  
  `--nui-shadow-inset-inverse` 는 없앴다 — 위쪽 밝은 1px 을 다크 그림자 토큰이 갖게
  되면서 토스트가 같은 선을 두 번 그리고 있었다. 내부 전용 토큰이라 문서화된 적이 없다.
- a4c4133: 포커스가 입력 안의 글자를 밀지 않게 한다
  
  입력 칸에 포커스가 오면 테두리가 1px 에서 2px 로 굵어지고 있었다. 상자 크기는 그대로인데
  안쪽이 1px 줄어들어 **글자가 오른쪽 아래로 밀렸다.** Tab 으로 폼을 훑을 때 칸마다 미세하게
  흔들린다.
  
  포커스는 이제 **테두리 색과 링으로만** 말한다. 두께는 어느 상태에서도 바뀌지 않는다.
  
  `Textfield` · `Textarea` · `Search` · `Password` · `Select` · `MultiSelect` ·
  `Datepicker` 계열이 함께 바뀐다. 이 셋은 라이브러리에서 유일하게 두께를 상태로 바꾸던
  자리였다 — 체크박스 · 라디오 · 스위치는 원래 색과 링만 쓰고, 버튼은 `outline` 이라
  레이아웃을 차지하지 않는다.
  
  포커스 표시 자체는 그대로 잘 보인다. 테두리 색이 바뀌고 4px 링이 붙는 것은 같다.
- d820c69: 팝업 · 시트 · 툴팁 · 달력 · 토스트의 열고 닫는 모션이 페이지가 바쁠 때도 매끄럽다.
  
  `y` · `scale` 숏핸드를 `transform` 문자열로 바꿨다. 숏핸드는 매 프레임 자바스크립트가 스타일을 쓰는 방식이라 화면이 바쁠 때 프레임이 떨어진다.
  
  등장 배율도 0.98 에서 0.97 로 맞췄다 — 모션 규칙이 정한 범위(0.9~0.97)를 벗어나 있었다.
- ae97fe6: hover 효과가 **정밀한 포인터에서만** 나타난다. 스타일러스나 TV · 게임기 커서처럼 hover 를 흉내 내지만 정밀하지 않은 기기에서, 좁은 자리를 스치기만 해도 hover 가 들어오던 것이 멈춘다.
  
  아코디언 화살표는 이제 패널과 끝이 맞는다 — 열림 250ms · 닫힘 200ms 다. 예전에는 150ms 로 패널보다 먼저 멈췄다.
- cd4e217: 아이콘을 단독으로 두었을 때 `size` 가 무시되던 것을 고쳤다.
  
  `<SearchIcon size={20} />` 처럼 이름 붙인 아이콘을 버튼 밖에 두면 크기가 `size` 대신 부모 폭을 채웠다. 버튼과 입력 안에서는 슬롯이 상자를 잡아 주어 드러나지 않았다. 이제 `size` 와 `width` · `height` 가 어디서나 그대로 적용된다. `Icon` 래퍼도 `size` 를 받는다.
- b52f3bd: 브라우저가 자동 완성한 입력의 배경이 더는 하늘색으로 바뀌지 않는다. 그리고 비활성 상태가 에러·읽기 전용에 가려지지 않는다.
  
  `Textfield` · `Search` · `Password` · `Textarea` · `Datepicker` 계열에 걸린다.
  
  **자동 완성 면** — 브라우저는 자동 완성한 입력의 배경과 글자를 자기 색으로 덮는다. 이제 그 자리에 컴포넌트의 색이 그대로 남는다. `autocomplete` 속성도, 자동 완성 동작도, 브라우저가 띄우는 드롭다운도 바뀌지 않는다. 바뀌는 것은 값이 채워진 뒤의 면 색뿐이다. 비활성·읽기 전용·에러에서도 각 상태의 색을 따르고, 면이 입력칸의 둥근 모서리를 넘어가지 않는다. `--nui-textfield--large-radius` 같은 둥글기 훅을 바꾸면 이 면도 따라간다.
  
  **상태 우선순위** — 비활성이 에러·읽기 전용보다 우선한다. 예전에는 규칙 순서 때문에 뒤집혀 있었다.
  
  | 조합 | 예전 | 지금 |
  | --- | --- | --- |
  | 비활성 + 에러 | 빨간 테두리 + 기본 배경 | 비활성 테두리 + 비활성 배경 |
  | 비활성 + 읽기 전용 | 읽기 전용 색 | 비활성 색 |
  
  읽기 전용 + 에러는 그대로다. 테두리가 빨강이고 글자는 읽기 전용 색이다.
  
  색을 `className` 으로 덮어 쓰고 있었다면 자동 완성 상태에서도 그 색이 보이게 됐다. 예전에는 그 자리에 브라우저 색이 깔렸다.
- 3730a9d: 라이트 테마에서 `Toast` 와 `Tooltip` 의 배경이 **순수 검정**이 된다.
  
  지금까지는 브랜드 색조가 살짝 도는 짙은 회색이었다. 반전 표면은 화면 위에 잠깐 떠서
  "이건 UI 밖의 알림"이라고 말하는 면이라 브랜드를 물려받을 이유가 없다. 흰 글자와의
  대비도 16.2 : 1 에서 **21 : 1** 로 오른다.
  
  다크 테마는 그대로다 — 거기서는 반전이 밝은 쪽이다.
- 675d2a2: `infoMessage` 와 `errorMessage` 를 함께 주면 이제 **에러만 보인다.** 예전에는 둘이 같이 쌓였다.
  
  도움말은 「어떻게 쓰는가」이고 에러는 「지금 무엇이 잘못됐는가」다. 둘을 함께 보여 주면 읽는 사람이 무엇을 고쳐야 하는지 두 문장에서 골라야 한다.
  
  `aria-describedby` 도 따라간다 — 에러가 있는 동안 스크린리더는 에러만 읽는다.
  
  문서 사이트는 이미 「에러가 있으면 안내 대신 에러가 보인다」고 적고 있었다. 문서가 맞고 코드가 달랐던 자리다.
- 03506ea: `Toast` 가 등장보다 빨리 사라지고, `Accordion` 의 화살표가 본문과 같은 속도로 돈다.
  
  - **`Toast` 의 퇴장이 250ms 에서 200ms 로 짧아진다.** 등장(250ms)은 그대로다. 팝업 · 툴팁 · 드롭다운처럼
    사라지는 쪽이 먼저 끝난다. 모션 감소 설정에서도 같은 시간으로 페이드한다.
  - **`Accordion` 화살표 회전이 본문과 같은 곡선을 쓴다.** 시간은 이미 같았는데 곡선이 달라 회전과
    높이 변화가 서로 다른 진행률로 움직였다. 열 때와 닫을 때 모두 맞춰졌다.
  - **모션 감소 설정에서 `Accordion` 을 펼칠 때 내용이 바로 나타나기 시작한다.** 페이드 시간(250ms)은
    같고 첫 프레임의 뜸이 없어졌다.
  - **`.nui-accordion__panel` 에 `will-change` 를 두지 않는다.** 닫혀 있는 패널까지 합성 레이어를
    붙잡고 있었다. 화면에서 달라 보이는 것은 없다. 이 클래스의 `will-change` 를 기대한 CSS 가 있었다면
    직접 걸어야 한다.
- 3ded5eb: placeholder 를 읽히게 한다.
  
  placeholder 도 글자다. 회색이 한 단계 연해서 라이트 3.77 : 1 · 다크 4.22 : 1 로
  WCAG AA(4.5)에 미달이었다 — 저시력 사용자에게는 "무엇을 넣는 자리인지" 가
  안내되지 않던 셈이다. 두 테마에서 4.5 를 넘는 첫 단계로 올렸다(5.87 · 8.53).
  
  `Textfield` · `Textarea` · `Search` · `Datepicker` · `Select` 다섯 자리가 함께
  바뀐다. 입력한 값(가장 진한 회색)보다는 여전히 연해서 "아직 안 쓴 자리"로 읽힌다.
- f6c6a71: dim 을 눌러도 팝업이 닫히지 않던 것을 고쳤다.
  
  `LayerPopup` · `BottomSheet` · `FullPopup` 은 `shouldCloseOnBackdrop` 이 기본 `true` 라 dim 을 누르면 닫혀야 한다. 그런데 패널을 가운데 놓는 상자가 화면 전체를 덮은 채 클릭을 받고 있어 dim 에 닿지 않았다. 문서를 다시 쓰며 브라우저로 확인하다 찾았다. `Alert` · `Confirm` 은 원래 dim 으로 닫히지 않으므로 그대로다.
- 4f05309: 팝업 배경이 더 빨리 어두워진다
  
  딤이 250ms 에 걸쳐 어두워져서 패널(300ms)과 거의 같이 움직였다. 둘이 동시에 움직이면
  눈이 갈린다. 이제 **100ms** 에 먼저 앉고, 그 위로 패널이 내려앉는다.
  
  딤은 전환이 아니라 상태를 알리는 것이다 — "뒤는 이제 만질 수 없다". 결정을 묻는
  자리에서 그 사실을 천천히 말할 이유가 없다.
  
  `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` 이 함께 바뀐다.
  딤은 다섯이 같은 값을 쓴다.
  
  닫힐 때는 그대로 200ms 다. 딤이 패널보다 먼저 걷히면 패널이 밝은 배경 위에 잠깐 뜬다.
  패널의 등장·퇴장 모션과 prop 은 바뀌지 않는다.
- 8601ff9: 팝업 본문이 길 때 스크롤 경계선이 생긴다. 위로 더 있으면 헤더 아래에, 아래로 더 있으면 푸터 위에 선이 보인다.
  
  제목과 버튼은 원래 제자리에 고정돼 있었고 본문만 스크롤됐는데, **어디까지 봤는지 알려주는 단서가 없었다.** 본문이 잘린 것인지 끝난 것인지 구분되지 않았다.
  
  선은 `inset box-shadow` 라 레이아웃을 밀지 않는다 — 테두리로 그리면 선이 생기는 순간 글이 1px 움찔한다.
- 61c7fe7: 팝업이 열린 채 **다른 페이지로 이동하면**, 닫힐 때 더는 이전 페이지의 스크롤 위치로 되돌리지 않습니다.
  
  - 전에는 시트 · 전체 팝업 안의 링크로 이동하면 새 페이지가 **이전 페이지에서 내려가 있던 위치**에서 열렸습니다. 이제 라우터가 정한 위치(보통 맨 위)에서 열립니다
  - 주소의 **경로(pathname)** 만 비교합니다. `?color=red` 같은 search 나 `#section` 같은 hash 만 바뀌었으면 지금처럼 원래 위치로 돌아갑니다 — 필터 시트가 주소를 맞추는 흐름이 닫힐 때 맨 위로 튀지 않습니다
  - 라우터에 기대지 않고 `location` 만 읽으므로 Next.js 외 라우터에서도 같습니다
  
  ⚠️ 팝업 안 링크로 이동한 뒤 **뒤로가기**하면 이전 페이지는 맨 위에서 열립니다. 팝업이 스크롤을 잠근 동안 브라우저가 그 위치를 기록하기 때문이라 라이브러리가 막을 수 없습니다. 뒤로가기 위치까지 지키려면 팝업을 먼저 닫고 이동합니다.
  
  공개 API 는 그대로입니다.
- 2f0969f: OS 의 **동작 줄이기**(`prefers-reduced-motion: reduce`)를 켠 사용자에게 팝업 · 메뉴 · 토스트 · 툴팁 · 아코디언이 **한 프레임에 툭 나타나고 사라지지 않고, 제자리에서 페이드**합니다. 동작 줄이기를 끈 사용자의 화면은 그대로입니다.
  
  - 위치 이동과 확대는 빠지고 투명도만 남습니다. 시간은 각 컴포넌트의 원래 값 그대로입니다 — 툴팁 150/100ms · Select · Datepicker 200/150ms · 토스트 250ms · LayerPopup · FullPopup 300/200ms · BottomSheet 250/200ms
  - `BottomSheet` · `FullPopup` 패널도 페이드합니다(예전에는 딤만 페이드되고 패널은 한 프레임에 나타났습니다)
  - `Accordion` — 펼치면 칸이 한 번에 열리고 내용만 페이드, 접으면 내용이 페이드된 뒤 칸이 한 번에 닫힙니다
  - `BottomSheet` 를 끌 때 손가락과 1:1 로 따라옵니다(탄성 없음). 조금만 끌고 놓으면 즉시 제자리, 끝까지 끌고 놓으면 그 자리에서 페이드로 닫힙니다
  - `Select` · `Datepicker` 가 닫히는 페이드 동안에도 옵션 · 날짜가 눌리지 않습니다
  - `Tooltip` 을 `defaultOpen` 으로 두고 동작 줄이기를 켠 브라우저로 처음 열 때 나던 hydration 경고가 없어졌습니다
- c36854e: 사용하지 않던 모션 시간 토큰 둘을 뺐다 — `--nui-duration-7`(350ms) · `--nui-duration-8`(400ms), 그리고 같은 값의 `motionDuration.d7` · `d8`.
  
  라이브러리 안에서 참조하는 곳이 없었다. 시트는 스프링으로, 풀팝업은 `--nui-duration-6`(300ms)으로 열리고, UI 모션은 300ms 를 넘지 않는다.
  
  직접 `--nui-duration-7` 이나 `--nui-duration-8` 을 참조해 쓰고 있었다면 `--nui-duration-6` 으로 옮긴다. 컴포넌트의 보이는 동작은 바뀌지 않는다.
- 62c7540: 필수 표시가 Select 에도 전해진다
  
  `Field` 에 `required` 를 줘도 `Select` · `MultiSelect` 의 입력에만
  `aria-required` 가 붙지 않았다. 스크린리더로 폼을 훑는 사람에게는 그 칸만
  필수가 아닌 것으로 읽혔다 — 화면에는 필수 표시가 멀쩡히 보여서 드러나지 않던
  종류다.
  
  ```tsx
  <Field required>
    <Field.Label>요금제</Field.Label>
    <Select options={plans} value={plan} onChange={setPlan} />
  </Field>
  ```
  
  다른 컨트롤 여섯(`Textfield` · `Textarea` · `Checkbox` · `Radio` · `Switch` ·
  `Datepicker` 계열)은 원래 동작하고 있었다.
- ae97fe6: `Select` · `MultiSelect` 의 메뉴가 컨트롤에서 자라 나오고, 닫힐 때 같은 자리로 되돌아가며 사라진다. 예전에는 첫 프레임부터 완성된 채로 나타났고 닫을 때는 즉시 사라졌다.
  
  메뉴가 위로 뒤집혀 열리면 **아래 모서리(트리거 쪽)에서** 자란다. 예전에는 뒤집힌 메뉴도 위에서 내려와 트리거 반대편에서 오는 모양이었다.
  
  닫히는 동안에는 옵션이 눌리지 않는다 — 메뉴가 사라지는 0.15초 안에 같은 자리를 클릭해도 값이 바뀌지 않는다.
  
  모션 감소 설정에서는 위치 이동 없이 즉시 나타나고 즉시 사라진다.
  
  `components` 의 `SelectContainer` 에 기본값이 생겼다. 소비자가 그 자리를 직접 채우면 지금까지처럼 소비자 것이 이기지만, **퇴장 모션은 그 기본값이 갖고 있으므로 함께 사라진다.** 바꿔 끼울 때는 `components.SelectContainer` 안에서 children 을 `AnimatePresence` 로 감싸야 한다.
- ecbcbf2: `Select` · `MultiSelect` 의 옵션을 누르면 눌린 것이 보입니다.
  
  눌림이 자리마다 다른 범위로 걸립니다 — *줄어들 여백이 있으면 누르는 것이 줄고, 없으면
  내용만 줄어듭니다*(`design-system.md §2-3-1`). 옵션은 메뉴 여백 안쪽에서 끝나 둘레가
  비어 있으므로 **칸 전체**가 `--nui-scale-98` 로 줄어듭니다. 인디케이터와 칩의 × 는 24px
  짜리 작은 요소라 `--nui-scale-94` 그대로입니다.
  
  **이미 고른 옵션도 눌립니다.** 선택된 옵션은 면이 이미 깔려 있어 눌림을 말하는 것이
  배율뿐입니다 — 면은 그대로 두고 크기만 줄어듭니다.
  
  ## 함께 고친 것 셋
  
  **비활성 옵션을 눌러도 면이 깔리지 않습니다.** 고를 수 없는 옵션인데 누르면 회색 면이
  잠깐 떠서 눌리는 것처럼 보였습니다. 이제 배율도 면도 없습니다.
  
  **칩의 × 눌림이 튀지 않습니다.** 크기는 줄고 있었는데 그 변화에 전환이 걸려 있지 않아
  들어갔다 나오는 것이 끊겨 보였습니다.
  
  **`readOnly` 인 `MultiSelect` 칩의 좌우 여백이 같아졌습니다.** 읽기 전용에서는 × 가
  사라지는데, 그 자리를 비우던 4px 만 남아 **글자가 칩 오른쪽 끝에 붙었습니다**(왼쪽 12 ·
  오른쪽 4). 이제 양쪽 12 입니다. `disabled` 는 × 가 남으므로 달라진 것이 없습니다.
  
  공개 클래스 · 훅 · prop 은 바뀌지 않았습니다.
- 6054404: `Checkbox` · `Radio` · `Switch` 를 누르는 동안 반응이 보인다. 예전에는 눌러도 화면이 그대로였다.
  
  - 미선택은 옅은 면이 깔리고, 선택된 것을 누르면 채움색이 한 단계 진해진다
  - 상자가 살짝 줄어든다(0.94) — 버튼과 같은 시간·곡선이다
  - 비활성 · 읽기 전용은 아무 반응이 없다
  - 에러 상태는 빨간 채움의 다음 단계로 간다. 누르는 동안 색이 바뀌지 않는다
- e883628: 바텀시트가 스프링으로 올라오고, 전체 팝업이 더 빨라진다
  
  **`BottomSheet`** — 400ms 짜리 곡선 대신 **스프링**으로 올라온다. 시트는 손으로 끌 수
  있는 물건이라, 나중에 끌어서 닫기가 붙었을 때 **올라올 때와 놓았을 때가 같은 물리**로
  움직인다. 튀지는 않는다.
  
  **`FullPopup`** — 350ms 에서 **300ms** 로. 눈에 띄게 빨라지지는 않지만 다른 팝업과
  같은 시계 안에 들어온다.
  
  둘 다 넘어야 할 선을 넘고 있었다. 화면 위에서 움직이는 것은 300ms 아래로 끝나야
  느리게 느껴지지 않는다.
  
  prop 과 마크업은 그대로다. `prefers-reduced-motion` 에서 페이드만 남는 것도 같다.
- 7281a8a: 스위치 손잡이가 켜졌을 때 한쪽으로 밀리던 것과, 체크 표시가 아래로 처지던 것을 고친다
  
  **스위치** — 켜짐일 때 손잡이가 오른쪽으로 2px 밀려 여백이 왼쪽 5 · 오른쪽 3 으로
  어긋나 있었다. 이동 거리 계산이 손잡이 크기와 맞지 않아서다. 여백을 손잡이에서
  역산하도록 바꿔 어느 쪽에서 봐도 같은 간격이 된다.
  
  **체크박스** — 체크 표시가 상자 가운데보다 1.4px 아래에 있었다. 체크가 ㄴ자 두 변으로
  그려지는데 두 변의 길이가 달라서, 45도로 돌리면 획이 아래로 처진다. 상자는 정확히
  가운데인데 눈에는 내려가 보였다. 두 변의 길이에서 보정값을 역산해 맞췄다.
  
  중간 상태(대시)는 회전이 없어 영향이 없다. 마크업과 prop 은 그대로다.
- 3e8a9a8: 토스트가 닫힐 때 `onOpenComplete` 가 한 번 더 불리던 것을 고쳤다.
  
  열림 모션이 끝나면 한 번, 닫힘 모션이 끝나면 또 한 번 불려 `onOpenComplete → onRequestClose → onOpenComplete → onCloseComplete` 순서였다. 명령형 `toast.open({ onOpenComplete })` 도 같았다. 이제 열릴 때 한 번만 불린다.
- 3e8a9a8: 툴바를 쓸며 지나갈 때 이웃 툴팁이 바로 뜨게 했다.
  
  하나가 열린 뒤 300ms 안에 이웃에 닿으면 지연 없이 열리기로 되어 있었는데, 실제로는 앞의 툴팁이 완전히 닫힌 뒤부터만 그 300ms 를 셌다. 마우스가 떠나고 100ms 뒤에 닫히므로 그보다 빨리 이웃에 닿으면 다시 400ms 를 기다렸다. 이제 열린 툴팁을 떠나는 순간부터 센다.
- bb335e7: 터치 기기에서 `Button` 계열(`Button` · `IconButton` · `ButtonLink` · `ButtonGroup` 항목)과 `Checkbox` · `Radio` · `Switch` 를 누를 때 **브라우저 기본 하이라이트가 더는 겹치지 않습니다.**
  
  - 탭을 뗄 때 회색(iOS) · 하늘색(Chrome) 면이 순간 덮이던 것이 사라집니다. 눌림 표시는 라이브러리의 면과 배율만 남습니다
  - 꾹 눌러도 라벨 글자가 선택되거나 iOS 콜아웃 메뉴가 뜨지 않습니다
  - 누르는 요소 자신에만 걸립니다. `Popup` · `Toast` 안에 넣은 소비자 콘텐츠의 선택·하이라이트는 그대로입니다
  - 다른 컴포넌트(입력 보조 버튼 · Select 옵션 · 달력 · Accordion · 팝업 닫기 등)는 이 판에 없습니다 — 다음 판에서 같은 방식으로 갑니다
  
  공개 API 는 그대로입니다.
- bb335e7: 터치 기기에서 누르는 자리 전부가 **브라우저 기본 하이라이트와 글자 선택을 끕니다.** `Button` · `Checkbox` · `Radio` · `Switch` 에 이어 나머지도 같아졌습니다.
  
  - 대상 — `Textfield` · `Search` · `Password` 의 입력 안 버튼 · `Select` · `MultiSelect` 의 옵션 · 지우기 · 화살표 · 칩 × · 달력의 날짜 · 이전/다음 · 년/월 선택 · `Accordion` 헤더 · `Toast` 의 액션 · 닫기 · `Field` 라벨
  - 탭을 뗄 때 회색(iOS) · 하늘색(Chrome) 면이 덮이지 않고, 꾹 눌러도 글자가 선택되거나 콜아웃 메뉴가 뜨지 않습니다
  - `Field` 없이 `Field.Item` 만 쓴 라벨(체크박스 · 스위치 옆)에서도 글자 선택이 막힙니다. 전에는 `Field` 안의 라벨에서만 막혔습니다
  - 입력칸과 소비자 콘텐츠는 그대로입니다 — `Select` 검색 · `Textfield` 입력 · `Accordion` 본문 · `Toast` 메시지 · `Popup` 안 글은 선택할 수 있습니다
  
  공개 API 는 그대로입니다.
- 69d6a2a: 투명한 요소의 hover 와 누르는 순간의 회색 면이 한 단계 연해집니다 — 아코디언 헤더 · `line`·`text`
  버튼 · 셀렉트 옵션 · 달력 날짜와 이전/다음 · 입력 안의 지우기·토글 버튼 · 팝업과 토스트의 닫기 버튼.
  
  흰 배경 위에서 hover 면은 검정 9.4% → **6.3%**, 누르는 면은 12.2% → **9.4%** 입니다(다크는 흰
  알파로 같은 단계). 전에는 「이미 면을 가진 요소」의 hover·pressed 단계를 투명 요소에 쓰고 있어
  정본 셋(KRDS 96쪽 gray 5→10 · Radix 「기본이 투명이면 hover 는 3」· SEED 투명 눌림)보다 한 단계
  진했습니다. `line` 버튼의 테두리 3단계는 그대로이고, 연해진 면 위에서 대비를 다시 쟀습니다.
  
  바뀐 것은 `--nui-control-bg-hover` · `--nui-control-bg-active` · `--nui-action-bg-hover` ·
  `--nui-action-bg-active` 네 토큰의 **값**뿐입니다. 이름 · 클래스 · 공개 훅은 바뀌지 않았고,
  색은 소비자 창구가 아니라 손댈 것이 없습니다.

## 0.1.2

### Patch Changes

- 5791009: `homepage` 가 API 문서 사이트를 가리킵니다 — https://nui-kit-docs.vercel.app
  
  npm 페이지의 Homepage 링크가 GitHub README 대신 문서 사이트로 갑니다.
  컴포넌트별 props 표와 토큰·공개 변수 목록은 코드에서 자동 생성되므로
  README 요약보다 정확하고, 새 버전이 나오면 함께 갱신됩니다.
  
  코드 동작은 바뀌지 않습니다.

## 0.1.1

### Patch Changes

- README 의 잘못된 안내를 고쳤습니다.
  
  **배포된 패키지가 "아직 배포되지 않았다"고 적고 있었습니다.** 0.1.0 의 README 첫
  문단에 `🚧 개발 중 (v0.0.0). 아직 npm 에 배포되지 않았습니다` 배너가 그대로
  남아 있었습니다. tarball 은 publish 시점에 고정되므로 새 버전으로만 고칠 수
  있습니다.
  
  - CSS 변수 계층을 **2계층 → 3계층**으로 정정했습니다.
    실제 구조는 Primitive → Semantic → Component(공개 훅)입니다
  - `DateMultiplePicker` 설명을 다시 썼습니다 — "아직 읽기 전용" 이 아니라
    **달력으로만 고른다**는 설계입니다. 여러 날짜를 한 칸에 쳐 넣는 구분자 규칙을
    두지 않았습니다
  
  코드 동작은 바뀌지 않았습니다. 주석의 출처 표기만 함께 정리했습니다.

## 0.1.0

**첫 공개 버전입니다.** Next.js App Router 전용 React 컴포넌트 라이브러리입니다.

이 버전 이전의 개발 과정은 저장소의 커밋 히스토리에 있습니다. 아래는 지금 이
버전에 무엇이 들어 있는지입니다.

### 들어 있는 것

컴포넌트 **40종**을 14개 계열로 제공합니다.

| 계열 | 컴포넌트 |
| --- | --- |
| 액션 | `Button` · `IconButton` · `ButtonGroup` · `ButtonLink` |
| 폼 골격 | `Field` (+ `Label` · `Description` · `Message` · `Item` · `Grid`) |
| 텍스트 입력 | `Textfield` · `Textarea` · `Search` · `Password` |
| 선택 컨트롤 | `Checkbox` · `Radio` · `Switch` (+ 각 `Group`) |
| 목록 선택 | `Select` · `MultiSelect` |
| 날짜 | `Datepicker` · `DateRangePicker` · `DateMultiplePicker` |
| 팝업 | `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` · `PopupHost` |
| 피드백 | `Toast` · `ToastHost` · `Tooltip` |
| 디스클로저 | `Accordion` |
| 아이콘 | `Icon` + 어댑터 7종 |

**react-hook-form 래퍼 13종**을 `/rhf` 서브패스로 함께 제공합니다 —
`RHFTextfield` · `RHFTextarea` · `RHFSearch` · `RHFPassword` · `RHFCheckbox` ·
`RHFRadio` · `RHFSwitch` · `RHFSelect` · `RHFMultiSelect` · `RHFDatepicker` ·
`RHFDateRangePicker` · `RHFDateMultiplePicker`.

### 설치

```bash
npm i @nui-kit/react
```

```tsx
import { Button, Field, Textfield } from "@nui-kit/react";
import "@nui-kit/react/styles/index.css";
```

`next` 는 **required peer** 입니다 — App Router 전용이고 배럴에 `next/link` 를
쓰는 `ButtonLink` 가 포함되어 있습니다. `react-hook-form` 은 **선택적 peer** 라
`/rhf` 서브패스를 쓸 때만 필요합니다.

### 설계 계약

- **소비자 스타일을 오염시키지 않습니다.** 모든 클래스는 `nui-` 프리픽스, 모든 CSS 는
  `@layer nui.*` 안에 있습니다. 레이어 밖 선언이 항상 이기므로 `!important` 없이
  덮어쓸 수 있습니다. reset 은 배포하지 않습니다 — `preflight.css` 를 원할 때만
  가져다 씁니다
- **ESM 단일 포맷**입니다. 듀얼 패키지 해저드(React 인스턴스 이중화)를 차단합니다
- **모든 컴포넌트가 클라이언트 컴포넌트**(`"use client"`)입니다. 합성 컴포넌트는
  dot notation 과 named export 를 함께 제공합니다 — Server Component 에서
  `<Field.Label>` 이 `undefined` 가 되는 문제를 피하려면 named export 를 쓰세요
- **서브패스 14개**로 필요한 것만 가져올 수 있습니다 (`@nui-kit/react/button` 등).
  CSS 도 컴포넌트별로 나뉘어 있고 서브패스 이름과 1:1로 맞습니다
- **값형 입력은 controlled 전용**입니다 (`value` + `onChange`). 체크형
  (`Checkbox`·`Radio`·`Switch`)은 `defaultChecked` 를 받습니다

### 커스터마이징

CSS 변수 **283개**를 3계층(Primitive → Semantic → Component)으로 두고, 그중
**공개 훅 40개**를 11개 컴포넌트에서 열어 둡니다. 치수·간격·둥글기·선 두께가
그 대상입니다.

```css
:root {
  --nui-button--radius: 20px;
  --nui-button--lg-height: 60px;
}
```

**색은 훅으로 열지 않습니다.** 배경과 글자는 짝이라 한쪽만 바꾸면 대비가 조용히
깨지는데, 그 사실이 화면에 드러나지 않기 때문입니다. 색을 바꾸는 길은 둘입니다 —
**브랜드 색 프리셋 185색** 중 하나를 고르거나, `className` 으로 그 컴포넌트만
직접 지정하는 것입니다.

다크 테마는 OS 설정만으로 적용되고 `data-theme="light|dark"` 로 고정할 수도 있습니다.

### 접근성

- **WCAG 비텍스트 대비 3:1** — 입력 테두리 · 스위치 트랙 · 체크박스 외곽선 ·
  포커스 표시를 라이트·다크 두 테마에서 기계 검사합니다
- **터치 영역** — 단독으로 누르는 것은 44×44px 을 향하고, 구조적으로 불가능한
  자리는 하한 24px 에 두고 이유를 기록합니다
- **`prefers-reduced-motion`** — duration 토큰이 무력화되고, framer-motion 을 쓰는
  컴포넌트는 `useReducedMotion()` 으로 분기합니다
- **컴포넌트가 소유한 문자열은 전부 prop 으로 교체 가능**합니다. 스크린리더 전용
  안내(`Select` 의 `ariaLiveMessages` 등)도 포함입니다
- `Field` 가 `id` · `aria-describedby` 연결을 소유하고, 에러는 색만이 아니라
  아이콘 + 텍스트 + `aria-live` 로 전합니다

### KRDS 준수

**디지털 정부서비스 UI/UX 가이드라인(2025.08)** 을 기준으로 색 단계 · 상태 · 대비 ·
서체 규격(400·700, 행간 150%, 최소 13px) · 형태(높이 × ⅛, 최대 12px) · 치수 ·
동작을 맞췄습니다. 정부 납품용은 아니며, 브랜드 색은 자체 상징 경로로 유지합니다.

### 알려진 제약

- **반응형 브레이크포인트는 보류 상태**입니다. 인프라는 있지만 컴포넌트가 쓰지
  않습니다 — 모든 뷰포트에서 지정한 값을 유지합니다
- `Alert` · `Confirm` 은 `Escape` · dim 클릭으로 닫히지 않습니다. KRDS 가 정한
  「승인이 필요한 모달」 유형이라 액션 버튼을 골라야 닫힙니다 (APG 와는 다릅니다)
- 문서 사이트와 컴포넌트 기본 문자열은 **한국어**입니다. 다른 언어라면 위의
  「접근성」 항목대로 prop 으로 교체하세요
- 0.x 이므로 공개 API 가 바뀔 수 있습니다. 변경은 이 파일에 기록합니다

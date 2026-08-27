# LayerPopup

> 화면 중앙에 떠서 배경 상호작용을 차단하는 모달 다이얼로그. `PopupBase` 의 `dialog`
> variant 를 고정한 프리셋이다.

## 0. 파일 배치

- **본체**: `src/components/Popup/LayerPopup.tsx` (기반: `PopupBase.tsx`)
- **배럴**: `src/components/Popup/index.ts`
- **서브패스**: `src/popup.ts` → `@chansikchoi/next-ui/popup`
- **스타일**: `src/styles/components/_popup.scss` + `entries/popup.scss`
- **RHF 래퍼**: 없음 — 폼 값을 다루지 않는다
- **문서**: `apps/docs/src/app/components/popup/`

---

## 1. 개요

모달 다이얼로그다. 같은 계열에서 `Alert`(알림) · `Confirm`(확인/취소) 은 푸터가 고정된
프리셋이고, `LayerPopup` 은 **내용과 푸터를 자유롭게 채우는** 범용 셸이다.
바닥에서 올라오면 `BottomSheet`, 전체 화면이면 `FullPopup`.

### 라이브러리 등록 근거

원본에서 이식.

---

## 2. 영역 구성

- ① **루트** — 상태 클래스와 z-index 소유 / 필수
- ② **dim** — 배경 차단막 / 필수
- ③ **positioner** — 패널 배치 / 필수
- ④ **panel** — `role="dialog"`. 실제 카드 / 필수
- ⑤ **head** — 제목 + 닫기 버튼 / 선택 (둘 다 없으면 렌더 안 함)
- ⑥ **body** — 아이콘·설명·children / 필수
- ⑦ **foot** — 푸터 / 선택

---

## 3. 공개 API

### 3-1. Props

`LayerPopupProps = Omit<PopupBaseProps, "variant" | "size"> & Pick<PopupBaseProps, "size">`
→ 실질적으로 **`variant` 만 제외한 `PopupBaseProps` 전부**. (`BottomSheet`·`FullPopup` 은
`size` 도 없다 — 셋을 구분하는 유일한 타입 차이다.)

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — (필수) | **controlled 전용** |
| `children` | `ReactNode` | — | body 안, 아이콘·설명 다음 |
| `size` | `"small" \| "regular" \| "large"` | `"regular"` | 패널 폭 |
| `contentAlign` | `"left" \| "center"` | **`"left"`** | `PopupBase` 기본값(`center`)을 덮는다 |
| `title` / `icon` / `description` / `footer` | `ReactNode` | — | 슬롯 |
| `hasCloseButton` | `boolean` | `true` | |
| `closeButtonLabel` | `string` | `"팝업 닫기"` | 닫기 버튼 `aria-label` |
| `dialogLabel` | `string` | **`"레이어 팝업"`** | `title` 이 없을 때의 접근 이름 |
| `shouldCloseOnBackdrop` / `shouldCloseOnEscape` | `boolean` | `true` | |
| `onRequestClose` | `() => void` | — | 닫기 **요청**. 실제로 닫는 주체는 소비자 |
| `onClickClose` | `() => void` | — | 닫기 버튼 전용. `onRequestClose` 보다 먼저 호출되고 **둘 다** 호출된다 |
| `onExited` | `() => void` | — | 닫힘 애니메이션 완료 후 |
| `isTopmost` | `boolean` | `false` | **`false` 면 ESC·포커스 트랩·최초 포커스가 전부 동작하지 않는다** |
| `className` / `panelClassName` / `bodyClassName` / `footerClassName` | `string` | — | 각 영역에 병합 |

**값 소유권** — 완전 controlled. `open` 을 컴포넌트가 소유하지 않는다.
닫기 트리거는 `onRequestClose` 통보뿐이고, 실제로 내리는 건 소비자(선언형) 또는
popup store(명령형)다.

**받지 않는 prop** — `variant`(dialog 고정).

⚠️ `isTopmost` 기본값이 `false` 라 **선언형으로 쓸 때 소비자가 명시해야 한다.**
`PopupHost` 경유면 Host 가 계산해 주입한다. 이 prop 을 `Omit` 하지 않은 이유가
`Popup.types.ts` 주석에 있다 — 원본의 결함이었다.

### 3-2. 합성 구조

없음. 슬롯을 prop 으로 받는다. 따라서 RSC dot notation 문제의 대상이 아니다.

### 3-3. 배럴에서 나가는 것

`LayerPopup` · `PopupBase` · `PopupHost` · `useLayerPopup` · `usePopupStore` ·
`usePopupStack` + 타입(`LayerPopupProps` · `LayerPopupComponentProps` · `LayerPopupOptions`).

**명령형 API** — `useLayerPopup()` 이 `{ open, close, closeAll, layerPopups }` 를 준다.
`open({ component })` 이 스택에 등록하고 id 를 반환한다. 같은 id 재등록은 **Error 를 던진다**
(열린 팝업의 내용을 갱신하는 용도가 아니다).

---

## 4. Variant

| 축 | 값 | 비고 |
| --- | --- | --- |
| `size` | small / regular / large | `regular` 가 기본, modifier 없음 |
| `contentAlign` | left / center | `left` 가 기본 |

---

## 5. 상태

폼 컨트롤이 아니라 `disabled`/`readonly`/`error` 가 **해당 없음**. 상태는 생명주기와 스택 위치다.

| 상태 | 변화 |
| --- | --- |
| 닫힘 | `AnimatePresence` 안에서 트리 전체가 렌더되지 않는다 (DOM 없음) |
| 열림 | dim 페이드 + 패널 `y 24 → 0`, `scale .96 → 1` |
| `closing`(store) | `status` 만 바뀌고 `open=false`. 이 동안 **topmost 후보에서 빠진다** |
| exited | `onExited` → (Host 경유면) 스택에서 제거 → 언마운트 → 포커스 복원 |
| `isTopmost=false` | 최초 포커스·Tab 트랩·ESC 가 전부 early-return. **화면에는 그대로 보인다** |

**우선순위** — 팝업끼리는 z-index 가 같다. 겹칠 때의 상하는 `PopupHost` 가 배열 순서대로
렌더하므로 **DOM 순서**가 정한다 (나중에 연 것이 위).

---

## 6. 동작 규칙

### PopupHost 와의 관계

```
useLayerPopup().open({ component })  ── store 에 push
                                          │
PopupHost ── 구독 ── createPortal ──> #nui-popup-root (body 직계)
                                          │
                              <component open isTopmost onRequestClose onExited />
```

- **앱 루트에서 한 번만 감싼다.** `children` 이 **필수**인 래퍼다
- **없으면 명령형 팝업은 조용히 렌더되지 않는다.** store 에는 쌓이지만 그리는 주체가 없다.
  에러도 경고도 나지 않는다
- portal 컨테이너는 **없으면 Host 가 만든다.** 우리가 만든 경우에 한해, 비어 있을 때만 제거
- 컨테이너 조회는 `useEffect` 안에서 한다 — 렌더 중 `document` 를 읽으면 하이드레이션 불일치

⚠️ **선언형으로 직접 쓰면 Host 를 거치지 않는다.** portal 없이 제자리에 렌더되고
**배경 스크롤 잠금과 `inert` 가 걸리지 않는다**(둘 다 Host 책임이고 store 항목 수로 판단).
패널은 `position: fixed` 라 화면 중앙에 뜬다. (→ §13)

### 포커스 생명주기

1. 열릴 때 `requestAnimationFrame` 뒤 패널 안 **첫 focusable** 로 이동. 없으면 패널 자신
2. 열기 직전 `activeElement` 를 기억했다가 **`PopupBase` 언마운트 시** 복원.
   `isConnected` 를 두 번(등록·실행 시점) 확인한다
3. ⚠️ **복원 기준이 `open` 이 아니라 마운트/언마운트다.** 명령형은 언마운트되므로 정상
   동작하지만, **선언형으로 항상 마운트해 두고 `open` 만 토글하면 포커스가 복원되지 않는다**

---

## 7. 접근성

| 항목 | 구현이 보장하는 것 |
| --- | --- |
| 시맨틱 | 패널이 `role="dialog"` + `aria-modal="true"` + `tabIndex={-1}` |
| 접근 이름 | `title` 있으면 `aria-labelledby`, 없으면 `aria-label={dialogLabel}`. **배타적** |
| 설명 | `description` 이 있을 때만 `aria-describedby`. 없으면 속성 생략 |
| 키보드 | `Escape` 닫기 / `Tab`·`Shift+Tab` 순환 트랩 / 포커스가 밖이면 끌어온다 / focusable 이 없으면 패널 자신 |
| 배경 격리 | `body` 직계 자식에 `inert` + `aria-hidden`. 남이 건 `inert` 는 건드리지 않고, 해제 시 원래 값 복원 |
| 스크롤 잠금 | `body.nui-is-prevent-scroll` + 위치 기록·복원. 언마운트 시 강제 원복 |
| 모션 | `useReducedMotion()` 으로 분기한다 — framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6) |

닫기 버튼은 `<button type="button">` + `aria-label`, 내부 아이콘은 `aria-hidden`.

**소비자가 책임지는 것** — 선언형 사용 시 `isTopmost` 명시.

배경 격리는 원본이 Pages Router 의 `#__next` 를 특정했으나, App Router 에 그 요소가 없어
**프레임워크 비의존 방식**으로 바꿨다.

---

## 8. 외부 라이브러리

| 라이브러리 | 분류 | 근거 |
| --- | --- | --- |
| `framer-motion` | dep | `AnimatePresence`/`motion`. 내부 구현 전용 |
| `zustand` | dep | store 는 우리 모듈 스코프 싱글턴. 소비자가 같은 store 를 만들 일이 없다 |
| `classnames` | dep | 클래스 조합 |
| `react-dom` | peer | `createPortal` — React 와 같은 인스턴스여야 한다 |

`entries/popup.scss` 는 `icon`·`button` 스타일을 함께 포함한다 — Alert·Confirm 푸터가
Button·ButtonGroup 을 렌더하므로 단독 동작을 위해서다.

---

## 9. 스타일

> 색·상태 토큰은 [design-system.md](../rules/design-system.md) §3 매트릭스를 따른다.

- **분류**: 표면 (§3-3) — 닫기 버튼 hover 가 `control-bg-hover`
- **너비**: 패널이 `--nui-popup-width` 로 자기 폭을 갖는다. 루트는 뷰포트 고정
- **공개 훅**

  | 훅 | 기본값 |
  | --- | --- |
  | `--nui-popup-width` | `min(100%, 30rem)` (small 22.5rem / large 40rem) |
  | `--nui-popup-bg` | `surface-panel-strong` |
  | `--nui-popup-radius` | `radius-xl` |
  | `--nui-popup-dim` | `surface-overlay-dim` |

- **매트릭스 예외**: 없음
- **z-index**: `z-overlay-layer`(1030). `z-portal-menu`·`z-toast`(1031)가 위에 오는 것은
  의도다 — 팝업 안에서 띄운 드롭다운·토스트가 보여야 한다
- `--nui-scroll-lock-top` 은 Host 가 기록하고 `base/_scroll-lock.scss` 가 읽는 **배선 값**이다.
  소비자가 설정할 대상이 아니다

⚠️ **`--nui-popup-width` 를 size 세 규칙이 모두 같은 이름으로 읽는다.** 소비자가 한 번
설정하면 size variant 가 전부 무력화된다 (→ §13)

---

## 10. 완료 조건

- [x] `open` 을 내리면 애니메이션 후 DOM 에서 사라진다
- [x] ESC·dim 클릭·닫기 버튼이 `onRequestClose` 를 부른다
- [x] 열려 있는 동안 배경을 Tab 으로 벗어날 수 없다
- [x] 닫으면 열기 전 요소로 포커스가 돌아간다 (명령형 경로)
- [x] 열려 있는 동안 배경이 스크롤되지 않고, 닫으면 원래 위치로 돌아온다
- [x] 여러 개를 겹치면 마지막에 연 것만 ESC 로 닫힌다

---

## 11. 주요 위험과 검증 방법

| 위험 | 기대 결과 | 검증 방법 |
| --- | --- | --- |
| portal 컨테이너 부재 | Host 가 직접 생성 | 브라우저 (없으면 조용히 렌더 안 됨) |
| 스크롤 잠금 누수 | 팝업이 열린 채 라우팅해도 문서가 잠기지 않음 | 브라우저 |
| 포커스 복원 | 선언형 상시 마운트에서는 복원되지 않음 | 브라우저 (정적 검사로 안 잡힘) |
| 스택 topmost | `closing` 인 팝업이 topmost 후보에서 빠짐 | 브라우저 |

---

## 12. 제외 범위

- 반응형 — 보류. 원본은 데스크톱에서 여백을 키웠으나 `card` 값으로 통일했다
- 드래그로 닫기 / 스와이프
- 열린 팝업의 props 갱신 — store 가 같은 id 재등록을 Error 로 막는다
- `LayerPopup` 전용 CSS — `.nui-layer-popup` 은 규칙이 없는 식별용 훅 클래스다

---

## 13. Open Questions

1. **`--nui-popup-width` 가 size variant 를 무력화하는 설계를 유지할지.**
   `iv()` 배선 + variant 별 훅으로 바꾸면 기존 오버라이드 동작이 달라지므로 **breaking.**
2. **선언형 사용 시 `isTopmost` 기본값.** 현재 `false` 라 명시하지 않으면 ESC·트랩이 조용히
   죽는다. 기본값을 `true` 로 두고 Host 가 `false` 를 주입하는 편이 안전하나 **breaking.**
3. **선언형 팝업에 스크롤 잠금·`inert` 가 없다.** 현재 store 항목 수로만 판단한다.
   의도된 분업인지, `PopupBase` 로 내려야 하는지.

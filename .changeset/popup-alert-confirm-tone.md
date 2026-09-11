---
"@nui-kit/react": minor
---

Alert · Confirm 의 제목을 본문으로 내리고 아이콘을 tone 넷으로 좁힌다

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

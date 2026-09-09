---
"@nui-kit/react": patch
---

토스트가 닫힐 때 `onOpenComplete` 가 한 번 더 불리던 것을 고쳤다.

열림 모션이 끝나면 한 번, 닫힘 모션이 끝나면 또 한 번 불려 `onOpenComplete → onRequestClose → onOpenComplete → onCloseComplete` 순서였다. 명령형 `toast.open({ onOpenComplete })` 도 같았다. 이제 열릴 때 한 번만 불린다.

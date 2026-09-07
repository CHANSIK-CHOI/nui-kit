import type { ReactNode } from "react";

export type ToastTone = "default" | "success" | "error";
export type ToastStatus = "open" | "closing";

/**
 * 토스트의 액션 하나. 라벨은 **행동 동사**다 — "되돌리기" · "목록보기"
 * (design-system.md §11-1). 사라지는 것에 두 개를 담지 않으므로 배열이 아니다 (§2-4-1).
 */
export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastSharedProps = {
  className?: string;
  message: ReactNode;
  tone?: ToastTone;
  /** 자동으로 닫히기까지의 시간(ms). 0 이하면 자동으로 닫히지 않는다 */
  duration?: number;
  /**
   * 닫기 버튼을 보인다. 기본값은 `false` —
   * 항상 X 가 붙으면 알림이 대화상자처럼 무거워진다.
   * 읽는 동안 시간이 멈추는 것은 이 값과 무관하게 **항상** 동작한다.
   */
  closable?: boolean;
  /** 닫기 버튼의 접근 이름 (a11y.md §9) */
  closeLabel?: string;
  /** 액션 하나. 누르면 실행하고 토스트를 닫는다 */
  action?: ToastAction;
};

export type ToastProps = ToastSharedProps & {
  open: boolean;
  onRequestClose?: () => void;
  onExited?: () => void;
  onOpenComplete?: () => void;
};

export type ToastOpenOptions = ToastSharedProps & {
  id?: string;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
};

export type ToastSnapshot = {
  id: string;
  status: ToastStatus;
  tone: ToastTone;
};

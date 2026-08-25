import type { ReactNode } from "react";

export type ToastTone = "default" | "error";
export type ToastStatus = "open" | "closing";

export type ToastSharedProps = {
  className?: string;
  message: ReactNode;
  tone?: ToastTone;
  /** 자동으로 닫히기까지의 시간(ms). 0 이하면 자동으로 닫히지 않는다 */
  duration?: number;
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

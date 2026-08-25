import type { ComponentType, ReactNode } from "react";

export type PopupVariant = "dialog" | "bottomSheet" | "full";
export type PopupSize = "small" | "regular" | "large";
export type PopupContentAlign = "left" | "center";

export type PopupBaseProps = {
  children?: ReactNode;
  id?: string;
  className?: string;
  panelClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  open: boolean;
  variant?: PopupVariant;
  size?: PopupSize;
  contentAlign?: PopupContentAlign;
  title?: ReactNode;
  icon?: ReactNode | null;
  description?: ReactNode;
  footer?: ReactNode;
  hasCloseButton?: boolean;
  closeButtonLabel?: string;
  /** dim 클릭으로 닫히는가 */
  shouldCloseOnBackdrop?: boolean;
  shouldCloseOnEscape?: boolean;
  /** title 이 없을 때 dialog 에 붙일 접근 이름 */
  dialogLabel?: string;
  onRequestClose?: () => void;
  onClickClose?: () => void;
  /** 닫힘 애니메이션까지 끝난 뒤 호출된다 */
  onExited?: () => void;
  /** 스택 최상단인가 — 포커스 트랩과 ESC 를 이 팝업만 처리한다 */
  isTopmost?: boolean;
};

type PopupInstanceProps = Pick<
  PopupBaseProps,
  "id" | "open" | "onExited" | "isTopmost"
>;

// ⚠️ isTopmost 를 Omit 하지 않는다.
//    PopupHost 는 등록된 컴포넌트에 isTopmost 를 넘기는데, 셸이 이를 받지 못하면
//    PopupBase 의 기본값 false 가 그대로 쓰이고 usePopupPanelA11y 가 전부
//    early-return 한다 — 즉 ESC 로 닫히지도, 포커스가 갇히지도 않는다.
//    (원본 프로젝트에 있던 결함이다)
type PopupSharedShellProps = Omit<PopupBaseProps, "variant" | "size">;
type PopupSizedShellProps = PopupSharedShellProps &
  Pick<PopupBaseProps, "size">;

export type PopupRuntimeProps = PopupInstanceProps &
  Pick<PopupBaseProps, "onRequestClose">;

export type AlertContentProps = Pick<
  PopupBaseProps,
  "className" | "title" | "icon" | "description"
> & {
  confirmText?: ReactNode;
  onConfirm?: () => void;
};

export type AlertProps = AlertContentProps & PopupInstanceProps;

export type AlertPopupOptions = AlertContentProps & {
  id?: string;
  shouldCloseOnConfirm?: boolean;
};

export type ConfirmContentProps = Pick<
  PopupBaseProps,
  "className" | "title" | "icon" | "description"
> & {
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export type ConfirmProps = ConfirmContentProps & PopupInstanceProps;

export type ConfirmPopupOptions = ConfirmContentProps & {
  id?: string;
  shouldCloseOnCancel?: boolean;
  shouldCloseOnConfirm?: boolean;
};

type PopupRegistrationOptions = {
  id?: string;
  /** 팝업 내용을 담은 컴포넌트. PopupHost 가 런타임 props 를 주입해 렌더한다 */
  component: ComponentType<PopupRuntimeProps>;
};

export type LayerPopupProps = PopupSizedShellProps;
export type BottomSheetProps = PopupSharedShellProps;
export type FullPopupProps = PopupSharedShellProps;

export type LayerPopupComponentProps = PopupRuntimeProps;
export type BottomSheetComponentProps = PopupRuntimeProps;
export type FullPopupComponentProps = PopupRuntimeProps;

export type LayerPopupOptions = PopupRegistrationOptions;
export type BottomSheetOptions = PopupRegistrationOptions;
export type FullPopupOptions = PopupRegistrationOptions;

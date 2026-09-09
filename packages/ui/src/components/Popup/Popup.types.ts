import type { ComponentType, ReactNode } from "react";

export type PopupVariant = "dialog" | "bottomSheet" | "full";
export type PopupSize = "small" | "medium" | "large";
export type PopupContentAlign = "left" | "center";

/**
 * 팝업에는 이름이 있어야 한다 — 둘 중 하나는 **반드시** (06 D5).
 *
 * 아무것도 안 주면 스크린리더가 "대화상자"만 읽는다. 무슨 팝업인지 알 수 없고,
 * 그 사실이 화면에서는 드러나지 않는다. 그래서 타입이 막는다 —
 * `IconButton` 의 접근 이름과 같은 모양이다(`c09578a`).
 *
 * ⚠️ **기본값으로 일반 이름을 두지 않는다.** 예전에는 셸마다
 *    "레이어 팝업" · "바텀시트 팝업" · "전체 팝업" 을 기본값으로 넣고 있었다.
 *    타입이 통과되니 소비자는 이름을 붙일 이유를 못 느끼고, 스크린리더는
 *    다섯 팝업을 전부 같은 이름으로 읽는다 (design-system.md §11).
 */
type PopupAccessibleName =
  | { title: ReactNode; dialogLabel?: string }
  | { title?: undefined; dialogLabel: string };

/**
 * 이름(`title` · `dialogLabel`)을 뺀 나머지.
 *
 * ⚠️ `Pick` · `Omit` 은 **여기서** 뽑는다. union 이 섞인 타입에서 `Pick` 하면
 *    분배되지 않아 "둘 중 하나" 제약이 조용히 풀린다.
 */
type PopupBaseOwnProps = {
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
  icon?: ReactNode | null;
  description?: ReactNode;
  footer?: ReactNode;
  hasCloseButton?: boolean;
  closeLabel?: string;
  /** dim 클릭으로 닫히는가 */
  shouldCloseOnBackdrop?: boolean;
  shouldCloseOnEscape?: boolean;
  onRequestClose?: () => void;
  onClickClose?: () => void;
  /** 닫힘 애니메이션까지 끝난 뒤 호출된다 */
  onCloseComplete?: () => void;
  /** 스택 최상단인가 — 포커스 트랩과 ESC 를 이 팝업만 처리한다 */
  isTopmost?: boolean;
};

/**
 * 골격의 props — 이름 제약이 **없다.**
 *
 * `PopupBase` 는 공개하지 않으므로(`index.ts`) 제약을 여기 두면 얻는 것이 없고,
 * 셸이 이름 한 쌍을 풀어서 넘기는 순간 TypeScript 가 union 을 못 맞춘다.
 * **제약은 소비자가 만지는 자리(셸 다섯)에만 둔다.**
 */
export type PopupBaseProps = PopupBaseOwnProps & {
  title?: ReactNode;
  /** title 이 없을 때 dialog 에 붙일 접근 이름 */
  dialogLabel?: string;
};

type PopupInstanceProps = Pick<
  PopupBaseOwnProps,
  "id" | "open" | "onCloseComplete" | "isTopmost"
>;

// ⚠️ isTopmost 를 Omit 하지 않는다.
//    PopupHost 는 등록된 컴포넌트에 isTopmost 를 넘기는데, 셸이 이를 받지 못하면
//    PopupBase 의 기본값 false 가 그대로 쓰이고 usePopupPanelA11y 가 전부
//    early-return 한다 — 즉 ESC 로 닫히지도, 포커스가 갇히지도 않는다.
//    화면도 마우스도 멀쩡해서 키보드 사용자만 겪는다.
type PopupSharedShellProps = Omit<PopupBaseOwnProps, "variant" | "size"> &
  PopupAccessibleName;
type PopupSizedShellProps = PopupSharedShellProps &
  Pick<PopupBaseOwnProps, "size">;

export type PopupRuntimeProps = PopupInstanceProps &
  Pick<PopupBaseOwnProps, "onRequestClose">;

export type AlertContentProps = Pick<
  PopupBaseOwnProps,
  "className" | "icon" | "description"
> &
  PopupAccessibleName & {
  confirmLabel?: ReactNode;
  onConfirm?: () => void;
};

export type AlertProps = AlertContentProps & PopupInstanceProps;

export type AlertPopupOptions = AlertContentProps & {
  id?: string;
  shouldCloseOnConfirm?: boolean;
};

export type ConfirmContentProps = Pick<
  PopupBaseOwnProps,
  "className" | "icon" | "description"
> &
  PopupAccessibleName & {
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
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

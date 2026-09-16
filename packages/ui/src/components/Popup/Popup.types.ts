import type { ComponentType, ReactNode } from "react";

export type PopupVariant = "dialog" | "bottomSheet" | "full";
export type PopupSize = "small" | "medium" | "large";
export type PopupContentAlign = "left" | "center";

/**
 * `Alert` · `Confirm` 의 성격. 아이콘 글리프와 **선 색**을 고른다 (spec §6-6).
 *
 * **바뀌는 것은 선 색 하나다.** 면도 테두리도 없다 — 글리프가 56px 자리를 그대로 차지한다.
 *
 * ⚠️ **「없음」은 여기 없다.** 아이콘을 끄는 것은 `hasIcon={false}` 다 — 색·글리프를 고르는
 *    축에 「안 그림」을 섞지 않는다.
 */
export type PopupTone = "info" | "success" | "warning" | "danger";

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
  /**
   * 제목을 어디에 그리나. **내부 전용** — `PopupBase` 는 공개하지 않는다(spec §3-3).
   *
   * `"body"` 면 head 대신 본문 맨 위(아이콘 다음)에 그리고 `hasHeader` 판정에서도 빠진다.
   * `Alert`·`Confirm` 이 그 경우다 — 닫기 버튼이 없어 헤더가 빈 껍데기이고, SEED
   * `alert-dialog.yaml` 의 `header` 슬롯이 title + description 한 쌍이다 (spec §2).
   */
  titlePlacement?: "head" | "body";
  /**
   * 본문 맨 앞에 오는 노드. **내부 전용** — 셸 다섯 전부가 타입에서 닫는다.
   *
   * 골격이 소유하는 것은 **구조 하나**다 — 「오면 `__icon` div 로 감싸 본문 맨 앞에 둔다」.
   * 크기 · 색은 감싼 쪽(`Alert`·`Confirm` 의 tone 계약)이 정한다.
   *
   * ⚠️ `LayerPopup`·`BottomSheet`·`FullPopup` 은 **받지 않는다**(2026-09-11). 셋은 내용을
   *    자유롭게 채우는 셸이라 아이콘이 필요하면 `children` 에 직접 넣는다 — 크기와 여백도
   *    그쪽이 정한다. 예전에는 열려 있었고, 그래서 프리셋 전용 스타일(56px · tone 색)이
   *    셋에까지 따라가 28px 글리프가 56px 빈 상자 안에 뜨는 자리가 있었다.
   */
  icon?: ReactNode | null;
  description?: ReactNode;
  footer?: ReactNode;
  /**
   * 표준 푸터 — 취소(line) · 확인(solid) 을 `ButtonGroup ratio="3:7"` 로 그린다.
   * 하나만 줘도 된다. `footer` 와는 셸 타입에서 배타다 (`PopupFooterProps`).
   */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  /** 생략하면 `onRequestClose` 를 부른다 — 취소는 닫아 달라는 뜻이다 */
  onCancel?: () => void;
  hasCloseButton?: boolean;
  closeLabel?: string;
  /** dim 클릭으로 닫히는가 */
  shouldCloseOnBackdrop?: boolean;
  shouldCloseOnEscape?: boolean;
  /**
   * 들어온 방향으로 끌어서 닫는가. 기본 `false` — opt-in 이다 (spec §6-7 · 2026-09-15).
   *
   * **방향이 있는 variant 만 읽는다.** 지금 문을 연 것은 `bottomSheet`(아래 · `y`) 하나이고
   * `full`(오른쪽 · `x`) 은 배선 자리만 있다. `dialog` 는 방향이 없어 참이어도 아무 일도
   * 하지 않는다. 참이면 **손잡이(`__handle`)도 함께 그린다** — 제스처의 유일한 힌트라
   * 따로 끄는 축을 두지 않는다.
   *
   * 드래그도 `onRequestClose` 를 부른다 — 닫기 요청이고 닫는 주체는 소비자다.
   * 없으면 끌려도 제자리로 돌아온다(`shouldCloseOnBackdrop` 과 같은 성질).
   */
  shouldCloseOnDrag?: boolean;
  /**
   * 끄는 띠 안에 **손잡이 막대를 그리나.** 기본 `true`.
   * `shouldCloseOnDrag` 가 참일 때만 읽는다 — 끌리지 않는데 손잡이만 보이는 거짓 힌트를
   * 만들지 않는다.
   *
   * ⚠️ **끄는 것을 권하지 않는다.** 끄는 면(위쪽 44px 띠)은 그대로 남지만 끌 수 있다는 것을
   *    알릴 길이 사라진다 — 힌트 없는 제스처다(Apple §8). SEED 도 손잡이를 없앨 때는
   *    드래그로 닫는 것 자체를 함께 거둔다. 그 경우엔 `shouldCloseOnDrag` 를 끄는 것이 맞다.
   */
  hasDragHandle?: boolean;
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
/**
 * 푸터는 둘 중 하나다 (2026-09-09). 표준 라벨 넷이거나 `footer` 슬롯이거나.
 * 둘 다 주면 하나가 조용히 무시되므로 타입이 막는다. `footer` 는 확인 · 취소
 * 둘로 안 되는 자리(진행 버튼 · 셋째 액션 · 링크)에만 쓴다.
 */
type PopupFooterProps =
  | {
      footer?: ReactNode;
      confirmLabel?: never;
      cancelLabel?: never;
      onConfirm?: never;
      onCancel?: never;
    }
  | {
      footer?: never;
      confirmLabel?: ReactNode;
      cancelLabel?: ReactNode;
      onConfirm?: () => void;
      onCancel?: () => void;
    };

type PopupSharedShellProps = Omit<
  PopupBaseOwnProps,
  | "variant"
  | "size"
  // 내부 전용 둘 — 셸 셋은 제목을 head 에 그리고, 아이콘은 `children` 에 직접 넣는다 (spec §3-1)
  | "titlePlacement"
  | "icon"
  | "footer"
  | "confirmLabel"
  | "cancelLabel"
  | "onConfirm"
  | "onCancel"
  // 방향이 있는 variant 만 되돌린다 — 아래 `BottomSheetProps` (spec §3-1)
  | "shouldCloseOnDrag"
  | "hasDragHandle"
> &
  PopupAccessibleName &
  PopupFooterProps;
type PopupSizedShellProps = PopupSharedShellProps &
  Pick<PopupBaseOwnProps, "size">;
/**
 * `shouldCloseOnDrag` 는 여기서만 되돌아온다 — `PopupSizedShellProps` 가 `size` 를
 * 되돌리는 것과 같은 모양이다. `FullPopup` 은 골격의 축 표(`DRAG_AXIS.full = "x"`)에
 * 배선이 있으나 문을 안 열었다 — 열려면 타입 한 줄 · `getPanelMotion` 의 `x` 키 전환 ·
 * 끄는 면(헤더) 셋이 함께 간다. `LayerPopup` · `Alert` · `Confirm` 은 방향이 없다
 * (spec §3-1 받지 않는 prop · §6-7).
 */
type PopupDraggableShellProps = PopupSharedShellProps &
  Pick<PopupBaseOwnProps, "shouldCloseOnDrag" | "hasDragHandle">;

export type PopupRuntimeProps = PopupInstanceProps &
  Pick<PopupBaseOwnProps, "onRequestClose">;

/**
 * 아이콘은 슬롯이 아니라 열거형이다 (2026-09-11). 자유 슬롯이면 소비자가 56px 자리에
 * 아무 크기의 그림을 넣을 수 있고, 고른 그림이 문구의 뜻과 어긋나도 막을 길이 없었다.
 *
 * `LayerPopup` · `BottomSheet` · `FullPopup` 은 `icon` 자체를 받지 않는다 — 셋은 내용을
 * 자유롭게 채우는 셸이라 아이콘도 `children` 에 직접 넣는다.
 */
type PopupToneProps = {
  tone?: PopupTone;
  /** `false` 면 아이콘을 그리지 않는다. 「없음」은 톤이 아니라 유무다 */
  hasIcon?: boolean;
};

export type AlertContentProps = Pick<
  PopupBaseOwnProps,
  "className" | "description"
> &
  PopupAccessibleName &
  PopupToneProps & {
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
  "className" | "description"
> &
  PopupAccessibleName &
  PopupToneProps & {
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
export type BottomSheetProps = PopupDraggableShellProps;
export type FullPopupProps = PopupSharedShellProps;

export type LayerPopupComponentProps = PopupRuntimeProps;
export type BottomSheetComponentProps = PopupRuntimeProps;
export type FullPopupComponentProps = PopupRuntimeProps;

export type LayerPopupOptions = PopupRegistrationOptions;
export type BottomSheetOptions = PopupRegistrationOptions;
export type FullPopupOptions = PopupRegistrationOptions;

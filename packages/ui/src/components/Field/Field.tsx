"use client";

import cn from "classnames";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { px, pv } from "../../internal/prefix.js";
import FieldContext, {
  useFieldContext,
  type FieldContextValue,
  type FieldFooterEntry,
} from "./Field.context.js";
import Message from "../Textfield/Message.js";

const block = px("field");
const errorState = `${px("is-error")}`;

export type FieldGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** 열 수. 인라인 `style` 의 `--nui-field-grid-columns` 로 내려간다 — 소비자 `style` 의 같은 키보다 이긴다 */
  columns?: 1 | 2 | 3 | 4;
};

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inputId?: string;
  direction?: "row" | "column";
  align?: "start" | "center";
  /** Footer 의 도움말. Field 안 컨트롤이 `infoMessage` 를 올리면 컨트롤 것이 이긴다 */
  infoMessage?: string;
  /** Footer 의 에러. 있으면 에러 상태로 승격된다. 컨트롤 것이 이긴다 */
  errorMessage?: string;
  isError?: boolean;
  /** 필수 입력 — 라벨에 표시가 붙고 컨트롤에 `aria-required` 가 간다 */
  required?: boolean;
  /** 필수 표시의 스크린리더 문구. 기본 "필수" */
  requiredLabel?: string;
  /** 선택 항목 문구. **주어야만 그린다** — 기본값이 없다 (Field.context.ts) */
  optionalLabel?: string;
};

/**
 * Header — 좌 라벨(점·선택 문구 포함) / 우 `suffix`(툴팁 아이콘 · text 버튼 · 글자).
 * SEED `field.mdx` 의 Header(Label + Requirement Mark + Suffix Slot).
 * `suffix` 는 `<label>` 밖이다 — 버튼을 라벨 안에 넣으면 라벨 클릭이 버튼 클릭이 된다.
 */
export type FieldHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  suffix?: ReactNode;
};

type FieldLabelAsLabel = LabelHTMLAttributes<HTMLLabelElement> & {
  as?: "label";
};
type FieldLabelAsSpan = HTMLAttributes<HTMLSpanElement> & {
  as?: "span";
  htmlFor?: never;
};
export type FieldLabelProps = FieldLabelAsLabel | FieldLabelAsSpan;

export type FieldMessageProps = HTMLAttributes<HTMLDivElement> & {
  infoMessage?: string;
  errorMessage?: string;
};

/**
 * 「이 범위가 **자기** `required` prop 을 받았는가」 — 라벨 점의 판정값.
 *
 * 공개 `FieldContextValue.isRequired` 는 부모에서 물려받은 것까지 합친 값이라
 * 컨트롤의 `aria-required` 에는 맞지만 점에는 안 맞는다 — 부모가 필수면 점은
 * 부모 라벨 하나여야 한다(그룹 전체가 필수라는 뜻을 한 번만 말한다). 공개 타입에
 * 더하지 않는다 — 소비자 컨트롤에 필요한 것은 `aria-required` 용 하나뿐이다 (spec §3-3).
 */
const OwnRequiredContext = createContext(false);

/** Footer `Message` 에 들어갈 값 — 컨트롤 것 ‖ Field 것 (spec §6). */
type FooterContent = {
  id: string;
  infoMessage: string;
  errorMessage: string;
  count?: number;
  maxCount?: number;
  counterLabel?: string;
  hasContent: boolean;
};

function useFieldScope({
  inputId,
  isError = false,
  infoMessage = "",
  errorMessage = "",
  required = false,
  requiredLabel = "필수",
  optionalLabel,
}: {
  inputId?: string;
  isError?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
}): { context: FieldContextValue; footer: FooterContent } {
  const parentFieldContext = useFieldContext();
  const generatedInputId = useId();
  const generatedLabelId = useId();
  const generatedFooterId = useId();
  const [messageIds, setMessageIds] = useState<string[]>([]);
  // 컨트롤이 올린 것. 한 범위에 메시지 컨트롤은 하나다 — 둘이면 마지막 등록이 이긴다(spec §13)
  const [footerEntry, setFooterEntry] = useState<FieldFooterEntry | null>(null);
  const resolvedInputId = inputId ?? generatedInputId;

  // 컨트롤 것 ‖ Field 것. 에러가 있으면 도움말은 `Message` 가 그리지 않는다
  const footerErrorMessage = footerEntry?.errorMessage || errorMessage;
  const footerInfoMessage = footerEntry?.infoMessage || infoMessage;
  const hasCounter = typeof footerEntry?.maxCount === "number";
  const hasFooterContent = Boolean(
    footerErrorMessage || footerInfoMessage || hasCounter,
  );

  // 판정식 — 부모 ‖ 자기 prop ‖ 자기 errorMessage ‖ **컨트롤이 올린 에러**(spec §5).
  // 컨트롤은 자기 것만 올리므로 Field 가 prop 을 거두면 함께 풀린다(래치 없음).
  const resolvedIsError =
    parentFieldContext.isError ||
    isError ||
    Boolean(errorMessage) ||
    Boolean(footerEntry?.isError);
  // `isError` 와 같은 전파 — 부모가 필수면 안쪽 컨트롤 전부에 `aria-required` 가 간다.
  const resolvedIsRequired = parentFieldContext.isRequired || required;

  const registerMessage = useCallback((nextMessageId: string) => {
    setMessageIds((currentIds) =>
      currentIds.includes(nextMessageId)
        ? currentIds
        : [...currentIds, nextMessageId],
    );

    return () => {
      setMessageIds((currentIds) =>
        currentIds.filter((id) => id !== nextMessageId),
      );
    };
  }, []);

  const registerFooter = useCallback((entry: FieldFooterEntry) => {
    setFooterEntry(entry);

    return () => {
      setFooterEntry((current) =>
        current && current.id === entry.id ? null : current,
      );
    };
  }, []);

  const context = useMemo<FieldContextValue>(
    () => ({
      inputId: resolvedInputId,
      labelId: generatedLabelId,
      footerId: generatedFooterId,
      // Footer 의 id 는 내용이 있을 때 **동기로** 들어간다 — 등록 → 렌더 → 등록의
      // 두 틱을 만들지 않는다(spec §11 「Footer 등록 두 틱」의 허용된 구현).
      describedByIds: [
        ...parentFieldContext.describedByIds,
        ...messageIds,
        ...(hasFooterContent ? [generatedFooterId] : []),
      ],
      isError: resolvedIsError,
      isRequired: resolvedIsRequired,
      requiredLabel,
      optionalLabel: optionalLabel ?? null,
      registerMessage,
      registerFooter,
    }),
    [
      generatedFooterId,
      generatedLabelId,
      hasFooterContent,
      messageIds,
      optionalLabel,
      parentFieldContext.describedByIds,
      registerFooter,
      registerMessage,
      requiredLabel,
      resolvedInputId,
      resolvedIsError,
      resolvedIsRequired,
    ],
  );

  const footer: FooterContent = {
    id: generatedFooterId,
    infoMessage: footerInfoMessage,
    errorMessage: footerErrorMessage,
    count: footerEntry?.count,
    maxCount: footerEntry?.maxCount,
    counterLabel: footerEntry?.counterLabel,
    hasContent: hasFooterContent,
  };

  return { context, footer };
}

/**
 * Footer — 루트와 `Item` 이 `children` 뒤에 **항상** 그린다. `Message` 하나:
 * 좌 에러 ‖ 도움말, 우 글자 수. 컨트롤이 자기 메시지 줄을 접었으므로 live 영역을
 * 미리 확보할 책임이 여기로 넘어온다(a11y.md §3). 비면 시각만 숨긴다.
 */
function FieldFooter({ footer }: { footer: FooterContent }) {
  return (
    <div
      className={cn(
        `${block}__footer`,
        !footer.hasContent && `${block}__footer--empty`,
      )}
    >
      <Message
        id={footer.hasContent ? footer.id : undefined}
        infoMessage={footer.infoMessage}
        errorMessage={footer.errorMessage}
        count={footer.count}
        maxCount={footer.maxCount}
        counterLabel={footer.counterLabel}
      />
    </div>
  );
}

const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      className,
      inputId,
      direction = "column",
      align = "start",
      infoMessage = "",
      errorMessage = "",
      isError = false,
      required = false,
      requiredLabel,
      optionalLabel,
      ...rest
    },
    ref,
  ) => {
    const { context, footer } = useFieldScope({
      inputId,
      isError,
      infoMessage,
      errorMessage,
      required,
      requiredLabel,
      optionalLabel,
    });

    return (
      <FieldContext.Provider value={context}>
        <OwnRequiredContext.Provider value={required}>
          <div
            {...rest}
            ref={ref}
            className={cn(
              block,
              `${block}--${direction}`,
              `${block}--align-${align}`,
              context.isError && errorState,
              className,
            )}
          >
            {children}
            <FieldFooter footer={footer} />
          </div>
        </OwnRequiredContext.Provider>
      </FieldContext.Provider>
    );
  },
);

FieldRoot.displayName = "Field";

export type FieldItemProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inputId?: string;
  direction?: "row" | "column";
  align?: "start" | "center";
  infoMessage?: string;
  errorMessage?: string;
  isError?: boolean;
  /** 필수 입력 — 라벨에 표시가 붙고 컨트롤에 `aria-required` 가 간다 */
  required?: boolean;
  /** 필수 표시의 스크린리더 문구. 기본 "필수" */
  requiredLabel?: string;
  /** 선택 항목 문구. **주어야만 그린다** — 기본값이 없다 (Field.context.ts) */
  optionalLabel?: string;
};

export const FieldItem = forwardRef<HTMLDivElement, FieldItemProps>(
  (
    {
      children,
      className,
      inputId,
      direction = "row",
      align = "center",
      infoMessage = "",
      errorMessage = "",
      isError = false,
      required = false,
      requiredLabel,
      optionalLabel,
      ...rest
    },
    ref,
  ) => {
    const { context, footer } = useFieldScope({
      inputId,
      isError,
      infoMessage,
      errorMessage,
      required,
      requiredLabel,
      optionalLabel,
    });

    return (
      <FieldContext.Provider value={context}>
        <OwnRequiredContext.Provider value={required}>
          <div
            {...rest}
            ref={ref}
            className={cn(
              `${block}__item`,
              `${block}__item--${direction}`,
              `${block}__item--align-${align}`,
              context.isError && errorState,
              className,
            )}
          >
            {children}
            <FieldFooter footer={footer} />
          </div>
        </OwnRequiredContext.Provider>
      </FieldContext.Provider>
    );
  },
);

FieldItem.displayName = "Field.Item";

export const FieldGrid = forwardRef<HTMLDivElement, FieldGridProps>(
  ({ children, className, columns = 2, style, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(`${block}__grid`, className)}
        // `columns` 가 창구다 — 소비자 `style` 의 같은 키는 뒤에 오는 이 값이 덮는다
        style={
          { ...style, [pv("field-grid-columns")]: columns } as CSSProperties
        }
      >
        {children}
      </div>
    );
  },
);

FieldGrid.displayName = "Field.Grid";

export const FieldHeader = forwardRef<HTMLDivElement, FieldHeaderProps>(
  ({ children, className, suffix, ...rest }, ref) => {
    return (
      <div {...rest} ref={ref} className={cn(`${block}__header`, className)}>
        {children}
        {suffix != null ? (
          <span className={`${block}__header-suffix`}>{suffix}</span>
        ) : null}
      </div>
    );
  },
);

FieldHeader.displayName = "Field.Header";

/**
 * 라벨 오른쪽의 필수 · 선택 표시.
 *
 * 필수는 **점**(6px · `text-danger`)이고 선택은 **문구**다 — SEED `field.yaml` 의
 * `indicatorIcon` · `indicatorText` 와 같은 자리다. 기호만으로는 뜻이 전해지지
 * 않으므로 점에는 sr-only 문구를 붙인다 (KRDS [입력폼 8]).
 *
 * **둘은 함께 나오지 않는다.** 한 화면에서 하나만 쓰는 것이 규칙이라
 * (SEED `field.mdx` · KRDS [입력폼 9]) 필수면 점만, 아니면 문구만 그린다.
 */
function FieldRequirement() {
  const { isRequired, requiredLabel, optionalLabel } = useFieldContext();
  const isOwnRequired = useContext(OwnRequiredContext);

  // 점은 **자기** `required` 를 받은 라벨에만 — 물려받은 필수는 컨트롤의 `aria-required` 가 전한다
  if (isOwnRequired) {
    return (
      <>
        <span className={`${block}__requirement`} aria-hidden="true" />
        <span className={px("sr-only")}>{requiredLabel}</span>
      </>
    );
  }

  // 선택 문구는 물려받은 필수로도 막힌다 — 부모가 필수인데 안쪽에 「선택」이 서면 한 필드
  // 안에서 둘이 섞인다 (SEED field.mdx · KRDS [입력폼 9])
  if (!isRequired && optionalLabel) {
    return <span className={`${block}__optional`}>{optionalLabel}</span>;
  }

  return null;
}

export const FieldLabel = forwardRef<
  HTMLLabelElement | HTMLSpanElement,
  FieldLabelProps
>(({ children, className, id, htmlFor, as = "label", ...rest }, ref) => {
  const { inputId: fieldContextId, labelId: fieldLabelId } = useFieldContext();
  const resolvedLabelId = id ?? fieldLabelId ?? undefined;

  if (as === "span") {
    return (
      <span
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
        ref={ref as Ref<HTMLSpanElement>}
        id={resolvedLabelId}
        className={cn(`${block}__label`, className)}
      >
        {children}
        <FieldRequirement />
      </span>
    );
  }

  return (
    <label
      {...(rest as LabelHTMLAttributes<HTMLLabelElement>)}
      ref={ref as Ref<HTMLLabelElement>}
      id={resolvedLabelId}
      htmlFor={htmlFor ?? fieldContextId ?? undefined}
      className={cn(`${block}__label`, className)}
    >
      {children}
      <FieldRequirement />
    </label>
  );
});

FieldLabel.displayName = "Field.Label";

/**
 * 직접 배치하는 메시지 — 컨트롤이 없는 그룹(체크박스 묶음)에서 자리를 옮길 때 쓴다.
 * Footer 와 같이 두면 live 영역이 둘이 된다(하나는 빈 채). 막지 않는다.
 */
export const FieldMessage = forwardRef<HTMLDivElement, FieldMessageProps>(
  ({ id, className, infoMessage = "", errorMessage = "", ...rest }, ref) => {
    const generatedMessageId = useId();
    const { registerMessage } = useFieldContext();
    const hasMessageContent = Boolean(infoMessage || errorMessage);
    const resolvedMessageId = id ?? generatedMessageId;

    useEffect(() => {
      if (!hasMessageContent) return;

      return registerMessage?.(resolvedMessageId);
    }, [hasMessageContent, registerMessage, resolvedMessageId]);

    // 비어 있어도 렌더한다 — `aria-live` 영역은 내용이 생기기 전에 DOM 에 있어야
    // 스크린리더가 읽는다 (Message.tsx 참조). 빈 상태는 `--empty` 로 시각만 숨긴다.
    return (
      <div
        {...rest}
        ref={ref}
        id={hasMessageContent ? resolvedMessageId : undefined}
        className={cn(
          `${block}__message`,
          className,
          !hasMessageContent && `${block}__message--empty`,
        )}
      >
        <Message infoMessage={infoMessage} errorMessage={errorMessage} />
      </div>
    );
  },
);

FieldMessage.displayName = "Field.Message";

// ⚠️ dot notation(Field.Label 등)은 **Client Component 안에서만** 동작한다.
//    Server Component 에서는 client reference 프록시라 정적 프로퍼티가 undefined 로 읽힌다.
//    → RSC 에서 쓸 수 있도록 위 서브 컴포넌트들을 개별 named export 로도 노출한다.
//      (FieldLabel / FieldItem / FieldGrid / FieldHeader / FieldMessage)
const Field = Object.assign(FieldRoot, {
  Item: FieldItem,
  Grid: FieldGrid,
  Header: FieldHeader,
  Label: FieldLabel,
  Message: FieldMessage,
});

export default Field;

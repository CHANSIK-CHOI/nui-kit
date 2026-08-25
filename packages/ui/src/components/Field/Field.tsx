"use client";

import cn from "classnames";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { px, pv } from "../../internal/prefix.js";
import FieldContext, { useFieldContext } from "./Field.context.js";
import Message from "../Textfield/Message.js";

const block = px("field");
const errorState = `${px("is-error")}`;

export type FieldGridProps = {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
};

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inputId?: string;
  direction?: "row" | "column";
  align?: "start" | "center";
  infoMessage?: string;
  errorMessage?: string;
  isError?: boolean;
};

type FieldLabelAsLabel = LabelHTMLAttributes<HTMLLabelElement> & {
  as?: "label";
};
type FieldLabelAsSpan = HTMLAttributes<HTMLSpanElement> & {
  as?: "span";
  htmlFor?: never;
};
export type FieldLabelProps = FieldLabelAsLabel | FieldLabelAsSpan;

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type FieldMessageProps = {
  id?: string;
  className?: string;
  infoMessage?: string;
  errorMessage?: string;
};

export type FieldItemProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inputId?: string;
  direction?: "row" | "column";
  align?: "start" | "center";
  infoMessage?: string;
  errorMessage?: string;
  isError?: boolean;
};

function useFieldScope({
  inputId,
  isError = false,
  errorMessage = "",
}: {
  inputId?: string;
  isError?: boolean;
  errorMessage?: string;
}) {
  const parentFieldContext = useFieldContext();
  const generatedInputId = useId();
  const generatedLabelId = useId();
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const resolvedInputId = inputId ?? generatedInputId;
  const resolvedIsError =
    parentFieldContext.isError || isError || Boolean(errorMessage);

  const registerDescription = useCallback((nextDescriptionId: string) => {
    setDescriptionIds((currentIds) =>
      currentIds.includes(nextDescriptionId)
        ? currentIds
        : [...currentIds, nextDescriptionId],
    );

    return () => {
      setDescriptionIds((currentIds) =>
        currentIds.filter((id) => id !== nextDescriptionId),
      );
    };
  }, []);

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

  return useMemo(
    () => ({
      inputId: resolvedInputId,
      labelId: generatedLabelId,
      describedByIds: [
        ...parentFieldContext.describedByIds,
        ...descriptionIds,
        ...messageIds,
      ],
      isError: resolvedIsError,
      registerDescription,
      registerMessage,
    }),
    [
      descriptionIds,
      generatedLabelId,
      messageIds,
      parentFieldContext.describedByIds,
      registerDescription,
      registerMessage,
      resolvedInputId,
      resolvedIsError,
    ],
  );
}

function FieldMessageSlot({
  infoMessage = "",
  errorMessage = "",
}: Pick<FieldProps, "infoMessage" | "errorMessage">) {
  if (!infoMessage && !errorMessage) return null;

  return <FieldMessage infoMessage={infoMessage} errorMessage={errorMessage} />;
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
      ...rest
    },
    ref,
  ) => {
    const fieldScope = useFieldScope({ inputId, isError, errorMessage });

    return (
      <FieldContext.Provider value={fieldScope}>
        <div
          {...rest}
          ref={ref}
          className={cn(
            block,
            `${block}--${direction}`,
            `${block}--align-${align}`,
            fieldScope.isError && errorState,
            className,
          )}
        >
          {children}
          <FieldMessageSlot
            infoMessage={infoMessage}
            errorMessage={errorMessage}
          />
        </div>
      </FieldContext.Provider>
    );
  },
);

FieldRoot.displayName = "Field";

export function FieldItem({
  children,
  className,
  inputId,
  direction = "row",
  align = "center",
  infoMessage = "",
  errorMessage = "",
  isError = false,
  ...rest
}: FieldItemProps) {
  const fieldScope = useFieldScope({ inputId, isError, errorMessage });

  return (
    <FieldContext.Provider value={fieldScope}>
      <div
        {...rest}
        className={cn(
          `${block}__item`,
          `${block}__item--${direction}`,
          `${block}__item--align-${align}`,
          fieldScope.isError && errorState,
          className,
        )}
      >
        {children}
        <FieldMessageSlot
          infoMessage={infoMessage}
          errorMessage={errorMessage}
        />
      </div>
    </FieldContext.Provider>
  );
}

export function FieldGrid({
  children,
  className,
  columns = 2,
}: FieldGridProps) {
  return (
    <div
      className={cn(`${block}__grid`, className)}
      style={{ [pv("field-grid-columns")]: columns } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  className,
  id,
  htmlFor,
  as = "label",
  ...rest
}: FieldLabelProps) {
  const { inputId: fieldContextId, labelId: fieldLabelId } = useFieldContext();
  const resolvedLabelId = id ?? fieldLabelId ?? undefined;

  if (as === "span") {
    return (
      <span
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
        id={resolvedLabelId}
        className={cn(`${block}__label`, className)}
      >
        {children}
      </span>
    );
  }

  return (
    <label
      {...(rest as LabelHTMLAttributes<HTMLLabelElement>)}
      id={resolvedLabelId}
      htmlFor={htmlFor ?? fieldContextId ?? undefined}
      className={cn(`${block}__label`, className)}
    >
      {children}
    </label>
  );
}

export function FieldDescription({
  children,
  className,
  id,
  ...rest
}: FieldDescriptionProps) {
  const generatedDescriptionId = useId();
  const { registerDescription } = useFieldContext();
  const resolvedDescriptionId = id ?? generatedDescriptionId;

  useEffect(() => {
    return registerDescription?.(resolvedDescriptionId);
  }, [registerDescription, resolvedDescriptionId]);

  return (
    <p
      {...rest}
      id={resolvedDescriptionId}
      className={cn(`${block}__description`, className)}
    >
      {children}
    </p>
  );
}

export function FieldMessage({
  id,
  className,
  infoMessage = "",
  errorMessage = "",
}: FieldMessageProps) {
  const generatedMessageId = useId();
  const { registerMessage } = useFieldContext();
  const hasMessageContent = Boolean(infoMessage || errorMessage);
  const resolvedMessageId = id ?? generatedMessageId;

  useEffect(() => {
    if (!hasMessageContent) return;

    return registerMessage?.(resolvedMessageId);
  }, [hasMessageContent, registerMessage, resolvedMessageId]);

  if (!hasMessageContent) return null;

  return (
    <div id={resolvedMessageId} className={cn(`${block}__message`, className)}>
      <Message infoMessage={infoMessage} errorMessage={errorMessage} />
    </div>
  );
}

// ⚠️ dot notation(Field.Label 등)은 **Client Component 안에서만** 동작한다.
//    Server Component 에서는 client reference 프록시라 정적 프로퍼티가 undefined 로 읽힌다.
//    → RSC 에서 쓸 수 있도록 위 서브 컴포넌트들을 개별 named export 로도 노출한다.
//      (FieldLabel / FieldItem / FieldGrid / FieldDescription / FieldMessage)
const Field = Object.assign(FieldRoot, {
  Item: FieldItem,
  Grid: FieldGrid,
  Label: FieldLabel,
  Description: FieldDescription,
  Message: FieldMessage,
});

export default Field;

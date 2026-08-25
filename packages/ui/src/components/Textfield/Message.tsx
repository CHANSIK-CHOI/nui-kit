"use client";

import { px } from "../../internal/prefix.js";
import { AttentionIcon } from "../Icon/index.js";

const block = px("message");

export type MessageProps = {
  id?: string;
  infoMessage?: string;
  errorMessage?: string;
};

export default function Message({
  id,
  infoMessage = "",
  errorMessage = "",
}: MessageProps) {
  const hasInfoMessage = Boolean(infoMessage);
  const hasErrorMessage = Boolean(errorMessage);

  if (!hasInfoMessage && !hasErrorMessage) return null;

  return (
    <div id={id} className={block}>
      {hasInfoMessage ? (
        <span className={`${block}__msg`}>{infoMessage}</span>
      ) : null}
      {hasErrorMessage ? (
        <span className={`${block}__msg ${block}__msg--error`}>
          <span className={`${block}__error-icon`}>
            <AttentionIcon />
          </span>
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

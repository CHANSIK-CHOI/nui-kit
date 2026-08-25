"use client";

import { forwardRef, useState } from "react";
import Textfield, { type TextfieldProps } from "./Textfield.js";
import TextfieldBtn from "./TextfieldBtn.js";

export type PasswordProps = Omit<TextfieldProps, "children" | "type"> & {
  defaultIsPasswordVisible?: boolean;
  hidePasswordTitle?: string;
  showPasswordTitle?: string;
};

const Password = forwardRef<HTMLInputElement, PasswordProps>(
  (
    {
      defaultIsPasswordVisible = false,
      hidePasswordTitle = "비밀번호 숨기기",
      showPasswordTitle = "비밀번호 보기",
      onClear,
      disabled = false,
      ...restTextfieldProps
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(
      defaultIsPasswordVisible,
    );

    const handleTogglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    // 값을 지우면 표시 상태도 되돌린다 — 지운 뒤 새로 입력할 때
    // 비밀번호가 노출된 채로 남지 않도록.
    const handleClear = () => {
      setIsPasswordVisible(false);
      onClear?.();
    };

    return (
      <Textfield
        {...restTextfieldProps}
        ref={ref}
        type={isPasswordVisible ? "text" : "password"}
        disabled={disabled}
        onClear={handleClear}
      >
        <TextfieldBtn
          icon={isPasswordVisible ? "hidePw" : "showPw"}
          title={isPasswordVisible ? hidePasswordTitle : showPasswordTitle}
          onClick={handleTogglePasswordVisibility}
          disabled={disabled}
        />
      </Textfield>
    );
  },
);

Password.displayName = "Password";

export default Password;

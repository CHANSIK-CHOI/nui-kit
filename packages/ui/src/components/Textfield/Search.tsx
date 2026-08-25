"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import Textfield, { type TextfieldProps } from "./Textfield.js";
import TextfieldBtn from "./TextfieldBtn.js";

export type SearchProps = Omit<TextfieldProps, "children" | "type"> & {
  /** 검색 버튼 클릭 핸들러. 주지 않으면 버튼이 submit 으로 동작한다 */
  onSearch?: () => void;
  /** 검색 버튼의 접근 이름 */
  searchButtonTitle?: string;
  searchButtonType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      onSearch,
      searchButtonTitle = "검색",
      searchButtonType,
      disabled = false,
      ...restTextfieldProps
    },
    ref,
  ) => {
    const resolvedSearchButtonType =
      searchButtonType ?? (onSearch ? "button" : "submit");

    return (
      <Textfield
        {...restTextfieldProps}
        ref={ref}
        type="text"
        disabled={disabled}
      >
        <TextfieldBtn
          icon="search"
          title={searchButtonTitle}
          type={resolvedSearchButtonType}
          onClick={onSearch}
          disabled={disabled}
        />
      </Textfield>
    );
  },
);

Search.displayName = "Search";

export default Search;

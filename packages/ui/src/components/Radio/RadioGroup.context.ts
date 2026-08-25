"use client";

import { createContext, useContext } from "react";

export type RadioGroupContextValue = {
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue>({});

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}

export default RadioGroupContext;

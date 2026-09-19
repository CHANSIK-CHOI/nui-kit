"use client";

import { useEffect, useId, useState } from "react";
import { Switch } from "@nui-kit/react";

export const THEME_STORAGE_KEY = "nui-docs-theme";

/**
 * 라이트 / 다크 전환.
 *
 * 토큰이 `[data-theme="dark"]` 하나로 전부 갈아끼워지므로
 * 여기서 하는 일은 그 속성을 켜고 끄는 것뿐이다.
 *
 * 초기값은 layout 의 인라인 스크립트가 페인트 전에 이미 정해둔다.
 * 그래서 이 컴포넌트는 마운트 시점에 "지금 무엇인지"를 읽기만 한다.
 *
 * 두 자리에 놓인다 — 데스크톱은 우측 상단에 떠 있는 것(`floating`), 모바일은
 * 헤더 안(`inline`). 둘 다 마운트돼 있고 CSS 가 하나만 보이므로, 한쪽에서 바꾼 값을
 * 다른 쪽이 `data-theme` 관찰로 따라간다.
 */
export function ThemeToggle({
  variant = "floating",
}: {
  variant?: "floating" | "inline";
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const switchId = useId();

  useEffect(() => {
    // 인라인 스크립트가 페인트 전에 이미 적용했더라도 여기서 한 번 더 확정한다.
    // App Router 의 하이드레이션이 html 속성을 서버 렌더 결과로 되돌리는 경우가
    // 있어서, 저장값을 아는 쪽이 마지막에 한 번 더 써야 상태가 유지된다.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // 저장소가 막혀 있으면 OS 설정을 따른다
    }

    const theme =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    document.documentElement.dataset.theme = theme;
    setIsDark(theme === "dark");
    setMounted(true);

    // 다른 자리의 토글이 바꾼 값을 따라간다
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.dataset.theme === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    const theme = next ? "dark" : "light";

    setIsDark(next);
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // 사생활 보호 모드 등에서 저장이 막혀도 전환 자체는 동작해야 한다
    }
  };

  return (
    <div className={`doc-theme-toggle doc-theme-toggle--${variant}`}>
      <label className="doc-theme-toggle__label" htmlFor={switchId}>
        {mounted && isDark ? "다크" : "라이트"}
      </label>
      <Switch
        id={switchId}
        checked={isDark}
        onChange={handleChange}
        aria-label="다크 모드"
      />
    </div>
  );
}

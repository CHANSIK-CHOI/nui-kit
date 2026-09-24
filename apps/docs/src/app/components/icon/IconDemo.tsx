"use client";

import type { ReactNode } from "react";
import { Button, IconButton } from "@nui-kit/react";
import { AttentionIcon, DelIcon, SearchIcon } from "@nui-kit/react/icon";
import { Example } from "@/components/guide";

type RowItem = { label: string; note?: string; node: ReactNode };

/** 아이콘은 작다. 격자 칸 대신 한 줄에 나란히 놓고 라벨을 옆에 붙인다 */
export function IconRow({
  items,
  caption,
  code,
}: {
  items: RowItem[];
  caption?: string;
  code?: string;
}) {
  return (
    <Example row={false} caption={caption} code={code}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px" }}>
        {items.map(({ label, note, node }) => (
          <div
            key={label}
            style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 24,
                minHeight: 24,
              }}
            >
              {node}
            </span>
            <span
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 2,
                fontSize: "var(--nui-font-size-1)",
                lineHeight: 1.3,
              }}
            >
              <code>{label}</code>
              {note ? (
                <span style={{ color: "var(--nui-text-secondary)" }}>
                  {note}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </Example>
  );
}

const SIZES = [
  [14, "목록의 작은 표시"],
  [16, "작은 버튼 · 상태 표시"],
  [20, "버튼 안"],
  [24, "입력 보조 버튼 · 토스트"],
] as const;

export function IconSizeDemo() {
  return (
    <IconRow
      caption="size 하나로 정사각이 잡히고, 선 굵기는 크기에 비례한다"
      code={`<SearchIcon size={20} />`}
      items={SIZES.map(([size, where]) => ({
        label: `size={${size}}`,
        note: where,
        node: <SearchIcon size={size} />,
      }))}
    />
  );
}

export function IconColorDemo() {
  return (
    <IconRow
      caption="글자색을 물려받는다. color 는 따로 줄 때만"
      code={`<Button icon={<DelIcon />}>삭제</Button>
<AttentionIcon color="var(--nui-text-danger)" />`}
      items={[
        {
          label: "버튼 안",
          note: "버튼 글자색",
          node: (
            <Button size="small" color="danger" icon={<DelIcon />}>
              삭제
            </Button>
          ),
        },
        {
          label: "아이콘 버튼",
          note: "이름은 버튼이 갖는다",
          node: (
            <IconButton aria-label="검색" size="small">
              <SearchIcon />
            </IconButton>
          ),
        },
        {
          label: "color",
          note: "직접 지정",
          node: <AttentionIcon size={20} color="var(--nui-text-danger)" />,
        },
      ]}
    />
  );
}

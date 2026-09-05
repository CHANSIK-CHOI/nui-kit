"use client";

import { useState } from "react";
import { Button, LayerPopup } from "@nui-kit/react";
import { Case, CaseGrid } from "@/components/guide";

/** PopupSize 는 `Popup.types.ts` 가 정한 셋이다. dialog 형태에만 적용된다. */
const SIZES = [
  ["small", "22.5rem"],
  ["regular", "30rem"],
  ["large", "40rem"],
] as const;

export function PopupSizeDemo() {
  const [open, setOpen] = useState<(typeof SIZES)[number][0] | null>(null);

  return (
    <>
      <CaseGrid
        columns={3}
        caption="size 는 dialog 형태에만 적용된다"
        code={`<LayerPopup open={isOpen} size="large" title="제목">내용</LayerPopup>`}
      >
        {SIZES.map(([size, width]) => (
          <Case key={size} label={size} note={width}>
            <Button variant="line" onClick={() => setOpen(size)}>
              {size} 열기
            </Button>
          </Case>
        ))}
      </CaseGrid>

      {SIZES.map(([size]) => (
        <LayerPopup
          key={size}
          open={open === size}
          onRequestClose={() => setOpen(null)}
          isTopmost
          size={size}
          title={`size="${size}"`}
          description="폭만 다르고 나머지는 같다."
          footer={
            <Button color="primary" onClick={() => setOpen(null)}>
              닫기
            </Button>
          }
        >
          <p style={{ color: "var(--nui-text-secondary)" }}>
            dim 을 누르거나 Escape 를 눌러도 닫힌다.
          </p>
        </LayerPopup>
      ))}
    </>
  );
}

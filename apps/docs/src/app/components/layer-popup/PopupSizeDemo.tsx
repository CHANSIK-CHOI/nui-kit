"use client";

import { Button } from "@nui-kit/react";
import {
  LayerPopup,
  useLayerPopup,
  type LayerPopupComponentProps,
  type PopupSize,
} from "@nui-kit/react/popup";
import { Case, CaseGrid } from "@/components/guide";

/** PopupSize 는 `Popup.types.ts` 가 정한 셋이다. dialog 형태에만 적용된다. */
const SIZES = [
  ["small", "22.5rem"],
  ["medium", "30rem"],
  ["large", "40rem"],
] as const;

/** 같은 컴포넌트를 다른 값으로 열 때는 팩토리로 만든다 — 열 때 넘기는 props 는 없다 */
function makeSizePopup(size: PopupSize) {
  return function SizePopup(runtime: LayerPopupComponentProps) {
    return (
      <LayerPopup
        {...runtime}
        size={size}
        title={`size="${size}"`}
        description="폭만 다르고 나머지는 같다."
        confirmLabel="닫기"
        onConfirm={runtime.onRequestClose}
      >
        <p style={{ color: "var(--nui-text-secondary)" }}>
          dim 을 누르거나 Escape 를 눌러도 닫힌다.
        </p>
      </LayerPopup>
    );
  };
}

const SIZE_POPUPS = {
  small: makeSizePopup("small"),
  medium: makeSizePopup("medium"),
  large: makeSizePopup("large"),
} satisfies Record<PopupSize, unknown>;

export function PopupSizeDemo() {
  const layerPopup = useLayerPopup();

  return (
    <CaseGrid
      columns={3}
      caption="size 는 dialog 형태에만 적용된다."
      code={`<LayerPopup {...runtime} size="large" title="제목">내용</LayerPopup>`}
    >
      {SIZES.map(([size, width]) => (
        <Case key={size} label={size} note={width}>
          <Button
            variant="line"
            onClick={() => layerPopup.open({ component: SIZE_POPUPS[size] })}
          >
            {size} 열기
          </Button>
        </Case>
      ))}
    </CaseGrid>
  );
}

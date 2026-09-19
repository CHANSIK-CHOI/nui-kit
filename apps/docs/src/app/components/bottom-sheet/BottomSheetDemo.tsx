"use client";

import { Button } from "@nui-kit/react";
import {
  BottomSheet,
  useBottomSheet,
  type BottomSheetComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

const SHARE_OPTIONS = ["링크 복사", "카카오톡", "메시지", "메일"];

/** 시트 하나 = 컴포넌트 하나. 선택지가 runtime.onRequestClose 를 부르면 닫힌다. */
function SortSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} title="정렬">
      <div style={{ display: "grid", gap: 8 }}>
        {["최신순", "인기순", "낮은 가격순"].map((label) => (
          <Button
            key={label}
            variant="line"
            size="medium"
            onClick={runtime.onRequestClose}
          >
            {label}
          </Button>
        ))}
      </div>
    </BottomSheet>
  );
}

export function BottomSheetOpenDemo() {
  const bottomSheet = useBottomSheet();

  return (
    <>
      <Example
        caption="컴포넌트를 만들고 훅으로 연다"
        code={`bottomSheet.open({ component: SortSheet });`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => bottomSheet.open({ component: SortSheet })}
        >
          정렬 바꾸기
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`function SortSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} title="정렬">
      <Button variant="line" onClick={runtime.onRequestClose}>최신순</Button>
      …
    </BottomSheet>
  );
}

const bottomSheet = useBottomSheet();
bottomSheet.open({ component: SortSheet });`}</code>
      </pre>
    </>
  );
}

function ShareSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} title="공유하기">
      <div style={{ display: "grid", gap: 8 }}>
        {SHARE_OPTIONS.map((label) => (
          <Button
            key={label}
            variant="line"
            size="medium"
            onClick={runtime.onRequestClose}
          >
            {label}
          </Button>
        ))}
      </div>
    </BottomSheet>
  );
}

export function BottomSheetShareDemo() {
  const bottomSheet = useBottomSheet();

  return (
    <Example
      caption="선택지 목록에 맞는 자리"
      code={`bottomSheet.open({ component: ShareSheet });`}
    >
      <Button
        size="medium"
        onClick={() => bottomSheet.open({ component: ShareSheet })}
      >
        공유하기
      </Button>
    </Example>
  );
}

function CenterSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet
      {...runtime}
      contentAlign="center"
      title="주문을 접수했습니다"
      description="배송이 시작되면 알려 드릴게요."
      confirmLabel="주문 내역 보기"
      onConfirm={runtime.onRequestClose}
    />
  );
}

function NoCloseSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet
      {...runtime}
      hasCloseButton={false}
      title="필터"
      cancelLabel="닫기"
      confirmLabel="적용"
      onConfirm={runtime.onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        × 가 없어도 dim 과 Esc 로 닫힌다.
      </p>
    </BottomSheet>
  );
}

export function BottomSheetOptionsDemo() {
  const bottomSheet = useBottomSheet();

  return (
    <CaseGrid
      columns={2}
      code={`<BottomSheet contentAlign="center" />
<BottomSheet hasCloseButton={false} />`}
    >
      <Case label='contentAlign="center"' note="짧은 안내">
        <Button
          variant="line"
          onClick={() => bottomSheet.open({ component: CenterSheet })}
        >
          가운데 정렬 열기
        </Button>
      </Case>
      <Case label="hasCloseButton={false}" note="dim · Esc 로만">
        <Button
          variant="line"
          onClick={() => bottomSheet.open({ component: NoCloseSheet })}
        >
          닫기 버튼 없이 열기
        </Button>
      </Case>
    </CaseGrid>
  );
}

// 본문이 시트 높이(88dvh)를 넘도록 넉넉히 둔다 — 「본문을 끌면 스크롤하고 시트는
// 안 움직인다」를 보이는 자리다. `verify:popup` 시트 절도 이 넘침을 전제한다.
const SORT_OPTIONS = [
  "최신순",
  "인기순",
  "낮은 가격순",
  "높은 가격순",
  "리뷰 많은 순",
  "평점 높은 순",
  "할인율 높은 순",
  "배송 빠른 순",
  "가까운 순",
  "이름순",
  "등록 오래된 순",
  "재고 많은 순",
  "찜 많은 순",
  "판매량순",
  "조회수순",
  "추천순",
];

function SortList({ onPick }: { onPick: () => void }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {SORT_OPTIONS.map((label) => (
        <Button key={label} variant="line" size="medium" onClick={onPick}>
          {label}
        </Button>
      ))}
    </div>
  );
}

function DragSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} shouldCloseOnDrag title="정렬">
      <SortList onPick={runtime.onRequestClose} />
    </BottomSheet>
  );
}

function DragSheetWithClose(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} shouldCloseOnDrag hasCloseButton title="정렬">
      <SortList onPick={runtime.onRequestClose} />
    </BottomSheet>
  );
}

function DragSheetNoHandle(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet
      {...runtime}
      shouldCloseOnDrag
      hasDragHandle={false}
      title="정렬"
    >
      <SortList onPick={runtime.onRequestClose} />
    </BottomSheet>
  );
}

export function BottomSheetDragDemo() {
  const bottomSheet = useBottomSheet();

  return (
    <>
      <Example
        caption="위쪽 띠를 아래로 끈다. 제목과 본문은 그대로다"
        code={`<BottomSheet {...runtime} shouldCloseOnDrag title="정렬">…</BottomSheet>`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => bottomSheet.open({ component: DragSheet })}
        >
          끌어서 닫는 시트 열기
        </Button>
      </Example>

      <CaseGrid
        columns={2}
        code={`<BottomSheet shouldCloseOnDrag hasCloseButton />
<BottomSheet shouldCloseOnDrag hasDragHandle={false} />`}
      >
        <Case label="hasCloseButton" note="× 를 함께 둘 때">
          <Button
            variant="line"
            onClick={() => bottomSheet.open({ component: DragSheetWithClose })}
          >
            닫기 버튼도 함께 열기
          </Button>
        </Case>
        <Case label="hasDragHandle={false}" note="막대 없이 끌기">
          <Button
            variant="line"
            onClick={() => bottomSheet.open({ component: DragSheetNoHandle })}
          >
            막대 없는 시트 열기
          </Button>
        </Case>
      </CaseGrid>
    </>
  );
}

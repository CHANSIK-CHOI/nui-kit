"use client";

import { Button } from "@nui-kit/react";
import {
  FullPopup,
  useFullPopup,
  type FullPopupComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

/** 전체 팝업 하나 = 컴포넌트 하나. PopupHost 가 넣는 runtime 다섯을 셸에 그대로 넘긴다. */
function ProductPopup(runtime: FullPopupComponentProps) {
  return (
    <FullPopup
      {...runtime}
      title="상품 상세"
      confirmLabel="장바구니 담기"
      onConfirm={runtime.onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        화면 전체를 덮고 오른쪽에서 들어옵니다. 긴 내용은 본문 안에서
        스크롤됩니다.
      </p>
    </FullPopup>
  );
}

export function FullPopupOpenDemo() {
  const fullPopup = useFullPopup();

  return (
    <>
      <Example
        caption="컴포넌트를 만들고 훅으로 연다"
        code={`fullPopup.open({ component: ProductPopup });`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => fullPopup.open({ component: ProductPopup })}
        >
          상품 상세 보기
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`function ProductPopup(runtime: FullPopupComponentProps) {
  return (
    <FullPopup {...runtime} title="상품 상세" confirmLabel="장바구니 담기" onConfirm={runtime.onRequestClose}>
      …
    </FullPopup>
  );
}

const fullPopup = useFullPopup();
fullPopup.open({ component: ProductPopup });`}</code>
      </pre>
    </>
  );
}

function DetailPopup(runtime: FullPopupComponentProps) {
  return (
    <FullPopup
      {...runtime}
      title="주문 상세"
      confirmLabel="닫기"
      onConfirm={runtime.onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        열려 있는 동안 배경은 inert 가 되고 스크롤이 잠깁니다.
      </p>
    </FullPopup>
  );
}

export function FullPopupDetailDemo() {
  const fullPopup = useFullPopup();

  return (
    <Example
      caption="한 페이지만큼의 내용에 맞는 자리"
      code={`fullPopup.open({ component: DetailPopup });`}
    >
      <Button
        size="medium"
        onClick={() => fullPopup.open({ component: DetailPopup })}
      >
        주문 상세 보기
      </Button>
    </Example>
  );
}

function CenterPopup(runtime: FullPopupComponentProps) {
  return (
    <FullPopup
      {...runtime}
      contentAlign="center"
      title="가입을 완료했습니다"
      description="이제 모든 기능을 쓸 수 있습니다."
      confirmLabel="시작하기"
      onConfirm={runtime.onRequestClose}
    />
  );
}

function NoClosePopup(runtime: FullPopupComponentProps) {
  return (
    <FullPopup
      {...runtime}
      hasCloseButton={false}
      title="본인 확인"
      confirmLabel="확인했습니다"
      onConfirm={runtime.onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        × 가 없으면 푸터 버튼과 Esc 만 남으므로, 닫는 버튼은 푸터에 둡니다.
      </p>
    </FullPopup>
  );
}

export function FullPopupOptionsDemo() {
  const fullPopup = useFullPopup();

  return (
    <CaseGrid
      columns={2}
      code={`<FullPopup contentAlign="center" />
<FullPopup hasCloseButton={false} />`}
    >
      <Case label='contentAlign="center"' note="짧은 안내">
        <Button
          variant="line"
          onClick={() => fullPopup.open({ component: CenterPopup })}
        >
          가운데 정렬 열기
        </Button>
      </Case>
      <Case label="hasCloseButton={false}" note="푸터 버튼과 Esc 로만">
        <Button
          variant="line"
          onClick={() => fullPopup.open({ component: NoClosePopup })}
        >
          닫기 버튼 없이 열기
        </Button>
      </Case>
    </CaseGrid>
  );
}

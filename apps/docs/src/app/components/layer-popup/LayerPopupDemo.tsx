"use client";

import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Field,
  SuccessIcon,
  Textfield,
} from "@nui-kit/react";
import {
  LayerPopup,
  useLayerPopup,
  type LayerPopupComponentProps,
} from "@nui-kit/react/popup";
import { Case, CaseGrid, Example } from "@/components/guide";

/** 팝업 하나 = 컴포넌트 하나. PopupHost 가 넣는 runtime 다섯을 셸에 그대로 넘긴다. */
function TermsPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      title="약관 동의"
      description="서비스 이용을 위해 아래 약관에 동의해 주세요."
      confirmLabel="동의합니다"
      onConfirm={runtime.onRequestClose}
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        dim 을 누르거나 Esc 를 눌러도 닫힙니다. Tab 은 팝업 밖으로 나가지
        않습니다.
      </p>
    </LayerPopup>
  );
}

export function LayerPopupOpenDemo() {
  const layerPopup = useLayerPopup();

  return (
    <>
      <Example
        caption="컴포넌트를 만들고 훅으로 연다"
        code={`layerPopup.open({ component: TermsPopup });`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => layerPopup.open({ component: TermsPopup })}
        >
          약관 보기
        </Button>
      </Example>
      <pre className="doc-code">
        <code>{`function TermsPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      title="약관 동의"
      confirmLabel="동의합니다"
      onConfirm={runtime.onRequestClose}
    >
      내용
    </LayerPopup>
  );
}

const layerPopup = useLayerPopup();
layerPopup.open({ component: TermsPopup });`}</code>
      </pre>
    </>
  );
}

function ProfilePopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      title="프로필 수정"
      cancelLabel="취소"
      confirmLabel="저장"
      onConfirm={runtime.onRequestClose}
    >
      <Field>
        <Field.Label>이름</Field.Label>
        <Textfield placeholder="홍길동" autoComplete="name" />
      </Field>
    </LayerPopup>
  );
}

export function LayerPopupFormDemo() {
  const layerPopup = useLayerPopup();

  return (
    <Example
      caption="폼처럼 내용이 있는 팝업도 같은 꼴이다"
      code={`layerPopup.open({ component: ProfilePopup });`}
    >
      <Button
        size="medium"
        onClick={() => layerPopup.open({ component: ProfilePopup })}
      >
        프로필 수정
      </Button>
    </Example>
  );
}

function CenterPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      contentAlign="center"
      title="업로드를 완료했습니다"
      description="파일 3개가 저장됐습니다."
      confirmLabel="닫기"
      onConfirm={runtime.onRequestClose}
    />
  );
}

/*
  아이콘 슬롯은 Alert · Confirm 전용이다. 셸 셋에서는 `children` 에 직접 넣고
  크기 · 색도 쓰는 쪽이 정한다 (2026-09-11).

  ⚠️ `description` 은 prop 으로 둔다 — 그래야 `aria-describedby` 가 이어지고
     글자 토큰을 받는다. 본문 순서가 `description → children` 이라 아이콘은
     글 아래에 선다. **제목 바로 아래 아이콘이 필요하면 Alert · Confirm 이다.**
*/
function IconPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      contentAlign="center"
      title="새 기능이 추가됐습니다"
      description="설정에서 알림 방식을 고를 수 있습니다."
      confirmLabel="설정 보기"
      onConfirm={runtime.onRequestClose}
    >
      <SuccessIcon size={40} color="var(--nui-text-success)" />
    </LayerPopup>
  );
}

function NoClosePopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      hasCloseButton={false}
      title="약관이 바뀌었습니다"
      description="계속 쓰려면 바뀐 약관에 동의해 주세요."
      confirmLabel="동의합니다"
      onConfirm={runtime.onRequestClose}
    />
  );
}

export function LayerPopupOptionsDemo() {
  const layerPopup = useLayerPopup();

  return (
    <CaseGrid
      columns={3}
      code={`<LayerPopup contentAlign="center" />
<LayerPopup description="…"><SuccessIcon size={40} /></LayerPopup>
<LayerPopup hasCloseButton={false} />`}
    >
      <Case label='contentAlign="center"' note="짧은 안내">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: CenterPopup })}
        >
          가운데 정렬 열기
        </Button>
      </Case>
      <Case label="children 에 아이콘" note="설명 아래 · 크기는 쓰는 쪽이">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: IconPopup })}
        >
          아이콘 열기
        </Button>
      </Case>
      <Case label="hasCloseButton={false}" note="× 없음">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: NoClosePopup })}
        >
          닫기 버튼 없이 열기
        </Button>
      </Case>
    </CaseGrid>
  );
}

export function LayerPopupCloseDemo() {
  const layerPopup = useLayerPopup();
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((prev) => [...prev, entry]);

  // runtime 콜백을 감싼다 — 내 일을 한 뒤 Host 것을 이어서 부른다
  function CloseLogPopup(runtime: LayerPopupComponentProps) {
    return (
      <LayerPopup
        {...runtime}
        onClickClose={() => push("onClickClose")}
        onRequestClose={() => {
          push("onRequestClose");
          runtime.onRequestClose();
        }}
        onCloseComplete={() => {
          push("onCloseComplete");
          runtime.onCloseComplete();
        }}
        size="small"
        title="닫는 길 셋"
        description="× · dim · Esc 로 닫아 보세요."
      />
    );
  }

  return (
    <Example
      caption="셋이 불리는 순서는 아래와 같다"
      code={`<LayerPopup {...runtime} onClickClose={…} onRequestClose={() => { …; runtime.onRequestClose(); }} onCloseComplete={…} />`}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button
          size="medium"
          variant="line"
          onClick={() => {
            setLog([]);
            layerPopup.open({ component: CloseLogPopup });
          }}
        >
          열기
        </Button>
        {log.length > 0 ? (
          <code style={{ fontSize: "var(--nui-font-size-2)" }}>
            {log.join(" → ")}
          </code>
        ) : null}
      </div>
    </Example>
  );
}

function ConfirmOnlyPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      title="알림을 켤까요?"
      description="새 글이 오면 알려 드립니다."
      confirmLabel="켜기"
      onConfirm={runtime.onRequestClose}
    />
  );
}

function BothPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      title="변경 사항을 저장할까요?"
      description="저장하지 않으면 입력한 내용이 사라집니다."
      cancelLabel="취소"
      confirmLabel="저장"
      onConfirm={runtime.onRequestClose}
    />
  );
}

function CustomFooterPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      title="매장 안내"
      description="영업시간은 10시부터 21시까지입니다."
      footer={
        <ButtonGroup>
          <ButtonGroup.Item>
            <Button variant="line" onClick={runtime.onRequestClose}>
              전화 걸기
            </Button>
          </ButtonGroup.Item>
          <ButtonGroup.Item>
            <Button onClick={runtime.onRequestClose}>길 찾기</Button>
          </ButtonGroup.Item>
        </ButtonGroup>
      }
    />
  );
}

export function LayerPopupFooterDemo() {
  const layerPopup = useLayerPopup();

  return (
    <CaseGrid
      columns={3}
      caption="라벨만 주면 표준 푸터. 둘 다 있으면 취소 : 확인 = 3 : 7"
      code={`<LayerPopup confirmLabel="저장" onConfirm={save} />
<LayerPopup cancelLabel="취소" confirmLabel="저장" onConfirm={save} />
<LayerPopup footer={
  <ButtonGroup>
    <ButtonGroup.Item><Button variant="line" onClick={call}>전화 걸기</Button></ButtonGroup.Item>
    <ButtonGroup.Item><Button onClick={navigate}>길 찾기</Button></ButtonGroup.Item>
  </ButtonGroup>
} />`}
    >
      <Case label="confirmLabel" note="확인 하나">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: ConfirmOnlyPopup })}
        >
          확인만 열기
        </Button>
      </Case>
      <Case label="cancelLabel + confirmLabel" note="3 : 7">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: BothPopup })}
        >
          둘 다 열기
        </Button>
      </Case>
      <Case label="footer" note="확인 · 취소가 아닌 행동 둘. 5 : 5">
        <Button
          variant="line"
          onClick={() => layerPopup.open({ component: CustomFooterPopup })}
        >
          footer 로 열기
        </Button>
      </Case>
    </CaseGrid>
  );
}

function AddressPopup(runtime: LayerPopupComponentProps) {
  return (
    <LayerPopup
      {...runtime}
      size="small"
      title="주소 찾기"
      cancelLabel="취소"
      confirmLabel="선택"
      onConfirm={runtime.onRequestClose}
    >
      <Field>
        <Field.Label>도로명</Field.Label>
        <Textfield placeholder="세종대로 209" />
      </Field>
    </LayerPopup>
  );
}

/** 팝업 안에서 훅을 다시 불러 하나를 더 연다. 위아래는 Host 가 스택 순서로 정한다. */
function ShippingPopup(runtime: LayerPopupComponentProps) {
  const layerPopup = useLayerPopup();

  return (
    <LayerPopup
      {...runtime}
      title="배송지"
      footer={
        <Button onClick={() => layerPopup.open({ component: AddressPopup })}>
          주소 찾기
        </Button>
      }
    >
      <p style={{ color: "var(--nui-text-secondary)" }}>
        「주소 찾기」를 누르면 위에 팝업이 하나 더 뜹니다. 그때 Esc 는 위쪽만
        닫습니다.
      </p>
    </LayerPopup>
  );
}

export function LayerPopupStackDemo() {
  const layerPopup = useLayerPopup();

  return (
    <Example
      caption="나중에 연 것이 위. Esc 는 위쪽만 닫는다"
      code={`function ShippingPopup(runtime) {
  const layerPopup = useLayerPopup();
  return <LayerPopup {...runtime} footer={<Button onClick={() => layerPopup.open({ component: AddressPopup })}>주소 찾기</Button>} />;
}`}
    >
      <Button
        size="medium"
        variant="line"
        onClick={() => layerPopup.open({ component: ShippingPopup })}
      >
        겹쳐 열기
      </Button>
    </Example>
  );
}

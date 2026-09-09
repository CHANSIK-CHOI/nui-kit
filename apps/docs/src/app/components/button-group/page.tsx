import Link from "next/link";
import { Button, ButtonGroup, ButtonGroupItem, IconButton } from "@nui-kit/react";
import { CloseIcon } from "@nui-kit/react/icon";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  Example,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "ButtonGroup" };

export default function ButtonGroupPage() {
  return (
    <>
      <GuideHeader
        title="ButtonGroup"
        named={["ButtonGroup", "ButtonGroupItem"]}
        subpath="button"
      />

      <ExceptionBadges items={[{ kind: "rsc", target: "ButtonGroup.Item" }]} />

      <p>
        버튼을 나란히 놓는다. 항목마다{" "}
        <code>ButtonGroup.Item</code> 으로 감싼다.
      </p>

      <div className="doc-note doc-note--warn">
        이 페이지는 Server Component 라 <code>ButtonGroupItem</code> 을 쓴다.{" "}
        <code>ButtonGroup.Item</code> 표기는 Client Component 에서만 동작한다.
      </div>

      <h2>균등 분할 — 기본</h2>
      <p>
        취소는 <code>line</code>, 주 행동은 <code>solid</code> 다. 둘 다 채우면
        어느 쪽을 눌러야 하는지 사라진다.
      </p>
      <Example
        row={false}
        caption="ratio 를 주지 않으면 균등하다"
        code={`<ButtonGroup>
  <ButtonGroup.Item>
    <Button variant="line">취소</Button>
  </ButtonGroup.Item>
  <ButtonGroup.Item>
    <Button color="primary">저장</Button>
  </ButtonGroup.Item>
</ButtonGroup>`}
      >
        <ButtonGroup>
          <ButtonGroupItem>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">저장</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <h2>3 : 7 — 첫 항목이 되돌리는 행동일 때</h2>
      <p>
        취소 · 닫기 · 초기화처럼 <strong>되돌리는 행동</strong>이 왼쪽에 오면{" "}
        <code>ratio=&quot;3:7&quot;</code> 로 폭에서도 위계를 드러낸다.
      </p>
      <Example
        row={false}
        caption='ratio="3:7" — 왼쪽이 3, 오른쪽이 7'
        code={`<ButtonGroup ratio="3:7">
  <ButtonGroup.Item>
    <Button variant="line">취소</Button>
  </ButtonGroup.Item>
  <ButtonGroup.Item>
    <Button color="danger">삭제</Button>
  </ButtonGroup.Item>
</ButtonGroup>`}
      >
        <ButtonGroup ratio="3:7">
          <ButtonGroupItem>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="danger">삭제</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <div className="doc-note">
        임의 비율은 받지 않는다. 값은 <code>&quot;equal&quot;</code>(기본)과{" "}
        <code>&quot;3:7&quot;</code> 둘이다.
      </div>

      <h2>내용 폭 — shouldAutoWidth</h2>
      <p>
        그 항목만 내용만큼 넓어지고 나머지가 남은 자리를 채운다. 비율보다
        우선한다.
      </p>
      <Example
        row={false}
        caption="shouldAutoWidth — 왼쪽만 내용 폭"
        code={`<ButtonGroup.Item shouldAutoWidth>
  <Button variant="line">취소</Button>
</ButtonGroup.Item>`}
      >
        <ButtonGroup>
          <ButtonGroupItem shouldAutoWidth>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">저장</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <h2>셋 이상은 놓지 않는다</h2>
      <p>
        나란히 놓는 버튼은 <strong>둘까지</strong>다. 액션이 더 필요하면{" "}
        <Link href="/components/icon-button">IconButton</Link> 이나 더보기로
        접는다.
      </p>
      <Example
        row={false}
        caption="셋째 액션은 아이콘 버튼으로 접는다"
        code={`<ButtonGroup>
  <ButtonGroup.Item shouldAutoWidth>
    <IconButton aria-label="닫기" variant="line"><CloseIcon /></IconButton>
  </ButtonGroup.Item>
  …
</ButtonGroup>`}
      >
        <ButtonGroup>
          <ButtonGroupItem shouldAutoWidth>
            <IconButton aria-label="닫기" variant="line">
              <CloseIcon />
            </IconButton>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button variant="line">임시 저장</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">보내기</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <DesignNote title="왜 셋을 나란히 놓지 않나">
        <p>
          여러 개를 나란히 두면 각 버튼의 중요도가 비슷해 보여서 사용자가
          고르기 어려워진다. 고르는 일이 아니라 <strong>읽는 일</strong>이
          된다.
        </p>
        <p>
          폭도 문제다. 글꼴을 키워 쓰는 사용자나 번역으로 라벨이 길어진 화면에서
          셋을 나누면 글자가 잘린다. 짧은 라벨은 번역 시 최대 2.5배까지 늘어난다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        항목 사이 간격 하나를 연다. 간격을 바꾸면 각 항목의 기준 폭도 같이
        따라간다. 그래서 간격을 얼마로 두든 두 항목이 정확히 반씩 나뉜다.
      </p>
      <HookTable group="button-group" />

      <h2>API</h2>
      <h3>ButtonGroup</h3>
      <PropsTable of="ButtonGroup" />
      <h3>ButtonGroup.Item</h3>
      <PropsTable of="ButtonGroup.Item" />
    </>
  );
}

import {
  Button,
  IconButton,
  ButtonGroup,
  ButtonGroupItem,
} from "@chansikchoi/next-ui";
import { DelIcon } from "@chansikchoi/next-ui/icon";
import { Example } from "@/components/Example";
import { HookTable } from "@/components/HookTable";
import { PropsTable } from "@/components/PropsTable";

export const metadata = { title: "Button" };

export default function ButtonPage() {
  return (
    <>
      <h1>Button</h1>
      <p className="doc-lead">
        누르는 동작을 담는다. <code>color</code> · <code>variant</code> ·{" "}
        <code>shape</code> · <code>size</code> 를 조합한다.
      </p>

      <pre className="doc-code">
        <code>{`import { Button } from "@chansikchoi/next-ui";
import "@chansikchoi/next-ui/styles/button.css"; // 온디맨드일 때`}</code>
      </pre>

      <h2>레이아웃 — 기본이 전체 너비다</h2>
      <p>
        <code>Button</code> 은 <code>width: 100%</code> 다. 모바일 우선 폼을
        전제로 한 기본값이라, 아래 예제에서도 버튼이 한 줄을 모두 차지한다.
        너비를 제어하려면 <strong>바깥 컨테이너로 감싸거나</strong>{" "}
        <code>ButtonGroup</code> 을 쓴다.
      </p>
      <Example row={false} caption="컨테이너로 너비를 제한한 예">
        <div style={{ display: "flex", gap: 8, maxWidth: 320 }}>
          <Button variant="line">취소</Button>
          <Button color="primary">확인</Button>
        </div>
      </Example>

      <h2>색상</h2>
      <p>
        색이 아니라 <strong>역할</strong>이 이름이다. 기본은{" "}
        <code>neutral</code>, 가장 중요한 액션에는 <code>primary</code>, 되돌릴
        수 없는 액션(삭제·탈퇴)에는 <code>danger</code>, 확인이 필요한 액션에는{" "}
        <code>warning</code> 을 쓴다.
      </p>
      <Example caption="color: neutral | primary | danger | warning">
        <Button>neutral</Button>
        <Button color="primary">primary</Button>
        <Button color="danger">danger</Button>
        <Button color="warning">warning</Button>
      </Example>

      <h2>변형</h2>
      <p>
        <code>solid</code> 는 채움, <code>line</code> 은 테두리,{" "}
        <code>text</code> 는 배경 없는 형태다. <code>text</code> 는 크기·모양
        옵션을 갖지 않는다.
      </p>
      <Example caption="variant: solid | line | text">
        <Button color="primary">solid</Button>
        <Button color="primary" variant="line">
          line
        </Button>
        <Button variant="text">text</Button>
      </Example>

      <h2>모양과 크기</h2>
      <Example caption="shape: square | round · size: large | medium(기본) | small">
        <Button color="primary" shape="round">
          round
        </Button>
        <Button size="large">large</Button>
        <Button size="medium">medium</Button>
        <Button size="small">small</Button>
      </Example>

      <h2>아이콘</h2>
      <Example caption="icon prop 으로 라벨 앞에 아이콘을 넣는다">
        <Button icon={<DelIcon />}>삭제</Button>
        <Button icon={<DelIcon />} size="small" variant="line">
          삭제
        </Button>
      </Example>

      <h2>비활성</h2>
      <Example caption="disabled 는 solid · line 모두 대응한다">
        <Button disabled>disabled</Button>
        <Button variant="line" disabled>
          disabled
        </Button>
      </Example>

      <h2>커스터마이징</h2>
      <p>
        <strong>색은 컴포넌트별로 열지 않는다.</strong> 배경과 글자는 짝이라
        배경만 바꾸면 대비가 깨지는데 화면에 드러나지 않는다. 버튼 하나의 색을
        바꿔야 하면 <code>className</code> 을, 전체 톤을 바꿔야 하면{" "}
        <code>--nui-action-*</code> 역할 토큰을 쓴다 —{" "}
        <a href="/foundations/color#change">색 문서</a>에 자세히 있다.
      </p>
      <p>
        치수는 <strong>크기 옵션마다 이름이 따로</strong> 있다. 하나로 두면 값을
        넣는 순간 large · medium · small 이 전부 같은 높이가 된다.
      </p>
      <Example caption="large 만 높이를 바꾼다 — medium 은 그대로다">
        <div
          className="doc-example__row"
          style={
            {
              "--nui-button-lg-height": "4rem",
              "--nui-button-radius": "999px",
            } as React.CSSProperties
          }
        >
          <Button size="large">덮어쓴 large</Button>
          <Button>medium 유지</Button>
        </div>
      </Example>
      <HookTable group="button" />

      <h2>IconButton</h2>
      <p>
        아이콘만 담는 정사각 버튼이다. <strong>접근 이름을 반드시 준다</strong>{" "}
        — <code>aria-label</code> 이 없으면 스크린리더가 읽을 것이 없다.
      </p>
      <Example caption="IconButton — aria-label 필수">
        <IconButton aria-label="삭제">
          <DelIcon />
        </IconButton>
        <IconButton aria-label="삭제" variant="line" color="primary">
          <DelIcon />
        </IconButton>
        <IconButton aria-label="삭제" size="small">
          <DelIcon />
        </IconButton>
      </Example>

      <h2>ButtonGroup</h2>
      <Example caption="ButtonGroup — 기본은 균등 분할" row={false}>
        <ButtonGroup>
          <ButtonGroupItem>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">확인</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <h2>API</h2>
      <h3>Button</h3>
      <PropsTable of="Button" />
      <h3>IconButton</h3>
      <PropsTable of="IconButton" />
      <h3>ButtonGroup</h3>
      <PropsTable of="ButtonGroup" />
      <h3>ButtonGroup.Item</h3>
      <PropsTable of="ButtonGroup.Item" />
      <h3>ButtonLink</h3>
      <p className="doc-note">
        <code>ButtonLink</code> 만 <code>next/link</code> 를 쓴다.{" "}
        <code>next</code> 는 optional peer 이므로 이 컴포넌트를 쓰지 않으면
        설치할 필요가 없다.
      </p>
      <PropsTable of="ButtonLink" />
    </>
  );
}

import {
  Button,
  IconButton,
  ButtonGroup,
  ButtonGroupItem,
} from "@chansikchoi/next-ui";
import { DelIcon } from "@chansikchoi/next-ui/icon";
import { Example } from "@/components/Example";
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
        기본은 <code>black</code> 이다. 브랜드 강조에는 <code>primary</code>,
        파괴적 동작에는 <code>secondary</code> 를 쓴다.
      </p>
      <Example caption="color: black | primary | secondary | point">
        <Button>black</Button>
        <Button color="primary">primary</Button>
        <Button color="secondary">secondary</Button>
        <Button color="point">point</Button>
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
      <Example caption="shape: square | round · size: large | medium | small">
        <Button color="primary" shape="round">
          round
        </Button>
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
        <code>--nui-button-bg</code> 는 <strong>기본(black) 버튼만</strong>{" "}
        바꾼다. variant 는 각자의 훅을 갖는다 — 훅 하나로 모든 variant 가 덮이는
        것을 막기 위해서다.
      </p>
      <Example caption="--nui-button-bg 를 바꿔도 primary 는 영향받지 않는다">
        <div
          className="doc-example__row"
          style={
            {
              "--nui-button-bg": "#6d28d9",
              "--nui-button-radius": "999px",
            } as React.CSSProperties
          }
        >
          <Button>덮어쓴 기본 버튼</Button>
          <Button color="primary">primary 유지</Button>
        </div>
      </Example>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>공개 훅</th>
              <th>대상</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["--nui-button-bg", "기본(black) 버튼 배경"],
              ["--nui-button-primary-bg", 'color="primary" 배경'],
              ["--nui-button-secondary-bg", 'color="secondary" 배경'],
              ["--nui-button-point-bg", 'color="point" 배경'],
              ["--nui-button-color", "라벨 색"],
              ["--nui-button-radius", "모서리 반경"],
              ["--nui-button-min-height", "최소 높이"],
              ["--nui-button-min-width", "최소 너비"],
              ["--nui-button-padding-x", "좌우 여백"],
            ].map(([name, target]) => (
              <tr key={name}>
                <td>
                  <span className="doc-token-name">{name}</span>
                </td>
                <td className="doc-wrap">{target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

import Link from "next/link";
import {
  Button,
  IconButton,
  ButtonGroup,
  ButtonGroupItem,
  ButtonLink,
} from "@chansikchoi/next-ui";
import { DelIcon } from "@chansikchoi/next-ui/icon";
import { LoadingDemo } from "./LoadingDemo";
import {
  GuideHeader,
  Case,
  CaseGrid,
  CaseMatrix,
  Example,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "Button" };

/** 축은 소스 타입과 같은 순서로 둔다 — packages/ui/src/components/Button/Button.tsx */
const COLORS = [
  "neutral",
  "primary",
  "secondary",
  "danger",
  "warning",
] as const;
const VARIANTS = ["solid", "line", "text"] as const;
const SIZES = [
  ["large", "56px"],
  ["medium", "48px"],
  ["small", "40px"],
] as const;

export default function ButtonPage() {
  return (
    <>
      <GuideHeader
        title="Button"
        named={["Button", "IconButton", "ButtonGroup", "ButtonLink"]}
        subpath="button"
      >
        누르는 동작을 담는다.
      </GuideHeader>

      <h2>기본이 전체 너비다</h2>
      <p>
        <code>Button</code> 은 <code>width: 100%</code> 다. 모바일 폼을 전제로
        한 기본값이라 아래 예제에서도 한 줄을 모두 차지한다. 너비를 제한하려면
        바깥 컨테이너로 감싸거나 <code>ButtonGroup</code> 을 쓴다.
      </p>
      <Example row={false} caption="컨테이너로 너비를 제한한 예">
        <div style={{ display: "flex", gap: 8, maxWidth: 320 }}>
          <Button variant="line">취소</Button>
          <Button color="primary">확인</Button>
        </div>
      </Example>

      <h2>색과 변형</h2>
      <p>
        색이 아니라 <strong>역할</strong>이 이름이다. 화면의 주 행동에는{" "}
        <code>primary</code>, 그보다 덜 중요한 행동에는 <code>secondary</code>,
        되돌릴 수 없는 삭제나 탈퇴에는 <code>danger</code>, 확인이 필요한
        진행에는 <code>warning</code> 을 쓴다. 손을 올리면 한 단계, 누르면 두
        단계 진해진다.
      </p>
      <CaseMatrix
        rows={VARIANTS}
        cols={COLORS}
        caption="variant × color 15조합"
        code={`<Button variant="line" color="danger">삭제</Button>`}
        render={(variant, color) => (
          <div style={{ minWidth: 108 }}>
            <Button
              {...(variant === "text"
                ? { variant: "text" as const }
                : { variant })}
              color={color}
            >
              라벨
            </Button>
          </div>
        )}
      />
      <div className="doc-note">
        <code>warning</code> 만 글자가 어둡다. 노랑 배경에 흰 글자는 대비가 크게
        미달한다.
      </div>

      <h2>크기</h2>
      <CaseGrid
        columns={3}
        caption="size: large | medium(기본) | small"
        code={`<Button size="large">라벨</Button>`}
      >
        {SIZES.map(([size, px]) => (
          <Case key={size} label={size} note={px}>
            <Button size={size}>라벨</Button>
          </Case>
        ))}
      </CaseGrid>

      <h2>모양</h2>
      <CaseGrid
        columns={2}
        caption="shape: square(기본) | round"
        code={`<Button shape="round" color="primary">라벨</Button>`}
      >
        <Case label="square" note="기본">
          <Button color="primary" shape="square">
            라벨
          </Button>
        </Case>
        <Case label="round" note="양끝이 반원">
          <Button color="primary" shape="round">
            라벨
          </Button>
        </Case>
      </CaseGrid>

      <div className="doc-note doc-note--warn">
        <code>variant=&quot;text&quot;</code> 는 크기와 모양 옵션이 없다.{" "}
        <strong>타입이 막는다</strong> — <code>size</code> 와 <code>shape</code>{" "}
        가 <code>never</code> 로 선언되어 있다.
      </div>

      <h2>아이콘</h2>
      <p>
        <code>icon</code> prop 으로 라벨 앞에 넣는다.
      </p>
      <CaseGrid
        columns={3}
        caption="아이콘 크기는 버튼 크기를 따라간다"
        code={`<Button icon={<DelIcon />}>삭제</Button>`}
      >
        {SIZES.map(([size]) => (
          <Case key={size} label={`icon + ${size}`}>
            <Button icon={<DelIcon />} size={size}>
              삭제
            </Button>
          </Case>
        ))}
      </CaseGrid>

      <h2>로딩</h2>
      <p>
        <code>isLoading</code> 이면 아이콘 자리에 스피너가 돌고 클릭·Enter·폼
        제출이 막히며 <code>aria-busy</code> 가 붙는다. 라벨은 그대로 보이고
        스크린리더에는 라벨 뒤에 <code>loadingLabel</code>(기본 &quot;처리
        중&quot;)이 붙는다. 색은 바뀌지 않고 포커스도 남는다 — disabled 가
        아니다.
      </p>
      <div className="doc-note">
        <strong>포커스가 버튼에 없어도 들린다.</strong> 문구는 화면 밖 공용{" "}
        <code>role=&quot;status&quot;</code> 영역에 놓여, 폼에서 Enter 로 제출해
        포커스가 입력창에 있을 때도 로딩 시작이 읽힌다. 버튼 <em>안</em> 의 live
        영역은 보조기술이 이름 변경으로 처리해 무시하기 때문이다.
        <br />
        <strong>완료는 알리지 않는다.</strong> 버튼은 결과를 모른다 —{" "}
        <code>isLoading</code> 이 내려간 것이 성공인지 실패인지 알 수 없다.
        결과는 <code>Toast</code> 나 에러 메시지로 알린다.
      </div>
      <CaseGrid
        columns={3}
        caption="isLoading — 세 변형, 아이콘 유무"
        code={`<Button isLoading>저장</Button>`}
      >
        {VARIANTS.map((variant) => (
          <Case key={variant} label={`${variant} + isLoading`}>
            <Button
              {...(variant === "text"
                ? { variant: "text" as const }
                : { variant })}
              color="primary"
              isLoading
            >
              저장
            </Button>
          </Case>
        ))}
        <Case label="icon + isLoading" note="스피너가 아이콘 자리를 대신한다">
          <Button icon={<DelIcon />} color="danger" isLoading>
            삭제
          </Button>
        </Case>
        <Case label="small + isLoading" note="스피너도 16px">
          <Button size="small" isLoading>
            저장
          </Button>
        </Case>
        <Case
          label="disabled + isLoading"
          note="색·커서는 disabled, 스피너는 남는다"
        >
          <Button disabled isLoading>
            저장
          </Button>
        </Case>
      </CaseGrid>
      <LoadingDemo />

      <h2>비활성</h2>
      <CaseGrid
        columns={3}
        caption="disabled — 세 변형 모두 대응한다"
        code={`<Button disabled>라벨</Button>`}
      >
        {VARIANTS.map((variant) => (
          <Case key={variant} label={`${variant} + disabled`}>
            <Button
              {...(variant === "text"
                ? { variant: "text" as const }
                : { variant })}
              color="primary"
              disabled
            >
              라벨
            </Button>
          </Case>
        ))}
      </CaseGrid>

      <h2>IconButton</h2>
      <p>
        아이콘만 담는 정사각 버튼이다. <code>aria-label</code> 을 반드시 준다.
        없으면 스크린리더가 읽을 것이 없다. <code>variant</code> 는{" "}
        <code>solid</code> 와 <code>line</code> 둘뿐이다.
      </p>
      <CaseGrid
        columns={3}
        caption="크기 3 × 변형 2 + disabled + isLoading"
        code={`<IconButton aria-label="삭제"><DelIcon /></IconButton>`}
      >
        {SIZES.map(([size, px]) => (
          <Case key={size} label={size} note={px}>
            <IconButton aria-label="삭제" size={size}>
              <DelIcon />
            </IconButton>
            <IconButton
              aria-label="삭제"
              size={size}
              variant="line"
              color="primary"
            >
              <DelIcon />
            </IconButton>
          </Case>
        ))}
        <Case label="disabled">
          <IconButton aria-label="삭제" disabled>
            <DelIcon />
          </IconButton>
          <IconButton aria-label="삭제" variant="line" disabled>
            <DelIcon />
          </IconButton>
        </Case>
        <Case label="isLoading" note="아이콘 자리에 스피너. 정사각 그대로">
          <IconButton aria-label="삭제" isLoading>
            <DelIcon />
          </IconButton>
          <IconButton aria-label="삭제" variant="line" isLoading>
            <DelIcon />
          </IconButton>
        </Case>
      </CaseGrid>

      <h2>ButtonGroup</h2>
      <p>
        기본은 균등 분할이다. <code>shouldAutoWidth</code> 를 주면 그 항목만
        내용 폭이 된다.
      </p>
      <Example row={false} caption="균등 분할 — 기본">
        <ButtonGroup>
          <ButtonGroupItem>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">확인</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>
      <Example row={false} caption="shouldAutoWidth — 왼쪽만 내용 폭">
        <ButtonGroup>
          <ButtonGroupItem shouldAutoWidth>
            <Button variant="line">취소</Button>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Button color="primary">확인</Button>
          </ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <h2>ButtonLink</h2>
      <p>
        생김새는 <code>Button</code> 과 같다. 누르는 대신 이동한다.{" "}
        <code>next/link</code> 를 쓰는 유일한 컴포넌트라 <code>next</code> 가
        optional peer 다. 이 컴포넌트를 쓰지 않으면 설치할 필요가 없다.
      </p>
      <CaseGrid
        columns={2}
        caption="href 가 필수다"
        code={`<ButtonLink href="/components" color="primary">목록</ButtonLink>`}
      >
        <Case label="solid">
          <ButtonLink href="/components" color="primary">
            컴포넌트 목록
          </ButtonLink>
        </Case>
        <Case label="line">
          <ButtonLink href="/components" variant="line">
            컴포넌트 목록
          </ButtonLink>
        </Case>
      </CaseGrid>

      <h2>커스터마이징</h2>
      <p>
        색은 컴포넌트별로 열지 않는다. 배경과 글자는 짝이라 배경만 바꾸면 대비가
        깨지는데 화면에 드러나지 않는다. 버튼 하나의 색을 바꾸려면{" "}
        <code>className</code> 을, 화면 전체를 바꾸려면{" "}
        <Link href="/brand-colors">브랜드 프리셋</Link>을 쓴다.
      </p>
      <p>
        치수는 크기 옵션마다 이름이 따로 있다. 하나로 두면 값을 넣는 순간 세
        크기가 전부 같아진다.
      </p>
      <Example caption="large 만 높이를 바꾼다 — medium 은 그대로다">
        <div
          className="doc-example__row"
          style={
            {
              "--nui-button--lg-height": "4rem",
              "--nui-button--radius": "999px",
            } as React.CSSProperties
          }
        >
          <Button size="large">덮어쓴 large</Button>
          <Button>medium 유지</Button>
        </div>
      </Example>
      <HookTable group="button" />

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
      <PropsTable of="ButtonLink" />
    </>
  );
}

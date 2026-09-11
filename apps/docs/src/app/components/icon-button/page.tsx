import Link from "next/link";
import { IconButton } from "@nui-kit/react";
import { CloseIcon, SearchIcon, CalendarIcon } from "@nui-kit/react/icon";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  Case,
  CaseGrid,
  CaseMatrix,
  Example,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "IconButton" };

const COLORS = ["neutral", "quiet", "primary", "secondary", "danger"] as const;
const VARIANTS = ["solid", "line"] as const;
const SIZES = [
  ["large", "56px"],
  ["medium", "48px"],
  ["small", "40px"],
] as const;

export default function IconButtonPage() {
  return (
    <>
      <GuideHeader title="IconButton" named={["IconButton"]} subpath="button" />

      <ExceptionBadges items={[{ kind: "ownSize", target: "IconButton" }]} />

      <p>
        아이콘만 담는 정사각 버튼이다. 부모 폭을 채우지 않는다. 라벨이 함께
        필요하면 <Link href="/components/button">Button</Link> 의{" "}
        <code>icon</code> 을 쓴다.
      </p>

      <div className="doc-note">
        <strong>
          <code>aria-label</code> 또는 <code>aria-labelledby</code> 가 필수다.
        </strong>{" "}
        둘 다 없으면 타입 에러가 난다.
      </div>

      <DesignNote title="왜 접근 이름을 타입으로 강제하나">
        <p>
          <code>children</code> 이 아이콘이라{" "}
          <strong>글자에서 이름이 생길 길이 없다.</strong> 빠뜨리면 스크린리더가
          &ldquo;버튼&rdquo; 이라고만 읽는데, 화면으로는 멀쩡해 보여서 개발 중에
          드러나지 않는다.
        </p>
        <p>
          <code>aria-label</code> 하나만 필수로 두면{" "}
          <code>aria-labelledby</code> 로 이름을 주는 정상 사용까지 막힌다.
          그래서 둘 중 하나를 요구하는 유니온이다 — 두 경로를 다 열면서 누락만
          잡는다.
        </p>
      </DesignNote>

      <h2>위계</h2>
      <p>
        <code>variant</code> 는 <code>solid</code> 와 <code>line</code> 둘이다.{" "}
        <code>soft</code> 와 <code>text</code> 는 없다.
      </p>
      <CaseMatrix
        rows={VARIANTS}
        cols={COLORS}
        caption="variant 2 × color 5 — 10조합"
        code={`<IconButton aria-label="닫기" variant="line" color="danger"><CloseIcon /></IconButton>`}
        render={(variant, color) => (
          <IconButton aria-label="닫기" variant={variant} color={color}>
            <CloseIcon />
          </IconButton>
        )}
      />

      <h2>크기</h2>
      <CaseGrid
        columns={3}
        caption="size — 정사각이라 높이가 곧 너비다"
        code={`<IconButton aria-label="닫기" size="small"><CloseIcon /></IconButton>`}
      >
        {SIZES.map(([size, px]) => (
          <Case key={size} label={size} note={`${px} 정사각`}>
            <IconButton aria-label="닫기" size={size}>
              <CloseIcon />
            </IconButton>
          </Case>
        ))}
      </CaseGrid>

      <h2>모양</h2>
      <CaseGrid
        columns={2}
        caption="shape — square(기본) · round"
        code={`<IconButton aria-label="검색" shape="round"><SearchIcon /></IconButton>`}
      >
        <Case label="square" note="기본">
          <IconButton aria-label="검색" color="primary">
            <SearchIcon />
          </IconButton>
        </Case>
        <Case label="round" note="완전한 원">
          <IconButton aria-label="검색" color="primary" shape="round">
            <SearchIcon />
          </IconButton>
        </Case>
      </CaseGrid>

      <h2>상태</h2>
      <CaseGrid
        columns={2}
        caption="disabled · isLoading — 두 variant 모두"
        code={`<IconButton aria-label="닫기" isLoading><CloseIcon /></IconButton>`}
      >
        <Case label="disabled">
          <IconButton aria-label="닫기" disabled>
            <CloseIcon />
          </IconButton>
          <IconButton aria-label="닫기" variant="line" disabled>
            <CloseIcon />
          </IconButton>
        </Case>
        <Case label="isLoading" note="스피너가 아이콘 자리를 대신한다">
          <IconButton aria-label="달력 열기" isLoading>
            <CalendarIcon />
          </IconButton>
          <IconButton aria-label="달력 열기" variant="line" isLoading>
            <CalendarIcon />
          </IconButton>
        </Case>
      </CaseGrid>

      <div className="doc-note doc-note--warn">
        손가락으로 누르는 자리에는 <code>medium</code>(48px) 이상을 쓴다.{" "}
        <code>small</code> 은 40px 이라 터치 하한 44px 에 못 미친다 — 마우스
        전용 화면이나 다른 컨트롤 안에 들어갈 때만 쓴다.
      </div>

      <h2>커스터마이징</h2>
      <p>
        크기는 이름 하나가 가로와 세로를 함께 바꾼다. 변수는{" "}
        <code>--nui-icon-button--</code> 으로 시작한다.{" "}
        <Link href="/components/button">Button</Link> 과 이름이 달라서 한쪽만
        바꿀 수 있다.
      </p>
      <Example
        caption="medium 만 48px 에서 44px 로 줄인 예"
        style={
          { "--nui-icon-button--medium-size": "2.75rem" } as React.CSSProperties
        }
      >
        <IconButton aria-label="검색">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="검색" size="large">
          <SearchIcon />
        </IconButton>
      </Example>
      <HookTable group="icon-button" />

      <h2>API</h2>
      <PropsTable of="IconButton" />
    </>
  );
}

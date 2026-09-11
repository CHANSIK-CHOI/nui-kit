import Link from "next/link";
import { Button } from "@nui-kit/react";
import { DelIcon } from "@nui-kit/react/icon";
import { LoadingDemo } from "./LoadingDemo";
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

export const metadata = { title: "Button" };

/**
 * 축은 코드에서 뽑는다 — 손으로 세면 빠뜨린다.
 *   grep -rhn "^export type.*=.*\"" packages/ui/src/components/Button/*.tsx
 *
 * 실제로 `soft` 가 늘었는데 이 배열이 따라오지 않아 16조합 중 4개가
 * 이 페이지에서 사라져 있었다.
 */
const COLORS = ["neutral", "quiet", "primary", "secondary", "danger"] as const;
const VARIANTS = ["solid", "soft", "line", "text"] as const;
const SIZES = [
  ["large", "56px"],
  ["medium", "48px"],
  ["small", "40px"],
] as const;

/** `variant="text"` 는 shape 를 `never` 로 닫는다. 전개할 때 갈라 준다 */
type Variant = (typeof VARIANTS)[number];
const asVariant = (v: Variant) =>
  v === "text" ? ({ variant: "text" } as const) : ({ variant: v } as const);

export default function ButtonPage() {
  return (
    <>
      <GuideHeader title="Button" named={["Button"]} subpath="button" />

      <ExceptionBadges
        items={[{ kind: "contentWidth", target: 'variant="text"' }]}
      />

      <p>
        <code>Button</code> 은 부모 폭을 채운다. 좁히려면 바깥 컨테이너로
        감싸거나 <Link href="/components/button-group">ButtonGroup</Link> 을
        쓴다. <code>variant=&quot;text&quot;</code> 만 예외로 글자 폭이다.
      </p>
      <Example row={false} caption="컨테이너로 너비를 제한한 예">
        <div style={{ display: "flex", gap: 8, maxWidth: 320 }}>
          <Button variant="line">취소</Button>
          <Button color="primary">저장</Button>
        </div>
      </Example>
      <Example
        row={false}
        caption="text 는 글자 폭이라 문장 안에 넣을 수 있다"
        code={`<Button variant="text">전체 보기</Button>`}
      >
        <div style={{ maxWidth: 320 }}>
          <p style={{ margin: 0 }}>
            주문 3건을 불러왔다. <Button variant="text">전체 보기</Button>
          </p>
        </div>
      </Example>

      <h2>위계 — 채움으로 나눈다</h2>
      <p>
        색이 아니라 <strong>역할</strong>이 이름이다. 화면의 주 행동에는{" "}
        <code>primary</code>, 덜 중요한 행동에는 <code>secondary</code>, 되돌릴
        수 없는 삭제나 탈퇴에는 <code>danger</code> 를 쓴다. 취소 · 닫기처럼
        눈에 덜 띄어야 하는 자리에는 <code>quiet</code> 가 있다 — 기본{" "}
        <code>neutral</code> 보다 한 단계 조용하다.
      </p>
      <CaseMatrix
        rows={VARIANTS}
        cols={COLORS}
        caption="variant 4 × color 5 — 20조합"
        code={`<Button variant="soft" color="danger">삭제</Button>`}
        render={(variant, color) => (
          <div style={{ minWidth: 108 }}>
            <Button {...asVariant(variant)} color={color}>
              저장
            </Button>
          </div>
        )}
      />

      <div className="doc-note">
        <strong>채워진 버튼은 한 화면에 하나만 둔다.</strong> 눌러야 할 것이
        둘이면 두 번째는 <code>soft</code> 다 — 채워져 있지만 조용하다. 버튼을
        셋 이상 나란히 놓지 않는다.
      </div>

      <DesignNote title="왜 line 의 테두리는 색이 없나">
        <p>
          선의 진하기는 <strong>한 화면에 몇 번 나오나</strong>로 정해진다.{" "}
          <code>line</code> 버튼은 목록 행마다 반복되는 자리라 그 축의 위쪽이다.
          색 테두리가 세 번 반복되면 화면이 줄무늬가 된다. 색은 글자와
          아이콘에만 남는다.
        </p>
        <p>
          테두리는 hover · active 에서 함께 한 단계씩 어두워진다. 안쪽 면만
          어두워지고 선이 제자리면 대비가 깎여서다 — 실측으로 2.87:1 까지
          내려갔다(기준 3.0).
        </p>
      </DesignNote>

      <h2>크기</h2>
      <p>
        기본은 <code>medium</code> 이다. 위아래로 하나씩 있다.
      </p>
      <CaseGrid
        columns={3}
        caption="size — large · medium(기본) · small"
        code={`<Button size="large">저장</Button>`}
      >
        {SIZES.map(([size, px]) => (
          <Case key={size} label={size} note={px}>
            <Button size={size}>저장</Button>
          </Case>
        ))}
      </CaseGrid>

      <h2>모양</h2>
      <CaseGrid
        columns={2}
        caption="shape — square(기본) · round"
        code={`<Button shape="round" color="primary">저장</Button>`}
      >
        <Case label="square" note="기본">
          <Button color="primary" shape="square">
            저장
          </Button>
        </Case>
        <Case label="round" note="양끝이 반원">
          <Button color="primary" shape="round">
            저장
          </Button>
        </Case>
      </CaseGrid>

      <h2>text 의 크기</h2>
      <p>
        <code>variant=&quot;text&quot;</code> 도 <code>size</code> 를 받는다.
        바뀌는 것은 글자와 아이콘뿐이고 높이는 잡지 않는다 — 그래서{" "}
        <code>large</code> 와 <code>medium</code> 은 같은 모양이다. 문장 안에 둘
        때는 주변 글자 크기에 맞춘다(14px 문단이면 <code>small</code>).{" "}
        <code>shape</code> 는 받지 않는다.
      </p>
      <CaseGrid
        columns={3}
        caption="variant=text × size 3 — large 와 medium 은 같다"
        code={`<Button variant="text" size="small">더 보기</Button>`}
      >
        {SIZES.map(([size]) => (
          <Case
            key={size}
            label={size}
            note={size === "small" ? "14px · 아이콘 16" : "16px · 아이콘 20"}
          >
            <Button variant="text" size={size} icon={<DelIcon />}>
              더 보기
            </Button>
          </Case>
        ))}
      </CaseGrid>

      <DesignNote title="왜 text 는 폭도 높이도 다른가">
        <p>
          <code>text</code> 는 면도 테두리도 없어서 높이를 바꿔도 바뀌는 것이
          글자 주변의 빈 공간뿐이다. 문장 안이나 목록 행 안에 놓이는 자리라
          높이를 스스로 정하면 오히려 줄 간격이 어긋난다. 그래서{" "}
          <code>size</code> 가 글자와 아이콘만 바꾼다.
        </p>
        <p>
          폭도 같은 이유로 예외다. 부모 폭을 채우면 글자는 왼쪽 끝에 있는데 줄
          전체가 눌린다 — 그 사실은 hover 면이 켜지는 순간에야 드러난다. 최소 폭
          120px 도 걸려서 두 글자짜리 버튼이 그만큼 자리를 차지했다. 누르는
          범위는 세로 29~32px 이라 44px 에 못 미치지만, 문장 안에서 세로를
          늘리면 줄 간격이 벌어진다. 하한 24px 을 지키는 자리로 둔다.
        </p>
        <p>
          타입에서 <code>ButtonDesignProps</code> 가 두 갈래 유니온이고{" "}
          <code>text</code> 쪽은 <code>shape?: never</code> 다. 런타임에
          무시하는 대신 컴파일에서 막는다.
        </p>
      </DesignNote>

      <h2>아이콘</h2>
      <p>
        <code>icon</code> 으로 라벨 앞에 넣는다. 아이콘 크기는 버튼 크기를
        따라간다. 아이콘만 담으려면{" "}
        <Link href="/components/icon-button">IconButton</Link> 을 쓴다.
      </p>
      <CaseGrid
        columns={3}
        caption="icon × size 3"
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
        <code>isLoading</code> 이면 아이콘 자리에 스피너가 돌고 클릭 · Enter ·
        폼 제출이 막히며 <code>aria-busy</code> 가 붙는다. 색은 바뀌지 않고
        포커스도 남는다.
      </p>
      <div className="doc-note">
        <strong>
          <code>disabled</code> 와 다르다.
        </strong>{" "}
        <code>disabled</code> 는 &ldquo;조건이 맞으면 된다&rdquo;,{" "}
        <code>isLoading</code> 은 &ldquo;지금 처리 중&rdquo; 이다. 둘 다 주면
        색과 커서는 <code>disabled</code> 를 따르고 스피너는 남는다.
      </div>
      <CaseGrid
        columns={4}
        caption="isLoading × variant 4"
        code={`<Button isLoading>저장</Button>`}
      >
        {VARIANTS.map((variant) => (
          <Case key={variant} label={`${variant} + isLoading`}>
            <Button {...asVariant(variant)} color="primary" isLoading>
              저장
            </Button>
          </Case>
        ))}
      </CaseGrid>
      <CaseGrid
        columns={3}
        caption="isLoading 이 다른 것과 겹칠 때"
        code={`<Button disabled isLoading>저장</Button>`}
      >
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
          note="disabled 가 색과 커서를 이긴다"
        >
          <Button disabled isLoading>
            저장
          </Button>
        </Case>
      </CaseGrid>
      <LoadingDemo />

      <DesignNote title="로딩은 어떻게 읽히나">
        <p>
          안내 문구는 버튼 안이 아니라 화면 밖 공용{" "}
          <code>role=&quot;status&quot;</code> 영역에 놓인다. 버튼 <em>안</em>{" "}
          의 live 영역은 보조기술이 &ldquo;내용이 바뀌었다&rdquo; 가 아니라{" "}
          <strong>버튼 이름이 바뀌었다</strong>로 처리해 무시하기 때문이다.
          그래서 폼에서 Enter 로 제출해 포커스가 입력창에 있을 때도 로딩 시작이
          읽힌다.
        </p>
        <p>
          <strong>완료는 알리지 않는다.</strong> 버튼은 결과를 모른다 —{" "}
          <code>isLoading</code> 이 내려간 것이 성공인지 실패인지 알 수 없다.
          결과는 <Link href="/components/toast">Toast</Link> 나 에러 메시지가
          알린다.
        </p>
      </DesignNote>

      <h2>비활성</h2>
      <CaseGrid
        columns={4}
        caption="disabled × variant 4"
        code={`<Button disabled>저장</Button>`}
      >
        {VARIANTS.map((variant) => (
          <Case key={variant} label={`${variant} + disabled`}>
            <Button {...asVariant(variant)} color="primary" disabled>
              저장
            </Button>
          </Case>
        ))}
      </CaseGrid>

      <h2>커스터마이징</h2>
      <p>
        변수 이름은 <strong>컴포넌트 · 옵션 · 속성</strong> 셋으로 끊긴다.
        옵션은 prop 값 그대로다 — <code>size=&quot;large&quot;</code> 면{" "}
        <code>--large-</code>, <code>shape=&quot;round&quot;</code> 면{" "}
        <code>--round-</code> 다. 둥글기는 크기를 따라{" "}
        <code>--large-radius</code> · <code>--medium-radius</code> ·{" "}
        <code>--small-radius</code> 로 나뉜다. 그래서 한 크기만 바꿔도 나머지는
        그대로다.
      </p>
      <Example
        caption="large 만 높이와 둥글기를 바꾼다 — medium 은 그대로다"
        code={`--nui-button--large-height: 4rem;
--nui-button--large-radius: 999px;`}
        style={
          {
            "--nui-button--large-height": "4rem",
            "--nui-button--large-radius": "999px",
          } as React.CSSProperties
        }
      >
        <Button size="large">덮어쓴 large</Button>
        <Button>medium 유지</Button>
      </Example>
      <div className="doc-note">
        <strong>컴포넌트가 다르면 변수 이름도 다르다.</strong>{" "}
        <code>Button</code> 은 <code>--nui-button--</code>,{" "}
        <Link href="/components/icon-button">IconButton</Link> 은{" "}
        <code>--nui-icon-button--</code>,{" "}
        <Link href="/components/button-group">ButtonGroup</Link> 은{" "}
        <code>--nui-button-group--</code> 이다. 하나를 손볼 때 옆이 따라
        움직이지 않는다. <code>ButtonLink</code> 는 <code>Button</code> 과 같은
        변수를 쓴다.
      </div>
      <p>
        색은 컴포넌트별로 열려 있지 않다. 버튼 하나의 색을 바꾸려면{" "}
        <code>className</code> 을, 화면 전체를 바꾸려면{" "}
        <Link href="/brand-colors">브랜드 프리셋</Link>을 쓴다.
      </p>

      <DesignNote title="왜 색만 못 바꾸나">
        <p>
          배경과 글자는 짝이다. 배경만 연하게 바꾸면 글자색은 기본값이 그대로
          남아 대비가 깨지는데,{" "}
          <strong>그 사실이 화면에 드러나지 않는다</strong> — 저시력 사용자만
          겪는다. 치수는 반대다. 바꾸면 바로 보이고 짝도 없다.
        </p>
        <p>
          <code>className</code> 으로 바꾸게 하면 배경과 글자를 같은 자리에 쓰게
          되므로 짝을 놓치기 어렵다. 막는 것이 아니라 짝을 지키는 경로로
          유도한다.
        </p>
      </DesignNote>

      <HookTable group="button" />

      <h2>API</h2>
      <PropsTable of="Button" />
    </>
  );
}

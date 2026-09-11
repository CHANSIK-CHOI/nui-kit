import { ButtonLink } from "@nui-kit/react";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  Case,
  CaseGrid,
  CaseMatrix,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "ButtonLink" };

const COLORS = ["neutral", "quiet", "primary", "secondary", "danger"] as const;
const VARIANTS = ["solid", "soft", "line", "text"] as const;
const SIZES = [
  ["large", "56px"],
  ["medium", "48px"],
  ["small", "40px"],
] as const;

type Variant = (typeof VARIANTS)[number];
const asVariant = (v: Variant) =>
  v === "text" ? ({ variant: "text" } as const) : ({ variant: v } as const);

export default function ButtonLinkPage() {
  return (
    <>
      <GuideHeader title="ButtonLink" named={["ButtonLink"]} subpath="button" />

      <p>
        생김새는 <code>Button</code> 과 같고 누르는 대신 이동한다.{" "}
        <code>href</code> 가 필수다. 부모 폭을 채우고{" "}
        <code>variant=&quot;text&quot;</code> 만 글자 폭이다.
      </p>

      <div className="doc-note">
        <code>next</code> 는 required peer 다. <code>ButtonLink</code> 가{" "}
        <code>next/link</code> 를 쓰고 그것이 배럴로 나가므로, 이 컴포넌트를
        쓰지 않더라도 설치되어 있어야 한다.
      </div>

      <h2>위계</h2>
      <p>
        축은 <code>Button</code> 과 같다 — <code>variant</code> 넷 ×{" "}
        <code>color</code> 넷.
      </p>
      <CaseMatrix
        rows={VARIANTS}
        cols={COLORS}
        caption="variant 4 × color 5 — 20조합"
        code={`<ButtonLink href="/components" color="primary">컴포넌트 목록</ButtonLink>`}
        render={(variant, color) => (
          <div style={{ minWidth: 108 }}>
            <ButtonLink
              href="/components"
              {...asVariant(variant)}
              color={color}
            >
              목록 보기
            </ButtonLink>
          </div>
        )}
      />

      <ExceptionBadges
        items={[{ kind: "contentWidth", target: 'variant="text"' }]}
      />

      <h2>크기와 모양</h2>
      <CaseGrid
        columns={3}
        caption="size — Button 과 같은 세 단계"
        code={`<ButtonLink href="/components" size="small">목록 보기</ButtonLink>`}
      >
        {SIZES.map(([size, px]) => (
          <Case key={size} label={size} note={px}>
            <ButtonLink href="/components" size={size}>
              목록 보기
            </ButtonLink>
          </Case>
        ))}
      </CaseGrid>
      <CaseGrid
        columns={2}
        caption="shape — square(기본) · round"
        code={`<ButtonLink href="/components" shape="round">목록 보기</ButtonLink>`}
      >
        <Case label="square" note="기본">
          <ButtonLink href="/components" color="primary">
            목록 보기
          </ButtonLink>
        </Case>
        <Case label="round" note="양끝이 반원">
          <ButtonLink href="/components" color="primary" shape="round">
            목록 보기
          </ButtonLink>
        </Case>
      </CaseGrid>

      <div className="doc-note">
        <strong>로딩은 없다.</strong> 이동에는 &ldquo;처리 중&rdquo; 이 없다.
        누르면 무언가를 처리해야 하면 <code>Button</code> 이 그 자리다.
      </div>

      <DesignNote title="왜 button 이 아니라 a 인가">
        <p>
          누르는 것은 <code>&lt;button&gt;</code>, 이동하는 것은{" "}
          <code>&lt;a&gt;</code> 다. 생김새가 같아도 요소가 달라야 한다 — 새
          탭으로 열기, 주소 복사, 링크 목록으로 훑기가 전부 요소에 달려 있고,
          스크린리더도 &ldquo;버튼&rdquo; 과 &ldquo;링크&rdquo; 를 다르게
          읽는다.
        </p>
      </DesignNote>

      <h2>커스터마이징</h2>
      <p>
        <code>Button</code> 과 같은 변수를 쓴다. 한 요소만 바꾸려면{" "}
        <code>className</code> 으로 그 요소에만 값을 준다.
      </p>
      <HookTable group="button" />

      <h2>API</h2>
      <PropsTable of="ButtonLink" />
    </>
  );
}

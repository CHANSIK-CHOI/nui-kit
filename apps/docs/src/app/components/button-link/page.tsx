import { ButtonLink } from "@nui-kit/react/next";
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
  ["large", "56px · 글자 18 · 아이콘 24"],
  ["medium", "48px · 글자 16 · 아이콘 20"],
  ["small", "40px · 글자 14 · 아이콘 16"],
] as const;

type Variant = (typeof VARIANTS)[number];
const asVariant = (v: Variant) =>
  v === "text" ? ({ variant: "text" } as const) : ({ variant: v } as const);

export default function ButtonLinkPage() {
  return (
    <>
      <GuideHeader
        title="ButtonLink"
        named={["ButtonLink"]}
        subpath="next"
        subpathOnly
        css="button"
      />

      <ExceptionBadges items={[{ kind: "nextOnly", target: "ButtonLink" }]} />

      <p>
        생김새는 <code>Button</code> 과 같고 누르는 대신 이동한다.{" "}
        <code>href</code> 가 필수다. 부모 폭을 채우고{" "}
        <code>variant=&quot;text&quot;</code> 만 글자 폭이다.
      </p>

      <div className="doc-note">
        <strong>Next.js 전용이다.</strong> <code>next/link</code> 를 쓰므로
        배럴이 아니라 <code>@nui-kit/react/next</code> 에서 가져오고,{" "}
        <code>next</code> 는 이 서브패스를 쓸 때만 설치한다(optional peer). Next
        가 아닌 환경에서 버튼 모양의 링크가 필요하면{" "}
        <code>getButtonClassName</code> 으로 자기 라우터의 Link 에 같은 클래스를
        붙인다.
      </div>
      <pre className="doc-code">
        <code>{`import { getButtonClassName } from "@nui-kit/react";

<Link to="/orders" className={getButtonClassName({ color: "primary" })}>주문 내역</Link>`}</code>
      </pre>

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

import Link from "next/link";
import { Button, Textfield, Switch, IconButton } from "@nui-kit/react";
import { CloseIcon } from "@nui-kit/react/icon";
import { Case, CaseGrid, DesignNote, Example } from "@/components/guide";

export const metadata = { title: "크기와 너비" };

/** SCSS 실측 — packages/ui/src/styles/components/*.scss */
const WIDTHS = [
  {
    kind: "부모 폭을 채운다",
    css: "width: 100%",
    who: "Button · ButtonLink · ButtonGroup · Textfield · Textarea · Search · Password · Select · MultiSelect · Datepicker 계열 · Field · Accordion",
    why: "폼과 블록 요소는 한 줄을 차지하는 것이 기본이다",
  },
  {
    kind: "자기 치수를 갖는다",
    css: "고정",
    who: "IconButton(정사각) · Switch(40×24) · Checkbox · Radio(24×24)",
    why: "내용과 무관하게 크기가 정해져 있다",
  },
  {
    kind: "상한이 있는 폭",
    css: "min(100%, N)",
    who: "Toast(420) · Popup 패널(360 · 480 · 640)",
    why: "떠 있는 것이라 부모가 없다. 넓은 화면에서는 읽기 좋은 폭에서 멈춘다",
  },
  {
    kind: "내용 폭",
    css: "fit-content",
    who: "Tooltip · ButtonGroup.Item(shouldAutoWidth)",
    why: "내용만큼만 넓어진다",
  },
] as const;

const SIZES = [
  ["large", "56px", "화면의 주 행동 하나"],
  ["medium", "48px", "기본"],
  ["small", "40px", "목록 행 안이나 좁은 자리"],
] as const;

export default function SizePage() {
  return (
    <>
      <h1>크기와 너비</h1>

      <h2>모든 컴포넌트가 부모 폭을 채우지는 않는다</h2>
      <p>컴포넌트가 자기 너비를 스스로 정한다. 넷으로 갈린다.</p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>어떻게</th>
              <th>무엇이</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            {WIDTHS.map((w) => (
              <tr key={w.kind}>
                <th scope="row" className="doc-wrap">
                  {w.kind}
                  <br />
                  <code>{w.css}</code>
                </th>
                <td className="doc-wrap">{w.who}</td>
                <td className="doc-wrap">{w.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Example row={false} caption="같은 자리에 놓아도 너비가 다르다">
        <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <Button color="primary">부모 폭을 채운다</Button>
          <Textfield value="입력도 마찬가지다" readOnly />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Switch />
            <IconButton aria-label="닫기" variant="line">
              <CloseIcon />
            </IconButton>
            <span style={{ fontSize: 13 }}>이 둘은 자기 치수를 갖는다</span>
          </div>
        </div>
      </Example>

      <div className="doc-note">
        <strong>
          <code>fullWidth</code> 같은 prop 은 없다.
        </strong>{" "}
        너비를 바꿔야 하면 감싸는 요소에서 정한다 — 배치는 부모의 몫이다.
      </div>

      <div className="doc-note doc-note--warn">
        <code>Button</code> 은 부모를 채우되{" "}
        <strong>120px 아래로는 줄지 않는다.</strong> 좁은 칸에 넣을 때 겹쳐
        보이면 <code>--nui-button--min-width</code> 로 낮춘다.
      </div>

      <h2>크기는 셋이고 기본은 가운데다</h2>
      <p>
        크기 옵션을 갖는 컴포넌트는 전부 <code>large</code> ·{" "}
        <code>medium</code> · <code>small</code> 이고,{" "}
        <strong>
          아무것도 주지 않으면 <code>medium</code>
        </strong>{" "}
        이다.
      </p>
      <CaseGrid
        columns={3}
        caption="size — 위아래로 하나씩 있다"
        code={`<Button size="large">저장</Button>`}
      >
        {SIZES.map(([size, px, use]) => (
          <Case key={size} label={size} note={`${px} · ${use}`}>
            <Button size={size}>저장</Button>
          </Case>
        ))}
      </CaseGrid>

      <div className="doc-note">
        <code>Popup</code> 도 같은 이름을 쓴다 — 값은 360 · 480 · 640px 이다.
      </div>

      <DesignNote title="왜 기본이 가장 큰 것이 아닌가">
        <p>
          <code>size</code> 를 주지 않은 사람은 &ldquo;보통 크기&rdquo; 를
          기대한다. 기본이 가장 크면 아무 생각 없이 놓은 버튼이 화면에서 가장
          커진다.
        </p>
        <p>
          이름도 그 기대를 따른다. <code>small</code> 을 본 사람은 그것이 가장
          작은 것이라고 읽는다 — 그 아래가 또 있으면 이름을 다시 지어야 한다.
        </p>
      </DesignNote>

      <h2>치수는 바꿀 수 있다</h2>
      <p>
        크기마다 변수 이름이 따로 있다. 하나로 두면 값을 넣는 순간 세 크기가
        전부 같아지기 때문이다.
      </p>
      <Example
        caption="large 만 높이를 바꾼다 — medium 은 그대로다"
        style={{ "--nui-button--lg-height": "4rem" } as React.CSSProperties}
      >
        <Button size="large">덮어쓴 large</Button>
        <Button>medium 유지</Button>
      </Example>
      <p>
        변수 전량은 <Link href="/foundations/customizing">커스터마이징</Link> 에
        있다.
      </p>

      <h2>손가락으로 누르는 자리는 44px 이다</h2>
      <p>
        누를 수 있는 것은 <strong>44 × 44px</strong> 을 목표로 한다. 보이는
        크기가 그보다 작아도 누르는 범위는 따로 넓힌다 — 달력 날짜는 36px 로
        보이지만 44px 이 눌린다.
      </p>
      <div className="doc-note">
        채울 수 없는 자리도 있다. 입력 안에 버튼 둘이 8px 로 붙으면 44 를 채웠을
        때 서로 먹으므로 하한인 24px 을 쓴다.
      </div>
    </>
  );
}

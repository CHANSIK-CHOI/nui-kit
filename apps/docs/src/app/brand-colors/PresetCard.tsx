import data from "@/generated/presets.json";

export type Pair = { l: string; d: string; tl?: string; td?: string };
export type Preset = {
  n: number;
  hex: string;
  name: string;
  h: number;
  group: string;
  merged: number;
  isDefault: boolean;
  brand: Pair[];
  gray: Pair[];
  brandAlpha: Pair[];
  grayAlpha: Pair[];
  solid: Pair;
  contrast: Pair;
  ratio: { l: number; d: number };
};

/**
 * 스와치 한 칸. 라이트·다크 두 색을 CSS 변수로 넘기고 CSS 가 갈아끼운다.
 * 두 벌을 다 그리면 엘리먼트가 두 배가 되고, 그만큼 페이지가 무거워진다.
 */
function Swatch({ c, label, marked }: { c: Pair; label: string; marked?: boolean }) {
  return (
    <i
      className={marked ? "preset-swatch preset-swatch--mark" : "preset-swatch"}
      style={{
        ["--l" as string]: c.l,
        ["--d" as string]: c.d,
        ["--tl" as string]: c.tl ?? "#fff",
        ["--td" as string]: c.td ?? "#fff",
      }}
    >
      {label}
    </i>
  );
}

function Scale({
  colors,
  labels,
  mark,
}: {
  colors: Pair[];
  labels: (number | string)[];
  /** 이 번호 칸에 표식을 단다. 9번이 고른 색 자리다. */
  mark?: number;
}) {
  return (
    <div className="preset-scale">
      {colors.map((c, i) => (
        <Swatch key={i} c={c} label={String(labels[i])} marked={labels[i] === mark} />
      ))}
    </div>
  );
}

export function PresetCard({ p }: { p: Preset }) {
  return (
    <article className="preset-card" id={`p${p.n}`}>
      <header className="preset-head">
        {/* 고른 색 그 자체. 아래 12칸은 여기서 만들어진 결과다 */}
        <span className="preset-seed" style={{ background: p.hex }} />
        <span className="preset-n">{p.n}</span>
        <strong className="preset-name">{p.name}</strong>
        <code className="preset-hex">{p.hex}</code>
        {p.isDefault && <span className="preset-badge">지금 기본값</span>}
        {/* 고른 색이 9번에 그대로 앉지 못한 경우에만 알린다 */}
        {p.hex.toLowerCase() !== p.solid.l.toLowerCase() && (
          <span
            className="preset-adjusted"
            title="9번은 버튼처럼 색으로 꽉 찬 면의 배경이다. 너무 밝으면 그 위에 흰 글자도 검은 글자도 읽히지 않아 어둡게 낮춘다."
          >
            밝아서 <code>{p.solid.l}</code> 로 낮춤
          </span>
        )}
        <span className="preset-hue">{p.h}°</span>
      </header>

      {/* 실제로 나오는 색은 9번 자리다 — 테두리로 표시한다 */}
      <Scale colors={p.brand} labels={data.steps} mark={9} />

      <pre className="preset-cmd">
        <code>npm run color:generate -- --preset {p.n}</code>
      </pre>

      <details className="preset-more">
        <summary>회색 · 반투명 · 글자색 보기</summary>
        <div className="preset-more-body">
          <p className="preset-label">
            회색 <span>브랜드의 색깔을 물려받되 선명함을 거의 0으로 둔다</span>
          </p>
          <Scale colors={p.gray} labels={data.steps} />

          <p className="preset-label">
            반투명 <span>포커스 링과 구분선에 쓴다</span>
          </p>
          <div className="preset-alpha-row">
            <Scale colors={p.brandAlpha} labels={data.alpha.brand.map((s) => `a${s}`)} />
            <Scale colors={p.grayAlpha} labels={data.alpha.gray.map((s) => `a${s}`)} />
          </div>

          <p className="preset-label">
            글자색 <span>9번 배경 위에 얹는 색</span>
          </p>
          <div className="preset-contrast">
            <span
              className="preset-chip"
              style={{
                ["--l" as string]: p.solid.l,
                ["--d" as string]: p.solid.d,
                ["--fl" as string]: p.contrast.l,
                ["--fd" as string]: p.contrast.d,
              }}
            >
              가나다 Abc 123
            </span>
            <span className="preset-ratio">
              대비 <b>{p.ratio.l}:1</b> · 다크 <b>{p.ratio.d}:1</b>
            </span>
          </div>
        </div>
      </details>
    </article>
  );
}

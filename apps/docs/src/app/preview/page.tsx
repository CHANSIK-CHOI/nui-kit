// ⚠️ 1단계 스타일 검증용 임시 페이지.
//    실제 React 컴포넌트는 2단계에서 이전하며, 이 페이지는 4단계에서 문서 페이지로 대체된다.
//    여기서는 CSS 만 검증하므로 의도적으로 raw markup 을 사용한다.
import type { CSSProperties, ReactNode } from "react";

export const metadata = { title: "Style Preview" };

const row: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "1.5rem",
};

const h2: CSSProperties = {
  fontSize: "var(--nui-font-size-body)",
  marginTop: "2rem",
  marginBottom: "0.5rem",
};

function Btn({
  children,
  className = "",
  disabled,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`nui-button ${className}`}
      disabled={disabled}
    >
      <span className="nui-button__wrap">{children}</span>
    </button>
  );
}

function Input({
  id,
  placeholder,
  defaultValue,
  unit,
}: {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  unit?: string;
}) {
  return (
    <div className="nui-textfield__wrap">
      <div className="nui-textfield__input-box">
        <input
          id={id}
          className="nui-textfield__input"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </div>
      <div className="nui-textfield__actions">
        {unit ? <span className="nui-textfield__unit">{unit}</span> : null}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: 880, margin: "0 auto" }}>
      <h1 style={{ fontSize: "var(--nui-font-size-title)" }}>
        1단계 스타일 검증
      </h1>

      <h2 style={h2}>Button — color</h2>
      <div style={row}>
        <Btn>black</Btn>
        <Btn className="nui-button--primary">primary</Btn>
        <Btn className="nui-button--secondary">secondary</Btn>
        <Btn className="nui-button--point">point</Btn>
      </div>

      <h2 style={h2}>Button — variant / size / disabled</h2>
      <div style={row}>
        <Btn className="nui-button--line nui-button--primary">line</Btn>
        <Btn className="nui-button--text">text</Btn>
        <Btn className="nui-button--round nui-button--primary">round</Btn>
        <Btn className="nui-button--small">small</Btn>
        <Btn className="nui-button--medium">medium</Btn>
        <Btn disabled>disabled</Btn>
      </div>

      <h2 style={h2}>
        커스터마이징 훅 — --nui-button-bg 는 기본 버튼만, variant 는 자기 훅을
        따름
      </h2>
      <div
        style={
          {
            ...row,
            "--nui-button-bg": "#6d28d9",
            "--nui-button-radius": "999px",
          } as CSSProperties
        }
      >
        <Btn>훅으로 덮어쓴 버튼</Btn>
        <Btn className="nui-button--primary">primary 는 영향 없음</Btn>
      </div>

      <h2 style={h2}>Field + Textfield</h2>
      <div className="nui-field nui-field--column" style={{ marginBottom: 24 }}>
        <label className="nui-field__label" htmlFor="pv-1">
          이름
        </label>
        <div className="nui-textfield">
          <Input id="pv-1" placeholder="내용을 입력해주세요" />
        </div>
        <p className="nui-field__description">설명 텍스트입니다.</p>
      </div>

      <div className="nui-field nui-field--column">
        <label className="nui-field__label" htmlFor="pv-2">
          에러 상태
        </label>
        <div className="nui-textfield nui-is-error">
          <Input id="pv-2" defaultValue="잘못된 값" unit="원" />
          <div className="nui-message">
            <span className="nui-message__msg nui-message__msg--error">
              에러 메시지입니다.
            </span>
          </div>
        </div>
      </div>

      <div className="nui-field nui-field--column" style={{ marginTop: 24 }}>
        <label className="nui-field__label" htmlFor="pv-3">
          disabled / readonly
        </label>
        <div className="nui-textfield nui-is-disabled">
          <Input id="pv-3" placeholder="disabled" />
        </div>
        <div className="nui-textfield nui-is-readonly">
          <Input placeholder="readonly" />
        </div>
      </div>

      <h2 style={h2}>Field.Grid (데스크톱 2열)</h2>
      <div className="nui-field__grid">
        <div className="nui-textfield">
          <Input placeholder="좌측" />
        </div>
        <div className="nui-textfield">
          <Input placeholder="우측" />
        </div>
      </div>

      <h2 style={h2}>ButtonGroup</h2>
      <div className="nui-button-group">
        <div className="nui-button-group__wrap">
          <div className="nui-button-group__item">
            <Btn className="nui-button--line">취소</Btn>
          </div>
          <div className="nui-button-group__item">
            <Btn className="nui-button--primary">확인</Btn>
          </div>
        </div>
      </div>
    </main>
  );
}

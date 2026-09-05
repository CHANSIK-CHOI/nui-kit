import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "아이콘" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

/** 실제 컴포넌트가 어느 크기를 쓰는지 — 코드에서 확인한 현행이다. */
const USAGE: [string, string, string][] = [
  ["md", "14px", "Select 태그 제거(×) 버튼"],
  [
    "lg",
    "16px",
    "Button small 의 아이콘 · Datepicker 이전/다음 · Accordion 화살표 · Message 아이콘",
  ],
  ["2xl", "20px", "Button 기본 크기의 아이콘 · Switch 썸"],
  ["3xl", "24px", "Textfield 안 아이콘 · Select 드롭다운 표시"],
];

export default function IconPage() {
  const icons = (DATA.size ?? []).filter((t) =>
    t.name.startsWith("--nui-size-icon"),
  );

  return (
    <>
      <h1>아이콘</h1>
      <p className="doc-lead">
        아이콘을 얼마나 크게 그리고 스크린리더에 어떻게 읽히게 할지 정한다.
      </p>

      <h2>크기</h2>
      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 28, alignItems: "flex-end" }}
        >
          {icons.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "block",
                  width: `var(${token.name})`,
                  height: `var(${token.name})`,
                  background: "var(--nui-color-brand-9)",
                  borderRadius: "var(--nui-radius-1)",
                  marginInline: "auto",
                  marginBottom: 8,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-size-icon-", "")}
              </span>
              <br />
              <span className="doc-token-name">{token.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p>
        값이 14 · 16 · 20 · 24px 로 등간격이 아니다. 값이 불규칙해서 숫자가
        아니라 역할 이름을 쓴다(
        <Link href="/foundations/tokens">디자인 토큰</Link>). <code>xl</code> 은
        쓰이지 않아서 만들지 않았다.
      </p>
      <div className="doc-note">
        <strong>점과 표시는 아이콘이 아니다.</strong> 라디오 점(8) · 체크
        표시(6×10) · 토스트 표시점(10) · 툴팁 화살표(10)는{" "}
        <code>size-dot-xs / sm / md</code> 다. 10px 아이콘은 하나도 없었다.
      </div>

      <h2>어느 크기를 고르나</h2>
      <p>
        <strong>아이콘은 나란히 놓인 글자보다 한 단계 크다.</strong> 같은 크기로
        맞추면 아이콘이 글자보다 작아 보인다. 글자는 획이 촘촘하고 아이콘은 비어
        있기 때문이다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>같이 놓이는 글자</th>
              <th>아이콘</th>
              <th>예</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="doc-wrap">
                <code>font-size-4</code> (16px) — 액션 라벨 · 입력값
              </td>
              <td>
                <span className="doc-token-name">size-icon-2xl</span> 20px
              </td>
              <td className="doc-wrap">Button 기본</td>
            </tr>
            <tr>
              <td className="doc-wrap">
                <code>font-size-3</code> (14px) — 보조 텍스트
              </td>
              <td>
                <span className="doc-token-name">size-icon-lg</span> 16px
              </td>
              <td className="doc-wrap">Button small · Datepicker 이전/다음</td>
            </tr>
            <tr>
              <td className="doc-wrap">
                <code>font-size-1</code> (12px) — 캡션 · 메시지
              </td>
              <td>
                <span className="doc-token-name">size-icon-lg</span> 16px
              </td>
              <td className="doc-wrap">에러 메시지 앞 아이콘</td>
            </tr>
            <tr>
              <td className="doc-wrap">
                <strong>글자 없이 단독</strong>
              </td>
              <td>
                <span className="doc-token-name">size-icon-3xl</span> 24px
              </td>
              <td className="doc-wrap">Textfield 안 아이콘 · Select 화살표</td>
            </tr>
            <tr>
              <td className="doc-wrap">
                <strong>태그 제거</strong>
              </td>
              <td>
                <span className="doc-token-name">size-icon-md</span> 14px
              </td>
              <td className="doc-wrap">MultiSelect 태그의 × 버튼</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>현재 쓰이는 곳 전부</h3>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>토큰</th>
              <th>값</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            {USAGE.map(([name, value, where]) => (
              <tr key={name}>
                <th scope="row">
                  <span className="doc-token-name">size-icon-{name}</span>
                </th>
                <td>{value}</td>
                <td className="doc-wrap">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>보이는 크기와 누를 수 있는 크기는 다르다</h2>
      <div className="doc-note doc-note--warn">
        <strong>아이콘이 16px 이어도 누르는 범위는 따로 정한다.</strong> 팝업
        닫기와 달력의 이전/다음·날짜는 가상요소로 44px 을 누르고, 입력 안 보조
        버튼은 둘이 붙어 있어 하한 24px 에 둔다. 자리별 결정은{" "}
        <Link href="/foundations/accessibility">접근성</Link> 문서에 있다.
      </div>

      <h2>읽히는 아이콘과 읽히지 않는 아이콘</h2>
      <p>
        <code>Icon</code> 은 <code>title</code> 이 있는지로 갈린다. 이것이
        유일한 스위치다.
      </p>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th />
              <th>장식용</th>
              <th>의미를 가진 것</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">언제</th>
              <td className="doc-wrap">
                옆에 글자가 있어 아이콘이 없어도 뜻이 통한다
              </td>
              <td className="doc-wrap">아이콘만으로 뜻을 전달한다</td>
            </tr>
            <tr>
              <th scope="row">쓰는 법</th>
              <td className="doc-wrap">
                <code>title</code> 을 주지 않는다
              </td>
              <td className="doc-wrap">
                <code>title</code> 을 준다
              </td>
            </tr>
            <tr>
              <th scope="row">결과</th>
              <td className="doc-wrap">
                <code>aria-hidden</code> — 스크린리더가 건너뛴다
              </td>
              <td className="doc-wrap">
                <code>role=&quot;img&quot;</code> + <code>&lt;title&gt;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre className="doc-code">
        <code>{`{/* 장식용 — 옆의 "삭제" 가 이미 뜻을 전한다 */}
<Button icon={<DelIcon />}>삭제</Button>

{/* 아이콘만 있는 버튼 — 접근 이름은 버튼이 갖는다 */}
<IconButton aria-label="삭제">
  <DelIcon />
</IconButton>`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>접근 이름을 두 번 주지 않는다.</strong> 아이콘 전용 버튼에서는
        버튼에 이름을 주고 아이콘은 장식으로 둔다. 둘 다 주면 스크린리더가 같은
        말을 두 번 읽는다.
      </div>

      <h2>아이콘 세트</h2>
      <p>
        아이콘은 <code>lucide-react</code> 다. 24px 격자에 stroke 2 인 line
        아이콘이고, 크기에 비례해 선이 가늘어진다. 컴포넌트가 쓰는 일곱
        개(지우기 · 검색 · 비밀번호 보기/숨기기 · 닫기 · 달력 · 주의)는{" "}
        <code>@nui-kit/react/icon</code> 에서 가져온다. Select 의 화살표와
        지우기, Datepicker 의 이전/다음, Accordion 의 화살표도 같은 세트다.
      </p>
      <p>
        직접 넣을 아이콘은 <code>lucide-react</code> 에서 바로 가져온다.{" "}
        <code>size</code> 에 14 · 16 · 20 · 24 를 주면 위 표와 같은 자리에
        놓인다. 라이브러리가 쓰는 세트와 같아 선 굵기가 섞이지 않는다.
      </p>
      <pre className="doc-code">
        <code>{`import { Trash2 } from "lucide-react";

<Button icon={<Trash2 size={20} />}>삭제</Button>`}</code>
      </pre>
      <p>
        직접 만든 SVG 를 쓸 때는 <code>Icon</code> 으로 감싸면 크기·색·접근성
        처리가 함께 따라온다.
      </p>

      <h2>토큰</h2>
      <TokenTable group="size" only="size-icon" swatch={false} />
    </>
  );
}

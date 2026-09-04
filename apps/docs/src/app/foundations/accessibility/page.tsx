import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "접근성" };

/**
 * 실측치다. `npm run verify:a11y` 가 문서 사이트에서 getComputedStyle 로 재고
 * WCAG 2.1 공식으로 계산한다. 손으로 적은 값이 아니다. 2026-09-03 측정.
 */
const CONTRAST: [string, string, string, string][] = [
  ["기본 버튼 라벨", "16.17:1", "15.21:1", "4.5"],
  ["primary 버튼 라벨", "5.30:1", "5.30:1", "4.5"],
  ["비활성 버튼 라벨", "2.96:1", "3.12:1", "2.0 (하한)"],
  ["입력 글자", "16.17:1", "15.21:1", "4.5"],
  ["에러 메시지", "5.11:1", "8.00:1", "4.5"],
  ["Tooltip · Toast 글자", "16.49:1", "16.24:1", "4.5"],
];

export default function AccessibilityPage() {
  return (
    <>
      <h1>접근성</h1>
      <p className="doc-lead">
        컴포넌트가 이미 보장하는 것과 직접 챙겨야 하는 것을 정한다.
      </p>

      <div className="doc-note">
        <strong>
          컴포넌트 라이브러리의 접근성은 쓰는 쪽에서 고칠 수 없다.
        </strong>{" "}
        포커스 링이 없거나 대비가 모자라면 CSS 로 덮기 전에는 그대로 나간다.
        그래서 라이브러리가 보장하고 기계로 검사한다.
      </div>

      <h2>명도 대비</h2>
      <p>
        기준은 WCAG 2.1 AA 인 4.5:1 이다. 비활성은 요구에서 빠지지만 2.0:1
        아래로는 두지 않는다. 아래는 계산값이 아니라 실제 렌더된 화면에서
        라이트·다크 두 테마로 잰 값이다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>대상</th>
              <th>라이트</th>
              <th>다크</th>
              <th>기준</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map(([target, light, dark, min]) => (
              <tr key={target}>
                <th scope="row" className="doc-wrap">
                  {target}
                </th>
                <td>
                  <strong>{light}</strong>
                </td>
                <td>
                  <strong>{dark}</strong>
                </td>
                <td className="doc-wrap">{min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <code>npm run verify:a11y</code> 가 브라우저에서 두 테마의 값을 다시
        재고 기준에 미달하면 실패시킨다. 터치 영역도 같이 잰다. 박스가 아니라
        실제로 눌리는 범위를 재고, 24px 미만은 실패, 이유 없는 44px 미만은
        경고다.
      </p>
      <div className="doc-note">
        <strong>다크가 이 검사를 만들었다.</strong> 토스트·툴팁의 반전 표면이
        다크에서 밝아지는데 글자는 흰색으로 남아 대비가 1.16:1 이었다. 라이트만
        재고 있어서 아무도 몰랐다.
      </div>

      <div className="doc-note doc-note--warn">
        <strong>색을 바꾸면 이 보장이 깨질 수 있다.</strong> 배경만 바꾸고
        글자색을 그대로 두면 대비가 무너진다. 무너진 대비는 화면에 드러나지
        않는다. 컴포넌트별 색 변수를 두지 않은 이유다(
        <Link href="/foundations/color#change">색</Link>).
      </div>

      <p>
        <strong>색만으로 정보를 전달하지 않는다.</strong> 에러는 빨간 테두리에
        더해 아이콘과 텍스트를 함께 준다. 색각 이상 사용자에게 빨강과 초록은
        구분되지 않는다.
      </p>

      <h2>터치 영역</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>기준</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">권장</th>
              <td>
                <strong>44 × 44px</strong>{" "}
                <span className="doc-token-name">
                  --nui-size-control-option
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                디자인 제약으로 44px 이 어려울 때의 하한
              </th>
              <td>24 × 24px</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>보이는 크기와 누를 수 있는 크기는 다르다.</strong> 아이콘이 16px
        이어도 누르는 범위는 따로 넓힐 수 있다. 가상요소로 가운데 정렬된 44px
        정사각형을 깔면 모양은 그대로인 채 히트만 커진다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>자리</th>
              <th>보이는 크기</th>
              <th>누르는 크기</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Popup 닫기</td>
              <td>40px</td>
              <td>
                <strong>44px</strong>
              </td>
              <td className="doc-wrap">가상요소로 넓혔다</td>
            </tr>
            <tr>
              <td>Datepicker 이전/다음</td>
              <td>32px</td>
              <td>
                <strong>44px</strong>
              </td>
              <td className="doc-wrap">
                가상요소로 넓히고 두 버튼 사이를 12px 로 뒀다. 4px 이면 두
                히트가 겹친다
              </td>
            </tr>
            <tr>
              <td>Datepicker 날짜</td>
              <td>36px</td>
              <td>
                <strong>44px</strong>
              </td>
              <td className="doc-wrap">
                격자라 셀이 히트의 상한이다. 셀을 44px 로 두고 버튼의 히트가
                셀을 채운다. <code>--nui-datepicker--day-size</code> 로 줄일 수
                있다
              </td>
            </tr>
            <tr>
              <td className="doc-wrap">
                Textfield 지우기 · Password 토글 · Search · 달력 열기 · Select
                화살표·지우기
              </td>
              <td>24px</td>
              <td>24px (하한)</td>
              <td className="doc-wrap">
                입력 안에 버튼 둘이 8px 로 붙는다. 44 를 채우면 서로 겹쳐 38 이
                상한이라 하한을 쓴다
              </td>
            </tr>
            <tr>
              <td>MultiSelect 칩 ×</td>
              <td>28×32px</td>
              <td>28×32px (하한)</td>
              <td className="doc-wrap">
                칩이 서로 붙어 있어 44 를 채우면 이웃 칩의 히트를 삼킨다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>선택 컨트롤은 예외가 필요하다.</strong> Checkbox 와 Radio 는
        24px, Switch 는 40×24 라 컨트롤 자체가 44px 보다 작다. 그래서 보이지
        않는 input 을 44×44 로 키워 두었다. 라벨 없이 단독으로 써도 누르는
        범위는 44 다.
      </div>

      <h2>포커스</h2>
      <p>
        키보드로 이동할 때 지금 위치를 알리는 표시다.{" "}
        <code>:focus-visible</code> 로만 그려서 마우스로 눌렀을 때는 나타나지
        않는다.
      </p>

      <h3>크기는 컨트롤 높이로 고른다</h3>
      <p>작은 컨트롤일수록 같은 굵기의 링이 더 두꺼워 보이기 때문이다.</p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>컨트롤</th>
              <th>토큰</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">36px 이하</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-sm</span>
              </td>
              <td className="doc-wrap">달력 날짜 칸(36), 년/월 셀렉트(36)</td>
            </tr>
            <tr>
              <th scope="row">36px 초과</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring</span>
              </td>
              <td className="doc-wrap">Textfield · Select · Datepicker 입력</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                선택 컨트롤
              </th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-strong</span>
              </td>
              <td className="doc-wrap">
                Checkbox · Radio · Switch. 작지만 강조가 필요하다
              </td>
            </tr>
            <tr>
              <th scope="row">error</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-error</span>
              </td>
              <td className="doc-wrap">크기 규칙과 무관하게 에러면 이것</td>
            </tr>
          </tbody>
        </table>
      </div>
      <TokenTable group="focus" />

      <h3>수단은 테두리가 있느냐로 갈린다</h3>
      <p>
        테두리를 가진 것(입력 컨트롤 · 선택 컨트롤 · 날짜 칸)은 테두리를 포커스
        색으로 바꾸고 위 표의 링을 더한다. 테두리 없이 누르는 것(Button ·
        IconButton · 닫기 버튼 · Accordion 헤더)은 <code>outline</code> 하나만
        그린다. 링을 겹치지 않는다. offset 은 <code>--nui-focus-offset</code>{" "}
        토큰이다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-focus-width</code> 에는 컴포넌트별 변수를 두지 않았다.
        </strong>{" "}
        치수인데도 막은 유일한 값이다. 얇아지면 키보드로 쓰는 사람만 영향을 받고
        마우스로 확인하는 사람은 알아채지 못한다. 색과 같은 성격이다.
      </div>

      <p>
        <code>outline: none</code> 을 쓸 때는 대체 표시를 반드시 준다. 포커스
        표시를 없애면 키보드 사용자는 자기 위치를 잃는다.
      </p>

      <h2>모션 줄이기</h2>
      <p>
        OS 에서 동작 줄이기를 켜면 <code>prefers-reduced-motion: reduce</code>{" "}
        가 전달되고 모든 <code>--nui-duration-*</code> 이 1ms 가 된다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>시간을 하드코딩하면 이 장치를 우회한다.</strong>{" "}
        <code>transition: 0.2s</code> 라고 쓰면 설정을 켠 사용자에게도 그대로
        움직인다. 자세한 것은 <Link href="/foundations/motion">모션</Link>{" "}
        문서에 있다.
      </div>
      <p>
        2초 넘게 이어지는 애니메이션은 두지 않는다. 로딩 표시처럼 불가피하면
        멈출 수 있어야 한다. 초당 3회 넘게 점멸하지 않는다 — 광과민성 발작
        기준이다.
      </p>

      <h2>메시지가 나타났다는 사실을 알린다</h2>
      <p>
        <code>aria-describedby</code> 는 포커스가 그 컨트롤로 갔을 때 읽힌다. 폼
        검증 실패처럼 사용자 조작 없이 메시지가 생기는 경우에는 포커스가
        이동하지 않아 스크린리더가 침묵한다.
      </p>
      <p>
        그래서 에러 메시지 컨테이너에 <code>aria-live=&quot;polite&quot;</code>{" "}
        를 함께 건다. 둘 다 필요하다. <code>describedby</code> 는 이 필드의
        설명이고 <code>live</code> 는 지금 바뀌었다는 신호다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>live 영역은 요소 밖에 둔다.</strong>{" "}
        <code>&lt;button&gt;</code> 안의 live 영역은 보조기술이 &quot;live
        갱신&quot;이 아니라 <strong>버튼 이름의 변경</strong>으로 처리해 대체로
        무시한다. 그래서 <code>Button</code> 의 로딩 안내는 화면 밖 공용{" "}
        <code>role=&quot;status&quot;</code> 영역에 놓인다. 그 영역은{" "}
        <strong>문구가 생기기 전에</strong> 문서에 있어야 읽힌다.
        <br />
        <strong>완료를 함부로 알리지 않는다.</strong> 로딩이 끝난 것이 성공인지
        실패인지 컴포넌트는 모른다 — 결과 알림은 <code>Toast</code> 나 에러
        메시지 몫이다.
      </div>
      <p>
        이 영역은 메시지가 없어도 DOM 에 있다. 내용과 함께 새로 끼워 넣은 live
        영역은 읽히지 않는 경우가 많아서다. 빈 상태는 시각적으로만 숨긴다.
      </p>

      <h2>자동 완성</h2>
      <p>
        개인정보를 받는 입력에는 <code>autoComplete</code> 로 용도를 지정한다 —
        이름 · 이메일 · 전화 · 주소 · 생년월일. WCAG 1.3.5(Identify Input
        Purpose)와 KRDS 가 요구하는 것이고, 손 떨림 · 인지 장애 · 모바일
        사용자에게는 실질적인 입력 보조다.
      </p>
      <div className="doc-note">
        <strong>컴포넌트가 이것을 기본값으로 막지 않는다.</strong>{" "}
        <code>Textfield</code> 와 <code>Textarea</code> 가{" "}
        <code>autoComplete=&quot;off&quot;</code> 를 기본으로 넣고 있었고 뺐다.
        소비자가 알아채려면 라이브러리 소스를 읽어야 하는 종류의 기본값이었다.
        끄는 것은 소비자가 명시한다.
      </div>

      <h2>이미 보장하는 것</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>어떻게</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                라벨과 입력의 연결
              </th>
              <td className="doc-wrap">
                <code>Field</code> 가 <code>useId()</code> 로 만든 id 를 라벨과
                컨트롤이 함께 쓴다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                설명·에러 연결
              </th>
              <td className="doc-wrap">
                여러 개여도 <code>aria-describedby</code> 로 중복 없이 합친다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                에러 표시
              </th>
              <td className="doc-wrap">
                <code>aria-invalid</code> + 아이콘 + 텍스트 +{" "}
                <code>aria-live</code>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                아이콘 전용 버튼
              </th>
              <td className="doc-wrap">sr-only 텍스트로 접근 이름을 준다</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                그룹 컨트롤
              </th>
              <td className="doc-wrap">
                <code>fieldset</code> + <code>legend</code> 또는{" "}
                <code>role=&quot;group&quot;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>직접 챙겨야 하는 것</h2>
      <ul>
        <li>
          <code>IconButton</code> 에 <code>aria-label</code> 을 준다. 없으면
          스크린리더가 읽을 것이 없다
        </li>
        <li>placeholder 를 라벨 대신 쓰지 않는다. 입력을 시작하면 사라진다</li>
        <li>
          라이브러리가 정한 기본 문자열은 prop 으로 바꾼다. 지우기 버튼(
          <code>clearButtonTitle</code>), Password 토글, Accordion 토글(
          <code>toggleLabel</code>), Popup 닫기, Datepicker 의 요일 이름,
          Confirm 의 버튼 문구가 여기 해당한다. 다국어 앱이면 교체한다
        </li>
        <li>
          번역하면 라벨이 최대 2.5배까지 늘어난다. 자기 치수를 갖는
          컨트롤(Switch · Checkbox) 옆의 긴 라벨이 컨트롤을 찌그러뜨리지 않는지
          확인한다
        </li>
      </ul>
    </>
  );
}

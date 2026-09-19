import Link from "next/link";
import { DesignNote } from "@/components/guide";

export const metadata = { title: "API 일관성" };

/** 실측 — apps/docs/src/generated/props.json */
const NAMES = [
  {
    concept: "크기",
    name: '"large" | "medium" | "small"',
    where: "Button · IconButton · ButtonLink · LayerPopup",
    note: "기본은 medium",
  },
  {
    concept: "화면에 보이는 문구",
    name: "*Label",
    where:
      "confirmLabel · closeLabel · loadingLabel · calendarLabel · requiredLabel",
    note: "전부 바꿀 수 있다",
  },
  {
    concept: "닫아 달라는 요청",
    name: "onRequestClose",
    where: "LayerPopup · BottomSheet · FullPopup · Toast",
    note: "딤 · Escape · 닫기 버튼이 모두 이것을 부른다",
  },
  {
    concept: "열림이 바뀜",
    name: "onOpenChange(next)",
    where: "Tooltip",
    note: "열림도 닫힘도 관찰한다",
  },
  {
    concept: "잘림에서 벗어남",
    name: "hasPortal",
    where: "Tooltip · Datepicker 계열 · Select 계열",
    note: "켜면 body 로 나가 잘리지 않는다. 기본은 제자리다",
  },
  {
    concept: "값을 가진 입력",
    name: "value + onChange",
    where: "Textfield · Textarea · Select · Datepicker 계열",
    note: "값은 쓰는 쪽이 소유한다",
  },
] as const;

const BOOLS = [
  ["is*", "상태다", "isLoading · isError · isClearable · isSearchable"],
  ["has*", "부품이 있다", "hasPortal · hasCloseButton · hasConfirmButton"],
  [
    "should*",
    "그렇게 동작한다",
    "shouldCloseOnEscape · shouldAutoWidth · shouldKeepMounted",
  ],
  ["그대로", "HTML 속성", "disabled · readOnly · required · open"],
] as const;

export default function ApiPage() {
  return (
    <>
      <h1>API 일관성</h1>

      <p>
        하나를 익히면 나머지를 짐작할 수 있게 이름을 맞췄다. 같은 개념에는 같은
        이름을 쓴다.
      </p>

      <h2>같은 개념, 같은 이름</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>개념</th>
              <th>이름</th>
              <th>어디에</th>
            </tr>
          </thead>
          <tbody>
            {NAMES.map((n) => (
              <tr key={n.concept}>
                <th scope="row" className="doc-wrap">
                  {n.concept}
                </th>
                <td className="doc-wrap">
                  <code>{n.name}</code>
                  <br />
                  <span className="doc-case__note">{n.note}</span>
                </td>
                <td className="doc-wrap">{n.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>감싼 라이브러리의 prop 은 이름을 바꾸지 않는다</h2>
      <p>
        <code>Select</code> 는 <code>react-select</code> 을,{" "}
        <code>Datepicker</code> 는 <code>react-day-picker</code> 를 감싼다. 그
        라이브러리에만 있는 prop 은 원래 이름 그대로 받는다 — 원본 문서에서 읽은
        것을 그대로 넘길 수 있다.
      </p>
      <pre className="doc-code">
        <code>{`<Select menuPlacement="auto" maxMenuHeight={480} filterOption={fn} />`}</code>
      </pre>
      <div className="doc-note">
        <strong>여러 컴포넌트에 걸치는 개념은 반대다.</strong>{" "}
        <code>disabled</code> · <code>readOnly</code> · <code>size</code> ·{" "}
        <code>isError</code> 는 어느 컴포넌트에서나 같은 이름이다.{" "}
        <code>react-select</code> 은 <code>isDisabled</code> 라고 부르지만
        여기서는 <code>disabled</code> 다.
      </div>

      <h2>참 · 거짓 prop 은 접두어로 뜻을 밝힌다</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>접두어</th>
              <th>뜻</th>
              <th>예</th>
            </tr>
          </thead>
          <tbody>
            {BOOLS.map(([prefix, meaning, ex]) => (
              <tr key={prefix}>
                <th scope="row">
                  <code>{prefix}</code>
                </th>
                <td className="doc-wrap">{meaning}</td>
                <td className="doc-wrap">
                  <code>{ex}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>값은 쓰는 쪽이 소유한다</h2>
      <p>
        값을 갖는 입력은 전부 <code>value</code> 와 <code>onChange</code> 를
        받는다. 컴포넌트가 값을 몰래 들고 있지 않으므로{" "}
        <code>defaultValue</code> 는 없다.
      </p>
      <pre className="doc-code">
        <code>{`const [name, setName] = useState("");

<Textfield value={name} onChange={(e) => setName(e.target.value)} />`}</code>
      </pre>
      <div className="doc-note">
        <strong>체크형은 다르다.</strong> <code>Checkbox</code> ·{" "}
        <code>Radio</code> · <code>Switch</code> 는 <code>defaultChecked</code>{" "}
        를 받는다 — 네이티브 input 에 그대로 넘길 뿐이라 값이 두 곳으로 갈리지
        않는다.
      </div>
      <p>
        <code>react-hook-form</code> 을 쓴다면 값 소유는 래퍼가 가져간다.
      </p>
      <pre className="doc-code">
        <code>{`import { RHFTextfield } from "@nui-kit/react/rhf";

<RHFTextfield control={control} name="email" />`}</code>
      </pre>

      <h2>접근 이름은 타입이 요구한다</h2>
      <p>
        스크린리더가 읽을 이름이 없으면 <strong>컴파일이 막는다.</strong> 화면만
        보고 개발하면 빠뜨리기 쉬운 자리라서다.
      </p>
      <pre className="doc-code">
        <code>{`// ❌ 타입 에러 — 아이콘에는 읽을 글자가 없다
<IconButton><CloseIcon /></IconButton>

// ✅ 둘 중 하나를 준다
<IconButton aria-label="닫기"><CloseIcon /></IconButton>
<IconButton aria-labelledby={titleId}><CloseIcon /></IconButton>`}</code>
      </pre>
      <p>
        팝업 다섯도 같다 — <code>title</code> 이나 <code>dialogLabel</code> 중
        하나가 없으면 타입 에러다.
      </p>

      <h2>여는 방법이 둘인 것</h2>
      <p>
        토스트는 <strong>선언형</strong>과 <strong>명령형</strong>을 다
        지원한다. 팝업은 훅으로만 연다. 앱 루트의 <code>PopupHost</code> 가
        그리고, 열려 있는 동안 배경 스크롤이 잠긴다.
      </p>
      <pre className="doc-code">
        <code>{`// 토스트 — 상태로도 연다
<Toast open={isOpen} message="저장했어요" onRequestClose={close} />

// 팝업 — 훅으로 연다. 기다렸다가 답을 받는다
const confirm = useConfirm();
if (await confirm.openAsync({ title: "삭제할까요?" })) remove();

// 셸 셋은 컴포넌트를 만들어 등록한다
function SettingsPopup(runtime: LayerPopupComponentProps) {
  return <LayerPopup {...runtime} title="설정">…</LayerPopup>;
}
useLayerPopup().open({ component: SettingsPopup });`}</code>
      </pre>

      <DesignNote title="왜 이름을 맞추는 데 공을 들였나">
        <p>
          컴포넌트 라이브러리에서 가장 자주 하는 일은{" "}
          <strong>문서를 다시 찾아보는 것</strong>이다. 같은 개념이 컴포넌트마다
          다른 이름이면 매번 찾아야 하고, 찾다 지치면 짐작해서 쓰다 틀린다.
        </p>
        <p>
          이름을 바꾸면 쓰는 쪽 코드가 깨지므로 한 번에 모아서 한다. 늦게
          고칠수록 비싸진다.
        </p>
      </DesignNote>

      <p>
        컴포넌트별 props 는 <Link href="/components">Components</Link> 의 각
        페이지에 전량 있다. 타입에서 자동 생성하므로 코드와 어긋나지 않는다.
      </p>
    </>
  );
}

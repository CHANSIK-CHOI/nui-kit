import Link from "next/link";
import { DesignNote } from "@/components/guide";
import { FormDemo } from "./FormDemo";

export const metadata = { title: "폼 만들기" };

/** src/rhf.ts 실측 — 래퍼 12개 */
const WRAPPERS = [
  ["RHFTextfield", "Textfield"],
  ["RHFSearch", "Search"],
  ["RHFPassword", "Password"],
  ["RHFTextarea", "Textarea"],
  ["RHFCheckbox", "Checkbox"],
  ["RHFRadio", "Radio"],
  ["RHFSwitch", "Switch"],
  ["RHFSelect", "Select"],
  ["RHFMultiSelect", "MultiSelect"],
  ["RHFDatepicker", "Datepicker"],
  ["RHFDateRangePicker", "DateRangePicker"],
  ["RHFDateMultiplePicker", "DateMultiplePicker"],
] as const;

export default function FormsPage() {
  return (
    <>
      <h1>폼 만들기</h1>
      <p className="doc-lead">
        컴포넌트 대부분이 폼 부품이다. 낱개로 쓰는 법은 각 페이지에 있고,
        여기서는 묶어서 쓰는 법을 다룬다.
      </p>

      <h2>Field 가 연결을 맡는다</h2>
      <p>
        라벨을 눌러도 입력에 포커스가 가고, 스크린리더가 라벨과 도움말과 에러를
        함께 읽는다. 그 연결을 <code>Field</code> 가 만든다 — id 를 직접 만들어
        붙이지 않아도 된다.
      </p>
      <pre className="doc-code">
        <code>{`<Field infoMessage="본인 확인에만 사용해요">
  <Field.Label>휴대폰 번호</Field.Label>
  <Textfield placeholder="010-0000-0000" />
</Field>`}</code>
      </pre>
      <div className="doc-note doc-note--warn">
        Server Component 에서는 <code>FieldLabel</code> 같은 named export 를
        쓴다 — <Link href="/design-system/isolation">오염시키지 않는다</Link>{" "}
        참조.
      </div>

      <h2>필수와 선택을 표시한다</h2>
      <p>
        <code>required</code> 를 주면 라벨에 점이 붙고 컨트롤에{" "}
        <code>aria-required</code> 가 간다. 점은 눈으로만 보이므로, 스크린리더가
        읽을 문구가 함께 들어간다.
      </p>
      <pre className="doc-code">
        <code>{`<Field required>              // 점 + 화면 밖 "필수"
<Field optionalLabel="선택">   // 문구로 표시`}</code>
      </pre>
      <div className="doc-note">
        <strong>둘을 섞지 않는다.</strong> 한 화면에서 필수가 대부분이면
        「선택」만 표시하고, 그렇지 않으면 필수만 표시한다. 그래서{" "}
        <code>optionalLabel</code> 에는 기본값이 없다 — 무엇을 표시할지는 화면
        전체를 보고 정한다.
      </div>

      <h2>메시지는 Footer 한 줄에 모인다</h2>
      <p>
        에러와 도움말을 줄 수 있는 자리가 둘이다 — <code>Field</code> 와 컨트롤.{" "}
        <code>Field</code> 안에서는 어디에 주든{" "}
        <strong>Field 의 Footer 한 줄</strong>에 모인다. 에러가 있으면 도움말은
        그리지 않고, 글자 수는 오른쪽에 선다. 그래도 어디에 주는지는 자리마다
        정해져 있다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이럴 때</th>
              <th>어디에</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                RHF 래퍼를 쓴다
              </th>
              <td className="doc-wrap">
                <strong>컨트롤</strong> — 래퍼가 알아서 넣는다. 손댈 것이 없다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                손으로 검증한다
              </th>
              <td className="doc-wrap">
                <strong>
                  <code>Field</code>
                </strong>{" "}
                — <code>errorMessage</code> · <code>infoMessage</code>. 서버
                HTML 에 바로 들어간다. 컨트롤에 주면 hydration 뒤에 그려진다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                컨트롤이 여럿인 필드 (체크박스 묶음)
              </th>
              <td className="doc-wrap">
                <strong>
                  <code>Field</code>
                </strong>{" "}
                — 묶음 전체의 에러라 컨트롤 하나에 붙일 수 없다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                글자 수 카운터
              </th>
              <td className="doc-wrap">
                <strong>컨트롤</strong> — 값을 가진 쪽만 셀 수 있다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>값은 쓰는 쪽이 소유한다</h2>
      <p>
        값을 갖는 입력은 <code>value</code> 와 <code>onChange</code> 를 받는다.
        컴포넌트가 값을 몰래 들고 있지 않으므로 <code>defaultValue</code> 는
        없다. <code>Checkbox</code> · <code>Radio</code> · <code>Switch</code>{" "}
        만 <code>defaultChecked</code> 를 받는다.
      </p>

      <h2>react-hook-form 을 쓴다면</h2>
      <p>
        래퍼 12개가 <code>@nui-kit/react/rhf</code> 에 있다.{" "}
        <code>control</code> 과 <code>name</code> 만 주면 값 · 검증 · 에러
        표시가 이어진다.
      </p>
      <pre className="doc-code">
        <code>{`import { useForm } from "react-hook-form";
import { RHFTextfield, RHFSelect } from "@nui-kit/react/rhf";

const { control, handleSubmit } = useForm({ defaultValues: { email: "" } });

<RHFTextfield
  control={control}
  name="email"
  rules={{ required: "이메일을 입력해 주세요" }}
/>`}</code>
      </pre>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>래퍼</th>
              <th>감싸는 것</th>
            </tr>
          </thead>
          <tbody>
            {WRAPPERS.map(([w, base]) => (
              <tr key={w}>
                <th scope="row">
                  <code>{w}</code>
                </th>
                <td>
                  <code>{base}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>서브패스가 따로인 이유가 있다.</strong>{" "}
        <code>react-hook-form</code> 은 optional peer 라, 배럴에 섞으면 RHF 를
        쓰지 않는 프로젝트의 번들에도 들어간다. <code>@nui-kit/react</code>{" "}
        에서는 래퍼가 나오지 않는다.
      </div>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>RHFRadio</code> 는 라디오 하나를 참 · 거짓 값에 잇는다.
        </strong>{" "}
        선택지 여럿이 값 하나를 나눠 갖는 그룹에는 맞지 않는다 — 그때는{" "}
        <code>RadioGroup</code> 을 <code>Controller</code> 로 직접 감싼다.
      </div>

      <h2>움직이는 폼</h2>
      <FormDemo />

      <h2>여러 칸을 나란히</h2>
      <p>
        <code>Field.Grid</code> 로 열 수를 정한다. 1 · 2 · 3 · 4 를 받고 기본은
        2 다.
      </p>
      <pre className="doc-code">
        <code>{`<Field.Grid columns={2}>
  <Field><Field.Label>이름</Field.Label><Textfield /></Field>
  <Field><Field.Label>생년월일</Field.Label><Datepicker … /></Field>
</Field.Grid>`}</code>
      </pre>
      <div className="doc-note">
        좁은 화면에서 한 줄로 접히지 않는다. 지정한 열 수를 그대로 유지하므로,
        모바일에서 한 줄이 필요하면 <code>columns={1}</code> 로 직접 바꾼다.
      </div>

      <h2>언제 검증하나</h2>
      <p>
        형식처럼 그 자리에서 알 수 있는 것은 입력하는 동안, 중복 확인처럼 서버가
        아는 것은 제출할 때 검사한다. 자세한 것은{" "}
        <Link href="/foundations/feedback">피드백 고르기</Link> 에 있다.
      </p>

      <DesignNote title="생성 폼과 수정 폼은 같은 꼴로 만든다">
        <p>
          같은 필드, 같은 순서, 같은 검증을 쓴다. 다른 것은 처음 채워져 있는
          값뿐이다. 둘을 따로 만들면 한쪽에만 필드가 추가되거나 검증 규칙이
          갈라지고, 그 사실은 한참 뒤에 드러난다.
        </p>
      </DesignNote>
    </>
  );
}

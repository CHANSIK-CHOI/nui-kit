import { Field, FieldLabel } from "@chansikchoi/next-ui";
import { Textfield } from "@chansikchoi/next-ui/textfield";
import { Example } from "@/components/Example";
import { PropsTable } from "@/components/PropsTable";
import { TextfieldDemo } from "./TextfieldDemo";

export const metadata = { title: "Textfield" };

export default function TextfieldPage() {
  return (
    <>
      <h1>Textfield</h1>
      <p className="doc-lead">
        한 줄 텍스트 입력. <strong>controlled 컴포넌트</strong>이므로 값은
        소비자가 소유한다. <code>defaultValue</code> 는 타입에서 제외되어 있다.
      </p>

      <pre className="doc-code">
        <code>{`import { Textfield } from "@chansikchoi/next-ui";
// 또는 서브패스
import { Textfield } from "@chansikchoi/next-ui/textfield";`}</code>
      </pre>

      <h2>기본</h2>
      <Example
        row={false}
        caption="Field 와 함께 쓰면 id·label 이 자동 연결된다"
      >
        <Field>
          <FieldLabel>이름</FieldLabel>
          <Textfield placeholder="내용을 입력해주세요" />
        </Field>
      </Example>

      <h2>상태</h2>
      <Example row={false} caption="disabled · readOnly">
        <Field>
          <FieldLabel>비활성</FieldLabel>
          <Textfield placeholder="disabled" disabled />
        </Field>
        <div style={{ height: 12 }} />
        <Field>
          <FieldLabel>읽기 전용</FieldLabel>
          <Textfield placeholder="readonly" readOnly />
        </Field>
      </Example>

      <h2>단위</h2>
      <p>
        <code>unit</code> 을 주면 오른쪽에 단위가 붙고 입력값이 우측 정렬된다.
      </p>
      <Example row={false} caption='unit="원"'>
        <Field>
          <FieldLabel>금액</FieldLabel>
          <Textfield placeholder="0" unit="원" />
        </Field>
      </Example>

      <h2>메시지</h2>
      <Example row={false} caption="infoMessage · errorMessage">
        <Field>
          <FieldLabel>비밀번호</FieldLabel>
          <Textfield
            type="password"
            placeholder="8자 이상"
            infoMessage="영문·숫자·특수문자를 조합해주세요."
          />
        </Field>
        <div style={{ height: 12 }} />
        <Field>
          <FieldLabel>이메일</FieldLabel>
          <Textfield
            placeholder="name@example.com"
            errorMessage="올바른 형식이 아닙니다."
          />
        </Field>
      </Example>

      <h2>입력값 지우기</h2>
      <p>
        <code>isClearable</code> 과 <code>onClear</code> 를 함께 준다. 값이 있고
        readOnly · disabled 가 아닐 때만 버튼이 나타난다.
      </p>
      <TextfieldDemo />

      <h2>react-hook-form</h2>
      <p>
        <code>RHFTextfield</code> 는 <code>/rhf</code> 서브패스에 있다.{" "}
        <code>useController</code> 로 값을 소유하므로 <code>value</code> ·{" "}
        <code>onChange</code> 를 직접 넘기지 않는다.
      </p>
      <pre className="doc-code">
        <code>{`import { useForm } from "react-hook-form";
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";

const { control } = useForm<{ email: string }>();

<RHFTextfield
  name="email"
  control={control}
  rules={{ required: "이메일을 입력해주세요." }}
  placeholder="name@example.com"
  isClearable
/>`}</code>
      </pre>
      <div className="doc-note">
        <code>react-hook-form</code> 은 optional peer 다. RHF 래퍼를 쓸 때만
        설치하면 된다. 소비자의 <code>control</code> 을 우리가 받으므로 반드시
        같은 인스턴스를 공유해야 하고, 그래서 dependency 가 아니라 peer 다.
      </div>

      <h2>커스터마이징</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>공개 훅</th>
              <th>대상</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["--nui-textfield-height", "입력 영역 높이"],
              ["--nui-textfield-radius", "모서리 반경"],
              ["--nui-textfield-border-color", "테두리 색"],
              ["--nui-textfield-bg", "배경색"],
            ].map(([name, target]) => (
              <tr key={name}>
                <td>
                  <span className="doc-token-name">{name}</span>
                </td>
                <td className="doc-wrap">{target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>API</h2>
      <h3>Textfield</h3>
      <PropsTable of="Textfield" />
      <h3>Message</h3>
      <PropsTable of="Message" />
    </>
  );
}

import Link from "next/link";
import { Message } from "@nui-kit/react";
import {
  GuideHeader,
  DesignNote,
  Case,
  CaseGrid,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "Message" };

export default function MessagePage() {
  return (
    <>
      <GuideHeader
        title="Message"
        named={["Message"]}
        subpath="textfield"
        css="textfield"
      />

      <p>
        입력 아래 한 줄이다 — 왼쪽에 안내나 에러, 오른쪽에 글자 수.{" "}
        <code>Textfield</code> · <code>Textarea</code> · <code>Select</code> ·{" "}
        <code>Datepicker</code> 계열이 스스로 그리므로 직접 놓을 일은 드물다.
        컨트롤이 없는 자리에 같은 모양이 필요할 때 쓴다.
      </p>

      <h2>어디에 주나</h2>
      <p>
        같은 문구를 그릴 수 있는 자리가 둘이다 — 컨트롤의{" "}
        <code>errorMessage</code> 와 <code>Field.Message</code>.{" "}
        <strong>한 곳에만 준다.</strong> 둘 다 주면 두 줄로 쌓인다.
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
              <td className="doc-wrap">컨트롤 — 래퍼가 알아서 넣는다</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                손으로 검증한다
              </th>
              <td className="doc-wrap">
                컨트롤 — <code>errorMessage</code>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                컨트롤이 여럿인 필드 (체크박스 묶음)
              </th>
              <td className="doc-wrap">
                <code>Field.Message</code> — 묶음 전체의 에러라서
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                글자 수
              </th>
              <td className="doc-wrap">컨트롤 — 값을 가진 쪽만 셀 수 있다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>안내와 에러</h2>
      <CaseGrid
        columns={3}
        caption="둘 다 주면 에러만 보인다"
        code={`<Message errorMessage="2자 이상 입력해 주세요" />`}
      >
        <Case label="infoMessage">
          <Message infoMessage="다른 사람에게 보이는 이름이에요" />
        </Case>
        <Case label="errorMessage" note="아이콘 + 글자">
          <Message errorMessage="2자 이상 입력해 주세요" />
        </Case>
        <Case label="둘 다" note="에러가 이긴다">
          <Message
            infoMessage="다른 사람에게 보이는 이름이에요"
            errorMessage="2자 이상 입력해 주세요"
          />
        </Case>
      </CaseGrid>
      <div className="doc-note">
        에러는 색만으로 말하지 않는다 — 아이콘과 문구가 함께 간다. 문구는 무엇을
        하면 되는지를 적는다 (<Link href="/foundations/label">라벨 쓰기</Link>).
      </div>

      <h2>글자 수</h2>
      <p>
        <code>count</code> 와 <code>maxCount</code> 를 주면 오른쪽에 붙는다.{" "}
        <code>maxCount</code> 가 없으면 카운터도 없다 — 제한이 없으면 남은
        글자라는 개념이 없다.
      </p>
      <CaseGrid
        columns={3}
        caption="현재 수는 진하게, 최대 수는 연하게. 넘치면 둘 다 빨개진다"
        code={`<Message count={value.length} maxCount={100} />`}
      >
        <Case label="count · maxCount">
          <Message count={12} maxCount={100} />
        </Case>
        <Case label="넘침" note="둘 다 빨개진다">
          <Message count={104} maxCount={100} />
        </Case>
        <Case label="메시지와 함께" note="왼쪽 문구 · 오른쪽 수">
          <Message
            errorMessage="10자 이상 적어 주세요"
            count={4}
            maxCount={100}
          />
        </Case>
      </CaseGrid>
      <div className="doc-note">
        카운터 앞의 스크린리더용 문구는 <code>counterLabel</code> 로 바꿀 수
        있다. 기본은 「글자 수」라 「글자 수 12 / 100」으로 읽힌다.
      </div>

      <h2>비어 있어도 자리를 차지하지 않는다</h2>
      <p>
        문구도 카운터도 없으면 화면에서는 사라지지만 DOM 에는 남는다. 그래서
        나중에 에러가 생겨도 레이아웃이 밀리지 않고, 스크린리더가 그 변화를
        읽는다.
      </p>

      <DesignNote title="왜 비어 있어도 렌더하나">
        <p>
          <code>aria-live</code> 영역은 내용이 바뀌기 <strong>전에</strong> DOM
          에 있어야 읽힌다. 에러가 생길 때 처음 만들면 스크린리더가 「영역이
          생겼다」만 알고 내용은 놓치는 경우가 많다. 그래서 빈 상태는{" "}
          <code>display: none</code> 이 아니라 시각적으로만 접어 둔다 — 그것도
          live 를 죽인다.
        </p>
      </DesignNote>

      <DesignNote title="왜 카운터는 소리 내어 읽지 않나">
        <p>
          <code>aria-live</code> 는 문구에만 붙어 있다. 카운터까지 감싸면 타이핑
          한 글자마다 숫자를 읽는다. 대신 <code>aria-describedby</code> 로
          이어서 포커스가 들어올 때 한 번 「글자 수 12 / 100」으로 읽힌다.
        </p>
      </DesignNote>

      <h2>API</h2>
      <PropsTable of="Message" />
    </>
  );
}

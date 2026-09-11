import Link from "next/link";
import { CircleHelp } from "lucide-react";
import {
  Button,
  Field,
  FieldLabel,
  Icon,
  Tooltip,
  FieldHeader,
  FieldGrid,
  FieldItem,
  Textfield,
  Checkbox,
} from "@nui-kit/react";
import { FieldFullDemo } from "./FieldFullDemo";
import {
  GuideHeader,
  Case,
  CaseGrid,
  CaseMatrix,
  Example,
  HookTable,
  PropsTable,
} from "@/components/guide";

export const metadata = { title: "Field" };

const DIRECTIONS = ["column", "row"] as const;
const ALIGNS = ["start", "center"] as const;

export default function FieldPage() {
  return (
    <>
      <GuideHeader
        title="Field"
        named={["Field", "FieldLabel", "FieldHeader", "FieldGrid", "FieldItem"]}
        subpath="field"
      />

      <h2>전체 예시</h2>
      <p>
        Field 계열 다섯과 폼 컨트롤 열 개를 한 폼에 놓았다. Field 가 받는 prop
        은 빠짐없이 한 번씩 쓰여 있다 — 아래 절은 이것을 하나씩 떼어 본다.
      </p>
      <FieldFullDemo />

      <div className="doc-note">
        이 페이지는 Server Component 라 dot notation 대신{" "}
        <code>FieldLabel</code> 같은 named export 를 쓴다. Client Component
        에서는 <code>Field.Label</code> 이 그대로 동작한다.
      </div>

      <h2>기본</h2>
      <p>
        라벨을 누르면 컨트롤에 포커스가 간다. <code>id</code> 는 Field 가 만들어
        라벨과 컨트롤에 같이 넣는다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Field>
  <FieldLabel>이름</FieldLabel>
  <Textfield placeholder="홍길동" />
</Field>`}
      >
        <Case label="기본">
          <Field>
            <FieldLabel>이름</FieldLabel>
            <Textfield placeholder="홍길동" />
          </Field>
        </Case>
        <Case
          label="infoMessage"
          note="Footer 에 그려지고 aria-describedby 로 연결된다"
        >
          <Field infoMessage="회사 메일 주소를 입력해 주세요">
            <FieldLabel>이메일</FieldLabel>
            <Textfield placeholder="name@example.com" />
          </Field>
        </Case>
        <Case
          label="FieldHeader suffix"
          note="라벨 오른쪽 보조 자리 — 툴팁 아이콘과 text 버튼. label 밖이라 눌러도 포커스가 안 간다"
        >
          <Field>
            <FieldHeader
              suffix={
                <>
                  <Tooltip content="도로명 주소만 받습니다. 지번은 우편번호 찾기에서 바꿔 드려요">
                    <span
                      tabIndex={0}
                      aria-label="도움말"
                      style={{ display: "inline-flex", cursor: "help" }}
                    >
                      <Icon icon={<CircleHelp />} />
                    </span>
                  </Tooltip>
                  <Button type="button" variant="text">
                    우편번호 찾기
                  </Button>
                </>
              }
            >
              <FieldLabel>주소</FieldLabel>
            </FieldHeader>
            <Textfield placeholder="도로명 주소" />
          </Field>
        </Case>
        <Case
          label="suffix 가 있어도 높이는 같다"
          note="Grid 이웃과 input 라인이 맞는다"
        >
          <FieldGrid columns={2}>
            <Field>
              <FieldHeader
                suffix={
                  <Button type="button" variant="text">
                    찾기
                  </Button>
                }
              >
                <FieldLabel>시</FieldLabel>
              </FieldHeader>
              <Textfield placeholder="서울" />
            </Field>
            <Field>
              <FieldLabel>구</FieldLabel>
              <Textfield placeholder="강남구" />
            </Field>
          </FieldGrid>
        </Case>
      </CaseGrid>

      <h2>필수 · 선택 표시</h2>
      <p>
        <code>required</code> 를 주면 라벨 오른쪽에 점이 붙고 컨트롤에{" "}
        <code>aria-required</code> 가 간다. 점은 <code>aria-hidden</code> 이고
        뜻은 함께 붙는 화면 낭독 전용 문구가 전한다 — 기호만으로는 스크린리더에
        아무것도 전해지지 않는다.
      </p>
      <p>
        선택 항목은 <code>optionalLabel</code> 로 문구를 준다.{" "}
        <strong>기본값이 없어서 주지 않으면 아무것도 그리지 않는다.</strong> 한
        화면에서 필드의 3분의 2 이상이 필수면 「선택」만 표시하고, 그렇지 않으면
        필수 표시만 쓴다. <strong>한 폼에서는 둘 중 하나만 쓴다.</strong>
      </p>
      <CaseGrid
        columns={2}
        code={`<Field required>
  <FieldLabel>휴대폰 번호</FieldLabel>
  <Textfield placeholder="010-0000-0000" />
</Field>

<Field optionalLabel="선택">
  <FieldLabel>회사</FieldLabel>
  <Textfield placeholder="회사명" />
</Field>`}
      >
        <Case
          label='requiredLabel="Required"'
          note="점은 같고 스크린리더 문구만 바뀐다"
        >
          <Field required requiredLabel="Required">
            <FieldLabel>Email</FieldLabel>
            <Textfield placeholder="name@example.com" />
          </Field>
        </Case>
        <Case label="required" note="점 + aria-required">
          <Field required>
            <FieldLabel>휴대폰 번호</FieldLabel>
            <Textfield placeholder="010-0000-0000" />
          </Field>
        </Case>
        <Case label="optionalLabel" note="문구만 · 점은 없다">
          <Field optionalLabel="선택">
            <FieldLabel>회사</FieldLabel>
            <Textfield placeholder="회사명" />
          </Field>
        </Case>
        <Case
          label="선택 컨트롤에도 간다"
          note="FieldItem 도 같은 prop 을 받는다"
        >
          <FieldItem required>
            <Checkbox />
            <FieldLabel>이용약관에 동의합니다</FieldLabel>
          </FieldItem>
        </Case>
        <Case label="아무것도 안 주면" note="표시가 붙지 않는다">
          <Field>
            <FieldLabel>별명</FieldLabel>
            <Textfield placeholder="선택 입력" />
          </Field>
        </Case>
        <Case
          label="그룹이 필수면 항목은 조용하다"
          note="점은 그룹 라벨 하나 · aria-required 는 항목마다"
        >
          <Field required>
            <FieldLabel as="span">수신 채널</FieldLabel>
            <FieldItem optionalLabel="선택">
              <Checkbox />
              <FieldLabel>이메일</FieldLabel>
            </FieldItem>
            <FieldItem>
              <Checkbox />
              <FieldLabel>SMS</FieldLabel>
            </FieldItem>
          </Field>
        </Case>
      </CaseGrid>

      <h2>에러</h2>
      <p>
        Field 에 <code>errorMessage</code> 를 주면 하위 컨트롤이 전부 에러
        상태가 된다. 컨트롤마다 따로 줄 필요가 없다.
      </p>
      <CaseGrid
        columns={2}
        caption="색만이 아니라 아이콘과 텍스트로 함께 표현한다"
        code={`<Field errorMessage="연락처를 입력해 주세요">…</Field>`}
      >
        <Case label="errorMessage">
          <Field errorMessage="연락처를 입력해 주세요">
            <FieldLabel>연락처</FieldLabel>
            <Textfield placeholder="01012345678" />
          </Field>
        </Case>
        <Case
          label="Header 안의 라벨"
          note="Header 를 써도 라벨이 함께 빨개진다"
        >
          <Field errorMessage="주소를 입력해 주세요">
            <FieldHeader
              suffix={
                <Button type="button" variant="text">
                  우편번호 찾기
                </Button>
              }
            >
              <FieldLabel>주소</FieldLabel>
            </FieldHeader>
            <Textfield placeholder="도로명 주소" />
          </Field>
        </Case>
        <Case
          label="Item 의 에러는 Item 까지"
          note="안쪽 라벨만 빨갛고 바깥 라벨은 아니다"
        >
          <Field>
            <FieldLabel as="span">배송지</FieldLabel>
            <FieldItem direction="column" align="start">
              <FieldLabel>상세 주소</FieldLabel>
              <Textfield
                placeholder="동 · 호수"
                errorMessage="상세 주소를 입력해 주세요"
              />
            </FieldItem>
          </Field>
        </Case>
        <Case
          label="컨트롤의 에러도 Footer 로"
          note="한 줄 — 에러가 도움말을 대신한다"
        >
          <Field infoMessage="하이픈 없이 입력해 주세요">
            <FieldLabel>연락처</FieldLabel>
            <Textfield
              placeholder="01012345678"
              errorMessage="숫자만 입력해 주세요"
            />
          </Field>
        </Case>
      </CaseGrid>

      <h2>방향과 정렬</h2>
      <p>
        <code>direction</code> 이 <code>column</code> 이면 라벨이 위,{" "}
        <code>row</code> 면 옆이다. <code>align</code> 은 <code>row</code> 일 때
        세로 정렬을 정한다.
      </p>
      <p>
        <code>row</code> 의 라벨은 120px 폭으로 선다. row 필드를 여럿 쌓아도
        컨트롤의 왼쪽이 맞는다. 긴 라벨은 그 폭 안에서 어절 단위로 줄을 바꾼다.
        폭은 <code>--nui-field--row-label-width</code> 로 바꾼다.
      </p>
      <CaseMatrix
        rows={DIRECTIONS}
        cols={ALIGNS}
        caption="direction × align"
        code={`<Field direction="row" align="center">…</Field>`}
        render={(direction, align) => (
          <div style={{ minWidth: 200 }}>
            <Field direction={direction} align={align}>
              <FieldLabel>수량</FieldLabel>
              <Textfield placeholder="0" unit="개" />
            </Field>
          </div>
        )}
      />

      <Example
        row={false}
        caption="row 에 컨트롤이 둘이어도 입력 열에 순서대로 쌓이고 Footer 는 그 아래다"
      >
        <Field
          direction="row"
          align="start"
          infoMessage="검색 뒤 상세 주소를 적어 주세요"
        >
          <FieldLabel>주소</FieldLabel>
          <Textfield placeholder="우편번호" />
          <Textfield placeholder="상세 주소" />
        </Field>
      </Example>

      <h2>Field.Grid</h2>
      <p>
        여러 Field 를 열로 배치한다. <code>columns</code> 는{" "}
        <code>--nui-field-grid-columns</code> CSS 변수로 전달된다. 필드 사이
        간격은 <code>--nui-field--grid-gap</code> 이 정한다.
      </p>
      <p>
        폼 안에 필드를 세로로 쌓을 때도 <code>Field.Grid</code> 를 쓴다.{" "}
        <code>columns={1}</code> 이면 한 열이고, 필드는 바깥 여백을 갖지 않는다.
        간격은 컨테이너의 몫이다.
      </p>
      <Example row={false} caption="columns={2}">
        <FieldGrid columns={2}>
          <Field>
            <FieldLabel>시</FieldLabel>
            <Textfield placeholder="서울" />
          </Field>
          <Field>
            <FieldLabel>구</FieldLabel>
            <Textfield placeholder="강남구" />
          </Field>
        </FieldGrid>
      </Example>
      <div className="doc-note doc-note--warn">
        <strong>모바일 1열 붕괴는 보류 상태다.</strong> 지금은 모든 뷰포트에서
        지정한 열 수를 유지한다. 1열이 필요하면 <code>columns={1}</code> 로
        제어한다.
      </div>

      <h2>Field.Item</h2>
      <p>Field 안에서 하위 그룹을 만든다. 자체 id 범위와 에러 상태를 갖는다.</p>
      <Example row={false} caption="FieldItem 은 기본이 row 방향이다">
        <Field>
          <FieldLabel>배송지</FieldLabel>
          <FieldItem direction="column" align="start">
            <Textfield placeholder="우편번호" />
            <Textfield placeholder="상세 주소" />
          </FieldItem>
        </Field>
      </Example>

      <h2>커스터마이징</h2>
      <p>
        라벨과 컨트롤 사이, 필드와 필드 사이, row 라벨의 폭을 연다. 색은
        컴포넌트별로 열려 있지 않다. 한 곳만 바꾸려면 <code>className</code> 을
        쓴다. 안에 놓이는 컨트롤의 변수는{" "}
        <Link href="/foundations/customizing">커스터마이징</Link> 에 모여 있다.
      </p>
      <HookTable group="field" />

      <h2>API</h2>
      <h3>Field</h3>
      <PropsTable of="Field" />
      <h3>Field.Item</h3>
      <PropsTable of="Field.Item" />
      <h3>Field.Grid</h3>
      <PropsTable of="Field.Grid" />
      <h3>Field.Label</h3>
      <PropsTable of="Field.Label" />
      <h3>Field.Header</h3>
      <PropsTable of="Field.Header" />
      <h3>Field.Message</h3>
      <PropsTable of="Field.Message" />
    </>
  );
}

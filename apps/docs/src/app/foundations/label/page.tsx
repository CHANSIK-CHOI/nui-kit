import Link from "next/link";
import { DesignNote } from "@/components/guide";

export const metadata = { title: "라벨 쓰기" };

/** design-system.md §11-1 — 자리가 정해지면 문구의 꼴이 결정된다 */
const PLACES = [
  {
    where: "버튼 · 확인 버튼 · 토스트 액션",
    form: "행동 동사",
    yes: ["삭제", "동의합니다", "되돌리기"],
    no: ["확인", "예", "완료"],
    why: "버튼만 읽어도 무엇이 일어나는지 알 수 있다",
  },
  {
    where: "Field 라벨",
    form: "명사형 · 마침표 없음 · 한 줄",
    yes: ["휴대폰 번호"],
    no: ["휴대폰 번호를 입력하세요."],
    why: "무엇을 넣는 칸인지만 말한다. 지시는 도움말이 한다",
  },
  {
    where: "옵션 (Select 항목 · Radio)",
    form: "명사형 짧게",
    yes: ["일반 배송"],
    no: ["일반 배송으로 받기"],
    why: "고르는 것이지 실행하는 것이 아니다",
  },
  {
    where: "도움말 · 에러 메시지",
    form: "행동 지시형",
    yes: ["10-11자리로 입력해 주세요"],
    no: ["번호가 잘못됐습니다"],
    why: "잘못을 알리는 것이 아니라 다음에 할 일을 알린다",
  },
  {
    where: "Toast",
    form: "명사 + 동사 · 긍정문",
    yes: ["업로드를 완료했어요"],
    no: ["실패하지 않았어요"],
    why: "부정문은 읽는 사람이 한 번 뒤집어야 한다",
  },
  {
    where: "Placeholder",
    form: "어떤 종류의 값인지",
    yes: ["지역을 고르세요"],
    no: ["휴대폰 번호"],
    why: "라벨을 반복하지 않는다. 라벨 대용으로도 쓰지 않는다",
  },
  {
    where: "「없음」 옵션",
    form: "질문을 담아",
    yes: ["선호하는 기내식 없음"],
    no: ["해당 없음"],
    why: "목록만 보고도 무엇에 대한 답인지 알 수 있어야 한다",
  },
] as const;

export default function LabelPage() {
  return (
    <>
      <h1>라벨 쓰기</h1>
      <p className="doc-lead">
        문구의 꼴은 자리가 정한다. 버튼에 쓸 말과 라벨에 쓸 말은 다르다.
      </p>

      <h2>자리 일곱</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>자리</th>
              <th>꼴</th>
              <th>이렇게</th>
              <th>이렇게 말고</th>
            </tr>
          </thead>
          <tbody>
            {PLACES.map((p) => (
              <tr key={p.where}>
                <th scope="row" className="doc-wrap">
                  {p.where}
                  <br />
                  <span className="doc-case__note">{p.why}</span>
                </th>
                <td className="doc-wrap">{p.form}</td>
                <td className="doc-wrap">
                  {p.yes.map((t) => (
                    <div key={t}>{t}</div>
                  ))}
                </td>
                <td className="doc-wrap doc-label-no">
                  {p.no.map((t) => (
                    <div key={t}>{t}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>버튼에는 일어날 일을 적는다</h2>
      <p>
        <code>확인</code> 은 무엇이 일어나는지 말하지 않는다. 특히 되돌릴 수
        없는 행동에서는 마지막으로 멈출 기회를 버리는 셈이다.
      </p>
      <pre className="doc-code">
        <code>{`// ❌ 무엇을 확인하는지 버튼만 봐서는 모른다
<Confirm title="정말 삭제할까요?" confirmLabel="확인" />

// ✅ 버튼만 읽어도 안다
<Confirm title="이 글을 삭제할까요?" confirmLabel="삭제" tone="danger" />`}</code>
      </pre>
      <div className="doc-note">
        <strong>같은 행동에는 같은 단어를 쓴다.</strong> 한 화면에서 「저장」
        이었다면 다른 화면에서도 「저장」이다. 「보관」 「등록」 으로 바꾸면
        같은 일인지 다른 일인지 알 수 없다.
      </div>

      <h2>에러는 다음에 할 일을 말한다</h2>
      <pre className="doc-code">
        <code>{`// ❌ 무엇이 문제인지만 말한다
<Textfield errorMessage="번호가 잘못됐습니다" />

// ✅ 무엇을 하면 되는지 말한다
<Textfield errorMessage="10-11자리 숫자로 입력해 주세요" />`}</code>
      </pre>

      <h2>라벨 대신 placeholder 를 쓰지 않는다</h2>
      <p>
        placeholder 는 입력을 시작하면 사라진다. 그것이 라벨이었다면 무엇을 쓰던
        칸인지 알 수 없게 된다. 대비도 본문보다 낮아 읽기 어렵다.
      </p>
      <pre className="doc-code">
        <code>{`// ❌ 입력을 시작하면 무슨 칸인지 사라진다
<Textfield placeholder="휴대폰 번호" />

// ✅ 라벨은 남고, placeholder 는 값의 종류를 알린다
<Field>
  <Field.Label>휴대폰 번호</Field.Label>
  <Textfield placeholder="010-0000-0000" />
</Field>`}</code>
      </pre>

      <h2>컴포넌트가 가진 문구는 전부 바꿀 수 있다</h2>
      <p>
        스크린리더용 안내처럼 화면에 안 보이는 문구도 <code>*Label</code> prop
        으로 열려 있다. 제품마다 어휘가 다르고 다국어 화면에서는 한국어가 그대로
        노출되기 때문이다.
      </p>
      <pre className="doc-code">
        <code>{`<IconButton aria-label="Close"><CloseIcon /></IconButton>
<Button isLoading loadingLabel="Saving…">Save</Button>
<Field required requiredLabel="Required">…</Field>`}</code>
      </pre>

      <DesignNote title="왜 문구까지 규칙으로 정했나">
        <p>
          문구는 컴포넌트보다 더 자주 눈에 띈다. 버튼 하나가 「확인」이면 그
          화면에서 무슨 일이 일어나는지 알 수 없게 된다.
        </p>
        <p>
          그리고 문구는 <strong>고치기 가장 쉬운 것</strong>이다. 레이아웃이나
          색과 달리 코드를 거의 건드리지 않고 바꿀 수 있다. 값이 큰 데 비해
          비용이 작다.
        </p>
      </DesignNote>

      <p>
        어떤 피드백에 어떤 컴포넌트를 쓰는지는{" "}
        <Link href="/foundations/feedback">피드백 고르기</Link> 에 있다.
      </p>
    </>
  );
}

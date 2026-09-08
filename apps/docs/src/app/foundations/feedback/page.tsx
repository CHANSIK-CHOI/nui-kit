import Link from "next/link";
import { DesignNote } from "@/components/guide";

export const metadata = { title: "피드백 고르기" };

/** design-system.md §12 — 넷이다. 무엇을 알리느냐가 컴포넌트를 정한다 */
const KINDS = [
  {
    kind: "상태",
    q: "지금 무엇을 하고 있나",
    when: "요청을 보냈고 아직 안 끝났다",
    use: "Button isLoading",
    detail: "스피너가 돌고 클릭이 막힌다. 화면 밖 안내 영역이 소리로도 알린다",
  },
  {
    kind: "완료",
    q: "됐다",
    when: "저장 · 전송이 성공했다",
    use: 'Toast tone="success"',
    detail: "화면을 막지 않고 잠깐 떴다 사라진다",
  },
  {
    kind: "경고",
    q: "하기 전에 알아둘 것",
    when: "되돌릴 수 없는 행동 앞",
    use: 'Confirm · Button color="danger"',
    detail: "누르기 전에 멈춰 세운다. 누른 뒤에 알리면 늦다",
  },
  {
    kind: "에러",
    q: "잘못됐다",
    when: "입력이 규칙에 안 맞거나 요청이 실패했다",
    use: 'Message · Toast tone="error"',
    detail: "그 입력 옆에 남긴다. 사라지면 안 되는 종류다",
  },
] as const;

const WHEN_VALIDATE = [
  {
    what: "단순 규칙",
    ex: "필수 · 글자 수 · 자릿수 · 형식",
    when: "입력하는 동안",
    why: "그 자리에서 알 수 있는 것을 제출까지 미루지 않는다",
  },
  {
    what: "서버가 아는 것",
    ex: "아이디 중복 · 재고 · 권한",
    when: "제출할 때",
    why: "타이핑마다 서버를 부르면 느리고, 치는 중간이 에러로 보인다",
  },
  {
    what: "보안 · 금융",
    ex: "계좌 · 카드 번호 · 비밀번호 규칙",
    when: "입력하는 동안",
    why: "틀린 채로 제출하는 비용이 크다",
  },
] as const;

export default function FeedbackPage() {
  return (
    <>
      <h1>피드백 고르기</h1>
      <p className="doc-lead">알릴 것이 넷이고 각각 맡는 컴포넌트가 있다.</p>

      <h2>넷 중 무엇인가</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>무엇</th>
              <th>언제</th>
              <th>무엇으로</th>
            </tr>
          </thead>
          <tbody>
            {KINDS.map((k) => (
              <tr key={k.kind}>
                <th scope="row" className="doc-wrap">
                  {k.kind}
                  <br />
                  <span className="doc-case__note">{k.q}</span>
                </th>
                <td className="doc-wrap">{k.when}</td>
                <td className="doc-wrap">
                  <code>{k.use}</code>
                  <br />
                  <span className="doc-case__note">{k.detail}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>토스트와 팝업을 헷갈리지 않는다</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이럴 때</th>
              <th>이것</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                놓쳐도 괜찮다
              </th>
              <td className="doc-wrap">
                <Link href="/components/toast">Toast</Link> — 사라진다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                반드시 읽어야 한다
              </th>
              <td className="doc-wrap">
                <Link href="/components/alert">Alert</Link> — 확인을 눌러야
                닫힌다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                진행할지 물어야 한다
              </th>
              <td className="doc-wrap">
                <Link href="/components/confirm">Confirm</Link> — 답이 돌아온다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                그 입력의 문제다
              </th>
              <td className="doc-wrap">
                <code>Message</code> — 입력 아래 남는다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>토스트는 포커스를 가져가지 않는다.</strong> 키보드로 조작하던
        사람의 자리를 빼앗지 않으려는 것이라, 반대로 말하면{" "}
        <strong>놓칠 수 있다.</strong> 놓치면 안 되는 내용은 토스트에 담지
        않는다.
      </div>

      <h2>사라지는 것은 붙잡을 수 있어야 한다</h2>
      <p>
        토스트는 마우스를 올리거나, 안에 포커스가 들어오거나, 탭이 숨으면{" "}
        <strong>시간이 멈추고 남은 시간부터 다시 간다.</strong> 읽는 도중에
        사라지지 않게 하려는 것이다.
      </p>
      <div className="doc-note doc-note--warn">
        멈춤은 <strong>마우스일 때만</strong> 동작한다. 터치에서는 손을 뗀
        신호가 오지 않을 수 있어, 한 번 멈추면 영영 남는 쪽이 더 나쁘다. 긴 글은
        토스트에 담지 않는다.
      </div>

      <h2>언제 검증하나</h2>
      <p>
        「입력하는 동안」이 전부는 아니다. 무엇을 검사하느냐가 시점을 정한다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>무엇을</th>
              <th>언제</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            {WHEN_VALIDATE.map((v) => (
              <tr key={v.what}>
                <th scope="row" className="doc-wrap">
                  {v.what}
                  <br />
                  <span className="doc-case__note">{v.ex}</span>
                </th>
                <td className="doc-wrap">
                  <strong>{v.when}</strong>
                </td>
                <td className="doc-wrap">{v.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>완료를 함부로 알리지 않는다</h2>
      <p>
        <code>isLoading</code> 이 내려간 것만으로는 성공인지 실패인지 알 수
        없다. 그래서 버튼은 시작만 알리고 끝은 알리지 않는다.{" "}
        <strong>결과는 부른 쪽이 안다.</strong>
      </p>
      <pre className="doc-code">
        <code>{`const toast = useToast();

async function save() {
  setSaving(true);
  try {
    await api.save(form);
    toast.open({ message: "저장했어요", tone: "success" });
  } catch {
    toast.open({ message: "저장하지 못했어요. 잠시 후 다시 시도해 주세요", tone: "error" });
  } finally {
    setSaving(false);
  }
}`}</code>
      </pre>

      <h2>작성 중 이탈은 물어본다</h2>
      <p>
        쓰던 것이 사라지는 자리에서는 <code>Confirm</code> 으로 한 번 멈춘다.
      </p>
      <div className="doc-note">
        <strong>바뀐 것이 없거나 자동 저장 중이면 묻지 않는다.</strong> 아무것도
        잃지 않는데 묻는 확인은 소음이고, 소음이 쌓이면 진짜 확인도 읽지 않고
        누른다.
      </div>

      <DesignNote title="왜 에러만 화면에 남나">
        <p>
          나머지 셋은 <strong>사용자가 방금 한 일에 대한 답</strong>이라 그
          순간에만 필요하다. 에러는 다르다 — 무엇을 고쳐야 하는지 알려주는
          것이라, 고칠 때까지 옆에 있어야 한다.
        </p>
        <p>
          그래서 에러 메시지 자리는 값이 없을 때도 비워 둔 채 미리 만들어 둔다.
          나중에 만들면 스크린리더가 그 자리가 생긴 것을 알아채지 못한다.
        </p>
      </DesignNote>

      <p>
        문구를 어떤 꼴로 쓰는지는{" "}
        <Link href="/foundations/label">라벨 쓰기</Link> 에 있다.
      </p>
    </>
  );
}

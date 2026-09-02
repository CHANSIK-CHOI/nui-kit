import Link from "next/link";
import data from "@/generated/presets.json";

export const metadata = { title: "브랜드 색 고르기" };

export default function BrandColorsPage() {
  return (
    <>
      <h1>브랜드 색 고르기</h1>
      <p className="doc-lead">
        준비된 <strong>{data.count}색</strong> 중 하나를 고르면 버튼과 입력창,
        선택 컨트롤, 회색까지 그 색에 맞춰 다시 만들어진다.
      </p>

      <div className="doc-note">
        <p>
          고른 색은 9단계 자리에 그대로 들어가고 나머지 11단계가 거기서 나온다.
          회색은 브랜드의 색깔만 물려받아 거의 무채색으로 둔다.
        </p>
      </div>

      <h2>색깔로 고른다</h2>
      <div className="preset-groups">
        {data.groups.map((g) => (
          <Link key={g.slug} href={`/brand-colors/${g.slug}`} className="preset-group">
            <span
              className="preset-group-chip"
              style={{ ["--c" as string]: g.sample ?? "#888" }}
            />
            <strong>{g.name}</strong>
            <span className="preset-group-meta">
              {g.count}색 · {g.from}~{g.to}°
            </span>
          </Link>
        ))}
      </div>

      <p className="preset-note">
        남색과 보라는 3색씩뿐이다. 원본 자료가 따뜻한 색 위주다.
      </p>

      <h2>쓰는 법</h2>
      <ol>
        <li>색깔 페이지에서 마음에 드는 번호를 찾는다</li>
        <li>
          그 카드의 명령을 실행하면 <code>nui-theme.css</code> 가 생긴다
        </li>
        <li>
          라이브러리 CSS 뒤에 불러온다
          <pre className="doc-code">
            <code>{`import "@chansikchoi/next-ui/styles/index.css";
import "./nui-theme.css";`}</code>
          </pre>
        </li>
      </ol>

      <div className="doc-note doc-note--warn">
        <p>
          <strong>색을 바꾸는 방법은 이것 하나다.</strong> <code>:root</code> 에서 색
          변수를 직접 덮어쓰는 방식은 지원하지 않는다. 배경만 바뀌고 글자색은 남아
          대비가 조용히 깨진다. 한 컴포넌트만 바꿔야 하면{" "}
          <Link href="/foundations/customizing">
            <code>className</code>
          </Link>{" "}
          을 쓴다.
        </p>
      </div>

      <h2>보는 테마를 따라간다</h2>
      <p>
        색깔 페이지의 스와치는 지금 보고 있는 테마를 따른다. 오른쪽 위에서 테마를
        바꾸면 같은 프리셋의 다크 색으로 바뀐다.
      </p>

      <h2>목록에 없는 색을 쓰고 싶다면</h2>
      <p>
        아직 안 된다. {data.count}색은 원본 400색에서 걸러낸 것이고, 기준은{" "}
        <em>{data.rule}</em> 이다.
      </p>
      <p>
        거의 회색인 색은 색깔 값이 우연한 숫자다. 그 숫자로 화면 전체를 물들이면
        엉뚱한 색이 나온다.
      </p>
    </>
  );
}

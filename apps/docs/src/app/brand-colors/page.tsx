import Link from "next/link";
import data from "@/generated/presets.json";

export const metadata = { title: "브랜드 색 고르기" };

export default function BrandColorsPage() {
  return (
    <>
      <h1>브랜드 색 고르기</h1>
      <p className="doc-lead">
        준비된 <strong>{data.count}색</strong> 중 하나를 고르면 버튼·입력창·선택
        컨트롤·회색까지 그 색에 맞춰 다시 만들어진다. 고르기 전에 결과를 여기서 본다.
      </p>

      <div className="doc-note">
        <p>
          <strong>고른 색이 그대로 나오지는 않는다.</strong> 우리는 고른 색에서{" "}
          <strong>색깔만 가져오고</strong> 밝기와 선명함은 우리 것을 쓴다.
        </p>
        <p>
          그래야 <strong>어느 색을 골라도 글자가 읽히기</strong> 때문이다. 크림색을
          그대로 버튼에 쓰면 흰 글자든 검은 글자든 안 보인다. 색깔별 페이지에서 고른
          색과 나오는 색을 나란히 볼 수 있다.
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
        빨강·주황·노랑이 절반이 넘고 <strong>남색·보라는 3색씩뿐</strong>이다. 원본
        팔레트가 따뜻한 색 위주로 모인 자료여서 그렇다.
      </p>

      <h2>쓰는 법</h2>
      <ol>
        <li>색깔 페이지에서 마음에 드는 번호를 찾는다</li>
        <li>
          그 카드의 명령을 실행한다 — <code>nui-theme.css</code> 가 생긴다
        </li>
        <li>
          라이브러리 CSS <strong>뒤에</strong> 불러온다
          <pre className="doc-code">
            <code>{`import "@chansikchoi/next-ui/styles/index.css";
import "./nui-theme.css";`}</code>
          </pre>
        </li>
      </ol>

      <div className="doc-note doc-note--warn">
        <p>
          <strong>색을 바꾸는 방법은 이것 하나다.</strong> <code>:root</code> 에서 색
          변수를 직접 덮어쓰는 방식은 지원하지 않는다 — 배경만 바뀌고 글자색은 남아
          대비가 조용히 깨진다. 한 컴포넌트만 바꿔야 하면{" "}
          <Link href="/foundations/customizing">
            <code>className</code>
          </Link>{" "}
          을 쓴다.
        </p>
      </div>

      <h2>보는 테마를 따라간다</h2>
      <p>
        색깔 페이지의 스와치는 <strong>지금 보고 있는 테마</strong>를 따른다. 오른쪽
        위에서 테마를 바꾸면 같은 프리셋의 다크 색으로 바뀐다.
      </p>

      <h2>목록에 없는 색을 쓰고 싶다면</h2>
      <p>
        아직 안 된다. <strong>{data.count}색은 원본 400색에서 걸러낸 것</strong>이고,
        걸러낸 기준은 <em>{data.rule}</em> 이다.
      </p>
      <p>
        거의 회색인 색은 색깔이라는 게 없어서 — 물에 물감을 눈에 안 보일 만큼 넣으면
        무슨 색인지 답할 수 없듯 — 그 색에서 뽑은 색깔은 우연한 숫자다. 그 숫자로 화면
        전체를 물들이면 엉뚱한 색이 나온다.
      </p>
      <p>
        임의의 색을 받는 것은 <strong>다음 단계</strong>다. 그때는 극단적인 색을 어떻게
        다룰지부터 정해야 한다.
      </p>
    </>
  );
}

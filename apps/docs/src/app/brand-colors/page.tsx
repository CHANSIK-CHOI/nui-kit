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
          고른 색은 색조의 원천이고, 9단계는 그 색조로 만든 채움이다. 페이지
          배경과 구분되는 한 고른 색이 9단계 자리에 그대로 앉고, 나머지 11단계가
          거기서 나온다. 배경에 녹는 색이면 같은 색조의 가장 가까운 채움이 대신
          앉고 카드가 그 사실을 보여준다. 회색은 브랜드의 색깔만 물려받아 거의
          무채색으로 남는다.
        </p>
      </div>

      <h2>색깔로 고른다</h2>
      <div className="preset-groups">
        {data.groups.map((g) => (
          <Link
            key={g.slug}
            href={`/brand-colors/${g.slug}`}
            className="preset-group"
          >
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
          루트 <code>layout.tsx</code> 에서 그 번호의 CSS 를 불러온다. 패키지에
          {data.count}색이 전부 들어 있어 설치할 것도 실행할 것도 없다
          <pre className="doc-code">
            <code>{`import "@nui-kit/react/styles/index.css";
import "@nui-kit/react/styles/themes/preset-42.css";`}</code>
          </pre>
        </li>
      </ol>
      <p>
        다른 색으로 바꾸려면 숫자만 고친다. 라이브러리를 올리면 그 버전의 색을
        받는다.
      </p>

      <div className="doc-note doc-note--warn">
        <p>
          <strong>화면 전체의 색을 바꾸는 길은 이것 하나다.</strong> 한
          컴포넌트만 바꾸려면 <code>className</code> 을 쓴다. 둘뿐인 이유는{" "}
          <Link href="/design-system/color">색은 고르는 것이다</Link> 에 있다.
        </p>
      </div>

      <h2>보는 테마를 따라간다</h2>
      <p>
        색깔 페이지의 스와치는 지금 보고 있는 테마를 따른다. 오른쪽 위에서
        테마를 바꾸면 같은 프리셋의 다크 색으로 바뀐다.
      </p>

      <h2>목록에 없는 색을 쓰고 싶다면</h2>
      <p>
        명령 하나로 만든다. 설치돼 있으면 바로 된다. 프리셋과 같은 규칙으로
        나머지 색이 나오고, 루트 <code>layout</code> 에 import 한 줄이 들어간다.
      </p>
      <pre className="doc-code">
        <code>{`npx nui-theme --accent "#b1002a"
# ./nui-theme.css 가 생기고 app/layout.tsx 에 import "../nui-theme.css" 가 들어간다`}</code>
      </pre>
      <p>
        프리셋 번호를 줘도 된다. 그때는 패키지에 든 파일을 그대로 복사한다. 다시
        실행하면 파일을 덮어쓴다.
      </p>
      <p>
        프리셋을 고를 때 쓴 기준을 그대로 지난다. 거의 회색인 색(
        <em>{data.rule}</em>)과 채움 위 글자 · 본문 글자 대비가 기준에 못 미치는
        색은 받지 않는다. 그때는 이유와 수치를 찍고 아무것도 바꾸지 않는다.
        9단계가 고른 색과 다르면 카드의 배지와 같은 내용을 함께 찍는다.
      </p>
    </>
  );
}

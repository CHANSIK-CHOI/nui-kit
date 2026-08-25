import Link from "next/link";

export const metadata = { title: "Components" };

const GROUPS = [
  {
    title: "Button",
    items: [
      {
        name: "Button",
        href: "/components/button",
        desc: "기본 버튼. color · variant · shape · size 조합",
      },
      {
        name: "IconButton",
        href: "/components/button",
        desc: "아이콘 전용 정사각 버튼",
      },
      {
        name: "ButtonGroup",
        href: "/components/button",
        desc: "버튼 나열 레이아웃",
      },
      {
        name: "ButtonLink",
        href: "/components/button",
        desc: "버튼 모양의 링크 (next/link)",
      },
    ],
  },
  {
    title: "Form",
    items: [
      {
        name: "Field",
        href: "/components/field",
        desc: "폼 레이아웃과 id·aria 연결",
      },
      {
        name: "Textfield",
        href: "/components/textfield",
        desc: "한 줄 텍스트 입력",
      },
    ],
  },
];

export default function ComponentsPage() {
  return (
    <>
      <h1>Components</h1>
      <p className="doc-lead">
        현재 파일럿 3계열이 공개되어 있다. 각 페이지의 API 표는 컴포넌트
        타입에서 자동 생성된다.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>컴포넌트</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <Link href={item.href}>
                        <code>{item.name}</code>
                      </Link>
                    </td>
                    <td className="doc-wrap">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="doc-note">
        나머지 컴포넌트(Select · Checkbox · Radio · Switch · Datepicker · Popup
        · Toast · Tooltip · Accordion 등)는 순차 이전 예정이다.
      </div>
    </>
  );
}

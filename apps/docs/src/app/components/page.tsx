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
        desc: "버튼 나열 레이아웃. Item 을 함께 쓴다",
      },
      {
        name: "ButtonLink",
        href: "/components/button",
        desc: "버튼 모양의 링크 (next/link)",
      },
    ],
  },
  {
    title: "Form — 레이아웃",
    items: [
      {
        name: "Field",
        href: "/components/field",
        desc: "라벨·설명·에러를 묶고 id 와 aria 를 연결한다",
      },
    ],
  },
  {
    title: "Form — 입력",
    items: [
      {
        name: "Textfield",
        href: "/components/textfield",
        desc: "한 줄 텍스트 입력",
      },
      {
        name: "Textarea",
        href: "/components/textarea",
        desc: "여러 줄 텍스트 입력. 자동 높이 조절",
      },
      {
        name: "Search",
        href: "/components/search",
        desc: "검색 입력. 지우기 버튼 포함",
      },
      {
        name: "Password",
        href: "/components/password",
        desc: "비밀번호 입력. 표시/숨김 토글",
      },
    ],
  },
  {
    title: "Form — 선택",
    items: [
      {
        name: "Checkbox",
        href: "/components/checkbox",
        desc: "체크박스. CheckboxGroup 으로 묶는다",
      },
      {
        name: "Radio",
        href: "/components/radio",
        desc: "라디오. RadioGroup 으로 묶는다",
      },
      {
        name: "Switch",
        href: "/components/switch",
        desc: "켜고 끄는 토글",
      },
      {
        name: "Select",
        href: "/components/select",
        desc: "단일 선택 드롭다운 (react-select 래핑)",
      },
      {
        name: "MultiSelect",
        href: "/components/select",
        desc: "다중 선택 드롭다운. 선택값을 칩으로 표시",
      },
    ],
  },
  {
    title: "Form — 날짜",
    items: [
      {
        name: "Datepicker",
        href: "/components/datepicker",
        desc: "날짜 하나를 고르는 캘린더 입력 (react-day-picker 래핑)",
      },
      {
        name: "DateRangePicker",
        href: "/components/datepicker",
        desc: "시작·종료 기간 선택. 둘 다 정해져야 값이 전달된다",
      },
      {
        name: "DateMultiplePicker",
        href: "/components/datepicker",
        desc: "여러 날짜를 개별 선택",
      },
    ],
  },
  {
    title: "Overlay",
    items: [
      {
        name: "Alert",
        href: "/components/popup",
        desc: "알림 팝업. 확인 버튼 하나",
      },
      {
        name: "Confirm",
        href: "/components/popup",
        desc: "확인/취소 팝업",
      },
      {
        name: "LayerPopup",
        href: "/components/popup",
        desc: "가운데 레이어 팝업",
      },
      {
        name: "BottomSheet",
        href: "/components/popup",
        desc: "아래에서 올라오는 시트",
      },
      {
        name: "FullPopup",
        href: "/components/popup",
        desc: "전체 화면 팝업",
      },
      {
        name: "PopupHost",
        href: "/components/popup",
        desc: "팝업이 렌더될 자리. 앱 루트에 한 번 둔다",
      },
      {
        name: "Tooltip",
        href: "/components/tooltip",
        desc: "포인터·포커스로 뜨는 설명",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        name: "Toast",
        href: "/components/toast",
        desc: "잠깐 떴다 사라지는 알림",
      },
      {
        name: "ToastHost",
        href: "/components/toast",
        desc: "토스트가 렌더될 자리. 앱 루트에 한 번 둔다",
      },
    ],
  },
  {
    title: "Disclosure",
    items: [
      {
        name: "Accordion",
        href: "/components/accordion",
        desc: "접었다 펴는 목록. Item · Head · Button · Panel 로 구성",
      },
    ],
  },
];

export default function ComponentsPage() {
  return (
    <>
      <h1>Components</h1>
      <p className="doc-lead">
        각 페이지의 API 표는 컴포넌트 타입에서 자동 생성된다 — 코드가 바뀌면
        문서가 따라간다. react-hook-form 래퍼는{" "}
        <code>@chansikchoi/next-ui/rhf</code> 에 있다.
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

export type NavItem = { title: string; href: string };
/** 섹션 안의 소묶음. Components 처럼 항목이 많은 섹션이 계열별로 나눠 쓴다 */
export type NavGroup = { title: string; items: NavItem[] };
export type NavSection = {
  title: string;
  items?: NavItem[];
  groups?: NavGroup[];
};

/**
 * 사이드바 네비게이션 단일 출처. 페이지를 추가하면 여기에 등록한다.
 * `verify:console` 이 이 파일의 `href` 를 뽑아 검사 대상을 만든다.
 *
 * Components 의 묶음은 라이브러리 README 의 컴포넌트 표와 같다 —
 * Button · Form · Popup · Feedback · Disclosure.
 *
 * 층은 큰 것부터 작은 것으로 쌓는다 — 왜 이렇게 생겼나(디자인 시스템) →
 * 어떤 값이 있나(Foundations) → 하나씩 어떻게 쓰나(Components).
 */
export const NAV: NavSection[] = [
  {
    title: "시작하기",
    items: [
      { title: "개요", href: "/" },
      { title: "설치와 사용", href: "/get-started" },
      { title: "브랜드 색 고르기", href: "/brand-colors" },
    ],
  },
  {
    title: "디자인 시스템",
    items: [
      { title: "무엇을 토대로 만들었나", href: "/design-system" },
      { title: "오염시키지 않는다", href: "/design-system/isolation" },
      { title: "색은 고르는 것이다", href: "/design-system/color" },
      { title: "크기와 너비", href: "/design-system/size" },
      { title: "API 일관성", href: "/design-system/api" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "개요", href: "/foundations" },
      { title: "디자인 토큰", href: "/foundations/tokens" },
      { title: "색", href: "/foundations/color" },
      { title: "타이포그래피", href: "/foundations/typography" },
      { title: "아이콘", href: "/foundations/icon" },
      { title: "간격과 크기", href: "/foundations/spacing" },
      { title: "모양과 선", href: "/foundations/shape" },
      { title: "깊이", href: "/foundations/elevation" },
      { title: "모션", href: "/foundations/motion" },
      { title: "상태", href: "/foundations/state" },
      { title: "라벨 쓰기", href: "/foundations/label" },
      { title: "피드백 고르기", href: "/foundations/feedback" },
      { title: "접근성", href: "/foundations/accessibility" },
      { title: "커스터마이징", href: "/foundations/customizing" },
    ],
  },
  {
    title: "폼 만들기",
    items: [{ title: "폼 만들기", href: "/forms" }],
  },
  {
    title: "Components",
    items: [{ title: "개요", href: "/components" }],
    groups: [
      {
        title: "Button",
        items: [
          { title: "Button", href: "/components/button" },
          { title: "IconButton", href: "/components/icon-button" },
          { title: "ButtonGroup", href: "/components/button-group" },
          { title: "ButtonLink", href: "/components/button-link" },
        ],
      },
      {
        title: "Form",
        items: [
          { title: "Field", href: "/components/field" },
          { title: "Textfield", href: "/components/textfield" },
          { title: "Textarea", href: "/components/textarea" },
          { title: "Search", href: "/components/search" },
          { title: "Password", href: "/components/password" },
          { title: "Message", href: "/components/message" },
          { title: "Checkbox", href: "/components/checkbox" },
          { title: "Radio", href: "/components/radio" },
          { title: "Switch", href: "/components/switch" },
          { title: "Select", href: "/components/select" },
          { title: "Datepicker", href: "/components/datepicker" },
        ],
      },
      {
        title: "Popup",
        items: [
          { title: "개요 · PopupHost", href: "/components/popup" },
          { title: "Alert", href: "/components/alert" },
          { title: "Confirm", href: "/components/confirm" },
          { title: "LayerPopup", href: "/components/layer-popup" },
          { title: "BottomSheet", href: "/components/bottom-sheet" },
          { title: "FullPopup", href: "/components/full-popup" },
        ],
      },
      {
        title: "Feedback",
        items: [
          { title: "Toast", href: "/components/toast" },
          { title: "Tooltip", href: "/components/tooltip" },
        ],
      },
      {
        title: "Disclosure",
        items: [{ title: "Accordion", href: "/components/accordion" }],
      },
    ],
  },
];

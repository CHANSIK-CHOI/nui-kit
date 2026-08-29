export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };

/** 사이드바 네비게이션 단일 출처. 페이지를 추가하면 여기에 등록한다. */
export const NAV: NavSection[] = [
  {
    title: "시작하기",
    items: [
      { title: "개요", href: "/" },
      { title: "설치와 사용", href: "/get-started" },
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
      { title: "접근성", href: "/foundations/accessibility" },
      { title: "커스터마이징", href: "/foundations/customizing" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "개요", href: "/components" },
      { title: "Button", href: "/components/button" },
      { title: "Field", href: "/components/field" },
      { title: "Textfield", href: "/components/textfield" },
      { title: "Textarea", href: "/components/textarea" },
      { title: "Search", href: "/components/search" },
      { title: "Password", href: "/components/password" },
      { title: "Checkbox", href: "/components/checkbox" },
      { title: "Radio", href: "/components/radio" },
      { title: "Switch", href: "/components/switch" },
      { title: "Popup", href: "/components/popup" },
      { title: "Toast", href: "/components/toast" },
      { title: "Tooltip", href: "/components/tooltip" },
      { title: "Select", href: "/components/select" },
      { title: "Datepicker", href: "/components/datepicker" },
      { title: "Accordion", href: "/components/accordion" },
    ],
  },
];

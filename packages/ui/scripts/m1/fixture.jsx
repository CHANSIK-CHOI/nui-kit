// M1 검증 하네스 fixture — 한 페이지에 공개 컴포넌트 × 케이스를 전부 그린다.
// `@nui-kit/react` 는 run.mjs 가 esbuild alias 로 기준선(0.2.0 tarball) 또는 후보(패키지 디렉터리)에 붙인다.
// 셀 표식: 인라인은 `data-h="<컴포넌트>|<케이스>"`, portal 로 나가는 팝업은 className `m1h--<컴포넌트>--<케이스>`.
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button, IconButton, ButtonGroup, ButtonGroupItem, Field, FieldItem, FieldLabel, FieldGrid,
  Textfield, Search, Password, Textarea, Checkbox, Radio, RadioGroup, Switch,
  Accordion, AccordionItem, AccordionHead, AccordionButton, AccordionPanel,
  Select, Datepicker, DateRangePicker, DateMultiplePicker, Tooltip, Toast,
  CloseIcon,
} from "@nui-kit/react";
import {
  LayerPopup, BottomSheet, FullPopup, PopupHost, useAlert, useConfirm, useLayerPopup, useBottomSheet, useFullPopup,
} from "@nui-kit/react/popup";
import { ButtonLink } from "@nui-kit/react/next";
import { getButtonClassName } from "@nui-kit/react/button";

const COLORS = ["neutral", "quiet", "primary", "secondary", "danger"];
const SIZES3 = ["large", "medium", "small"];
const noop = () => {};
const Cell = ({ h, children }) => <div data-h={h} style={{ display: "inline-block", margin: 4 }}>{children}</div>;

function Buttons() {
  const out = [];
  for (const color of COLORS) for (const variant of ["solid", "soft", "line", "text"]) for (const size of SIZES3) for (const shape of ["square", "round"])
    out.push(<Cell key={`b${color}${variant}${size}${shape}`} h={`Button|${color}.${variant}.${size}.${shape}`}><Button color={color} variant={variant} size={size} shape={shape}>버튼</Button></Cell>);
  for (const color of COLORS) for (const variant of ["solid", "line"]) for (const size of SIZES3) for (const shape of ["square", "round"])
    out.push(<Cell key={`i${color}${variant}${size}${shape}`} h={`IconButton|${color}.${variant}.${size}.${shape}`}><IconButton aria-label="닫기" color={color} variant={variant} size={size} shape={shape}><CloseIcon /></IconButton></Cell>);
  for (const size of SIZES3) {
    out.push(<Cell key={`bl${size}`} h={`ButtonLink|${size}`}><ButtonLink href="/x" size={size}>링크</ButtonLink></Cell>);
    out.push(<Cell key={`gb${size}`} h={`getButtonClassName|${size}`}><a href="/x" className={getButtonClassName({ size })}>링크</a></Cell>);
  }
  for (const ratio of ["equal", "3:7"])
    out.push(<Cell key={`g${ratio}`} h={`ButtonGroup|${ratio}`}><ButtonGroup ratio={ratio}><ButtonGroupItem><Button>가</Button></ButtonGroupItem><ButtonGroupItem><Button>나</Button></ButtonGroupItem></ButtonGroup></Cell>);
  return out;
}

function Forms() {
  const out = [];
  for (const size of ["large", "medium"]) {
    out.push(<Cell key={`tf${size}`} h={`Textfield|${size}`}><Textfield size={size} aria-label="t" defaultValue="값" /></Cell>);
    out.push(<Cell key={`se${size}`} h={`Search|${size}`}><Search size={size} aria-label="s" /></Cell>);
    out.push(<Cell key={`pw${size}`} h={`Password|${size}`}><Password size={size} aria-label="p" /></Cell>);
    out.push(<Cell key={`sl${size}`} h={`Select|${size}`}><Select size={size} aria-label="sel" options={[{ value: "a", label: "가" }]} /></Cell>);
    out.push(<Cell key={`dp${size}`} h={`Datepicker|${size}`}><Datepicker size={size} aria-label="d1" /></Cell>);
    out.push(<Cell key={`dr${size}`} h={`DateRangePicker|${size}`}><DateRangePicker size={size} aria-label="d2" /></Cell>);
    out.push(<Cell key={`dm${size}`} h={`DateMultiplePicker|${size}`}><DateMultiplePicker size={size} aria-label="d3" /></Cell>);
  }
  // 달력이 열린 상태 — datepicker 달력 훅(day · dropdown · border)의 자리를 그린다
  out.push(<Cell key="dpo" h="Datepicker|open"><Datepicker aria-label="d1o" defaultIsCalendarOpen hasPortal={false} /></Cell>);
  out.push(<Cell key="dro" h="DateRangePicker|open"><DateRangePicker aria-label="d2o" defaultIsCalendarOpen hasPortal={false} /></Cell>);
  out.push(<Cell key="fg" h="FieldGrid|default"><FieldGrid><FieldItem><FieldLabel>가</FieldLabel><Textfield aria-label="g1" /></FieldItem><FieldItem><FieldLabel>나</FieldLabel><Textfield aria-label="g2" /></FieldItem></FieldGrid></Cell>);
  for (const resize of ["none", "vertical"]) out.push(<Cell key={`ta${resize}`} h={`Textarea|${resize}`}><Textarea resize={resize} aria-label="ta" /></Cell>);
  for (const shape of ["square", "ghost"]) for (const tone of ["neutral", "brand"])
    out.push(<Cell key={`cb${shape}${tone}`} h={`Checkbox|${shape}.${tone}`}><Checkbox shape={shape} tone={tone} defaultChecked aria-label="체크" /></Cell>);
  for (const tone of ["neutral", "brand"]) {
    out.push(<Cell key={`rd${tone}`} h={`Radio|${tone}`}><RadioGroup name={`r${tone}`} aria-label="라디오"><Radio tone={tone} value="a" defaultChecked aria-label="가" /></RadioGroup></Cell>);
    out.push(<Cell key={`sw${tone}`} h={`Switch|${tone}`}><Switch tone={tone} defaultChecked aria-label="sw" /></Cell>);
  }
  for (const direction of ["row", "column"])
    out.push(<Cell key={`fd${direction}`} h={`Field|${direction}`}><Field direction={direction}><FieldItem><FieldLabel>라벨</FieldLabel><Textfield aria-label="f" /></FieldItem></Field></Cell>);
  for (const variant of ["line", "box", "separated"])
    out.push(<Cell key={`ac${variant}`} h={`Accordion|${variant}`}><Accordion variant={variant} defaultActiveIndices={[0]}><AccordionItem index={0}><AccordionHead><AccordionButton>제목</AccordionButton></AccordionHead><AccordionPanel>본문</AccordionPanel></AccordionItem></Accordion></Cell>);
  for (const placement of ["topCenter", "bottomLeft"])
    out.push(<Cell key={`tt${placement}`} h={`Tooltip|${placement}`}><Tooltip content="도움말" placement={placement} open hasPortal={false}><Button>툴팁</Button></Tooltip></Cell>);
  for (const tone of ["success", "default", "error"])
    out.push(<Cell key={`to${tone}`} h={`Toast|${tone}`}><Toast tone={tone} message="알림" open onRequestClose={noop} onCloseComplete={noop} /></Cell>);
  return out;
}

const withRt = (Comp, extra) => function Registered(rt) { return <Comp {...rt} {...extra}>본문</Comp>; };
const SHELLS = [
  ...SIZES3.map((s) => ["layer", `lp-${s}`, withRt(LayerPopup, { size: s, title: "레이어", className: `m1h--LayerPopup--${s}` })]),
  ["sheet", "bs", withRt(BottomSheet, { title: "시트", hasDragHandle: true, shouldCloseOnDrag: true, className: "m1h--BottomSheet--default" })],
  ["full", "fp", withRt(FullPopup, { title: "풀", className: "m1h--FullPopup--default" })],
];
function Popups() {
  const alert = useAlert();
  const confirm = useConfirm();
  const layer = useLayerPopup();
  const sheet = useBottomSheet();
  const full = useFullPopup();
  useEffect(() => {
    if (location.hash.includes("popups=off")) return;
    const api = { layer, sheet, full };
    for (const [kind, id, component] of SHELLS) api[kind].open({ id, component });
    alert.open({ title: "알림", description: "본문", className: "m1h--Alert--default" });
    confirm.open({ title: "확인", description: "본문", className: "m1h--Confirm--default" });
  }, []);
  return null;
}

function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => { setReady(true); document.body.dataset.m1Ready = "1"; }, 1200); }, []);
  return (
    <PopupHost>
      <main id="m1-grid"><Buttons /><Forms /></main>
      <Popups />
      {ready ? null : null}
    </PopupHost>
  );
}

createRoot(document.getElementById("root")).render(<App />);

#!/usr/bin/env node
/**
 * 컴포넌트 props 표를 **타입에서 생성**한다.
 *
 * 왜 직접 만들었나:
 *   react-docgen-typescript 는 TypeScript 7 에서 깨진다 (`ts.JsxEmit` undefined).
 *   tsup 의 dts, rollup-plugin-dts 와 같은 유형 — TS 7 이 JS API 를 바꿨다.
 *   문서 파이프라인이 서드파티의 TS 대응 속도에 묶이면 안 되므로 직접 만든다.
 *   apps/docs 에만 typescript@5.9 를 격리 설치해 그 컴파일러 API 를 쓴다.
 *
 * 출력: apps/docs/src/generated/props.json
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI_ROOT = resolve(DOCS_ROOT, "..", "..", "packages", "ui");
const OUT = join(DOCS_ROOT, "src", "generated", "props.json");

if (!ts.JsxEmit) {
  console.error(
    `❌ typescript@${ts.version} 의 JS API 가 예상과 다르다. apps/docs 의 typescript 5.x 격리 설치를 확인할 것.`,
  );
  process.exit(1);
}

/**
 * 문서화 대상. 컴포넌트명 → 소스 파일 + props 타입 별칭.
 * 함수 시그니처에서 추론하지 않고 타입을 명시한다 — forwardRef 등 형태가 제각각이라
 * 명시가 훨씬 안정적이다.
 */
const TARGETS = [
  { name: "Button", file: "components/Button/Button.tsx", type: "ButtonProps" },
  {
    name: "IconButton",
    file: "components/Button/IconButton.tsx",
    type: "IconButtonProps",
  },
  {
    name: "ButtonGroup",
    file: "components/Button/ButtonGroup.tsx",
    type: "ButtonGroupProps",
  },
  {
    name: "ButtonGroup.Item",
    file: "components/Button/ButtonGroup.tsx",
    type: "ButtonGroupItemProps",
  },
  {
    name: "ButtonLink",
    file: "components/Button/ButtonLink.tsx",
    type: "ButtonLinkProps",
  },
  { name: "Field", file: "components/Field/Field.tsx", type: "FieldProps" },
  { name: "ToastHost", file: "components/Toast/ToastHost.tsx", type: "ToastHostProps" },
  { name: "PopupHost", file: "components/Popup/PopupHost.tsx", type: "PopupHostProps" },
  {
    name: "Field.Item",
    file: "components/Field/Field.tsx",
    type: "FieldItemProps",
  },
  {
    name: "Field.Grid",
    file: "components/Field/Field.tsx",
    type: "FieldGridProps",
  },
  {
    name: "Field.Description",
    file: "components/Field/Field.tsx",
    type: "FieldDescriptionProps",
  },
  {
    name: "Field.Message",
    file: "components/Field/Field.tsx",
    type: "FieldMessageProps",
  },
  // 2026-09-09 — spec 대조가 `as` · `htmlFor` 를 「코드에 없는 prop」으로 잡았다. 없는 게 아니라
  //    Field.Label 이 추출 목록에 빠져 있었다. 문서 표도 같이 비어 있었다.
  {
    name: "Field.Label",
    file: "components/Field/Field.tsx",
    type: "FieldLabelProps",
  },
  {
    name: "Textfield",
    file: "components/Textfield/Textfield.tsx",
    type: "TextfieldProps",
  },
  {
    name: "Message",
    file: "components/Textfield/Message.tsx",
    type: "MessageProps",
  },
  {
    name: "Search",
    file: "components/Textfield/Search.tsx",
    type: "SearchProps",
  },
  {
    name: "Password",
    file: "components/Textfield/Password.tsx",
    type: "PasswordProps",
  },
  {
    name: "Textarea",
    file: "components/Textarea/Textarea.tsx",
    type: "TextareaProps",
  },
  {
    name: "Checkbox",
    file: "components/Checkbox/Checkbox.tsx",
    type: "CheckboxProps",
  },
  {
    name: "CheckboxGroup",
    file: "components/Checkbox/CheckboxGroup.tsx",
    type: "CheckboxGroupProps",
  },
  { name: "Radio", file: "components/Radio/Radio.tsx", type: "RadioProps" },
  {
    name: "RadioGroup",
    file: "components/Radio/RadioGroup.tsx",
    type: "RadioGroupProps",
  },
  { name: "Switch", file: "components/Switch/Switch.tsx", type: "SwitchProps" },
  {
    name: "Alert",
    file: "components/Popup/Popup.types.ts",
    type: "AlertProps",
    // 타입만 있는 파일이라 기본값이 없다. 구현에서 읽는다 — 앞의 파일이 이긴다.
    defaultsFrom: ["components/Popup/Alert.tsx"],
  },
  {
    name: "Confirm",
    file: "components/Popup/Popup.types.ts",
    type: "ConfirmProps",
    // 타입만 있는 파일이라 기본값이 없다. 구현에서 읽는다 — 앞의 파일이 이긴다.
    defaultsFrom: ["components/Popup/Confirm.tsx"],
  },
  {
    name: "LayerPopup",
    file: "components/Popup/Popup.types.ts",
    type: "LayerPopupProps",
    // 타입만 있는 파일이라 기본값이 없다. 구현에서 읽는다 — 앞의 파일이 이긴다.
    defaultsFrom: ["components/Popup/LayerPopup.tsx", "components/Popup/PopupBase.tsx"],
  },
  {
    name: "BottomSheet",
    file: "components/Popup/Popup.types.ts",
    type: "BottomSheetProps",
    // 타입만 있는 파일이라 기본값이 없다. 구현에서 읽는다 — 앞의 파일이 이긴다.
    defaultsFrom: ["components/Popup/BottomSheet.tsx", "components/Popup/PopupBase.tsx"],
  },
  {
    name: "FullPopup",
    file: "components/Popup/Popup.types.ts",
    type: "FullPopupProps",
    // 타입만 있는 파일이라 기본값이 없다. 구현에서 읽는다 — 앞의 파일이 이긴다.
    defaultsFrom: ["components/Popup/FullPopup.tsx", "components/Popup/PopupBase.tsx"],
  },
  {
    name: "Toast",
    file: "components/Toast/Toast.types.ts",
    type: "ToastProps",
  },
  {
    name: "Tooltip",
    file: "components/Tooltip/Tooltip.tsx",
    type: "TooltipProps",
  },
  {
    name: "Accordion",
    file: "components/Accordion/Accordion.tsx",
    type: "AccordionProps",
  },
  {
    name: "Accordion.Item",
    file: "components/Accordion/AccordionItem.tsx",
    type: "AccordionItemProps",
  },
  {
    name: "Accordion.Head",
    file: "components/Accordion/AccordionHead.tsx",
    type: "AccordionHeadProps",
  },
  {
    name: "Accordion.Button",
    file: "components/Accordion/AccordionButton.tsx",
    type: "AccordionButtonProps",
  },
  {
    name: "Accordion.Panel",
    file: "components/Accordion/AccordionPanel.tsx",
    type: "AccordionPanelProps",
  },
  { name: "Select", file: "components/Select/Select.tsx", type: "SelectProps" },
  {
    name: "MultiSelect",
    file: "components/Select/MultiSelect.tsx",
    type: "MultiSelectProps",
  },
  {
    name: "Datepicker",
    file: "components/Datepicker/Datepicker.tsx",
    type: "DatepickerProps",
  },
  {
    name: "DateRangePicker",
    file: "components/Datepicker/DateRangePicker.tsx",
    type: "DateRangePickerProps",
  },
  {
    name: "DateMultiplePicker",
    file: "components/Datepicker/DateMultiplePicker.tsx",
    type: "DateMultiplePickerProps",
  },
  { name: "Icon", file: "components/Icon/Icon.tsx", type: "IconProps" },
];

const entryFiles = [
  ...new Set(
    TARGETS.flatMap((t) =>
      [t.file, ...(t.defaultsFrom ?? [])].map((f) => join(UI_ROOT, "src", f)),
    ),
  ),
];

const configPath = join(UI_ROOT, "tsconfig.json");
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  UI_ROOT,
);

const program = ts.createProgram(entryFiles, {
  ...parsed.options,
  noEmit: true,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();

/** 선언 위치가 우리 소스인지 (node_modules = React DOM 상속 props) */
function isOwnDeclaration(symbol) {
  const decls = symbol.getDeclarations() ?? [];
  return decls.some(
    (d) => !d.getSourceFile().fileName.includes("node_modules"),
  );
}

/** JSDoc 설명 */
function docOf(symbol) {
  return ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .trim();
}

/**
 * 문자열 리터럴 유니온이면 값을 **전부 펼친 문자열**을, 아니면 null 을 돌려준다.
 *
 * ⚠️ 왜 필요한가 (2026-09-09) — 표에 `ButtonShape` 라고만 찍히면 소비자는 무엇을
 *    넣을 수 있는지 모른다. 별칭 이름은 우리 사정이고 소비자가 쓰는 것은 값이다.
 *    실제로 27자리가 그랬다 — `ButtonSize` · `SelectionTone` · `TooltipPlacement` …
 *
 * ⚠️ 별칭을 무조건 풀지는 않는다. `ToastAction` 같은 객체 타입은 펼치면 표가
 *    터지고, `boolean` 은 `false | true` 가 되어 오히려 나빠진다. 그래서 **모든
 *    갈래가 문자열 리터럴일 때만** 편다.
 *
 * ⚠️ `undefined` 는 맨 뒤로 보낸다. checker 가 앞에 두는데, 손으로 쓴 표기
 *    (`"a" | "b" | undefined`)와 순서가 어긋나면 같은 뜻이 두 꼴로 보인다.
 */
function expandStringUnion(type) {
  if (!type.isUnion()) return null;

  const literals = [];
  let hasUndefined = false;
  for (const member of type.types) {
    if (member.flags & ts.TypeFlags.Undefined) {
      hasUndefined = true;
      continue;
    }
    if (!member.isStringLiteral()) return null;
    literals.push(`"${member.value}"`);
  }
  if (literals.length === 0) return null;
  return [...literals, ...(hasUndefined ? ["undefined"] : [])].join(" | ");
}

/**
 * 선언에 적힌 타입 텍스트 (checker 문자열보다 사람이 읽기 좋다).
 * 단 선언이 여럿이면(판별 유니온의 각 갈래 등) 한 갈래만 보여주게 되므로
 * checker 가 합성한 타입 문자열을 쓴다.
 *
 * 문자열 리터럴 유니온은 **별칭 이름 대신 값**을 보여준다 (`expandStringUnion`).
 */
function typeTextOf(symbol, fallbackType) {
  const expanded = expandStringUnion(fallbackType);
  if (expanded) return expanded;

  const decls = symbol.getDeclarations() ?? [];
  if (decls.length === 1) {
    const decl = decls[0];
    if (ts.isPropertySignature(decl) && decl.type) {
      return decl.type.getText().replace(/\s+/g, " ");
    }
  }
  return checker.typeToString(fallbackType).replace(/\s+/g, " ");
}

/**
 * 컴포넌트 함수의 구조분해 기본값을 **파라미터 타입 이름별로** 뽑는다.
 *
 * ⚠️ 왜 타입별인가 (2026-09-09) — 한 파일에 컴포넌트가 여럿이면 예전 구현은 전부 한
 *    맵에 섞었고 **뒤에 선언된 것이 앞을 덮었다.** `Field.tsx` 가 그랬다 — `Field` 의
 *    기본값이 `column`·`start` 인데 표에는 `FieldItem` 의 `row`·`center` 가 찍혔다.
 *    소비자가 문서만 보고 쓰면 반대로 배치된다.
 *
 * 제네릭은 이름만 본다 — `DatepickerProps<TSelected>` → `DatepickerProps`.
 *
 * ⚠️ `forwardRef<HTMLDivElement, FieldProps>((props) => …)` 는 파라미터에 타입 주석이
 *    없다 — 타입이 **호출의 제네릭 인자**에 있다. 그 자리는 두 번째 인자다.
 */
function collectDefaultsByType(sourceFile) {
  const byType = new Map();
  const merged = {};
  /** forwardRef 호출을 지나는 동안 그 제네릭 두 번째 인자를 물고 간다 */
  let inheritedType = null;
  const visit = (node) => {
    let restore = inheritedType;
    if (
      ts.isCallExpression(node) &&
      /(^|\.)forwardRef$/.test(node.expression.getText()) &&
      node.typeArguments?.length >= 2
    ) {
      const t = node.typeArguments[1];
      inheritedType = ts.isTypeReferenceNode(t) ? t.typeName.getText() : null;
    }
    const params =
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
        ? node.parameters
        : null;

    if (params?.[0] && ts.isObjectBindingPattern(params[0].name)) {
      const found = {};
      for (const el of params[0].name.elements) {
        if (el.initializer) found[el.name.getText()] = el.initializer.getText();
      }
      Object.assign(merged, found);

      const t = params[0].type;
      const typeName =
        t && ts.isTypeReferenceNode(t) ? t.typeName.getText() : inheritedType;
      if (typeName) {
        // 같은 타입을 쓰는 함수가 둘이면 먼저 만난 쪽이 소유자다 (본체가 먼저 온다)
        if (!byType.has(typeName)) byType.set(typeName, {});
        Object.assign(byType.get(typeName), found);
      }
    }
    ts.forEachChild(node, visit);
    inheritedType = restore;
  };
  visit(sourceFile);
  return { byType, merged };
}

const result = {};
const warnings = [];

for (const target of TARGETS) {
  const filePath = join(UI_ROOT, "src", target.file);
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    warnings.push(`${target.name}: 소스 파일 없음 (${target.file})`);
    continue;
  }

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  const exported = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const typeSymbol = exported.find((s) => s.getName() === target.type);

  if (!typeSymbol) {
    warnings.push(
      `${target.name}: 타입 ${target.type} 을 export 에서 찾지 못함`,
    );
    continue;
  }

  const type = checker.getDeclaredTypeOfSymbol(typeSymbol);
  // 기본값은 `defaultsFrom` 이 있으면 그 파일들에서, 없으면 타입 파일 자신에서 읽는다.
  // **앞의 파일이 이긴다** — 셸이 자기 기본값을 갖고 나머지는 Base 로 흐르는 꼴이다.
  //
  // ⚠️ 셸이 값을 **고정**하는 것(`<PopupBase hasCloseButton={false}>`)은 구조분해 기본값이
  //    아니라 JSX 속성이라 여기 안 잡힌다. 그래서 Alert·Confirm 은 Base 를 잇지 않는다 —
  //    이으면 그들이 끈 `hasCloseButton` 이 `true` 로 찍힌다.
  const defaultFiles = target.defaultsFrom ?? [target.file];
  const defaults = {};
  for (const rel of [...defaultFiles].reverse()) {
    const sf = program.getSourceFile(join(UI_ROOT, "src", rel));
    if (!sf) {
      warnings.push(`${target.name}: 기본값 파일 없음 (${rel})`);
      continue;
    }
    const { byType, merged } = collectDefaultsByType(sf);
    const own = byType.get(target.type);
    if (!own && rel === target.file && byType.size > 1) {
      warnings.push(
        `${target.name}: 파라미터 타입 \`${target.type}\` 을 못 찾아 파일 전체의 기본값을 합쳐 쓴다 — 값이 섞일 수 있다`,
      );
    }
    Object.assign(defaults, own ?? merged);
  }

  const own = [];
  let inheritedCount = 0;
  // 이름만 남긴다 — spec 대조(scripts/check-specs.mjs)가 「이 prop 이 상속인가」를 물을 때 쓴다.
  // 타입·설명까지 담으면 React DOM props 수백 개로 파일이 터진다.
  const inheritedNames = [];

  for (const prop of checker.getPropertiesOfType(type)) {
    if (!isOwnDeclaration(prop)) {
      inheritedCount += 1;
      inheritedNames.push(prop.getName());
      // 상속 props 는 목록에 넣지 않는다. React DOM props 만 수백 개라 표가 터진다.
      //
      // ⚠️ 예외 — **우리가 기본값을 지정한 것은 우리 API 의 일부다.**
      //    `Select` 는 react-select 의 `isSearchable` 을 `false` 로 뒤집어 넘긴다
      //    (react-select 기본은 `true`). 그런 자리가 표에 없으면 소비자는 그 prop 이
      //    있는 줄도 모른다. 실제로 데모와 캡션이 쓰고 있는데 표에만 없었다.
      if (!(prop.getName() in defaults)) continue;
    }
    const decl = prop.getDeclarations()?.[0];
    const propType = checker.getTypeOfSymbolAtLocation(
      prop,
      decl ?? sourceFile,
    );
    own.push({
      name: prop.getName(),
      type: typeTextOf(prop, propType),
      required: !(prop.flags & ts.SymbolFlags.Optional),
      default: defaults[prop.getName()] ?? null,
      description: docOf(prop),
    });
  }

  own.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  result[target.name] = {
    typeName: target.type,
    sourceFile: target.file,
    props: own,
    inheritedCount,
    inheritedNames: inheritedNames.sort(),
  };
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n", "utf8");

const total = Object.values(result).reduce((n, r) => n + r.props.length, 0);
console.log(
  `✅ props 추출 완료 — 컴포넌트 ${Object.keys(result).length}개 / 자체 prop ${total}개 → src/generated/props.json`,
);
for (const w of warnings) console.warn("  ⚠️ " + w);
if (warnings.length) process.exit(1);

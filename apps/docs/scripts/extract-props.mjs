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
    name: "TextfieldBtn",
    file: "components/Textfield/TextfieldBtn.tsx",
    type: "TextfieldBtnProps",
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
  { name: "Icon", file: "components/Icon/Icon.tsx", type: "IconProps" },
];

const entryFiles = [
  ...new Set(TARGETS.map((t) => join(UI_ROOT, "src", t.file))),
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
 * 선언에 적힌 타입 텍스트 (checker 문자열보다 사람이 읽기 좋다).
 * 단 선언이 여럿이면(판별 유니온의 각 갈래 등) 한 갈래만 보여주게 되므로
 * checker 가 합성한 타입 문자열을 쓴다.
 */
function typeTextOf(symbol, fallbackType) {
  const decls = symbol.getDeclarations() ?? [];
  if (decls.length === 1) {
    const decl = decls[0];
    if (ts.isPropertySignature(decl) && decl.type) {
      return decl.type.getText().replace(/\s+/g, " ");
    }
  }
  return checker.typeToString(fallbackType).replace(/\s+/g, " ");
}

/** 컴포넌트 함수의 구조분해 기본값을 뽑는다 */
function collectDefaults(sourceFile) {
  const defaults = {};
  const visit = (node) => {
    let params = null;
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      params = node.parameters;
    }
    if (params?.[0] && ts.isObjectBindingPattern(params[0].name)) {
      for (const el of params[0].name.elements) {
        if (el.initializer) {
          defaults[el.name.getText()] = el.initializer.getText();
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
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
  const defaults = collectDefaults(sourceFile);

  const own = [];
  let inheritedCount = 0;

  for (const prop of checker.getPropertiesOfType(type)) {
    if (!isOwnDeclaration(prop)) {
      inheritedCount += 1;
      continue;
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

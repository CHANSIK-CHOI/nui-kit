#!/usr/bin/env node
// M1 검증 하네스 — 기준선(@nui-kit/react@0.2.0 npm tarball) 대 후보 패키지를 브라우저의 계산된 스타일로 비교한다.
//
//   node packages/ui/scripts/m1/run.mjs [--base <dir|0.2.0>] [--cand <dir>] [--scope <json>] [--self]
//
//   --base  기준선 패키지 디렉터리. 기본은 `npm pack @nui-kit/react@0.2.0` 을 .m1-cache 에 풀어 쓴다(git 태그 v0.2.0 은 없다)
//   --cand  후보 패키지 디렉터리. 기본은 packages/ui (build:ui 를 먼저 돌린다)
//   --scope M1 에서 의도적으로 발자국을 바꾼 훅 목록 { "<hook>": { "cells": ["LayerPopup|*", ...] } } — M0 목록에서 온다
//   --self  기준선 대 기준선(자기 대조). 회귀 검사(R*)는 전부 PASS, 능력 검사(C*)는 0.2.0 이 못 하므로 전부 FAIL 이어야
//           exit 0 이다 — 능력 검사가 살아 있다는 검출력 시험을 겸한다
//
// 마지막 줄: RECEIPT m1-harness cells= nodes= hooks= pass= fail= exit=   (rules/scripts.md §1)
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const UI = resolve(HERE, "../..");
const ROOT = resolve(UI, "../..");
const CACHE = join(UI, ".m1-cache");
const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i < 0 ? undefined : args[i + 1];
};
const SELF = args.includes("--self");

let cells = 0,
  nodes = 0,
  hookCount = 0,
  pass = 0,
  fail = 0;
process.on("exit", (code) =>
  console.log(
    `RECEIPT m1-harness mode=${SELF ? "self" : "cand"} cells=${cells} nodes=${nodes} hooks=${hookCount} pass=${pass} fail=${fail} exit=${code}`,
  ),
);

function baselineDir() {
  const d = join(CACHE, "base-0.2.0", "package");
  if (existsSync(join(d, "package.json"))) return d;
  mkdirSync(join(CACHE, "base-0.2.0"), { recursive: true });
  const tgz = execFileSync(
    "npm",
    ["pack", "@nui-kit/react@0.2.0", "--silent", "--pack-destination", CACHE],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .pop();
  execFileSync("tar", [
    "xzf",
    join(CACHE, tgz),
    "-C",
    join(CACHE, "base-0.2.0"),
  ]);
  return d;
}
const BASE =
  opt("--base") && opt("--base") !== "0.2.0"
    ? resolve(opt("--base"))
    : baselineDir();
const CAND = SELF ? BASE : resolve(opt("--cand") ?? UI);
const SCOPE = opt("--scope")
  ? JSON.parse(readFileSync(opt("--scope"), "utf8"))
  : {};

// ── 공개 훅 표면: styles/*.css 에서 `--nui-<컴포넌트>--<…>` 이름 (0.2.0 = 68) ─────────────
export function hooksOf(pkg) {
  const set = new Set();
  const dir = join(pkg, "styles");
  for (const f of readdirSync(dir))
    if (f.endsWith(".css"))
      for (const m of readFileSync(join(dir, f), "utf8").matchAll(
        /--nui-[a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9-]+/g,
      ))
        set.add(m[0]);
  return [...set].sort();
}

async function bundle(pkg, tag) {
  const out = join(CACHE, tag);
  mkdirSync(out, { recursive: true });
  const exp = JSON.parse(
    readFileSync(join(pkg, "package.json"), "utf8"),
  ).exports;
  const alias = {};
  for (const [k, v] of Object.entries(exp))
    if (!k.includes("*") && typeof v === "object" && v.default)
      alias[k === "." ? "@nui-kit/react" : `@nui-kit/react${k.slice(1)}`] =
        join(pkg, v.default);
  await build({
    entryPoints: [join(HERE, "fixture.jsx")],
    bundle: true,
    format: "iife",
    outfile: join(out, "app.js"),
    jsx: "automatic",
    alias: { ...alias, "next/link": join(HERE, "next-link-shim.jsx") },
    nodePaths: [join(ROOT, "node_modules")],
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "error",
    loader: { ".js": "jsx" },
  });
  copyFileSync(join(pkg, "styles", "index.css"), join(out, "index.css"));
  writeFileSync(
    join(out, "index.html"),
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"><link rel="stylesheet" href="index.css"><style id="m1-consumer"></style></head><body><div id="root"></div><script src="app.js"></script></body></html>`,
  );
  return pathToFileURL(join(out, "index.html")).href;
}

// 페이지 안에서 도는 측정기 — 셀마다 자기 + 자손의 계산된 스타일
const PROPS = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "row-gap",
  "column-gap",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "color",
  "background-color",
  "border-top-color",
  "box-shadow",
  "opacity",
  "display",
];
function measure(PROPS) {
  const cellsOf = () => {
    const out = [];
    for (const el of document.querySelectorAll("[data-h]"))
      out.push([el.dataset.h, el]);
    for (const el of document.querySelectorAll('[class*="m1h--"]')) {
      const c = [...el.classList].find((x) => x.startsWith("m1h--"));
      const [, comp, cs] = c.split("--");
      out.push([`${comp}|${cs}`, el]);
    }
    return out;
  };
  const snap = {};
  for (const [key, root] of cellsOf()) {
    const walk = (el, path) => {
      const cs = getComputedStyle(el);
      const v = {};
      for (const p of PROPS) v[p] = cs.getPropertyValue(p);
      const cls = [...el.classList]
        .filter((c) => c.startsWith("nui-"))
        .join(".");
      snap[`${key}/${path}`] = { tag: el.tagName.toLowerCase(), cls, v };
      for (const pe of ["::before", "::after"]) {
        const ps = getComputedStyle(el, pe);
        if (ps.getPropertyValue("content") === "none") continue;
        const pv = {};
        for (const p of PROPS) pv[p] = ps.getPropertyValue(p);
        snap[`${key}/${path}${pe}`] = { tag: pe, cls, v: pv };
      }
      [...el.children].forEach((c, i) => walk(c, `${path}>${i}`));
    };
    walk(root, "0");
  }
  return snap;
}

function diff(a, b) {
  const out = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!a[k] || !b[k]) {
      out.push({ node: k, prop: "(node)", a: !!a[k], b: !!b[k] });
      continue;
    }
    for (const p of Object.keys(a[k].v))
      if (a[k].v[p] !== b[k].v[p])
        out.push({ node: k, prop: p, a: a[k].v[p], b: b[k].v[p] });
  }
  return out;
}

async function open(browser, url, css = "", hash = "") {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
  });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(url + hash);
  try {
    await page.waitForSelector("body[data-m1-ready]", {
      timeout: 20000,
      state: "attached",
    });
  } catch (e) {
    throw new Error(
      `fixture 준비 실패 ${url}: ${errs.join(" | ") || e.message}`,
    );
  }
  await page.evaluate((c) => {
    document.getElementById("m1-consumer").textContent = c;
  }, css);
  await page.waitForTimeout(100);
  return page;
}

// 훅마다 발자국: 표식 값 둘(길이 · 수)을 :root 에 선언했을 때 바뀌는 (셀 · 노드 · 속성)
async function footprints(page, hooks) {
  return page.evaluate(
    async ({ hooks, PROPS, measureSrc }) => {
      const measure = new Function(`return (${measureSrc})`)();
      const st = document.getElementById("m1-consumer");
      const base = measure(PROPS);
      const res = {};
      for (const h of hooks) {
        const ch = new Set();
        for (const val of ["137px", "901"]) {
          st.textContent = `:root{${h}:${val}}`;
          const s = measure(PROPS);
          for (const k of Object.keys(base))
            for (const p of PROPS)
              if (s[k] && s[k].v[p] !== base[k].v[p]) ch.add(`${k}#${p}`);
        }
        st.textContent = "";
        res[h] = [...ch].sort();
      }
      return res;
    },
    { hooks, PROPS, measureSrc: measure.toString() },
  );
}

const cellOf = (entry) => entry.split("/")[0];
const matchCell = (pat, cell) =>
  new RegExp(
    "^" + pat.replace(/[.+?^${}()[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
  ).test(cell);

const results = [];
const report = (id, kind, spec, ok, detail) => {
  results.push({ id, kind, spec, ok, detail });
};

const browser = await chromium.launch();
try {
  const baseUrl = await bundle(BASE, "base");
  const candUrl = SELF ? baseUrl : await bundle(CAND, "cand");
  const baseHooks = hooksOf(BASE),
    candHooks = hooksOf(CAND);
  hookCount = baseHooks.length;

  // R1 — 훅 무변경 시 렌더 동일
  const pb = await open(browser, baseUrl),
    pc = await open(browser, candUrl);
  const sb = await pb.evaluate(measure, PROPS),
    sc = await pc.evaluate(measure, PROPS);
  cells = new Set(Object.keys(sb).map(cellOf)).size;
  nodes = Object.keys(sb).length;
  if (cells === 0 || nodes === 0)
    throw new Error("셀 0 — fixture 가 안 그려졌다");
  // 후보가 표식 클래스만 더한 경우는 값 비교 대상이 아니다 — 계산된 값만 본다(노드 수 차이는 실패)
  const d1 = diff(sb, sc);
  report(
    "R1-render-identical",
    "regression",
    "§7-2 ①",
    d1.length === 0,
    `cells=${cells} nodes=${nodes} diffs=${d1.length}` +
      (d1.length ? ` 예: ${JSON.stringify(d1.slice(0, 3))}` : ""),
  );

  // R2 · R3 — 0.2.0 공개 훅 68개 전부에 표식 값을 선언한 소비자 CSS 가 같은 계산된 스타일을 낸다 (:root · 요소 자리)
  const decl = baseHooks.map((h, i) => `${h}:${101 + i}px`).join(";");
  for (const [id, css] of [
    ["R2-hook-surface-root", `:root{${decl}}`],
    ["R3-hook-surface-narrow", `*{${decl}}`],
  ]) {
    const a = await open(browser, baseUrl, css),
      b = await open(browser, candUrl, css);
    const d = diff(
      await a.evaluate(measure, PROPS),
      await b.evaluate(measure, PROPS),
    );
    report(
      id,
      "regression",
      "§7-2 D1 (0.2.0 공개 훅 표면 전체)",
      d.length === 0,
      `hooks=${baseHooks.length} diffs=${d.length}` +
        (d.length ? ` 예: ${JSON.stringify(d.slice(0, 3))}` : ""),
    );
    await a.close();
    await b.close();
  }

  // R4 — 훅 발자국: 0.2.0 훅마다 바꾸는 (셀 · 노드 · 속성) 이 후보에서도 같다. --scope 에 적힌 훅은 선언한 셀 안으로만 좁아져야 한다
  const fpB = await footprints(pb, baseHooks);
  const fpC = SELF ? fpB : await footprints(pc, candHooks);
  const bad = [];
  const inScope = (h, e) => {
    const s = SCOPE[h];
    const [nodeKey, prop] = e.split("#");
    if (!s.cells.some((p) => matchCell(p, cellOf(e)))) return false;
    if (s.props && !s.props.includes(prop)) return false;
    if (
      s.nodes &&
      !s.nodes.some((n) => (sc[nodeKey]?.cls ?? "").split(".").includes(n))
    )
      return false;
    return true;
  };
  for (const h of baseHooks) {
    const cH = fpC[h];
    if (!cH) {
      bad.push(`${h}: 후보에 없음(이름 변경이면 --scope 와 이행표로)`);
      continue;
    }
    if (fpB[h].length === 0)
      bad.push(
        `${h}: 기준선 발자국 0 — 측정 fixture 가 이 훅의 자리를 안 그린다`,
      );
    if (SCOPE[h]) {
      const out = cH.filter((e) => !inScope(h, e));
      if (out.length)
        bad.push(`${h}: 선언 밖 ${out.length} (${out.slice(0, 2).join(", ")})`);
    } else if (JSON.stringify(cH) !== JSON.stringify(fpB[h]))
      bad.push(`${h}: 발자국 변화 ${fpB[h].length}→${cH.length}`);
  }
  // 새 훅은 --scope(M0 목록)에 있어야 하고, 선언한 셀 · 요소 · 속성 밖을 바꾸지 않아야 한다 (§7-2 ③ ④ ⑦)
  for (const h of candHooks)
    if (!baseHooks.includes(h)) {
      if (!SCOPE[h]) {
        bad.push(`${h}(새 훅): --scope 에 없음 — M0 목록에 이유 없이 생긴 훅`);
        continue;
      }
      if ((fpC[h] ?? []).length === 0) bad.push(`${h}(새 훅): 발자국 0`);
      const out = (fpC[h] ?? []).filter((e) => !inScope(h, e));
      if (out.length)
        bad.push(
          `${h}(새 훅): 선언 밖 ${out.length} (${out.slice(0, 2).join(", ")})`,
        );
    }
  writeFileSync(
    join(CACHE, "footprints.base.json"),
    JSON.stringify(fpB, null, 1),
  );
  report(
    "R4-hook-footprint",
    "regression",
    "§7-2 ③ ④ ⑦ (격리 · 새 훅은 M0 목록)",
    bad.length === 0,
    `hooks=${baseHooks.length} new=${candHooks.filter((h) => !baseHooks.includes(h)).length} scoped=${Object.keys(SCOPE).length} bad=${bad.length}` +
      (bad.length ? ` ${bad.slice(0, 4).join(" | ")}` : ""),
  );

  // R6 — LayerPopup 격리: 0.2.0 에 없던 훅 중 LayerPopup 을 바꾸는 훅은 BottomSheet · FullPopup · Alert · Confirm 을 바꾸지 않는다
  const lp = candHooks.filter(
    (h) =>
      !baseHooks.includes(h) &&
      (fpC[h] ?? []).some((e) => e.startsWith("LayerPopup|")),
  );
  const leak = lp.filter((h) =>
    fpC[h].some((e) => /^(BottomSheet|FullPopup|Alert|Confirm)\|/.test(e)),
  );
  report(
    "R6-layerpopup-isolation",
    "regression",
    "§7-2 ②",
    leak.length === 0,
    `layerpopup 새 훅=${lp.length} 누수=${leak.join(",") || 0}`,
  );

  // R5 — portal inert: 팝업이 열려도 body 직계 portal 표식 요소는 inert 가 아니고, 다른 body 직계는 inert 다 (usePopupHostA11y L69)
  const inert = await pc.evaluate(() => {
    const kids = [...document.body.children].filter(
      (e) => e.tagName !== "SCRIPT",
    );
    const portal = kids.filter((e) => e.hasAttribute("data-nui-portal-root"));
    const other = kids.filter(
      (e) => !e.hasAttribute("data-nui-portal-root") && e.id !== "m1-probe",
    );
    return {
      portal: portal.length,
      portalInert: portal.filter((e) => e.inert).length,
      other: other.length,
      otherInert: other.filter((e) => e.inert).length,
    };
  });
  report(
    "R5-portal-inert",
    "regression",
    "platform 조건 ③ · E-1",
    inert.portal > 0 &&
      inert.portalInert === 0 &&
      inert.other > 0 &&
      inert.otherInert === inert.other,
    JSON.stringify(inert),
  );

  // C1 · C2 — Button 텍스트 font-size / font-weight 를 바꾸는 훅이 있다
  for (const [id, prop] of [
    ["C1-button-font-size", "font-size"],
    ["C2-button-font-weight", "font-weight"],
  ]) {
    const hs = candHooks.filter((h) =>
      (fpC[h] ?? []).some(
        (e) => e.startsWith("Button|") && e.endsWith(`#${prop}`),
      ),
    );
    report(
      id,
      "capability",
      `§7-2 ${prop === "font-size" ? "⑤" : "⑥"}`,
      hs.length > 0,
      `hooks=${hs.join(",") || "없음"}`,
    );
  }
  // C3 — 팝업 크기 훅 이름이 prop 값(large · medium · small)을 쓴다
  const pop = candHooks.filter(
    (h) =>
      /^--nui-(layer-)?popup--/.test(h) &&
      /(lg|md|sm|large|medium|small)-/.test(h),
  );
  report(
    "C3-popup-size-names",
    "capability",
    "§7-2 ⑧",
    pop.length > 0 && pop.every((h) => /--(large|medium|small)-/.test(h)),
    `popup 크기 훅=${pop.join(",")}`,
  );
  // C4 — Datepicker 3종 루트 표식이 서로 다르다 · C5 — ButtonLink <a> 와 getButtonClassName <a> 가 구별된다
  const marks = await pc.evaluate(() => {
    const sig = (el) =>
      [
        ...[...el.classList].filter((c) => !/(large|medium|small)/.test(c)),
        ...[...el.attributes]
          .filter((a) => a.name.startsWith("data-"))
          .map((a) => `${a.name}=${a.value}`),
      ]
        .sort()
        .join(" ");
    const root = (h) =>
      document.querySelector(`[data-h="${h}"]`)?.firstElementChild;
    return {
      dp: [
        "Datepicker|medium",
        "DateRangePicker|medium",
        "DateMultiplePicker|medium",
      ].map((h) => sig(root(h))),
      bl: sig(root("ButtonLink|medium")),
      gb: sig(root("getButtonClassName|medium")),
    };
  });
  report(
    "C4-datepicker-root-markers",
    "capability",
    "§7-2 ⑩",
    new Set(marks.dp).size === 3,
    JSON.stringify(marks.dp),
  );
  report(
    "C5-buttonlink-marker",
    "capability",
    "§7-2 ⑪",
    marks.bl !== marks.gb,
    `ButtonLink=[${marks.bl}] getButtonClassName=[${marks.gb}]`,
  );

  // 표면 스냅샷(이행표 diff 입력) — 훅 이름 + 발자국 셀 + 루트 표식
  const snap = (hooks, fp) => ({
    hooks: Object.fromEntries(
      hooks.map((h) => [h, [...new Set((fp[h] ?? []).map(cellOf))].sort()]),
    ),
    markers: marks,
  });
  writeFileSync(
    join(CACHE, SELF ? "surface.base-0.2.0.json" : "surface.cand.json"),
    JSON.stringify(snap(candHooks, fpC), null, 1),
  );
} finally {
  await browser.close();
}

for (const r of results) {
  const expected = SELF && r.kind === "capability" ? !r.ok : r.ok;
  const tag = r.ok ? "PASS" : "FAIL";
  console.log(
    `${tag}  ${r.id.padEnd(28)} [${r.kind}${SELF && r.kind === "capability" ? " · 0.2.0 기대 FAIL" : ""}] ${r.spec} — ${r.detail}`,
  );
  expected ? pass++ : fail++;
}
process.exit(fail === 0 ? 0 : 1);

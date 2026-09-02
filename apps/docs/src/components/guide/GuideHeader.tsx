import type { ReactNode } from "react";

/**
 * 컴포넌트 가이드 페이지의 머리말.
 *
 * 제목 · 한 줄 설명 · import 블록을 한 자리에서 만든다. 페이지마다 손으로 쓰면
 * import 경로가 실제 서브패스와 어긋나기 쉽다 — `Search` 와 `Password` 는
 * 서브패스가 따로 없고 `textfield` 에 들어 있다.
 */
export function GuideHeader({
  title,
  children,
  named,
  subpath,
  css,
}: {
  title: string;
  /** 한 줄 설명. 무엇을 하는 것인지만 쓴다 */
  children: ReactNode;
  /** 배럴에서 가져올 이름들 */
  named: string[];
  /** 서브패스 이름. 생략하면 배럴만 보여준다 */
  subpath?: string;
  /** 온디맨드 CSS 파일 이름. 생략하면 `subpath` 와 같다고 본다 */
  css?: string;
}) {
  const cssName = css ?? subpath;

  return (
    <>
      <h1>{title}</h1>
      <p className="doc-lead">{children}</p>
      <pre className="doc-code">
        <code>{`import { ${named.join(", ")} } from "@chansikchoi/next-ui";${
          subpath
            ? `
// 서브패스로 좁힐 때
import { ${named[0]} } from "@chansikchoi/next-ui/${subpath}";`
            : ""
        }${
          cssName
            ? `
import "@chansikchoi/next-ui/styles/${cssName}.css";   // 온디맨드일 때`
            : ""
        }`}</code>
      </pre>
    </>
  );
}

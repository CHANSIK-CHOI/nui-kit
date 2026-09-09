import Link from "next/link";
import {
  AttentionIcon,
  CalendarIcon,
  CloseIcon,
  DelIcon,
  HidePwIcon,
  Icon,
  SearchIcon,
  ShowPwIcon,
  SpinnerIcon,
  SuccessIcon,
} from "@nui-kit/react/icon";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  PropsTable,
} from "@/components/guide";
import { IconRow, IconSizeDemo, IconColorDemo } from "./IconDemo";

export const metadata = { title: "Icon" };

/** 배럴이 내보내는 아홉. 어디에 쓰이는지는 소스에서 셌다 */
const ICONS = [
  {
    name: "DelIcon",
    lucide: "X",
    Comp: DelIcon,
    where: "입력창의 지우기 버튼",
  },
  {
    name: "CloseIcon",
    lucide: "X",
    Comp: CloseIcon,
    where: "팝업 · 토스트의 닫기 버튼",
  },
  {
    name: "SearchIcon",
    lucide: "Search",
    Comp: SearchIcon,
    where: "검색 버튼",
  },
  {
    name: "ShowPwIcon",
    lucide: "Eye",
    Comp: ShowPwIcon,
    where: "비밀번호 보기",
  },
  {
    name: "HidePwIcon",
    lucide: "EyeOff",
    Comp: HidePwIcon,
    where: "비밀번호 숨기기",
  },
  {
    name: "CalendarIcon",
    lucide: "Calendar",
    Comp: CalendarIcon,
    where: "달력 열기 버튼",
  },
  {
    name: "AttentionIcon",
    lucide: "CircleAlert",
    Comp: AttentionIcon,
    where: "에러 메시지 · Alert · Confirm",
  },
  {
    name: "SuccessIcon",
    lucide: "CircleCheck",
    Comp: SuccessIcon,
    where: "성공 토스트",
  },
  {
    name: "SpinnerIcon",
    lucide: "LoaderCircle",
    Comp: SpinnerIcon,
    where: "버튼의 로딩",
  },
] as const;

export default function IconPage() {
  return (
    <>
      <GuideHeader
        title="Icon"
        named={["Icon", "DelIcon", "SpinnerIcon"]}
        subpath="icon"
      />

      <ExceptionBadges items={[{ kind: "noSize", target: "Icon" }]} />

      <p>
        컴포넌트가 쓰는 아이콘 아홉과, 직접 만든 SVG 를 같은 규칙에 얹는{" "}
        <code>Icon</code> 래퍼다. 전부 <code>lucide-react</code> 위의 어댑터라
        소비자가 lucide 를 바로 써도 선 굵기가 섞이지 않는다. 크기 자리와 읽히는
        아이콘의 규칙은{" "}
        <Link href="/foundations/icon">Foundations · 아이콘</Link> 에 있다.
      </p>

      <h2>아홉 아이콘</h2>
      <p>이름은 자리를 말한다. 같은 모양이라도 자리가 다르면 이름이 다르다.</p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th></th>
              <th>이름</th>
              <th>lucide</th>
              <th>쓰이는 자리</th>
            </tr>
          </thead>
          <tbody>
            {ICONS.map(({ name, lucide, Comp, where }) => (
              <tr key={name}>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      width: 20,
                      height: 20,
                      color: "var(--nui-text-primary)",
                    }}
                  >
                    <Comp size={20} />
                  </span>
                </td>
                <td>
                  <code>{name}</code>
                </td>
                <td>
                  <code>{lucide}</code>
                </td>
                <td className="doc-wrap">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="doc-code">
        <code>{`import { SearchIcon } from "@nui-kit/react/icon";

<SearchIcon size={20} />`}</code>
      </pre>

      <DesignNote title="왜 DelIcon 과 CloseIcon 이 따로 있나">
        <p>
          둘 다 lucide 의 X 다. 그래도 이름을 나눈 것은 자리가 다르기 때문이다.
          하나는 입력값을 지우고 하나는 창을 닫는다. 나중에 한쪽만 모양을 바꿔야
          할 때 다른 쪽이 따라오지 않아야 한다. 값이 같아도 역할이 다르면 이름을
          나누는 토큰 규칙과 같다.
        </p>
      </DesignNote>

      <h2>읽히는 아이콘</h2>
      <p>
        <code>title</code> 이 있으면 <code>role=&quot;img&quot;</code> 와{" "}
        <code>&lt;title&gt;</code> 이 붙어 스크린리더가 읽는다. 없으면{" "}
        <code>aria-hidden</code> 이라 건너뛴다. 옆에 글자가 있거나 버튼이 이름을
        갖고 있으면 <code>title</code> 없이 두는 쪽이 맞다.
      </p>
      <IconRow
        code={`<SuccessIcon title="완료" />   // 읽힌다
<SuccessIcon />              // 장식`}
        items={[
          {
            label: "title",
            note: 'role="img"',
            node: <SuccessIcon size={20} title="완료" />,
          },
          {
            label: "없음",
            note: "aria-hidden",
            node: <SuccessIcon size={20} />,
          },
        ]}
      />

      <h2>크기</h2>
      <p>
        <code>size</code> 하나로 정사각을 준다. 자리마다 쓰는 값은 넷이다. 버튼
        안 20, 작은 버튼과 상태 표시 16, 입력 보조 버튼과 토스트 24, 목록의 작은
        표시 14.
      </p>
      <IconSizeDemo />

      <h2>색</h2>
      <p>
        글자색을 물려받는다. 버튼 안에 넣으면 버튼 글자색을, 메시지 옆에 두면
        메시지 색을 따른다. 따로 주려면 <code>color</code> 다.
      </p>
      <IconColorDemo />

      <h2>회전</h2>
      <p>
        <code>SpinnerIcon</code> 은 1초에 한 바퀴 돈다.{" "}
        <code>prefers-reduced-motion</code> 에서는 멈춘다. 이 라이브러리에서 2초
        넘게 이어지는 유일한 움직임이라 상태는 아이콘이 아니라 옆의 글자가
        전한다.
      </p>
      <IconRow
        code={`<SpinnerIcon size={20} />`}
        items={[
          { label: "SpinnerIcon", note: "돈다", node: <SpinnerIcon size={20} /> },
          {
            label: "title 과 함께",
            note: "읽힌다",
            node: <SpinnerIcon size={20} title="불러오는 중" />,
          },
        ]}
      />

      <h2>다른 아이콘이 필요하면</h2>
      <p>
        아홉 밖의 아이콘은 <code>lucide-react</code> 에서 바로 가져온다. 이
        라이브러리가 쓰는 세트와 같아 한 화면에서 선 굵기가 섞이지 않는다.
        이름은{" "}
        <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">
          lucide.dev/icons
        </a>{" "}
        에서 찾는다. 소비자 프로젝트의 의존성에 <code>lucide-react</code> 를
        직접 더한다. 이 라이브러리가 쓰고 있어도 소비자가 import 하려면 자기
        것이어야 한다.
      </p>
      <pre className="doc-code">
        <code>{`npm i lucide-react

import { Star } from "lucide-react";

<Button icon={<Star size={20} />}>즐겨찾기</Button>
<IconButton aria-label="즐겨찾기"><Star size={20} /></IconButton>`}</code>
      </pre>
      <div className="doc-note">
        lucide 아이콘은 기본이 <code>aria-hidden</code> 이라 장식으로 들어간다.
        뜻을 전해야 하면 버튼이나 옆 글자가 이름을 갖게 한다. 아이콘 자체가
        읽혀야 하면 아래처럼 <code>Icon</code> 으로 감싸고 <code>title</code> 을
        준다.
      </div>

      <h2>직접 만든 SVG</h2>
      <p>
        <code>Icon</code> 에 <code>viewBox</code> 와 path 를 넣으면 크기 · 색 ·
        읽힘 규칙이 같이 따라온다. lucide 에 있는 아이콘이면 바로 가져오는 편이
        짧다.
      </p>
      <IconRow
        code={`<Icon viewBox="0 0 24 24" size={20} title="별점">
  <path d="…" fill="currentColor" />
</Icon>

import { Star } from "lucide-react";
<Star size={20} />`}
        items={[
          {
            label: "Icon 으로 감싼다",
            note: "같은 규칙",
            node: (
              <Icon viewBox="0 0 24 24" size={20} title="별점">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="currentColor"
                />
              </Icon>
            ),
          },
          {
            label: "lucide 그대로",
            note: "같은 세트",
            node: (
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ),
          },
        ]}
      />

      <DesignNote title="왜 lucide 인가">
        <p>
          24px 격자에 stroke 2 인 line 아이콘이고 크기에 비례해 선이 가늘어진다.
          컴포넌트가 쓰는 아홉을 라이브러리 이름으로 감싸 두면 소비자가 같은
          세트에서 다른 아이콘을 골라도 한 화면에서 선 굵기가 같다. 세트를 두 개
          섞으면 그 차이가 먼저 보인다.
        </p>
      </DesignNote>

      <h2>API</h2>
      <p>
        아홉 아이콘은 아래 표에서 <code>children</code> 과 <code>viewBox</code>{" "}
        를 뺀 것을 받는다.
      </p>
      <PropsTable of="Icon" />
    </>
  );
}

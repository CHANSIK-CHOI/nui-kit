import Link from "next/link";
import { Star } from "lucide-react";
import {
  AttentionIcon,
  CalendarIcon,
  CloseIcon,
  DelIcon,
  HidePwIcon,
  Icon,
  SearchIcon,
  ShowPwIcon,
  InfoIcon,
  SpinnerIcon,
  SuccessIcon,
  WarningIcon,
} from "@nui-kit/react/icon";
import { GuideHeader, DesignNote, PropsTable } from "@/components/guide";
import { IconRow, IconSizeDemo, IconColorDemo } from "./IconDemo";

export const metadata = { title: "Icon" };

/** 배럴이 내보내는 열하나. 어디에 쓰이는지는 소스에서 셌다 */
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
    where: "에러 메시지 · 에러 토스트 · Alert · Confirm 의 danger",
  },
  {
    name: "SuccessIcon",
    lucide: "CircleCheck",
    Comp: SuccessIcon,
    where: "성공 토스트 · Alert · Confirm 의 success",
  },
  {
    name: "InfoIcon",
    lucide: "Info",
    Comp: InfoIcon,
    where: "Alert · Confirm 의 기본",
  },
  {
    name: "WarningIcon",
    lucide: "TriangleAlert",
    Comp: WarningIcon,
    where: "Alert · Confirm 의 warning",
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

      <p>
        아이콘이 지나는 문 하나다. <code>lucide-react</code> 의 아이콘을{" "}
        <code>icon</code> 으로 넘기거나 직접 그린 SVG 를 넣으면 크기 · 색 상속 ·
        읽힘 규칙이 같이 따라온다. 컴포넌트가 쓰는 열하나와 <code>Select</code>{" "}
        · <code>Datepicker</code> · <code>Accordion</code> 의 화살표도 같은 문을
        지난다. 크기 자리와 읽히는 아이콘의 규칙은{" "}
        <Link href="/foundations/icon">Foundations · 아이콘</Link> 에 있다.
      </p>

      <h2>열한 아이콘</h2>
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
          {
            label: "SpinnerIcon",
            note: "돈다",
            node: <SpinnerIcon size={20} />,
          },
          {
            label: "title 과 함께",
            note: "읽힌다",
            node: <SpinnerIcon size={20} title="불러오는 중" />,
          },
        ]}
      />

      <h2>다른 아이콘이 필요하면</h2>
      <p>
        열하나 밖의 아이콘은 <code>lucide-react</code> 에서 가져와{" "}
        <code>icon</code> 으로 넘긴다. 이름은{" "}
        <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">
          lucide.dev/icons
        </a>{" "}
        에서 찾는다. <code>lucide-react</code> 는 이 라이브러리와 소비자
        프로젝트가 <strong>같은 한 벌을 나눠 쓰는</strong> peer 라 프로젝트에
        직접 설치한다.
      </p>
      <IconRow
        code={`import { Star } from "lucide-react";
import { Icon } from "@nui-kit/react";

<Icon icon={<Star />} size={20} />
<Button icon={<Icon icon={<Star />} />}>즐겨찾기</Button>`}
        items={[
          {
            label: "icon 으로 넘긴다",
            note: "프리셋과 같은 규칙",
            node: <Icon icon={<Star />} size={20} />,
          },
          {
            label: "title 과 함께",
            note: "읽힌다",
            node: <Icon icon={<Star />} size={20} title="즐겨찾기" />,
          },
        ]}
      />
      <div className="doc-note">
        <code>Icon</code> 을 지나면 크기 · 색 상속 · 읽힘 규칙이 프리셋과
        같아진다. 아이콘 전용 버튼에서는 버튼이 이름을 갖고 아이콘은{" "}
        <code>title</code> 없이 둔다.
      </div>

      <h2>직접 그린 SVG</h2>
      <p>
        lucide 에 없는 모양은 <code>viewBox</code> 와 도형을 직접 넣는다. 같은{" "}
        <code>Icon</code> 이라 크기 · 색 · 읽힘 규칙이 그대로 따라온다.
      </p>
      <IconRow
        code={`<Icon viewBox="0 0 24 24" size={20} title="별점">
  <path d="…" fill="currentColor" />
</Icon>`}
        items={[
          {
            label: "viewBox 와 도형",
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
        ]}
      />

      <DesignNote title="왜 lucide 인가">
        <p>
          24px 격자에 stroke 2 인 line 아이콘이고 크기에 비례해 선이 가늘어진다.
          세트를 두 개 섞으면 그 차이가 먼저 보인다.
        </p>
        <p>
          <code>lucide-react</code> 가 peer 인 것도 같은 이유다. 두 벌이
          설치되면 한 화면의 아이콘이 두 세트에서 오고, 소비자가{" "}
          <code>LucideProvider</code> 로 선 굵기를 맞춰도 라이브러리 안 아이콘만
          그대로 남는다. 버전이 갈리면 같은 이름이 다른 모양이 되기도 한다.
        </p>
      </DesignNote>

      <h2>API</h2>
      <p>
        열한 아이콘은 아래 표에서 <code>icon</code> · <code>viewBox</code> ·{" "}
        <code>children</code> 을 뺀 것을 받는다.
      </p>
      <PropsTable of="Icon" />
    </>
  );
}

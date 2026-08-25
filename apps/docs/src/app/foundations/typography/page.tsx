import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "타이포그래피" };

const SCALES = [
  { key: "label", label: "label", usage: "보조 설명, 캡션, 에러 메시지" },
  { key: "body-sm", label: "body-sm", usage: "라벨, 작은 버튼" },
  { key: "body", label: "body", usage: "기본 본문, 입력값, 버튼" },
  { key: "title", label: "title", usage: "섹션 제목" },
  { key: "display", label: "display", usage: "페이지 헤드라인" },
];

export default function TypographyPage() {
  return (
    <>
      <h1>타이포그래피</h1>
      <p className="doc-lead">
        5단계 스케일. 각 단계는 크기·굵기·행간·자간을 한 벌로 묶는다.
      </p>

      <div className="doc-note">
        폰트는 배포하지 않는다. <code>--nui-font-family-base</code> 의 기본값은{" "}
        <code>inherit</code> 이므로{" "}
        <strong>소비자 앱의 폰트를 그대로 따른다.</strong>
      </div>

      <h2>스케일</h2>
      {SCALES.map((scale) => (
        <div key={scale.key} className="doc-example">
          <div className="doc-example__preview">
            <span
              style={{
                fontSize: `var(--nui-font-size-${scale.key})`,
                fontWeight: `var(--nui-font-weight-${scale.key})`,
                lineHeight: `var(--nui-line-height-${scale.key})`,
                letterSpacing: `var(--nui-letter-spacing-${scale.key})`,
              }}
            >
              다람쥐 헌 쳇바퀴에 타고파 — The quick brown fox 0123
            </span>
          </div>
          <p className="doc-example__caption">
            <code>{scale.label}</code> · {scale.usage}
          </p>
        </div>
      ))}

      <h2>토큰</h2>
      <TokenTable group="typography" />

      <div className="doc-note doc-note--warn">
        <strong>반응형 타이포는 현재 보류 상태다.</strong> 원본 디자인은
        데스크톱에서 일부 단계를 키웠으나, 브레이크포인트 대응은 별도 단계에서
        일괄 적용한다. 지금은 모든 뷰포트에서 같은 크기다.
      </div>
    </>
  );
}

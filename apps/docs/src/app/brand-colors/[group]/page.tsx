import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/generated/presets.json";
import { PresetCard, type Preset } from "../PresetCard";

/**
 * 색깔 구간마다 한 페이지. 185색을 한 페이지에 넣으면 2.1MB 가 된다 —
 * 접어둬도 HTML 에는 다 들어가기 때문이다. 나누면 가장 큰 빨강이 600KB 대다.
 */
export function generateStaticParams() {
  return data.groups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const g = data.groups.find((x) => x.slug === group);
  return { title: g ? `브랜드 색 — ${g.name}` : "브랜드 색" };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const g = data.groups.find((x) => x.slug === group);
  if (!g) notFound();

  const presets = (data.presets as Preset[]).filter((p) => p.group === group);
  const index = data.groups.findIndex((x) => x.slug === group);
  const prev = data.groups[index - 1];
  const next = data.groups[index + 1];

  return (
    <>
      <p className="preset-crumb">
        <Link href="/brand-colors">브랜드 색 고르기</Link>
      </p>

      <h1>
        {g.name}{" "}
        <span className="preset-range">
          {g.from}~{g.to}° · {g.count}색
        </span>
      </h1>

      <p className="doc-lead">
        왼쪽 동그라미가 <strong>고른 색</strong>이고, 아래 12칸이 그 색으로 만든
        결과다. <strong>테두리를 두른 9번이 고른 색이 앉는 자리</strong>다.
      </p>

      <div className="doc-note">
        <p>
          <strong>대부분은 고른 색이 9번에 그대로 들어간다.</strong> 다만 너무 밝은
          색은 어둡게 낮춘다 — <strong>9번은 버튼처럼 색으로 꽉 찬 면의 배경</strong>이라,
          밝으면 그 위에 흰 글자도 검은 글자도 읽히지 않기 때문이다.
        </p>
        <p>
          낮춘 경우에는 카드에 <em>밝아서 …로 낮춤</em> 이라고 적어뒀다.{" "}
          <strong>밝기가 76 언저리를 넘으면</strong> 그렇게 된다.
        </p>
      </div>

      <div className="preset-list">
        {presets.map((p) => (
          <PresetCard key={p.n} p={p} />
        ))}
      </div>

      <nav className="preset-pager" aria-label="색깔 이동">
        {prev ? (
          <Link href={`/brand-colors/${prev.slug}`}>← {prev.name}</Link>
        ) : (
          <span />
        )}
        {next ? <Link href={`/brand-colors/${next.slug}`}>{next.name} →</Link> : <span />}
      </nav>

      <p className="preset-jump">
        {data.groups.map((x) => (
          <Link
            key={x.slug}
            href={`/brand-colors/${x.slug}`}
            aria-current={x.slug === group ? "page" : undefined}
          >
            {x.name} <span>{x.count}</span>
          </Link>
        ))}
      </p>
    </>
  );
}

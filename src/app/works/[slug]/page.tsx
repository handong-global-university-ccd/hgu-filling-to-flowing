import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import OthersMarquee from "@/components/works/OthersMarquee";
import WorkCredits from "@/components/works/WorkCredits";
import { WORKS, getOtherWorks, getWork } from "@/data/works";
import { getDesigner } from "@/data/designers";
import { asset } from "@/lib/asset";

// 정적 export: 빌드 시 모든 작품 페이지를 미리 생성
export const dynamicParams = false;
export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.description,
    openGraph: { images: [asset(work.thumbnails[0])] },
  };
}

/**
 * Figma Works 상세 (1807:14520)
 * - 본문은 헤더(110) 아래 46px, 좌측 정보 338px + 간격 16 + 상세 설명 이미지
 * - 좌측: 작품 사진(338×225) → 타이틀·부제 → 설명 → 크레딧
 * - 좌측 안쪽 간격: 정보 묶음 24 / 제목·설명 20 / 크레딧은 890 높이 열의 맨 아래
 * - 작업물 아래 110 띄우고 Others, 제목 아래 16 에 352×222 썸네일 루프
 * - 마지막 콘텐츠와 푸터 사이 360
 */
export default async function WorkDetailPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const designers = work.designerSlugs.map(getDesigner).filter((d) => d !== undefined);
  const others = getOtherWorks(slug).map((w) => ({
    slug: w.slug,
    title: w.title,
    thumbnail: w.thumbnails[0],
  }));

  return (
    <PageShell>
      <article className="flex flex-col gap-4 px-margin pt-[46px] lg:flex-row lg:items-start">
        {/* 좌측 정보 — 스크롤해도 고정 */}
        {/* Figma: 좌측 열 높이 890, 크레딧은 열 맨 아래 (justify-between). 화면이 낮으면 줄어들고 최소 간격 104 */}
        <div className="flex w-full flex-col justify-between gap-[104px] lg:sticky lg:top-[126px] lg:min-h-[min(890px,calc(100svh-160px))] lg:w-[338px] lg:shrink-0">
          <div className="flex flex-col gap-6">
            {/* 타이틀 위 작품 사진 — 따로 없으면 대표 썸네일 */}
            <Image
              src={asset(work.photo ?? work.thumbnails[0])}
              alt={`${work.title} 작품 사진`}
              width={338}
              height={225}
              priority
              className="h-[225px] w-full object-cover"
            />
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <h1 className="font-kr text-kr-h4">{work.title}</h1>
                {work.subtitle && <p className="font-kr text-kr-body-lg">{work.subtitle}</p>}
              </div>
              <p className="font-kr text-kr-body-sm">{work.description}</p>
            </div>
          </div>

          <WorkCredits
            teamName={work.teamName}
            designers={designers.map((d) => ({ slug: d.slug, nameKo: d.nameKo }))}
          />
        </div>

        {/* 우측 상세 설명 이미지 — PDF를 페이지별 webp로 변환해서 나열 */}
        <div className="w-full min-w-0 space-y-4">
          {work.pages.length === 0 && (
            <div className="grid aspect-[1518/1000] place-items-center bg-bg-subtle text-fg-tertiary">
              작업물 이미지 (TODO)
            </div>
          )}
          {work.pages.map((src, i) => (
            <Image
              key={src}
              src={asset(src)}
              alt={`${work.title} ${i + 1}페이지`}
              width={1518}
              height={2024}
              className="w-full"
            />
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="pb-90" aria-label="같은 분야의 다른 작품">
          <h2 className="mt-[110px] mb-4 px-margin text-body-xl">Others</h2>
          <OthersMarquee items={others} />
        </section>
      )}
      {others.length === 0 && <div className="h-90" />}
    </PageShell>
  );
}

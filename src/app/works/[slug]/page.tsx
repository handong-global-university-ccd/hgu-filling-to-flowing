import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import OthersMarquee from "@/components/works/OthersMarquee";
import WorkCredits from "@/components/works/WorkCredits";
import MobileCredits from "@/components/works/MobileCredits";
import WorkPages from "@/components/works/WorkPages";
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
 * - 좌측: 작품 사진(338×225, 개인 작품은 디자이너 프로필 338×224) → 타이틀·부제 → 설명 → 크레딧
 * - 좌측 안쪽 간격: 정보 묶음 24 / 제목·설명 20 / 크레딧은 890 높이 열의 맨 아래
 * - 작업물 아래 240 띄우고 Others, 제목 아래 16 에 352×222 썸네일 루프
 * - 마지막 콘텐츠와 푸터 사이 300 (모든 페이지 공통)
 */
export default async function WorkDetailPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const designers = work.designerSlugs.map(getDesigner).filter((d) => d !== undefined);
  // 팀 이름이 없는 1인 작품 = 개인 작품
  const solo = !work.teamName && designers.length === 1 ? designers[0] : undefined;
  const others = getOtherWorks(slug).map((w) => ({
    slug: w.slug,
    title: w.title,
    thumbnail: w.thumbnails[0],
  }));

  return (
    <PageShell mobileTitle={{ title: work.title, backHref: "/works/" }}>
      {/* 모바일 (2563:7046 팀 / 2573:20660 개인): ← 헤더 아래 제목·부제·설명 → 20 → 작업물 → 80 → 사진·참여자 → 80 → Others */}
      <article className="flex flex-col gap-4 px-margin pt-[46px] max-lg:gap-10 max-md:gap-5 max-md:pt-0 lg:flex-row lg:items-start">
        {/* 좌측 정보 — 스크롤해도 고정 */}
        {/* Figma: 좌측 열 높이 890 고정, 크레딧은 열 맨 아래 (justify-between) */}
        <div className="flex w-full flex-col justify-between gap-10 max-md:gap-0 lg:sticky lg:top-[126px] lg:h-[890px] lg:w-[338px] lg:shrink-0 lg:gap-[104px]">
          <div className="flex flex-col gap-6 max-md:gap-0">
            {/* 모바일은 사진을 작업물 아래로 (MobileCredits) */}
            <div className="max-md:hidden">
              {solo ? (
                /* 개인 작품 (2252:15830): 작품 사진 대신 디자이너 프로필. 338×224 칸 안에
                 193×290 사진을 왼쪽 -22 · 위 -33 으로 놓아 상반신만 보이게 자른다 */
                <div className="relative h-[224px] w-full overflow-hidden max-md:h-[239px]">
                  <Image
                    src={asset(solo.profile)}
                    alt={`${solo.nameKo} 프로필 사진`}
                    width={193}
                    height={290}
                    priority
                    className="absolute top-[-33px] left-[-22px] h-[290px] w-[193px] max-w-none object-cover"
                  />
                </div>
              ) : (
                /* 팀 작품: 타이틀 위 팀 사진 — 따로 없으면 대표 썸네일 */
                <Image
                  src={asset(work.photo ?? work.thumbnails[0])}
                  alt={`${work.title} 작품 사진`}
                  width={338}
                  height={225}
                  priority
                  className="h-[225px] w-full object-cover"
                />
              )}
            </div>
            {/* 모바일: 제목 SemiBold 16/30 · 부제 14/22 Neutral/700 → 12 → 설명 12/1.5 Neutral/700 */}
            <div className="flex flex-col gap-5 max-md:gap-3">
              <div className="flex flex-col">
                <h1 className="font-kr text-kr-h4 max-md:text-[16px] max-md:leading-[30px] max-md:font-semibold">
                  {work.title}
                </h1>
                {work.subtitle && (
                  <p className="font-kr text-kr-body-lg max-md:text-[14px] max-md:leading-[22px] max-md:text-fg-secondary">
                    {work.subtitle}
                  </p>
                )}
              </div>
              <p className="font-kr text-kr-body-sm whitespace-pre-line max-md:text-[12px] max-md:leading-[1.5] max-md:tracking-normal max-md:text-fg-secondary">
                {work.description}
              </p>
            </div>
          </div>

          <div className="max-md:hidden">
            <WorkCredits
              teamName={work.teamName}
              designers={designers.map((d) => ({ slug: d.slug, nameKo: d.nameKo }))}
            />
          </div>
        </div>

        {/* 우측 작업물 — 드라이브 '작품파일' 폴더의 이미지·영상·YouTube 를 번호 순서대로 */}
        <div className="w-full min-w-0">
          <WorkPages pages={work.pages} title={work.title} />
        </div>
      </article>

      <MobileCredits
        photo={solo ? solo.profile : (work.photo ?? work.thumbnails[0])}
        photoAlt={solo ? `${solo.nameKo} 프로필 사진` : `${work.title} 작품 사진`}
        solo={Boolean(solo)}
        designers={designers.map((d) => ({ slug: d.slug, nameKo: d.nameKo }))}
      />

      {others.length > 0 && (
        <section className="pb-75 max-md:pb-[86px]" aria-label="같은 분야의 다른 작품">
          <h2 className="mt-60 mb-4 px-margin text-body-xl max-md:mt-20 max-md:mb-2 max-md:text-[14px] max-md:leading-8">
            Others
          </h2>
          <OthersMarquee items={others} />
        </section>
      )}
      {others.length === 0 && <div className="h-75 max-md:h-[86px]" />}
    </PageShell>
  );
}

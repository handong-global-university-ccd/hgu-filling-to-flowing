import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import OthersMarquee from "@/components/works/OthersMarquee";
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
 * - 본문은 헤더(110) 아래 46px, 좌측 정보 338px + 간격 16 + 작업물
 * - 좌측 안쪽 간격: 정보 묶음 24 / 제목·설명 20 / 묶음과 Designers 104
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
        <div className="flex w-full flex-col gap-[104px] lg:sticky lg:top-[126px] lg:w-[338px] lg:shrink-0">
          <div className="flex flex-col gap-6">
            {work.teamPhoto && (
              <Image
                src={asset(work.teamPhoto)}
                alt=""
                width={338}
                height={225}
                className="h-[225px] w-full object-cover"
              />
            )}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <h1 className="font-kr text-kr-h4">{work.title}</h1>
                {work.subtitle && <p className="font-kr text-kr-body-lg">{work.subtitle}</p>}
              </div>
              <p className="font-kr text-kr-body-sm">{work.description}</p>
            </div>
          </div>

          <div className="flex w-fit min-w-[84px] flex-col gap-1 text-body-sm whitespace-nowrap">
            <p className="text-fg-tertiary">Designers</p>
            <ul>
              {designers.map((d) => (
                <li key={d.slug}>
                  <Link href={`/designers/${d.slug}/`} className="hover:text-fg-tertiary">
                    {d.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 우측 작업물 — PDF를 페이지별 webp로 변환해서 나열 */}
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

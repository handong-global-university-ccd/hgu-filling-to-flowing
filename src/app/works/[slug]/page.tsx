import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
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

/** Figma Works 상세 (1807:14520) */
export default async function WorkDetailPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const designers = work.designerSlugs.map(getDesigner).filter((d) => d !== undefined);
  const others = getOtherWorks(slug);

  return (
    <PageShell>
      <article className="page-grid">
        {/* 좌측 정보 — 스크롤해도 고정 */}
        <div className="col-span-12 lg:sticky lg:top-[100px] lg:col-span-4 lg:self-start">
          {work.teamPhoto && (
            <Image src={asset(work.teamPhoto)} alt="" width={456} height={326} className="mb-6 w-full" />
          )}
          <h1 className="font-kr text-h2">{work.title}</h1>
          {work.subtitle && <p className="mt-1 font-kr text-body">{work.subtitle}</p>}
          <p className="mt-6 font-kr text-body-sm text-fg-secondary">{work.description}</p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-body-sm">
            {designers.map((d) => (
              <li key={d.slug}>
                <Link href={`/designers/${d.slug}/`}>{d.nameEn}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 작업물 — PDF를 페이지별 webp로 변환해서 나열 */}
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {work.pages.length === 0 && (
            <div className="grid aspect-[4/3] place-items-center bg-bg-subtle text-fg-tertiary">
              작업물 이미지 (TODO)
            </div>
          )}
          {work.pages.map((src, i) => (
            <Image
              key={src}
              src={asset(src)}
              alt={`${work.title} ${i + 1}페이지`}
              width={1200}
              height={1600}
              className="w-full"
            />
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-32 px-margin" aria-label="같은 분야의 다른 작품">
          <h2 className="mb-4 text-label">Others</h2>
          {/* TODO: Marquee + 호버 시 일시정지 & 제목 오버레이 */}
          <ul className="flex gap-gutter overflow-x-auto">
            {others.map((w) => (
              <li key={w.slug} className="w-[338px] shrink-0">
                <Link href={`/works/${w.slug}/`}>
                  <Image src={asset(w.thumbnails[0])} alt={w.title} width={338} height={242} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

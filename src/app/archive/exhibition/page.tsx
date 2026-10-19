import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Archive — Exhibition View" };

// TODO: 전시 현장 사진 전달받으면 교체 (Figma 기준 810×540)
const photos = ["/placeholder/dummy/archive/view-1.webp", "/placeholder/dummy/archive/view-2.webp"];

/**
 * Figma 아카이브_전시 현장 (1807:16563 디폴트 / 1807:16574 헤더 호버시)
 *
 * - 왼쪽 전시 정보는 폭 529px, 화면 기준 y=228 에 고정(sticky)된다.
 *   헤더가 74px 로 접혀도 자리를 지킨다.
 * - 오른쪽 사진은 810×540, 세로 간격 20px, 헤더 바로 아래(y=176)에서 시작한다.
 * - 마지막 사진과 푸터 사이는 300px (모든 페이지 공통)
 *
 * 모바일 (2573:20571): 헤더 아래 4 에 제목 KR·EN Label 14/20 → 17 → 일시·장소 Caption 12/18
 *                     → 45 → 사진 358 너비(3:2), 사이 15. 푸터 위 86
 */
export default function ArchiveExhibitionPage() {
  return (
    <PageShell archive="exhibition" hideOnScroll>
      <div className="flex flex-col gap-10 px-margin pb-75 max-md:gap-[45px] max-md:pt-1 max-md:pb-[86px] lg:flex-row lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-4 max-md:gap-[17px] lg:sticky lg:top-[228px] lg:mt-[52px] lg:h-fit lg:w-[529px] lg:shrink-0">
          <div className="flex flex-col gap-1 max-md:gap-0">
            <h1 className="font-kr text-kr-h3 max-md:text-kr-label">{SITE.fullTitle}</h1>
            <p className="text-h3 max-md:text-label">{SITE.title}</p>
          </div>
          <div className="font-kr text-kr-body-lg max-md:text-kr-caption">
            <p>{SITE.period}</p>
            <p>{SITE.place}</p>
          </div>
        </div>

        <ul className="space-y-5 max-md:space-y-[15px] lg:w-[810px] lg:shrink-0">
          {photos.map((src) => (
            <li key={src}>
              <Image
                src={asset(src)}
                alt="전시 현장"
                width={810}
                height={540}
                className="aspect-[3/2] w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Archive — Exhibition View" };

// TODO: 전시 현장 사진 전달받으면 교체 (Figma 기준 810×540)
const photos = ["/placeholder/thumb-a.svg", "/placeholder/thumb-b.svg", "/placeholder/profile.svg"];

/**
 * Figma 아카이브_전시 현장 (1807:16563 디폴트 / 1807:16574 헤더 호버시)
 *
 * - 왼쪽 전시 정보는 폭 529px, 화면 기준 y=228 에 고정(sticky)된다.
 *   헤더가 74px 로 접혀도 자리를 지킨다.
 * - 오른쪽 사진은 810×540, 세로 간격 20px, 헤더 바로 아래(y=176)에서 시작한다.
 * - 마지막 사진과 푸터 사이는 360px (1900:14667)
 */
export default function ArchiveExhibitionPage() {
  return (
    <PageShell archive="exhibition">
      <div className="flex flex-col gap-10 px-margin pb-90 lg:flex-row lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-4 lg:sticky lg:top-[228px] lg:mt-[52px] lg:h-fit lg:w-[529px] lg:shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="font-kr text-kr-h3">{SITE.fullTitle}</h1>
            <p className="text-h3">{SITE.title}</p>
          </div>
          <div className="font-kr text-kr-body-lg">
            <p>{SITE.period}</p>
            <p>{SITE.place}</p>
          </div>
        </div>

        <ul className="space-y-5 lg:w-[810px] lg:shrink-0">
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

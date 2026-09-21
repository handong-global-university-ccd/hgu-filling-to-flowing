import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import ArchiveTabs from "@/components/archive/ArchiveTabs";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Archive — Exhibition View" };

// TODO: 전시 현장 사진 전달받으면 교체
const photos = ["/placeholder/thumb-a.svg", "/placeholder/thumb-b.svg", "/placeholder/profile.svg"];

/** Figma 아카이브_전시 현장 (1807:16563) — 좌측 정보 고정, 우측 사진만 스크롤 */
export default function ArchiveExhibitionPage() {
  return (
    <PageShell>
      <ArchiveTabs current="exhibition" />
      <div className="page-grid">
        <div className="col-span-12 lg:sticky lg:top-[100px] lg:col-span-6 lg:self-start">
          <h1 className="font-kr text-h2">
            {SITE.fullTitle}
            <br />
            {SITE.title}
          </h1>
          <p className="mt-6 font-kr text-body-sm">{SITE.period}</p>
          <p className="font-kr text-body-sm">{SITE.place}</p>
        </div>
        <ul className="col-span-12 space-y-4 lg:col-span-6">
          {photos.map((src) => (
            <li key={src}>
              <Image src={asset(src)} alt="전시 현장" width={920} height={560} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}

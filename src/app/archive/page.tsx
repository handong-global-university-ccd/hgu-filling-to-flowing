import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ArchiveCanvas from "@/components/archive/ArchiveCanvas";
import ArchiveTabs from "@/components/archive/ArchiveTabs";

export const metadata: Metadata = { title: "Archive — Behind" };

// TODO: 실제 비하인드 사진 174장 + Figma 레이아웃 좌표로 교체
const photos = Array.from({ length: 48 }, (_, i) => ({
  src:
    i % 3 === 0
      ? "/placeholder/thumb-a.svg"
      : i % 3 === 1
        ? "/placeholder/thumb-b.svg"
        : "/placeholder/profile.svg",
  alt: "",
  x: 2 + (i % 8) * 12.2,
  y: 2 + Math.floor(i / 8) * 16,
  w: 9,
  h: 12,
}));

export default function ArchiveBehindPage() {
  return (
    <PageShell>
      <ArchiveTabs current="behind" />
      <ArchiveCanvas photos={photos} />
    </PageShell>
  );
}

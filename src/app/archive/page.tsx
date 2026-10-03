import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ArchiveCanvas, { type Photo } from "@/components/archive/ArchiveCanvas";
import { ARCHIVE_TILES } from "@/data/archive-layout";

export const metadata: Metadata = { title: "Archive — Behind" };

// TODO: 실제 비하인드 사진으로 교체 (팀 27 + 개인 2 → 174장 예정, 칸 수는 193)
const photos: Photo[] = ARCHIVE_TILES.map(([col, row]) => {
  const n = ((col + row * 3) % 8) + 1;
  return {
    src: `/placeholder/thumb-${String(n).padStart(2, "0")}${(col + row) % 2 ? "b" : "a"}.svg`,
    alt: "",
    col,
    row,
  };
});

export default function ArchiveBehindPage() {
  return (
    <PageShell fullscreen archive="behind" hideOnScroll>
      <ArchiveCanvas photos={photos} />
    </PageShell>
  );
}

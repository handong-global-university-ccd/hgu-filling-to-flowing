import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ArchiveCanvas, { type Photo } from "@/components/archive/ArchiveCanvas";
import ArchiveTabs from "@/components/archive/ArchiveTabs";

export const metadata: Metadata = { title: "Archive — Behind" };

/** Figma 레이아웃: 16열 × 14행 그리드에 빈칸을 섞어 174장 */
const COLS = 16;
const ROWS = 14;
const TARGET = 174;

// TODO: 실제 비하인드 사진 174장(팀 27 + 개인 2 → 87×2)으로 교체
const photos: Photo[] = (() => {
  const out: Photo[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // 결정적 패턴으로 약 22% 를 빈칸으로 (hydration 불일치 방지)
      if ((col * 7 + row * 13) % 9 < 2) continue;
      if (out.length >= TARGET) break;
      const n = ((col + row * 3) % 8) + 1;
      out.push({
        src: `/placeholder/thumb-${String(n).padStart(2, "0")}${(col + row) % 2 ? "b" : "a"}.svg`,
        alt: "",
        col,
        row,
      });
    }
  }
  return out;
})();

export default function ArchiveBehindPage() {
  return (
    <PageShell>
      <ArchiveTabs current="behind" />
      <ArchiveCanvas photos={photos} cols={COLS} rows={ROWS} />
    </PageShell>
  );
}

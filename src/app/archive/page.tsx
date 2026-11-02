import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ArchiveCanvas, { type Photo } from "@/components/archive/ArchiveCanvas";
import { ARCHIVE_TILES } from "@/data/archive-layout";
import ARCHIVE_PHOTOS from "@/data/archive-photos.json";

export const metadata: Metadata = { title: "Archive — Behind" };

/**
 * 비하인드 사진 (npm run pull:archive → src/data/archive-photos.json) 을 판의 193칸에 나눠 넣는다.
 * 사진이 칸보다 적어서 돌려 쓴다 — 7칸씩 건너뛰며 고르면(7 과 사진 수가 서로소일 때)
 * 가로·세로로 붙은 칸에 같은 사진이 오지 않는다.
 * TODO: 사진이 더 들어오면 pull:archive 만 다시 돌리면 된다 (칸 수 193)
 */
const STEP = 7;
const photos: Photo[] = ARCHIVE_TILES.map(([col, row], k) => {
  const p = ARCHIVE_PHOTOS[(k * STEP) % ARCHIVE_PHOTOS.length];
  return { src: p.src, alt: p.title, title: p.title, col, row };
});

export default function ArchiveBehindPage() {
  return (
    <PageShell fullscreen archive="behind" hideOnScroll>
      <ArchiveCanvas photos={photos} />
    </PageShell>
  );
}

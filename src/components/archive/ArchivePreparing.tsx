import { cn } from "@/lib/cn";

/**
 * 아카이브 사진이 아직 없을 때 사진 자리에 두는 회색 칸 — 작품 상세의 "작업물을 준비하고 있습니다." 와 같은 모양.
 * 사진이 들어오면 data/archive.ts 의 ARCHIVE_READY 를 true 로 바꾼다.
 */
export default function ArchivePreparing({ className }: { className?: string }) {
  return (
    <div className={cn("grid place-items-center bg-neutral-50 font-kr text-fg-tertiary", className)}>
      준비중입니다.
    </div>
  );
}

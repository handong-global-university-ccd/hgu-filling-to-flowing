import Image from "next/image";
import type { WorkPage } from "@/data/types";
import { asset } from "@/lib/asset";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

/**
 * 작품 상세 오른쪽 작업물 — 드라이브 '작품파일' 폴더의 번호 순서 그대로 이어 붙인다.
 * - 이미지 : 원본 비율 그대로 꽉 찬 너비
 * - 영상   : 음소거 자동재생·반복 (컨트롤로 소리를 켤 수 있다), 첫 장면 포스터
 * - YouTube: 16:9 임베드
 * - 링크   : 작품 웹사이트 등 — 새 탭
 */
export default function WorkPages({ pages, title }: { pages: WorkPage[]; title: string }) {
  if (pages.length === 0) {
    return (
      <div className="grid aspect-[1518/1000] place-items-center bg-bg-subtle font-kr text-fg-tertiary">
        작업물을 준비하고 있습니다.
      </div>
    );
  }

  // 이미지에만 1, 2, 3 … 번호 (대체 텍스트용)
  const imageNo = pages.map((_, i) => pages.slice(0, i + 1).filter((p) => p.type === "image").length);
  return (
    <div className="flex flex-col">
      {pages.map((p, i) => {
        switch (p.type) {
          case "image":
            return (
              <Image
                key={p.src}
                src={asset(p.src)}
                alt={`${title} 작업물 ${imageNo[i]}`}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 80vw, 100vw"
                priority={i === 0}
                className="block h-auto w-full"
              />
            );
          case "video":
            return (
              <video
                key={p.src}
                src={asset(p.src)}
                poster={asset(p.poster)}
                width={p.width}
                height={p.height}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                className="block h-auto w-full bg-bg-inverse"
              />
            );
          case "youtube":
            return (
              <div key={`${p.id}-${i}`} className="relative aspect-video w-full bg-bg-inverse">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${p.id}?rel=0`}
                  title={`${title} 영상`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 size-full"
                />
              </div>
            );
          case "link":
            return (
              <a
                key={`${p.href}-${i}`}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border-b border-border py-6 text-body hover:text-fg-secondary"
              >
                <span className="break-all">{p.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                <ArrowUpRight className="size-5 shrink-0" />
              </a>
            );
        }
      })}
    </div>
  );
}

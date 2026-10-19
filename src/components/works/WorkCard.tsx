"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Work } from "@/data/types";
import { asset } from "@/lib/asset";

/**
 * Figma Works 카드 (2564:9047) — 썸네일 456×270, 아래로 16px, 제목 KR Body/Large · 이름 KR Body/Small, 사이 2px
 * 인터렉션(1801:15055): 호버하면 1.5초 간격으로 썸네일 A↔B 무한 교차 + 20% 검정 덮개 (2564:9048)
 */
export default function WorkCard({ work, designerName }: { work: Work; designerName: string }) {
  const [hover, setHover] = useState(false);
  const [showB, setShowB] = useState(false);

  useEffect(() => {
    if (!hover) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowB(true);
    const id = setInterval(() => setShowB((v) => !v), 1500);
    return () => {
      clearInterval(id);
      setShowB(false);
    };
  }, [hover]);

  return (
    <Link
      href={`/works/${work.slug}/`}
      className="group block"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="relative aspect-[456/270] overflow-hidden bg-bg-subtle">
        {work.thumbnails.map((src, i) => (
          <Image
            key={src}
            src={asset(src)}
            alt={i === 0 ? work.title : ""}
            fill
            sizes="(min-width: 1024px) 24vw, 50vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: (i === 1) === showB ? 1 : 0 }}
          />
        ))}
        <span
          aria-hidden
          className="absolute inset-0 bg-bg-inverse/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>
      {/* 모바일 (2573:10142): 아래 8, 제목 12/18 Neutral/700 · 4 · 팀 이름(개인은 디자이너) 11/17 Neutral/500 */}
      <div className="mt-4 flex flex-col gap-0.5 font-kr max-md:mt-2 max-md:gap-1">
        <p className="text-kr-body-lg max-md:text-[12px] max-md:leading-[18px] max-md:text-fg-secondary">
          {work.cardTitle ?? work.title}
        </p>
        <p className="text-kr-body-sm max-md:hidden">{designerName}</p>
        <p className="text-[11px] leading-[17px] text-fg-tertiary md:hidden">
          {work.teamName ?? designerName}
        </p>
      </div>
    </Link>
  );
}

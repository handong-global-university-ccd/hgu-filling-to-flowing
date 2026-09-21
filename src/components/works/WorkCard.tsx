"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Work } from "@/data/types";
import { asset } from "@/lib/asset";

/**
 * Figma Works 썸네일: 호버하면 1.5초 간격으로 A↔B 무한 교차
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
      <div className="relative aspect-[456/326] overflow-hidden bg-bg-subtle">
        {work.thumbnails.map((src, i) => (
          <Image
            key={src}
            src={asset(src)}
            alt={i === 0 ? work.title : ""}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: (i === 1) === showB ? 1 : 0 }}
          />
        ))}
      </div>
      <p className="mt-3 font-kr text-body-sm">{work.title}</p>
      <p className="text-caption text-fg-tertiary">{designerName}</p>
    </Link>
  );
}

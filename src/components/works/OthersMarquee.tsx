"use client";

import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/home/Marquee";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { asset } from "@/lib/asset";

export type OtherItem = { slug: string; title: string; thumbnail: string };

/** Figma Works 상세 Others (1807:14543~) — 352×222, 간격 0, 화면 전체 폭으로 흐른다 */
const TILE_W = 352;
const TILE_H = 222;

/**
 * 인터렉션 설명 (1837:11696)
 * - 좌측 첫 번째가 현재 작품의 다음 순서이고 그 뒤로 이어진다 (getOtherWorks)
 * - 호버 전에는 계속 흐르고, 호버하면 멈춘다
 * - 호버한 썸네일에는 흰색 80% 레이어 + 제목 + 화살표가 올라온다
 */
export default function OthersMarquee({ items }: { items: OtherItem[] }) {
  if (items.length === 0) return null;

  return (
    <Marquee duration={60} pauseOnHover>
      {items.map((w) => (
        <Link
          key={w.slug}
          href={`/works/${w.slug}/`}
          className="group/tile relative block shrink-0"
          style={{ width: TILE_W, height: TILE_H }}
        >
          <Image
            src={asset(w.thumbnail)}
            alt={w.title}
            width={TILE_W}
            height={TILE_H}
            className="size-full object-cover"
          />
          <span className="absolute inset-0 bg-bg/80 opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100" />
          <span className="absolute inset-0 grid place-items-center px-6 text-center font-kr text-body text-fg-secondary opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100">
            {w.title}
          </span>
          <ArrowUpRight
            aria-hidden
            className="absolute right-1.5 bottom-1.5 size-6 text-fg-secondary opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100"
          />
        </Link>
      ))}
    </Marquee>
  );
}

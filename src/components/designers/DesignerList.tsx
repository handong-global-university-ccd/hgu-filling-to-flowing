"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useWorksFilter } from "@/components/works/works-filter";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import type { FieldKey } from "@/data/types";

export type DesignerRow = {
  slug: string;
  nameKo: string;
  nameEn: string;
  fieldKeys: FieldKey[];
  disciplines: string;
  profile: string;
  /** 활성화 시 우측에 뜨는 대표 작업 썸네일 (최대 3장) */
  thumbnails: string[];
};

/** Figma 1893:2000 / 1807:14949 / 1807:14984 — 활성 행에 붙는 이미지 위치 */
const NAME_W = 102;
const COL_GAP = 488;
const DISC_W = 338;
const PROFILE = { left: 119, top: -8, w: 102, h: 136 };
const THUMBS = { left: 944, w: 280, h: 165, gap: 16 };

/**
 * Figma 디자이너 리스트 (1807:15014 디폴트 / 1893:2000 hover)
 *
 * 인터렉션 설명 (1837:11706)
 * - Scroll : 스크롤하면 다음 디자이너가 활성화되고 프로필·썸네일이 함께 바뀐다
 * - Tab    : 기본 All, 분야 탭을 고르면 해당 분야만 남는다
 * - Search : 이름을 입력하면 첫 결과가 hover 와 같은 모습으로 활성화된다
 * - Click  : 이름이나 분야를 누르면 디자이너 프로필 페이지로 간다
 *
 * 활성 행의 이미지는 absolute 로 띄워 아래 행을 덮는다 — 레이아웃이 밀리지 않는다.
 */
export default function DesignerList({ designers }: { designers: DesignerRow[] }) {
  const filter = useWorksFilter();
  const field = filter?.field ?? "all";
  const q = filter?.q ?? "";

  const list = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return designers.filter((d) => {
      if (field !== "all" && !d.fieldKeys.includes(field)) return false;
      if (!query) return true;
      return (
        d.nameKo.toLowerCase().includes(query) ||
        d.nameEn.toLowerCase().includes(query) ||
        d.disciplines.toLowerCase().includes(query)
      );
    });
  }, [designers, field, q]);

  // 스크롤 위치로 활성 디자이너를 정한다.
  // 기준선은 "스크롤 0 일 때 첫 행이 있던 자리" — 리스트가 그 선을 지나가며
  // 한 명씩 차례로 활성화된다 (인터렉션 설명의 Scroll 동작)
  useEffect(() => {
    const rows = list.current;
    if (!rows || rows.children.length === 0) return;
    const focus = rows.children[0].getBoundingClientRect().top + window.scrollY;
    const pick = () => {
      let best = 0;
      let bestDist = Infinity;
      Array.from(rows.children).forEach((el, i) => {
        const dist = Math.abs(el.getBoundingClientRect().top - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setScrolled(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [filtered.length]);

  // 포인터 > 검색 > 스크롤 순으로 활성 행이 정해진다
  const base = q.trim() ? 0 : scrolled;
  const active = Math.min(hovered ?? base, Math.max(0, filtered.length - 1));

  return (
    <div className="px-margin pt-[81px] pb-90">
      <div className="flex flex-col gap-6">
        <div className="flex text-body-sm text-neutral-300 opacity-[0.88]">
          <span style={{ width: NAME_W }}>Name</span>
          <span style={{ marginLeft: COL_GAP }}>Disciplines</span>
        </div>

        <ul ref={list} className="flex flex-col gap-4" onPointerLeave={() => setHovered(null)}>
          {filtered.map((d, i) => {
            const on = i === active;
            return (
              <li key={d.slug} className="relative" onPointerEnter={() => setHovered(i)}>
                <Link
                  href={`/designers/${d.slug}/`}
                  className={cn(
                    "flex w-fit items-center transition-colors",
                    on ? "text-fg" : "text-neutral-300",
                  )}
                  style={{ gap: COL_GAP }}
                >
                  <span className="flex shrink-0 items-center gap-2" style={{ width: NAME_W }}>
                    {on && <span aria-hidden className="size-1.5 shrink-0 bg-current" />}
                    <span className="font-kr text-kr-label whitespace-nowrap">{d.nameKo}</span>
                  </span>
                  <span className="shrink-0 text-label" style={{ width: DISC_W }}>
                    {d.disciplines}
                  </span>
                </Link>

                <AnimatePresence>
                  {on && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-10"
                    >
                      <Image
                        src={asset(d.profile)}
                        alt=""
                        width={PROFILE.w}
                        height={PROFILE.h}
                        className="absolute max-w-none object-cover"
                        style={{ left: PROFILE.left, top: PROFILE.top, width: PROFILE.w, height: PROFILE.h }}
                      />
                      <div
                        className="absolute top-0 flex"
                        style={{ left: THUMBS.left, gap: THUMBS.gap }}
                      >
                        {d.thumbnails.map((src) => (
                          <Image
                            key={src}
                            src={asset(src)}
                            alt=""
                            width={THUMBS.w}
                            height={THUMBS.h}
                            className="max-w-none object-cover"
                            style={{ width: THUMBS.w, height: THUMBS.h }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {filtered.length === 0 && <p className="py-20 text-fg-tertiary">검색 결과가 없습니다.</p>}
    </div>
  );
}

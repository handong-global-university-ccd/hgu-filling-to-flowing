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
// 이름 102 / 이름과 분야 사이 488 / 분야 338 — 데스크톱 값은 아래 md: 클래스에 그대로 들어 있다
const PROFILE = { left: 119, top: -8, w: 102, h: 136 };
const THUMBS = { left: 944, w: 280, h: 165, gap: 16 };

/**
 * 모바일(< 768px): 이름 80 + 분야(남은 폭), 활성 행의 프로필 사진은 오른쪽 끝에 72×96.
 * 대표 작업 썸네일은 화면이 좁아 숨긴다. 위 상수는 데스크톱 전용이라 md: 클래스로만 쓴다.
 *
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
    // macOS 등에서 한글이 자모 분리(NFD)로 들어와도 일치하도록 NFC 로 맞춘다
    const query = q.trim().normalize("NFC").toLowerCase();
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

  // 검색어·분야가 바뀌면 맨 위로 올린다 — 스크롤을 내린 채 검색하면
  // 줄어든 결과가 화면 위쪽 밖에 그려져 아무것도 안 나온 것처럼 보인다
  const firstFilter = useRef(true);
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [q, field]);

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
    // 대표 썸네일 3장은 1920 기준 위치라 그보다 좁은 화면에선 오른쪽으로 넘친다 — 가로 스크롤이 생기지 않게 자른다
    <div className="overflow-x-clip px-margin pt-[81px] pb-90 max-md:pt-6">
      <div className="flex flex-col gap-6">
        <div className="flex text-body-sm text-neutral-300 opacity-[0.88] max-md:gap-3">
          <span className="w-20 shrink-0 md:w-[102px]">Name</span>
          <span className="md:ml-[488px]">Disciplines</span>
        </div>

        <ul
          ref={list}
          className="flex flex-col gap-4"
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(null)}
        >
          {filtered.map((d, i) => {
            const on = i === active;
            return (
              <li
                key={d.slug}
                className="relative"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              >
                <Link
                  href={`/designers/${d.slug}/`}
                  className={cn(
                    "flex items-center gap-3 pr-[88px] transition-colors md:w-fit md:gap-[488px] md:pr-0",
                    on ? "text-fg" : "text-neutral-300",
                  )}
                >
                  <span className="flex w-20 shrink-0 items-center gap-2 md:w-[102px]">
                    {on && <span aria-hidden className="size-1.5 shrink-0 bg-current" />}
                    <span className="font-kr text-kr-label whitespace-nowrap">{d.nameKo}</span>
                  </span>
                  <span className="min-w-0 flex-1 text-label md:w-[338px] md:flex-none md:shrink-0">
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
                        className="absolute top-[-8px] right-0 h-24 w-[72px] max-w-none object-cover md:top-(--top) md:right-auto md:left-(--left) md:h-(--h) md:w-(--w)"
                        style={
                          {
                            "--left": `${PROFILE.left}px`,
                            "--top": `${PROFILE.top}px`,
                            "--w": `${PROFILE.w}px`,
                            "--h": `${PROFILE.h}px`,
                          } as React.CSSProperties
                        }
                      />
                      <div
                        className="absolute top-0 flex max-md:hidden"
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

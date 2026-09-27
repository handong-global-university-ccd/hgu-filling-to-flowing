"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Marquee from "./Marquee";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/** 줄마다 흐르는 방향·속도를 다르게 (한 방향으로만 흐르면 단조로워서) */
const MARQUEE = [
  { duration: 70, reverse: false },
  { duration: 95, reverse: true },
  { duration: 55, reverse: false },
  { duration: 110, reverse: true },
] as const;

/** 작품 수가 적어도 루프가 비어 보이지 않게 min 개까지 반복 */
function fillLoop<T>(items: T[], min: number): T[] {
  if (items.length === 0) return [];
  const out: T[] = [];
  while (out.length < min) out.push(...items);
  return out;
}

/**
 * Figma 홈 분야 아코디언 (1696:16987)
 * - 접힘: 높이 74px. 썸네일이 opacity 50% 로 가로 루프하고 그 위에 분야명(32/40)
 * - 펼침: 좌측에 분야명 + 소개 문구(456px, Pretendard 18/26),
 *         우측 37.5% 지점부터 썸네일 그리드(높이 112px, 간격 16px)
 */
export default function FieldAccordion({ worksByField }: { worksByField: Record<FieldKey, Work[]> }) {
  const [active, setActive] = useState<FieldKey | null>(null);

  return (
    <section
      aria-label="분야별 작품"
      onPointerLeave={() => setActive(null)}
      className="flex flex-col bg-bg-inverse text-fg-inverse"
    >
      {FIELDS.map((field, i) => {
        const works = worksByField[field.key] ?? [];
        const open = active === field.key;
        const flow = MARQUEE[i % MARQUEE.length];

        return (
          <div
            key={field.key}
            onPointerEnter={() => setActive(field.key)}
            onFocusCapture={() => setActive(field.key)}
            /* 아코디언 사이 흰색 구분선 — 선 위아래로 16px 씩 여백 */
            className={cn("border-fg-inverse", i > 0 && "mt-4 border-t pt-4")}
          >
            {/* ───── 접힌 행 ───── */}
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setActive(open ? null : field.key)}
              className={cn("relative block h-[74px] w-full overflow-hidden text-left", open && "sr-only")}
            >
              <Marquee duration={flow.duration} reverse={flow.reverse} className="h-full">
                {fillLoop(works, 14).map((w, i) => (
                  <div
                    key={`${w.slug}-${i}`}
                    className="relative mr-4 h-[74px] w-[120px] shrink-0 opacity-50"
                  >
                    <Image src={asset(w.thumbnails[0])} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </Marquee>
              <span className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-[32px] leading-[40px] font-medium">
                {field.short}
              </span>
            </button>

            {/* ───── 펼친 패널 ───── */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  {/* Figma: 좌측 카피 456px(left 24), 썸네일 그리드는 37.5%+4px 지점부터 */}
                  <div className="flex pt-[18px] pb-10">
                    <div className="w-[calc(37.5%+4px)] shrink-0 pl-6">
                      <h3 className="text-[32px] leading-[40px] font-medium">{field.short}</h3>
                      <p className="mt-2 max-w-[456px] font-kr text-[18px] leading-[26px] text-neutral-300">
                        {field.intro}
                      </p>
                      <Link
                        href="/works/"
                        className="mt-6 inline-block text-caption uppercase underline underline-offset-4 hover:opacity-70"
                      >
                        View all {works.length} works
                      </Link>
                    </div>

                    <ul className="flex flex-1 flex-wrap content-start gap-4 pr-6">
                      {works.map((w) => (
                        <li key={w.slug}>
                          <Link
                            href={`/works/${w.slug}/`}
                            className="group block h-[112px] w-[157px] overflow-hidden"
                            title={w.title}
                          >
                            <Image
                              src={asset(w.thumbnails[0])}
                              alt={w.title}
                              width={157}
                              height={112}
                              className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}

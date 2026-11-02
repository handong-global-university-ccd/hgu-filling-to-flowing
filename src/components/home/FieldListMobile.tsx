"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { FIELDS, FIELD_INTRO_LINES, type FieldKey, type Work } from "@/data/types";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 모바일 홈 분야 목록 (Figma 2625:5896 — Default / 분야별 펼침 5종)
 *
 * - 화면 폭 꽉 차는 #151515 칸 5개, 사이 8. 칸 안쪽 16·12, ↗(10) + 분야명(Plus Jakarta 12/26)
 *   접힌 칸 글자는 Neutral/100, 첫 칸만 흰색 (시안 Default)
 * - 누르면 그 자리에서 펼친다: ↗ 가 90° 돌아 ↘, 분야명 흰색, 아래 8 에 소개(Pretendard 12/1.5, 시안 줄바꿈),
 *   16 띄우고 썸네일 4열 (간격 8, 131:112 비율) — 썸네일은 그 작품으로
 * - 펼친 칸의 분야명을 한 번 더 누르면 접힌다. 다른 칸을 누르면 그 칸이 펼쳐진다
 */
export default function FieldListMobile({ worksByField }: { worksByField: Record<FieldKey, Work[]> }) {
  const [open, setOpen] = useState<FieldKey | null>(null);
  const reduce = useReducedMotion();

  return (
    <section aria-label="분야별 작품" className="flex flex-col gap-2 md:hidden">
      {FIELDS.map((field, i) => {
        const isOpen = open === field.key;
        const works = worksByField[field.key] ?? [];
        return (
          <div key={field.key} className="bg-[#151515] px-4 py-3 text-white">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : field.key)}
              className={cn(
                "flex w-full items-center gap-2 text-left text-[12px] leading-[26px]",
                !isOpen && i > 0 && "text-neutral-100",
              )}
            >
              <ArrowUpRight
                className={cn("size-2.5 shrink-0 transition-transform duration-300", isOpen && "rotate-90")}
              />
              {field.label}
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 font-kr text-[12px] leading-[1.5]">
                    {FIELD_INTRO_LINES[field.key].map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <ul className="mt-4 grid grid-cols-4 gap-2 pb-0.5">
                    {works.map((w) => (
                      <li key={w.slug}>
                        <Link
                          href={`/works/${w.slug}/`}
                          className="relative block aspect-[131/112] overflow-hidden"
                          title={w.title}
                        >
                          <Image
                            src={asset(w.thumbnails[0])}
                            alt={w.title}
                            fill
                            sizes="25vw"
                            className="object-cover"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}

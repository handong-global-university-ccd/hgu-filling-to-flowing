"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/** 모바일 소개 문구 — 시안(2625:5896) 줄바꿈. 데스크톱 FIELDS.intro 와 줄이 다르다 */
const INTRO_MOBILE: Record<FieldKey, string[]> = {
  "ax-product": [
    "기술의 발달로 인해 우리 일상과 사회 가운데 많은 변화가 있습니다.",
    "기술이 개인과 사회에 전달되는 중요 수단으로서 제품 시스템이",
    "근 미래사회에 어떤 역할을 해야 할 지 예측하고 제시합니다.",
  ],
  communication: [
    "포스터, 책, 영상, 광고, 브랜드 등 다양한 시각 매체를 활용해",
    "사람들이 정보를 쉽고 명확하게 인지하도록",
    "소통하는 방법을 디자인합니다.",
  ],
  service: [
    "서비스의 사용자와 제공자의 입장을 살펴 문제를 발견하고,",
    "아직 해결되지 않은 문제를 찾아",
    "새로운 서비스 방식을 기획하고 설계합니다.",
  ],
  "ux-product": [
    "사용자의 행동과 맥락을 바탕으로 제품과 서비스에서 새로운",
    "경험의 가능성을 발견합니다. 기능과 정보 구조, 인터랙션을 체계적으로",
    "구성하여 사용자와 제품·서비스가 관계 맺는 새로운 방식을 제안합니다.",
  ],
  "ux-space": [
    "사람과 공간의 관계를 이해해 새로운 사용자 경험을 발견하고,",
    "브랜드의 가치와 이야기가 공간 속 행동과 경험으로 이어지도록",
    "공간의 흐름과 기능, 분위기를 기획하고 디자인합니다.",
  ],
};

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
                    {INTRO_MOBILE[field.key].map((line) => (
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

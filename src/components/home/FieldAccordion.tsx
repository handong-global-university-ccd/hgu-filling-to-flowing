"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Marquee from "./Marquee";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { asset } from "@/lib/asset";

const EASE = [0.22, 1, 0.36, 1] as const;

/** 작품 수가 적어도 루프가 비어 보이지 않게 min 개까지 반복 */
function fillLoop<T>(items: T[], min: number): T[] {
  if (items.length === 0) return [];
  const out: T[] = [];
  while (out.length < min) out.push(...items);
  return out;
}

/**
 * Figma 홈 2-1 (1807:14128)
 * - 분야별 썸네일이 가로로 무한 루프
 * - 분야에 호버하면 해당 영역이 펼쳐지고(Reveal) 소개 + 썸네일 그리드 노출, 작품 opacity 50→100
 */
export default function FieldAccordion({ worksByField }: { worksByField: Record<FieldKey, Work[]> }) {
  const [active, setActive] = useState<FieldKey | null>(null);

  return (
    <section aria-label="분야별 작품" onPointerLeave={() => setActive(null)}>
      {FIELDS.map((field) => {
        const works = worksByField[field.key];
        const loop = fillLoop(works, 16);
        const isOpen = active === field.key;

        return (
          <motion.div
            key={field.key}
            layout
            onPointerEnter={() => setActive(field.key)}
            onFocus={() => setActive(field.key)}
            className="border-t border-neutral-700 bg-bg-inverse text-fg-inverse"
            transition={{ layout: { duration: 0.6, ease: EASE } }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {isOpen ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="page-grid py-6"
                >
                  <div className="col-span-4">
                    <h2 className="text-h2">{field.short}</h2>
                    <p className="mt-2 text-body-sm text-neutral-300">분야 소개 문구 (TODO)</p>
                  </div>
                  <ul className="col-span-8 grid grid-cols-8 gap-2">
                    {works.map((w) => (
                      <li key={w.slug}>
                        <Link
                          href={`/works/${w.slug}/`}
                          className="block opacity-50 transition-opacity hover:opacity-100"
                        >
                          <Image
                            src={asset(w.thumbnails[0])}
                            alt={w.title}
                            width={456}
                            height={326}
                            className="aspect-square object-cover"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div key="closed" className="relative h-14" exit={{ opacity: 0 }}>
                  <Marquee duration={50} reverse={field.key === "service"} className="h-full">
                    {loop.map((w, i) => (
                      <Image
                        key={`${w.slug}-${i}`}
                        src={asset(w.thumbnails[0])}
                        alt=""
                        width={78}
                        height={56}
                        className="h-14 w-auto px-1"
                      />
                    ))}
                  </Marquee>
                  <h2 className="absolute top-1/2 left-margin -translate-y-1/2 text-h2 mix-blend-difference">
                    <button type="button" className="text-left">
                      {field.short}
                    </button>
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </section>
  );
}

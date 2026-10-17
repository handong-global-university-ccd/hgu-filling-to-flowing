"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Marquee from "./Marquee";
import { FIELDS, type FieldKey, type Work } from "@/data/types";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 펼칠 때는 천천히, 접을 때는 조금 빠르게 (초).
 * 펼침은 처음부터 확 벌어지지 않도록 가속·감속이 고른 커브를 쓴다.
 */
const OPEN_DURATION = 0.8;
const CLOSE_DURATION = 0.45;
const OPEN_EASE = [0.4, 0, 0.2, 1] as const;

/** 접힌 행 높이. 펼침 패널이 0 이 아니라 이 높이에서 시작해야 행이 순간적으로 줄어들지 않는다 */
const ROW_H = 74;
/** 행이 바뀐 직후 호버를 무시하는 시간 (ms) */
const HOVER_LOCK_MS = 250;

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
 * Figma 홈화면 썸네일 (2573:21293 — Default / 분야별 펼침 5종)
 * - 접힘: 높이 74px. 썸네일(120×74)이 opacity 50% 로 가로 루프하고 그 위에 분야명(H2 32/40, left 24)
 *         행 사이: 아래 16 · 흰 1px 선 · 16
 * - 펼침: 흰 배경 패널 1920×540. 좌측 위(24, 30)에 분야명 + 소개 문구(Pretendard 18/26, 검정, 시안 줄바꿈)
 *         우측(right 24, top 22)에 썸네일 그리드 8열 131×112, 간격 16 (폭 1160 = 화면 폭 60.42%)
 *         패널 아래에는 선 없이 16 띄우고 다음 행
 */
export default function FieldAccordion({ worksByField }: { worksByField: Record<FieldKey, Work[]> }) {
  const [active, setActive] = useState<FieldKey | null>(null);
  const lockedUntil = useRef(0);

  /**
   * 호버로 행을 바꾼다. 행이 열리고 닫히면 아래 행들이 위아래로 밀리는데,
   * 커서가 경계에 있으면 밀린 행이 다시 커서 밑으로 들어와 열림↔닫힘이 무한 반복된다.
   * 그래서 enter 대신 실제로 마우스가 움직일 때만 반응하고, 전환 직후 잠깐은 무시한다.
   */
  const hoverTo = (key: FieldKey, time: number) => {
    if (key === active || time < lockedUntil.current) return;
    lockedUntil.current = time + HOVER_LOCK_MS;
    setActive(key);
  };

  return (
    <section
      aria-label="분야별 작품"
      // 터치는 손을 떼는 순간 pointerleave 가 와서 바로 닫혀 버리므로 마우스일 때만 호버로 연다
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
      className="flex flex-col bg-bg-inverse text-fg-inverse"
    >
      {FIELDS.map((field, i) => {
        const works = worksByField[field.key] ?? [];
        const open = active === field.key;
        const flow = MARQUEE[i % MARQUEE.length];

        return (
          <div
            key={field.key}
            onPointerMove={(e) => e.pointerType === "mouse" && hoverTo(field.key, e.timeStamp)}
            onFocusCapture={() => setActive(field.key)}
            /* 아코디언 사이 흰색 구분선 — 선 위아래로 16px 씩 여백 */
            /* 펼친 패널 바로 다음 행은 선 없이 16 만 띄운다 (흰 패널이 구분선 역할) */
            className={cn(
              "border-fg-inverse",
              i > 0 && (active === FIELDS[i - 1].key ? "mt-4" : "mt-4 border-t pt-4"),
            )}
          >
            {/* ───── 접힌 행 ───── */}
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setActive(open ? null : field.key)}
              // 펼쳤을 때는 sr-only 만 남긴다 — relative·h-[74px] 와 섞이면 sr-only 가 지고
              // 보이지 않는 74px 빈칸이 패널 위에 남는다
              className={cn(open ? "sr-only" : "relative block h-[74px] w-full overflow-hidden text-left")}
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
              <span className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-h2 whitespace-nowrap max-md:left-margin max-md:text-[28px] max-md:leading-[36px]">
                {field.label}
              </span>
            </button>

            {/* ───── 펼친 패널 ───── */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: ROW_H, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { duration: OPEN_DURATION, ease: OPEN_EASE },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { duration: CLOSE_DURATION, ease: EASE },
                  }}
                  className="overflow-hidden"
                >
                  {/* 모바일: 카피 위, 썸네일 아래로 쌓는다 */}
                  <div className="flex min-h-[540px] justify-between gap-10 bg-bg text-fg max-md:min-h-0 max-md:flex-col max-md:gap-6 max-md:py-6">
                    <div className="pt-[30px] pl-6 max-md:px-margin max-md:pt-0">
                      <h3 className="text-h2 max-md:text-[28px] max-md:leading-[36px]">{field.label}</h3>
                      <p className="mt-2 font-kr text-kr-body-lg whitespace-pre-line max-md:text-kr-body max-md:whitespace-normal">
                        {field.intro}
                      </p>
                    </div>

                    <ul className="grid w-[calc(60.42%+24px)] shrink-0 grid-cols-8 content-start gap-4 py-[22px] pr-6 max-md:w-full max-md:grid-cols-2 max-md:gap-(--spacing-gutter) max-md:px-margin max-md:py-0">
                      {works.map((w) => (
                        <li key={w.slug}>
                          <Link
                            href={`/works/${w.slug}/`}
                            className="group block aspect-[131/112] overflow-hidden"
                            title={w.title}
                          >
                            <Image
                              src={asset(w.thumbnails[0])}
                              alt={w.title}
                              width={262}
                              height={224}
                              sizes="(max-width: 767px) 50vw, 131px"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
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

/**
 * 패널이 들어오고 나가는 모션 (레퍼런스: rbp-agency-template 의 Services 목록 호버).
 * - 커서가 들어온 가장자리(위/아래)에서 판이 밀려 들어오고, 안쪽 내용은 반대로 같은 거리만큼 움직여
 *   제자리에 서 있는 것처럼 보인다 → 판의 경계가 먼저 훑고 지나가며 내용이 드러난다
 * - 분야명·소개 문구는 한 줄씩 차례로 아래에서 올라온다 (분야명 → 소개 첫 줄 → 다음 줄)
 * - 나갈 때는 커서가 빠져나간 쪽으로 판이 빠진다
 * 레퍼런스 값: 0.6s expo.out
 */
type Edge = "top" | "bottom";
const SHEET_EASE = [0.16, 1, 0.3, 1] as const; // GSAP expo.out
const SHEET_DURATION = 0.6;
const off = (edge: Edge, flip = false) => ((edge === "top") !== flip ? "-101%" : "101%");

const sheetVariants: Variants = {
  enter: (edge: Edge) => ({ y: off(edge) }),
  shown: { y: "0%", transition: { duration: SHEET_DURATION, ease: SHEET_EASE } },
  leave: (edge: Edge) => ({ y: off(edge), transition: { duration: CLOSE_DURATION, ease: SHEET_EASE } }),
};
const innerVariants: Variants = {
  enter: (edge: Edge) => ({ y: off(edge, true) }),
  shown: { y: "0%", transition: { duration: SHEET_DURATION, ease: SHEET_EASE } },
  leave: (edge: Edge) => ({
    y: off(edge, true),
    transition: { duration: CLOSE_DURATION, ease: SHEET_EASE },
  }),
};

/** 커서가 요소의 위·아래 중 어느 가장자리에 더 가까운지 */
function nearestEdge(el: Element, clientY: number): Edge {
  const r = el.getBoundingClientRect();
  return clientY - r.top < r.bottom - clientY ? "top" : "bottom";
}

/** 줄 등장 — 한 줄씩 차례로 (앞 줄이 거의 다 올라온 뒤 다음 줄). power3.out */
const RISE_EASE = [0.215, 0.61, 0.355, 1] as const;
const RISE_DURATION = 0.6;
const RISE_STAGGER = 0.18;

/**
 * 줄마다 overflow-hidden 마스크 안에서 110% 아래 → 제자리로 올라온다.
 * 패널이 열릴 때마다 다시 재생된다 (패널이 새로 그려지므로). 스크린리더는 원문 한 덩어리로 읽는다.
 */
function RiseLines({
  lines,
  still,
  delay = 0,
  className,
}: {
  lines: string[];
  still: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("block", className)}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block overflow-hidden">
          <motion.span
            className="block"
            initial={still ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: RISE_DURATION, ease: RISE_EASE, delay: delay + i * RISE_STAGGER }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

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
 * Figma 홈화면 썸네일 (2698:15672 Default / 2573:23212 · 23562 · 24159 펼침)
 * - 접힘: 높이 74px. 썸네일(120×74)이 opacity 50% 로 가로 루프하고 그 위에 분야명(H2 32/40, left 24, 흰색)
 *         행 사이: 위 16 · 흰 1px 선 · 아래 16 (선 포함 행 간격 106 — 1px 선이라 아래는 15)
 * - 펼침: #333(Neutral/700) 패널 폭 1920, 글자 흰색. 좌측 위(24, 30)에 분야명 + 소개 문구(Pretendard 18/26, 시안 줄바꿈)
 *         우측(right 24, top 22)에 썸네일 그리드 8열 131×112, 간격 16 (폭 1160 = 화면 폭 60.42%)
 *         패널 높이는 썸네일 수에 맞춘다 — 마지막 줄 아래 16 에서 끝난다 (고정 540 이면 작품이 적을 때 아래가 빈다)
 *         패널 위아래도 다른 행처럼 16 · 흰 선 · 16
 * - 클릭: 분야명·패널을 누르면 Works 의 그 분야로 간다 (/works/?field=…). 썸네일은 그 작품으로.
 *         터치 기기는 첫 탭에 펼치고, 펼친 패널을 누르면 이동한다
 */
export default function FieldAccordion({ worksByField }: { worksByField: Record<FieldKey, Work[]> }) {
  const [active, setActive] = useState<FieldKey | null>(null);
  /** 흰 판이 들어온 가장자리 / 닫히는 패널이 빠져나갈 가장자리 */
  const [edges, setEdges] = useState<{ enter: Edge; leave: Edge }>({ enter: "top", leave: "top" });
  const lockedUntil = useRef(0);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const fieldHref = (key: FieldKey) => `/works/?field=${key}`;

  const open = (key: FieldKey | null, enter: Edge = "top", leave: Edge = "top") => {
    setEdges({ enter, leave });
    setActive(key);
  };

  /**
   * 호버로 행을 바꾼다. 행이 열리고 닫히면 아래 행들이 위아래로 밀리는데,
   * 커서가 경계에 있으면 밀린 행이 다시 커서 밑으로 들어와 열림↔닫힘이 무한 반복된다.
   * 그래서 enter 대신 실제로 마우스가 움직일 때만 반응하고, 전환 직후 잠깐은 무시한다.
   */
  const hoverTo = (key: FieldKey, e: React.PointerEvent<HTMLDivElement>) => {
    if (key === active || e.timeStamp < lockedUntil.current) return;
    lockedUntil.current = e.timeStamp + HOVER_LOCK_MS;
    const from = FIELDS.findIndex((f) => f.key === active);
    const to = FIELDS.findIndex((f) => f.key === key);
    // 아래 행으로 옮겨 가면 열린 패널은 아래로, 위 행이면 위로 빠진다
    open(key, nearestEdge(e.currentTarget, e.clientY), to > from ? "bottom" : "top");
  };

  /**
   * 커서가 목록 밖으로 나가면 닫는다.
   * pointerleave 를 쓰지 않는 이유: 패널이 접히면서 목록 높이가 줄면 커서가 가만히 있어도
   * 목록 밖에 놓이게 되고, 브라우저가 그때도 pointerleave 를 보내서 방금 연 행이 바로 닫혀 버린다.
   * 실제로 마우스를 움직였을 때만 판단한다.
   */
  useEffect(() => {
    if (active === null) return;
    const onMove = (e: PointerEvent) => {
      const section = sectionRef.current;
      if (e.pointerType !== "mouse" || !section || section.contains(e.target as Node)) return;
      setEdges({ enter: "top", leave: nearestEdge(section, e.clientY) });
      setActive(null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);

  return (
    <section
      aria-label="분야별 작품"
      ref={sectionRef}
      className="flex flex-col bg-bg-inverse text-fg-inverse"
    >
      {FIELDS.map((field, i) => {
        const works = worksByField[field.key] ?? [];
        const isOpen = active === field.key;
        const flow = MARQUEE[i % MARQUEE.length];

        return (
          <div
            key={field.key}
            onPointerMove={(e) => e.pointerType === "mouse" && hoverTo(field.key, e)}
            onFocusCapture={() => active !== field.key && open(field.key)}
            /* 행 사이 흰색 구분선 — 펼친 패널이든 접힌 행이든 선 위아래로 16px (선 1px 포함 106 간격) */
            className={cn("border-fg-inverse", i > 0 && "mt-4 border-t pt-[15px]")}
          >
            {/* ───── 접힌 행 ───── */}
            <button
              type="button"
              aria-expanded={isOpen}
              // 마우스는 호버로 이미 펼쳐지므로 누르면 바로 Works 로. 터치는 첫 탭에 펼친다
              onClick={(e) => {
                if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === "mouse") {
                  router.push(fieldHref(field.key));
                } else open(isOpen ? null : field.key);
              }}
              // 펼쳤을 때는 sr-only 만 남긴다 — relative·h-[74px] 와 섞이면 sr-only 가 지고
              // 보이지 않는 74px 빈칸이 패널 위에 남는다
              className={cn(isOpen ? "sr-only" : "relative block h-[74px] w-full overflow-hidden text-left")}
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
            <AnimatePresence initial={false} custom={edges.leave}>
              {isOpen && (
                <motion.div
                  initial={{ height: ROW_H }}
                  animate={{ height: "auto", transition: { duration: OPEN_DURATION, ease: OPEN_EASE } }}
                  exit={{ height: 0, transition: { duration: CLOSE_DURATION, ease: EASE } }}
                  className="overflow-hidden"
                >
                  {/* 흰 판 — 커서가 들어온 쪽에서 밀려 들어온다. 안쪽 내용은 반대로 움직여 제자리처럼 보인다 */}
                  <motion.div
                    custom={edges.enter}
                    variants={reduce ? undefined : sheetVariants}
                    initial="enter"
                    animate="shown"
                    exit="leave"
                    className="relative overflow-hidden bg-neutral-700 text-fg-inverse"
                  >
                    {/* 패널 아무 데나 누르면 Works 의 이 분야로 — 썸네일은 그 위에 따로 링크 */}
                    <Link
                      href={fieldHref(field.key)}
                      aria-label={`${field.label} 작품 보기`}
                      className="absolute inset-0"
                    />
                    <motion.div
                      custom={edges.enter}
                      variants={reduce ? undefined : innerVariants}
                      initial="enter"
                      animate="shown"
                      exit="leave"
                      /* 모바일: 카피 위, 썸네일 아래로 쌓는다. 빈 곳 클릭은 아래 Link 로 통과시키고 썸네일만 받는다 */
                      className="pointer-events-none flex justify-between gap-10 max-md:flex-col max-md:gap-6 max-md:py-6"
                    >
                      <div className="pointer-events-none pt-[30px] pb-4 pl-6 max-md:px-margin max-md:pt-0 max-md:pb-0">
                        <h3 className="text-h2 max-md:text-[28px] max-md:leading-[36px]">
                          <RiseLines lines={[field.label]} still={!!reduce} />
                        </h3>
                        <p className="mt-2 font-kr text-kr-body-lg max-md:text-kr-body">
                          <RiseLines
                            lines={field.intro.split("\n").map((l) => l.trim())}
                            still={!!reduce}
                            delay={RISE_STAGGER}
                          />
                        </p>
                      </div>

                      <ul className="pointer-events-auto relative grid w-[calc(60.42%+24px)] shrink-0 grid-cols-8 content-start gap-4 pt-[22px] pr-6 pb-4 max-md:w-full max-md:grid-cols-2 max-md:gap-(--spacing-gutter) max-md:px-margin max-md:py-0">
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
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}

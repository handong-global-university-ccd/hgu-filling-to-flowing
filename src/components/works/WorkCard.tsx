"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Work } from "@/data/types";
import { asset } from "@/lib/asset";

/** 다음 썸네일로 넘어가는 간격 · 미는 시간 */
const INTERVAL = 1500; // ms
const SLIDE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * Figma Works 카드 (2564:9047) — 썸네일 456×270, 아래로 16px, 제목 KR Body/Large · 이름 KR Body/Small, 사이 2px
 * 인터렉션(1801:15055): 호버하면 1.5초 간격으로 썸네일이 무한히 바뀌고 20% 검정 덮개 (2564:9048)
 * 바뀔 때는 오른쪽으로 민다 — 지금 사진이 오른쪽으로 빠지고 다음 사진이 왼쪽에서 들어온다
 * (참고: readymag.com/designs/5807552). 호버가 끝나면 첫 장으로 같은 방향으로 돌아온다.
 * 모션 줄이기 설정이면 밀지 않고 바로 바꾼다.
 */
export default function WorkCard({ work, designerName }: { work: Work; designerName: string }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [index, setIndex] = useState(0);
  const count = work.thumbnails.length;

  useEffect(() => {
    if (!hover || count < 2) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(1);
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => {
      clearInterval(id);
      setIndex(0);
    };
  }, [hover, count]);

  return (
    <Link
      href={`/works/${work.slug}/`}
      className="group block"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="relative aspect-[456/270] overflow-hidden bg-bg-subtle">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={reduce ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { x: "100%" }}
            transition={SLIDE}
          >
            <Image
              src={asset(work.thumbnails[index] ?? work.thumbnails[0])}
              alt={index === 0 ? work.title : ""}
              fill
              sizes="(min-width: 1024px) 24vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* 다음 썸네일을 미리 받아 둔다 — 처음 밀려 들어올 때 빈 칸이 보이지 않게 */}
        {work.thumbnails.slice(1).map((src, i) => (
          <Image
            key={i}
            src={asset(src)}
            alt=""
            fill
            sizes="(min-width: 1024px) 24vw, 50vw"
            className="invisible object-cover"
            aria-hidden
          />
        ))}
        <span
          aria-hidden
          className="absolute inset-0 bg-bg-inverse/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>
      {/* 모바일 (2573:10142): 아래 8, 제목 12/18 Neutral/700 · 4 · 팀 이름(개인은 디자이너) 11/17 Neutral/500 */}
      <div className="mt-4 flex flex-col gap-0.5 font-kr max-md:mt-2 max-md:gap-1">
        <p className="text-kr-body-lg max-md:text-[12px] max-md:leading-[18px] max-md:text-fg-secondary">
          {work.cardTitle ?? work.title}
        </p>
        <p className="text-kr-body-sm max-md:hidden">{designerName}</p>
        <p className="text-[11px] leading-[17px] text-fg-tertiary md:hidden">
          {work.teamName ?? designerName}
        </p>
      </div>
    </Link>
  );
}

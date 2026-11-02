"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Work } from "@/data/types";
import { asset } from "@/lib/asset";

/** 한 장이 다 들어온 뒤 머무는 시간 · 미는 시간 (넘어가는 간격 ≈ 1.3 + 1.2 = 2.5초) */
const HOLD = 1300; // ms
const SLIDE = { duration: 3.2, ease: [0.65, 0, 0.35, 1] } as const;

/**
 * Figma Works 카드 (2564:9047) — 썸네일 456×270, 아래로 16px, 제목 KR Body/Large · 이름 KR Body/Small, 사이 2px
 * 인터렉션(1801:15055): 호버하면 약 2.5초 간격으로 썸네일이 무한히 바뀌고 20% 검정 덮개 (2564:9048)
 * 바뀔 때는 왼쪽으로 민다 — 지금 사진이 왼쪽으로 빠지고 다음 사진이 오른쪽에서 들어온다 (1.2초)
 * (참고: readymag.com/designs/5807552). 호버가 끝나면 첫 장으로 같은 방향으로 돌아온다.
 * 모션 줄이기 설정이면 밀지 않고 바로 바꾼다.
 */
export default function WorkCard({ work, designerName }: { work: Work; designerName: string }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  // 화면에는 두 장만 그린다 — 왼쪽으로 빠지는 사진(prev)과 오른쪽에서 들어오는 사진(index).
  // 넘어갈 때마다 step 을 늘려 두 장을 새 key 로 다시 그린다 (나가는 사진은 0 에서, 들어오는 사진은 100% 에서 시작).
  // AnimatePresence 로 사진 번호를 key 로 쓰면 빠지는 중인 사진이 되살아나 왼·오로 왔다 갔다 하고,
  // 나간 사진이 DOM 에 계속 쌓였다
  const [slide, setSlide] = useState<{ step: number; index: number; prev: number | null }>({
    step: 0,
    index: 0,
    prev: null,
  });
  const count = work.thumbnails.length;
  const { step, index, prev } = slide;

  // 다음 장은 앞 장이 다 들어온 뒤(onAnimationComplete) HOLD 만큼 쉬고 넘긴다.
  // 고정 간격(setInterval)이면 프레임이 느린 기기에서 슬라이드가 끝나기 전에 다음 장이 와서 튄다
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const advance = () => setSlide((s) => ({ step: s.step + 1, index: (s.index + 1) % count, prev: s.index }));
  const queueNext = () => {
    clearTimeout(timer.current);
    if (hover && count > 1) timer.current = setTimeout(advance, HOLD);
  };

  useEffect(() => {
    if (!hover || count < 2) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlide((s) => ({ step: s.step + 1, index: (s.index + 1) % count, prev: s.index }));
    // 모션 줄이기면 밀지 않으니 완료 이벤트 대신 고정 간격으로 바꾼다
    const id = reduce
      ? setInterval(
          () => setSlide((s) => ({ step: s.step + 1, index: (s.index + 1) % count, prev: s.index })),
          HOLD + SLIDE.duration * 1000,
        )
      : undefined;
    return () => {
      clearInterval(id);
      clearTimeout(timer.current);
      // 호버가 끝나면 첫 장으로 — 이것도 같은 방향(왼쪽)으로 넘어간다
      setSlide((s) => (s.index === 0 ? s : { step: s.step + 1, index: 0, prev: s.index }));
    };
  }, [hover, count, reduce]);

  const src = (i: number) => asset(work.thumbnails[i] ?? work.thumbnails[0]);

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
        {prev !== null && !reduce && (
          <motion.div
            key={`out-${step}`}
            aria-hidden
            className="absolute inset-0"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={SLIDE}
          >
            <Image
              src={src(prev)}
              alt=""
              fill
              sizes="(min-width: 1024px) 24vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        )}
        <motion.div
          key={`in-${step}`}
          className="absolute inset-0"
          initial={reduce || prev === null ? false : { x: "100%" }}
          animate={{ x: 0 }}
          transition={SLIDE}
          onAnimationComplete={reduce ? undefined : queueNext}
        >
          <Image
            src={src(index)}
            alt={index === 0 ? work.title : ""}
            fill
            sizes="(min-width: 1024px) 24vw, 50vw"
            className="object-cover"
          />
        </motion.div>
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

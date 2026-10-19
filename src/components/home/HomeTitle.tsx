"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LOGO_LETTERS, LOGO_ROWS, LOGO_VIEWBOX } from "@/components/layout/Logo";

/** 글자가 위로 빠지고 같은 글자가 아래에서 올라오는 거리 (viewBox 단위, 줄 높이보다 조금 크게) */
const TRAVEL = 30;

/** 이만큼(ms) 스크롤이 멈췄다가 다시 시작하면 새 스크롤로 보고 한 번 더 굴린다 */
const GESTURE_GAP = 200;

/**
 * 홈 로고타입 (Figma 2573:20767) — 스크롤할 때 글자가 읽는 순서대로 하나씩 굴러 바뀐다
 * (레퍼런스: rbp-agency-template 순차 모션).
 * - 아래로 스크롤: 글자가 위로 빠지고 같은 글자가 아래에서 올라온다
 * - 위로 스크롤  : 반대로 아래로 빠지고 위에서 내려온다
 * 로고가 화면에 있을 때, 스크롤을 새로 시작할 때마다 한 번씩 굴린다 (굴러가는 중에는 겹쳐 걸지 않는다).
 *
 * 글자마다 원본 + 아래(TRAVEL)에 복제본을 두고 묶음을 0 ↔ -TRAVEL 로 옮긴다.
 * 복제본이 원본과 같아서 끝난 뒤 0 으로 되돌려도 이음매가 보이지 않는다. 줄마다 clipPath 로 잘라 줄 밖으로는 안 보인다.
 *
 * 등장: 홈 전시 소개(RevealLines)와 같은 인터랙션 — 화면에 들어오면 줄마다 글자가 아래에서 천천히 올라온다.
 * 글자 묶음을 TRAVEL 만큼 내려 두면 원본·복제본 모두 줄 clipPath 밖이라 보이지 않는다 → 0 으로 올린다.
 * 등장이 끝나기 전에는 굴리지 않는다. 모션 줄이기 설정이면 둘 다 하지 않는다.
 */
export default function HomeTitle({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const letters = gsap.utils.toArray<SVGGElement>("[data-letter]", svgRef.current);
      let revealed = false;

      // 등장 — RevealLines 와 같은 값 (1.4s power3.out, 줄 간격 0.12s)
      LOGO_ROWS.forEach((_, row) => {
        gsap.fromTo(
          gsap.utils.toArray<SVGGElement>(`[data-row="${row}"] [data-letter]`, svgRef.current),
          { y: TRAVEL },
          {
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            delay: row * 0.12,
            scrollTrigger: { trigger: svgRef.current, start: "top 85%", once: true },
            onComplete: () => {
              if (row === LOGO_ROWS.length - 1) revealed = true;
            },
          },
        );
      });

      const roll = { duration: 0.55, ease: "power3.inOut", stagger: 0.04 } as const;
      const up = gsap
        .timeline({ paused: true })
        .fromTo(letters, { y: 0 }, { y: -TRAVEL, ...roll })
        .set(letters, { y: 0 });
      const down = gsap.timeline({ paused: true }).fromTo(letters, { y: -TRAVEL }, { y: 0, ...roll });

      let last = 0;
      ScrollTrigger.create({
        trigger: svgRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const now = performance.now();
          const fresh = now - last > GESTURE_GAP;
          last = now;
          if (!revealed || !fresh || up.isActive() || down.isActive()) return;
          (self.direction > 0 ? up : down).restart();
        },
      });
    },
    { scope: svgRef },
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
      fill="currentColor"
      role="img"
      aria-label="Filling to Flowing"
      className={className}
      style={{ display: "block", width: "100%", height: "auto", overflow: "hidden" }}
    >
      <defs>
        {LOGO_ROWS.map((r, i) => (
          <clipPath key={i} id={`home-title-row-${i}`}>
            <rect x={-1} y={r.y - 1} width={LOGO_VIEWBOX.w + 2} height={r.h + 2} />
          </clipPath>
        ))}
      </defs>
      {LOGO_ROWS.map((_, row) => (
        <g key={row} data-row={row} clipPath={`url(#home-title-row-${row})`}>
          {LOGO_LETTERS.filter((l) => l.row === row).map((l) => (
            <g key={l.d} data-letter>
              <path d={l.d} />
              <path d={l.d} transform={`translate(0 ${TRAVEL})`} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

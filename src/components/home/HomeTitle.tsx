"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOGO_LETTERS, LOGO_ROWS, LOGO_VIEWBOX } from "@/components/layout/Logo";
import { TITLE_REVEAL } from "@/data/home";

/** 글자가 올라오는 거리 (viewBox 단위, 줄 높이보다 조금 크게 — 이만큼 내려 두면 줄 밖이라 안 보인다) */
const TRAVEL = 30;

/**
 * 홈 로고타입 (Figma 2573:20767) — 화면에 들어오면 전시 소개(RevealLines)와 같은 모션으로 한 줄씩 아래에서 올라오고,
 * 아래 말씀 두 줄이 이어서 같은 간격으로 올라온다 (page.tsx).
 *
 * 글자 묶음을 TRAVEL 만큼 내려 두면 줄 clipPath 밖이라 보이지 않는다 → 0 으로 올린다.
 * 모션 줄이기 설정이면 처음부터 보인다.
 */
export default function HomeTitle({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 등장 — 전시 소개처럼 줄 단위로 (FILLING → TO FLOWING). 말씀은 page.tsx 에서 이 뒤로 이어 붙인다
      LOGO_ROWS.forEach((_, row) => {
        gsap.fromTo(
          gsap.utils.toArray<SVGGElement>(`[data-row="${row}"] [data-letter]`, svgRef.current),
          { y: TRAVEL },
          {
            y: 0,
            duration: TITLE_REVEAL.duration,
            ease: "power3.out",
            delay: row * TITLE_REVEAL.stagger,
            scrollTrigger: { trigger: svgRef.current, start: "top 85%", once: true },
          },
        );
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
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

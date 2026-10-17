"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOGO_LETTERS, LOGO_ROWS, LOGO_VIEWBOX } from "@/components/layout/Logo";
import { useHasFinePointer } from "@/hooks/useMediaQuery";

/** 글자가 위로 빠지고 같은 글자가 아래에서 올라오는 거리 (viewBox 단위, 줄 높이보다 조금 크게) */
const TRAVEL = 30;

/**
 * 홈 로고타입 (Figma 2573:20767) — 커서를 올리면 글자가 읽는 순서대로 하나씩
 * 위로 빠지고, 같은 글자가 아래에서 올라와 제자리를 채운다 (레퍼런스: rbp-agency-template 순차 호버).
 *
 * 글자마다 원본 + 아래(TRAVEL)에 복제본을 두고 묶음을 -TRAVEL 만큼 올린 뒤 0 으로 되돌린다.
 * 복제본이 원본과 같아서 되돌릴 때 이음매가 보이지 않는다. 줄마다 clipPath 로 잘라 줄 밖으로는 안 보인다.
 * 마우스 기기 + 모션 줄이기 해제일 때만 움직인다.
 */
export default function HomeTitle({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const finePointer = useHasFinePointer();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const letters = gsap.utils.toArray<SVGGElement>("[data-letter]", svgRef.current);
      tl.current = gsap
        .timeline({ paused: true })
        .to(letters, { y: -TRAVEL, duration: 0.55, ease: "power3.inOut", stagger: 0.04 })
        .set(letters, { y: 0 });
    },
    { scope: svgRef },
  );

  const roll = (e: React.PointerEvent) => {
    const t = tl.current;
    if (!finePointer || e.pointerType !== "mouse" || !t || t.isActive()) return;
    t.restart();
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
      fill="currentColor"
      role="img"
      aria-label="Filling to Flowing"
      onPointerEnter={roll}
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
        <g key={row} clipPath={`url(#home-title-row-${row})`}>
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
